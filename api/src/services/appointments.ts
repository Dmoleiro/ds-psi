import { prisma } from '../lib/prisma.js'
import { formatDateOnly, getTherapistPatientOrThrow, parseDateOnly } from './attendance.js'

export type AppointmentInput = {
  patientId: string
  locationId: string
  date: string
  time: string
  durationMinutes: number
  notes?: string | null
}

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

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
  const scheduledAt = parseScheduledAt(input.date, input.time)
  if (!scheduledAt) {
    throw new Error('INVALID_SCHEDULE')
  }

  const appointment = await prisma.appointment.create({
    data: {
      therapistId,
      patientId: input.patientId,
      locationId: input.locationId,
      scheduledAt,
      durationMinutes: input.durationMinutes,
      notes: input.notes?.trim() ? input.notes.trim() : null,
    },
    include: appointmentInclude,
  })

  return formatAppointment(appointment)
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
      notes: input.notes?.trim() ? input.notes.trim() : null,
    },
    include: appointmentInclude,
  })

  return formatAppointment(appointment)
}

export async function deleteTherapistAppointment(therapistId: string, appointmentId: string) {
  const existing = await prisma.appointment.findFirst({
    where: { id: appointmentId, therapistId },
  })
  if (!existing) {
    throw new Error('APPOINTMENT_NOT_FOUND')
  }

  await prisma.appointment.delete({ where: { id: appointmentId } })
}
