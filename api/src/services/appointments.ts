import { randomUUID } from 'node:crypto'
import { prisma } from '../lib/prisma.js'
import { formatDateOnly, getTherapistPatientOrThrow, parseDateOnly } from './attendance.js'

export type AppointmentRecurrenceCadence = 'weekly' | 'biweekly' | 'monthly'

export type AppointmentRecurrence = {
  cadence: AppointmentRecurrenceCadence
  until: string
}

export type AppointmentSeriesScope = 'single' | 'following' | 'series'

export const MAX_RECURRING_APPOINTMENTS = 104

export type AppointmentInput = {
  patientId: string
  locationId: string
  date: string
  time: string
  durationMinutes: number
  notes?: string | null
  recurrence?: AppointmentRecurrence
  scope?: AppointmentSeriesScope
}

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function addMonths(date: Date, months: number): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, date.getUTCDate()),
  )
}

export function generateRecurrenceDates(
  startDate: string,
  endDate: string,
  cadence: AppointmentRecurrenceCadence,
): string[] {
  const start = parseDateOnly(startDate)
  const end = parseDateOnly(endDate)
  if (!start || !end || end < start) {
    return []
  }

  const dates: string[] = []
  let current = start

  while (current <= end) {
    dates.push(formatDateOnly(current))
    if (dates.length > MAX_RECURRING_APPOINTMENTS) {
      break
    }

    if (cadence === 'weekly') {
      current = addDays(current, 7)
    } else if (cadence === 'biweekly') {
      current = addDays(current, 14)
    } else {
      current = addMonths(current, 1)
    }
  }

  return dates
}

export function buildSeriesWhere(
  therapistId: string,
  recurrenceGroupId: string,
  anchorScheduledAt: Date,
  scope: Exclude<AppointmentSeriesScope, 'single'>,
) {
  return {
    therapistId,
    recurrenceGroupId,
    ...(scope === 'following' ? { scheduledAt: { gte: anchorScheduledAt } } : {}),
  }
}

export function parseScheduledAt(date: string, time: string): Date | null {
  const day = parseDateOnly(date)
  if (!day) return null
  const match = TIME_PATTERN.exec(time)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  return new Date(
    Date.UTC(
      day.getUTCFullYear(),
      day.getUTCMonth(),
      day.getUTCDate(),
      hours,
      minutes,
      0,
    ),
  )
}

export function formatAppointmentTime(scheduledAt: Date): string {
  const hours = String(scheduledAt.getUTCHours()).padStart(2, '0')
  const minutes = String(scheduledAt.getUTCMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export function formatAppointmentDate(scheduledAt: Date): string {
  return formatDateOnly(scheduledAt)
}

export function parseAppointmentMonth(year: number, month: number) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return null
  }
  const from = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0))
  const to = new Date(Date.UTC(year, month, 1, 0, 0, 0))
  return { from, to }
}

export async function getActiveLocationOrThrow(locationId: string) {
  const location = await prisma.location.findFirst({
    where: { id: locationId, active: true },
    select: { id: true, name: true },
  })
  if (!location) {
    throw new Error('LOCATION_NOT_FOUND')
  }
  return location
}

export function formatAppointment(record: {
  id: string
  scheduledAt: Date
  durationMinutes: number
  notes: string | null
  recurrenceGroupId: string | null
  patient: { id: string; fullName: string }
  location: { id: string; name: string }
}) {
  return {
    id: record.id,
    patientId: record.patient.id,
    patientName: record.patient.fullName,
    locationId: record.location.id,
    locationName: record.location.name,
    date: formatAppointmentDate(record.scheduledAt),
    time: formatAppointmentTime(record.scheduledAt),
    scheduledAt: record.scheduledAt.toISOString(),
    durationMinutes: record.durationMinutes,
    notes: record.notes,
    recurrenceGroupId: record.recurrenceGroupId,
  }
}

const appointmentInclude = {
  patient: {
    select: {
      id: true,
      fullName: true,
    },
  },
  location: {
    select: {
      id: true,
      name: true,
    },
  },
} as const

export async function listTherapistAppointments(
  therapistId: string,
  year: number,
  month: number,
  locationId?: string,
) {
  const range = parseAppointmentMonth(year, month)
  if (!range) {
    throw new Error('INVALID_MONTH')
  }

  if (locationId) {
    await getActiveLocationOrThrow(locationId)
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      therapistId,
      scheduledAt: { gte: range.from, lt: range.to },
      ...(locationId ? { locationId } : {}),
    },
    include: appointmentInclude,
    orderBy: { scheduledAt: 'asc' },
  })

  return appointments.map(formatAppointment)
}

