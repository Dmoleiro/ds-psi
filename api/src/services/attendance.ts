import { AttendanceStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { formatAppointmentDate } from './appointments.js'
import { assertTherapistHasLocation } from './therapistLocations.js'
import { decimalToNumber, getOrCreateFinancialSettings } from './financialSettings.js'

function appointmentFeeKey(patientId: string, date: string) {
  return `${patientId}:${date}`
}

function buildAppointmentFeeLookup(
  appointments: Array<{
    patientId: string
    scheduledAt: Date
    sessionFee: { toString(): string }
  }>,
) {
  const map = new Map<string, number>()
  for (const appointment of appointments) {
    const key = appointmentFeeKey(appointment.patientId, formatAppointmentDate(appointment.scheduledAt))
    if (!map.has(key)) {
      map.set(key, decimalToNumber(appointment.sessionFee))
    }
  }
  return map
}

export function resolveAttendanceSessionFee(
  patientId: string,
  date: string,
  appointmentFees: Map<string, number>,
  patientSessionFee: number | null,
  defaultSessionFee: number,
) {
  return (
    appointmentFees.get(appointmentFeeKey(patientId, date)) ??
    patientSessionFee ??
    defaultSessionFee
  )
}

export function parseYearMonth(year: number, month: number) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return null
  }
  const from = new Date(Date.UTC(year, month - 1, 1))
  const to = new Date(Date.UTC(year, month, 0))
  return { from, to }
}

export function parseDateOnly(isoDate: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }
  return date
}

export function formatDateOnly(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export async function getTherapistPatientOrThrow(
  therapistId: string,
  patientId: string,
  options?: { requireActive?: boolean },
) {
  const patient = await prisma.patient.findFirst({
    where: { id: patientId, therapistId },
    select: { id: true, therapistId: true, active: true },
  })
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND')
  }
  if (options?.requireActive && !patient.active) {
    throw new Error('PATIENT_INACTIVE')
  }
  return patient
}

export async function listPatientAttendance(
  therapistId: string,
  patientId: string,
  year: number,
  month: number,
) {
  await getTherapistPatientOrThrow(therapistId, patientId)
  const range = parseYearMonth(year, month)
  if (!range) {
    throw new Error('INVALID_MONTH')
  }

  const records = await prisma.attendanceRecord.findMany({
    where: {
      patientId,
      therapistId,
      sessionDate: { gte: range.from, lte: range.to },
    },
    orderBy: { sessionDate: 'asc' },
  })

  return records.map((record) => ({
    patientId: record.patientId,
    date: formatDateOnly(record.sessionDate),
    status: record.status,
    notes: record.notes,
  }))
}

export async function listTherapistAttendance(
  therapistId: string,
  year: number,
  month: number,
  locationId: string,
) {
  const range = parseYearMonth(year, month)
  if (!range) {
    throw new Error('INVALID_MONTH')
  }

  const location = await prisma.location.findFirst({
    where: { id: locationId, active: true },
  })
  if (!location) {
    throw new Error('LOCATION_NOT_FOUND')
  }

  await assertTherapistHasLocation(therapistId, locationId)

  const monthStart = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0))
  const monthEndExclusive = new Date(Date.UTC(year, month, 1, 0, 0, 0))

  const [patients, records, appointments, settings] = await Promise.all([
    prisma.patient.findMany({
      where: { therapistId, locationId },
      orderBy: { fullName: 'asc' },
      select: { id: true, fullName: true, sessionFee: true },
    }),
    prisma.attendanceRecord.findMany({
      where: {
        therapistId,
        sessionDate: { gte: range.from, lte: range.to },
      },
      orderBy: [{ sessionDate: 'asc' }, { patientId: 'asc' }],
    }),
    prisma.appointment.findMany({
      where: {
        therapistId,
        locationId,
        scheduledAt: {
          gte: monthStart,
          lt: monthEndExclusive,
        },
      },
      select: { patientId: true, scheduledAt: true, sessionFee: true },
      orderBy: { scheduledAt: 'asc' },
    }),
    getOrCreateFinancialSettings(therapistId),
  ])

  const patientMap = new Map(patients.map((patient) => [patient.id, patient]))
  const appointmentFees = buildAppointmentFeeLookup(appointments)

  return {
    year,
    month,
    daysInMonth: range.to.getUTCDate(),
    location: { id: location.id, name: location.name },
    patients: patients.map(({ id, fullName }) => ({ id, fullName })),
    records: records
      .filter((record) => patientMap.has(record.patientId))
      .map((record) => {
        const patient = patientMap.get(record.patientId)!
        const date = formatDateOnly(record.sessionDate)
        const patientFee =
          patient.sessionFee != null ? decimalToNumber(patient.sessionFee) : null
        return {
          patientId: record.patientId,
          patientName: patient.fullName,
          date,
          status: record.status,
          sessionFee: resolveAttendanceSessionFee(
            record.patientId,
            date,
            appointmentFees,
            patientFee,
            settings.defaultSessionFee,
          ),
        }
      }),
    scheduledAppointments: appointments.map((appointment) => ({
      patientId: appointment.patientId,
      date: formatDateOnly(appointment.scheduledAt),
    })),
  }
}

