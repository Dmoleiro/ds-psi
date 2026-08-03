import { CalendarInviteStatus } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { prisma } from '../lib/prisma.js'
import { buildCalendarUid } from '../lib/icalendar.js'
import { getActiveGabineteOrThrow, listActiveGabinetes } from './gabinetes.js'
import { decimalToNumber, resolveSessionFee } from './financialSettings.js'
import { assertTherapistHasLocation } from './therapistLocations.js'
import { formatDateOnly, getTherapistPatientOrThrow, parseDateOnly } from './attendance.js'
import {
  formatCalendarInviteStatusForAppointment,
  prepareDeletionCancellationJobs,
  queueAppointmentCalendarInvites,
  queueDeletionCancellationInvites,
  sendSeriesOccurrenceException,
} from './appointmentCalendarInvites.js'

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
  gabineteId: string
  date: string
  time: string
  durationMinutes: number
  sessionFee?: number
  notes?: string | null
  recurrence?: AppointmentRecurrence
  scope?: AppointmentSeriesScope
  sendCalendarUpdate?: boolean
}

export class RoomConflictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RoomConflictError'
  }
}

export async function updatePatientAppointmentFees(
  therapistId: string,
  patientId: string,
  patientSessionFee: number | null,
  db: Pick<typeof prisma, 'appointment'> = prisma,
) {
  const sessionFee =
    patientSessionFee ?? (await resolveSessionFee(therapistId, undefined))

  const result = await db.appointment.updateMany({
    where: {
      therapistId,
      patientId,
    },
    data: { sessionFee },
  })

  return result.count
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

export function getAppointmentEnd(scheduledAt: Date, durationMinutes: number): Date {
  return new Date(scheduledAt.getTime() + durationMinutes * 60_000)
}

export function appointmentsOverlap(
  startA: Date,
  durationA: number,
  startB: Date,
  durationB: number,
): boolean {
  const endA = getAppointmentEnd(startA, durationA)
  const endB = getAppointmentEnd(startB, durationB)
  return startA < endB && startB < endA
}

function getUtcDayRange(date: string) {
  const day = parseDateOnly(date)
  if (!day) return null
  const dayStart = new Date(
    Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 0, 0, 0),
  )
  const dayEnd = new Date(
    Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate() + 1, 0, 0, 0),
  )
  return { dayStart, dayEnd }
}

async function assertRoomAvailable(
  gabineteId: string,
  gabineteName: string,
  scheduledAt: Date,
  durationMinutes: number,
  excludeIds: string[] = [],
) {
  const date = formatAppointmentDate(scheduledAt)
  const range = getUtcDayRange(date)
  if (!range) {
    throw new Error('INVALID_SCHEDULE')
  }

  const candidates = await prisma.appointment.findMany({
    where: {
      gabineteId,
      ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
      scheduledAt: { gte: range.dayStart, lt: range.dayEnd },
    },
    select: {
      id: true,
      scheduledAt: true,
      durationMinutes: true,
      therapist: { select: { name: true } },
    },
  })

  const conflict = candidates.find((candidate) =>
    appointmentsOverlap(scheduledAt, durationMinutes, candidate.scheduledAt, candidate.durationMinutes),
  )

  if (conflict) {
    const timeLabel = formatAppointmentTime(scheduledAt)
    const dateLabel = new Intl.DateTimeFormat('pt-PT', {
      timeZone: 'UTC',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(scheduledAt)
    throw new RoomConflictError(
      `${gabineteName} já está ocupado em ${dateLabel} às ${timeLabel} (${conflict.therapist.name}).`,
    )
  }
}

export async function listDayRoomOccupancy(date: string) {
  const range = getUtcDayRange(date)
  if (!range) {
    throw new Error('INVALID_DATE')
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      scheduledAt: { gte: range.dayStart, lt: range.dayEnd },
    },
    select: {
      id: true,
      gabineteId: true,
      scheduledAt: true,
      durationMinutes: true,
      gabinete: { select: { name: true } },
      therapist: { select: { name: true } },
      patient: { select: { fullName: true } },
    },
    orderBy: { scheduledAt: 'asc' },
  })

  return appointments.map((appointment) => ({
    id: appointment.id,
    gabineteId: appointment.gabineteId,
    gabineteName: appointment.gabinete.name,
    date: formatAppointmentDate(appointment.scheduledAt),
    time: formatAppointmentTime(appointment.scheduledAt),
    durationMinutes: appointment.durationMinutes,
    therapistName: appointment.therapist.name,
    patientName: appointment.patient.fullName,
  }))
}