export async function createTherapistAppointment(therapistId: string, input: AppointmentInput) {
  await getTherapistPatientOrThrow(therapistId, input.patientId)
  await getActiveLocationOrThrow(input.locationId)

  const dates = input.recurrence
    ? generateRecurrenceDates(input.date, input.recurrence.until, input.recurrence.cadence)
    : [input.date]

  if (dates.length === 0) {
    throw new Error('INVALID_RECURRENCE')
  }
  if (dates.length > MAX_RECURRING_APPOINTMENTS) {
    throw new Error('TOO_MANY_APPOINTMENTS')
  }

  const notes = input.notes?.trim() ? input.notes.trim() : null
  const recurrenceGroupId = input.recurrence ? randomUUID() : null
  const appointments = await prisma.$transaction(
    dates.map((date) => {
      const scheduledAt = parseScheduledAt(date, input.time)
      if (!scheduledAt) {
        throw new Error('INVALID_SCHEDULE')
      }

      return prisma.appointment.create({
        data: {
          therapistId,
          patientId: input.patientId,
          locationId: input.locationId,
          scheduledAt,
          durationMinutes: input.durationMinutes,
          notes,
          recurrenceGroupId,
        },
        include: appointmentInclude,
      })
    }),
  )

  const formatted = appointments.map(formatAppointment)
  return {
    appointment: formatted[0],
    appointments: formatted,
    createdCount: formatted.length,
  }
}

export async function updateTherapistAppointment(
  therapistId: string,
  appointmentId: string,
  input: AppointmentInput,
) {
  const existing = await prisma.appointment.findFirst({
    where: { id: appointmentId, therapistId },
  })
  if (!existing) {
    throw new Error('APPOINTMENT_NOT_FOUND')
  }

  await getTherapistPatientOrThrow(therapistId, input.patientId)
  await getActiveLocationOrThrow(input.locationId)

  const scope = input.scope ?? 'single'
  const notes = input.notes?.trim() ? input.notes.trim() : null

  if (scope === 'single' || !existing.recurrenceGroupId) {
    const scheduledAt = parseScheduledAt(input.date, input.time)
    if (!scheduledAt) {
      throw new Error('INVALID_SCHEDULE')
    }

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        patientId: input.patientId,
        locationId: input.locationId,
        scheduledAt,
        durationMinutes: input.durationMinutes,
        notes,
      },
      include: appointmentInclude,
    })

    const formatted = formatAppointment(appointment)
    return {
      appointment: formatted,
      appointments: [formatted],
      updatedCount: 1,
    }
  }

  const targets = await prisma.appointment.findMany({
    where: buildSeriesWhere(therapistId, existing.recurrenceGroupId, existing.scheduledAt, scope),
    orderBy: { scheduledAt: 'asc' },
  })

  if (targets.length === 0) {
    throw new Error('APPOINTMENT_NOT_FOUND')
  }

  const appointments = await prisma.$transaction(
    targets.map((target) => {
      const date = formatAppointmentDate(target.scheduledAt)
      const scheduledAt = parseScheduledAt(date, input.time)
      if (!scheduledAt) {
        throw new Error('INVALID_SCHEDULE')
      }

      return prisma.appointment.update({
        where: { id: target.id },
        data: {
          patientId: input.patientId,
          locationId: input.locationId,
          scheduledAt,
          durationMinutes: input.durationMinutes,
          notes,
        },
        include: appointmentInclude,
      })
    }),
  )

  const formatted = appointments.map(formatAppointment)
  return {
    appointment: formatted.find((appointment) => appointment.id === appointmentId) ?? formatted[0],
    appointments: formatted,
    updatedCount: formatted.length,
  }
}

export async function deleteTherapistAppointment(
  therapistId: string,
  appointmentId: string,
  scope: AppointmentSeriesScope = 'single',
) {
  const existing = await prisma.appointment.findFirst({
    where: { id: appointmentId, therapistId },
  })
  if (!existing) {
    throw new Error('APPOINTMENT_NOT_FOUND')
  }

  if (scope === 'single' || !existing.recurrenceGroupId) {
    await prisma.appointment.delete({ where: { id: appointmentId } })
    return { deletedCount: 1 }
  }

  const result = await prisma.appointment.deleteMany({
    where: buildSeriesWhere(therapistId, existing.recurrenceGroupId, existing.scheduledAt, scope),
  })

  return { deletedCount: result.count }
}