export async function deleteAttendanceForAppointments(
  appointments: Array<{ patientId: string; scheduledAt: Date }>,
) {
  const uniqueSessions = new Map<string, { patientId: string; sessionDate: Date }>()

  for (const appointment of appointments) {
    const sessionDate = parseDateOnly(formatAppointmentDate(appointment.scheduledAt))
    if (!sessionDate) continue
    const key = `${appointment.patientId}:${formatDateOnly(sessionDate)}`
    uniqueSessions.set(key, { patientId: appointment.patientId, sessionDate })
  }

  if (uniqueSessions.size === 0) return

  await prisma.$transaction(
    [...uniqueSessions.values()].map(({ patientId, sessionDate }) =>
      prisma.attendanceRecord.deleteMany({
        where: { patientId, sessionDate },
      }),
    ),
  )
}

export async function upsertPatientAttendance(
  therapistId: string,
  patientId: string,
  isoDate: string,
  status: AttendanceStatus | null,
  notes?: string | null,
) {
  const patient = await getTherapistPatientOrThrow(therapistId, patientId)
  const sessionDate = parseDateOnly(isoDate)
  if (!sessionDate) {
    throw new Error('INVALID_DATE')
  }

  if (status === null) {
    await prisma.attendanceRecord.deleteMany({
      where: { patientId, sessionDate },
    })
    return { date: isoDate, status: null, notes: null }
  }

  const record = await prisma.attendanceRecord.upsert({
    where: {
      patientId_sessionDate: { patientId, sessionDate },
    },
    create: {
      patientId,
      therapistId: patient.therapistId,
      sessionDate,
      status,
      notes: notes ?? null,
    },
    update: {
      status,
      notes: notes ?? null,
    },
  })

  return {
    date: formatDateOnly(record.sessionDate),
    status: record.status,
    notes: record.notes,
  }
}

export async function toggleCoordinatorReceiptStatus(
  therapistId: string,
  patientId: string,
  isoDate: string,
) {
  await getTherapistPatientOrThrow(therapistId, patientId)
  const sessionDate = parseDateOnly(isoDate)
  if (!sessionDate) {
    throw new Error('INVALID_DATE')
  }

  const existing = await prisma.attendanceRecord.findUnique({
    where: {
      patientId_sessionDate: { patientId, sessionDate },
    },
  })

  if (!existing || existing.therapistId !== therapistId) {
    throw new Error('RECORD_NOT_FOUND')
  }

  if (
    existing.status !== AttendanceStatus.present_paid &&
    existing.status !== AttendanceStatus.receipt_issued
  ) {
    throw new Error('NOT_RECEIPT_EDITABLE')
  }

  const nextStatus =
    existing.status === AttendanceStatus.present_paid
      ? AttendanceStatus.receipt_issued
      : AttendanceStatus.present_paid

  const record = await prisma.attendanceRecord.update({
    where: {
      patientId_sessionDate: { patientId, sessionDate },
    },
    data: { status: nextStatus },
  })

  return {
    date: formatDateOnly(record.sessionDate),
    status: record.status,
    notes: record.notes,
  }
}