export async function listLocationDaySchedule(
  therapistId: string,
  locationId: string,
  date: string,
) {
  const range = getUtcDayRange(date)
  if (!range) {
    throw new Error('INVALID_DATE')
  }

  await assertTherapistHasLocation(therapistId, locationId)

  const location = await getActiveLocationOrThrow(locationId)
  const gabinetes = await listActiveGabinetes(locationId)

  const appointments = await prisma.appointment.findMany({
    where: {
      locationId,
      scheduledAt: { gte: range.dayStart, lt: range.dayEnd },
    },
    select: {
      id: true,
      gabineteId: true,
      scheduledAt: true,
      durationMinutes: true,
      gabinete: { select: { name: true } },
      therapist: { select: { id: true, name: true } },
      patient: { select: { fullName: true } },
    },
    orderBy: { scheduledAt: 'asc' },
  })

  return {
    date,
    location,
    gabinetes: gabinetes.map((g) => ({
      id: g.id,
      name: g.name,
      sortOrder: g.sortOrder,
    })),
    appointments: appointments.map((appointment) => ({
      id: appointment.id,
      gabineteId: appointment.gabineteId,
      gabineteName: appointment.gabinete.name,
      date: formatAppointmentDate(appointment.scheduledAt),
      time: formatAppointmentTime(appointment.scheduledAt),
      durationMinutes: appointment.durationMinutes,
      therapistId: appointment.therapist.id,
      therapistName: appointment.therapist.name,
      patientName: appointment.patient.fullName,
    })),
  }
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

export function formatAppointment(
  record: {
    id: string
    gabineteId: string
    scheduledAt: Date
    durationMinutes: number
    sessionFee: { toString(): string } | number
    notes: string | null
    recurrenceGroupId: string | null
    calendarInviteStatus?: CalendarInviteStatus
    calendarInviteError?: string | null
    calendarInvitedAt?: Date | null
    patient: { id: string; fullName: string }
    location: { id: string; name: string }
    gabinete: { id: string; name: string }
  },
  options?: { includeCalendarInvite?: boolean },
) {
  const base = {
    id: record.id,
    patientId: record.patient.id,
    patientName: record.patient.fullName,
    locationId: record.location.id,
    locationName: record.location.name,
    gabineteId: record.gabinete.id,
    gabineteName: record.gabinete.name,
    date: formatAppointmentDate(record.scheduledAt),
    time: formatAppointmentTime(record.scheduledAt),
    scheduledAt: record.scheduledAt.toISOString(),
    durationMinutes: record.durationMinutes,
    sessionFee: decimalToNumber(record.sessionFee),
    notes: record.notes,
    recurrenceGroupId: record.recurrenceGroupId,
  }

  if (!options?.includeCalendarInvite) {
    return base
  }

  return {
    ...base,
    ...formatCalendarInviteStatusForAppointment({
      calendarInviteStatus: record.calendarInviteStatus ?? CalendarInviteStatus.not_sent,
      calendarInviteError: record.calendarInviteError ?? null,
      calendarInvitedAt: record.calendarInvitedAt ?? null,
    }),
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
  gabinete: {
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
  options?: { includeCalendarInvite?: boolean },
) {
  const range = parseAppointmentMonth(year, month)
  if (!range) {
    throw new Error('INVALID_MONTH')
  }

  if (locationId) {
    await getActiveLocationOrThrow(locationId)
    await assertTherapistHasLocation(therapistId, locationId)
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

  return appointments.map((appointment) =>
    formatAppointment(appointment, { includeCalendarInvite: options?.includeCalendarInvite ?? false }),
  )
}

export async function createTherapistAppointment(therapistId: string, input: AppointmentInput) {
  await getTherapistPatientOrThrow(therapistId, input.patientId)
  await getActiveLocationOrThrow(input.locationId)
  await assertTherapistHasLocation(therapistId, input.locationId)
  const gabinete = await getActiveGabineteOrThrow(input.gabineteId, input.locationId)

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
  const sessionFee = await resolveSessionFee(therapistId, {
    sessionFee: input.sessionFee,
    patientId: input.patientId,
  })

  const scheduledSlots = dates.map((date) => {
    const scheduledAt = parseScheduledAt(date, input.time)
    if (!scheduledAt) {
      throw new Error('INVALID_SCHEDULE')
    }
    return { date, scheduledAt }
  })

  for (const slot of scheduledSlots) {
    await assertRoomAvailable(
      gabinete.id,
      gabinete.name,
      slot.scheduledAt,
      input.durationMinutes,
    )
  }

  const appointments = await prisma.$transaction(
    scheduledSlots.map((slot) =>
      prisma.appointment.create({
        data: {
          therapistId,
          patientId: input.patientId,
          locationId: input.locationId,
          gabineteId: input.gabineteId,
          scheduledAt: slot.scheduledAt,
          durationMinutes: input.durationMinutes,
          sessionFee,
          notes,
          recurrenceGroupId,
        },
        include: appointmentInclude,
      }),
    ),
  )

  await prisma.$transaction(
    appointments.map((appointment) =>
      prisma.appointment.update({
        where: { id: appointment.id },
        data: recurrenceGroupId
          ? {
              recurrenceCadence: input.recurrence!.cadence,
              recurrenceUntil: input.recurrence!.until,
            }
          : { calendarUid: buildCalendarUid(appointment.id) },
      }),
    ),
  )

  if (recurrenceGroupId && appointments.length > 0) {
    const anchor = [...appointments].sort(
      (left, right) => left.scheduledAt.getTime() - right.scheduledAt.getTime(),
    )[0]
    await prisma.appointment.update({
      where: { id: anchor.id },
      data: { calendarUid: buildCalendarUid(recurrenceGroupId) },
    })
  }

  const formatted = appointments.map((appointment) =>
    formatAppointment(appointment, { includeCalendarInvite: true }),
  )
  queueAppointmentCalendarInvites(
    recurrenceGroupId && appointments.length > 0
      ? [
          [...appointments].sort(
            (left, right) => left.scheduledAt.getTime() - right.scheduledAt.getTime(),
          )[0].id,
        ]
      : appointments.map((appointment) => appointment.id),
    'REQUEST',
  )
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
  await assertTherapistHasLocation(therapistId, input.locationId)
  const gabinete = await getActiveGabineteOrThrow(input.gabineteId, input.locationId)

  const scope = input.scope ?? 'single'
  const notes = input.notes?.trim() ? input.notes.trim() : null
  const sendCalendarUpdate = input.sendCalendarUpdate !== false

  if (scope === 'single' || !existing.recurrenceGroupId) {
    const scheduledAt = parseScheduledAt(input.date, input.time)
    if (!scheduledAt) {
      throw new Error('INVALID_SCHEDULE')
    }

    const previousScheduledAt = existing.scheduledAt

    await assertRoomAvailable(
      gabinete.id,
      gabinete.name,
      scheduledAt,
      input.durationMinutes,
      [appointmentId],
    )

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        patientId: input.patientId,
        locationId: input.locationId,
        gabineteId: input.gabineteId,
        scheduledAt,
        durationMinutes: input.durationMinutes,
        sessionFee: input.sessionFee ?? decimalToNumber(existing.sessionFee),
        notes,
      },
      include: appointmentInclude,
    })

    const formatted = formatAppointment(appointment, { includeCalendarInvite: true })
    if (sendCalendarUpdate) {
      if (existing.recurrenceGroupId) {
        void sendSeriesOccurrenceException(appointment.id, previousScheduledAt, scheduledAt).catch(
          () => {
            // Status persisted on the appointment row.
          },
        )
      } else {
        queueAppointmentCalendarInvites([appointment.id], 'REQUEST')
      }
    }
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

  const sessionFee = await resolveSessionFee(therapistId, {
    sessionFee: input.sessionFee,
    patientId: input.patientId,
  })

  const excludeIds = targets.map((target) => target.id)
  const updateSlots = targets.map((target) => {
    const date = formatAppointmentDate(target.scheduledAt)
    const scheduledAt = parseScheduledAt(date, input.time)
    if (!scheduledAt) {
      throw new Error('INVALID_SCHEDULE')
    }
    return { target, scheduledAt }
  })

  for (const slot of updateSlots) {
    await assertRoomAvailable(
      gabinete.id,
      gabinete.name,
      slot.scheduledAt,
      input.durationMinutes,
      excludeIds,
    )
  }

  const appointments = await prisma.$transaction(
    updateSlots.map(({ target, scheduledAt }) =>
      prisma.appointment.update({
        where: { id: target.id },
        data: {
          patientId: input.patientId,
          locationId: input.locationId,
          gabineteId: input.gabineteId,
          scheduledAt,
          durationMinutes: input.durationMinutes,
          sessionFee,
          notes,
        },
        include: appointmentInclude,
      }),
    ),
  )

  const formatted = appointments.map((appointment) =>
    formatAppointment(appointment, { includeCalendarInvite: true }),
  )
  if (sendCalendarUpdate) {
    queueAppointmentCalendarInvites(
      [
        [...appointments].sort(
          (left, right) => left.scheduledAt.getTime() - right.scheduledAt.getTime(),
        )[0].id,
      ],
      'REQUEST',
    )
  }
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
    const cancellationJobs = await prepareDeletionCancellationJobs(
      [
        {
          id: existing.id,
          recurrenceGroupId: existing.recurrenceGroupId,
          calendarInviteStatus: existing.calendarInviteStatus,
          scheduledAt: existing.scheduledAt,
        },
      ],
      scope,
    )
    await prisma.appointment.delete({ where: { id: appointmentId } })
    queueDeletionCancellationInvites(cancellationJobs)
    return { deletedCount: 1 }
  }

  const targets = await prisma.appointment.findMany({
    where: buildSeriesWhere(therapistId, existing.recurrenceGroupId, existing.scheduledAt, scope),
    select: {
      id: true,
      recurrenceGroupId: true,
      calendarInviteStatus: true,
      scheduledAt: true,
    },
  })

  const cancellationJobs = await prepareDeletionCancellationJobs(targets, scope)

  const result = await prisma.appointment.deleteMany({
    where: buildSeriesWhere(therapistId, existing.recurrenceGroupId, existing.scheduledAt, scope),
  })

  queueDeletionCancellationInvites(cancellationJobs)

  return { deletedCount: result.count }
}
