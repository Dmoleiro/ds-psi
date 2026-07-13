import { AttendanceStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'

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

export async function getTherapistPatientOrThrow(therapistId: string, patientId: string) {
  const patient = await prisma.patient.findFirst({
    where: { id: patientId, therapistId },
    select: { id: true, therapistId: true },
  })
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND')
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
    date: formatDateOnly(record.sessionDate),
    status: record.status,
    notes: record.notes,
  }))
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
