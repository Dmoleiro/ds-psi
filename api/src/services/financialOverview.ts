import { AttendanceStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { formatAppointmentDate, formatAppointmentTime } from './appointments.js'
import { formatDateOnly, parseYearMonth } from './attendance.js'
import { getClinicTodayIso } from './dashboard.js'
import {
  decimalToNumber,
  getOrCreateFinancialSettings,
  type FinancialRates,
} from './financialSettings.js'

export { getOrCreateFinancialSettings, updateFinancialSettings } from './financialSettings.js'
export type { FinancialRates } from './financialSettings.js'

export type SessionFinancials = {
  gross: number
  socialSecurity: number
  irs: number
  savings: number
  totalReserves: number
  available: number
}

export const PAID_ATTENDANCE_STATUSES: AttendanceStatus[] = [
  AttendanceStatus.present_paid,
  AttendanceStatus.receipt_issued,
]

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

export function computeSessionFinancials(gross: number, rates: FinancialRates): SessionFinancials {
  if (gross <= 0) {
    return {
      gross: 0,
      socialSecurity: 0,
      irs: 0,
      savings: 0,
      totalReserves: 0,
      available: 0,
    }
  }

  const socialSecurity = roundMoney(gross * rates.socialSecurityRate)
  const irs = roundMoney(gross * rates.irsRate)
  const savings = roundMoney(gross * rates.savingsRate)
  const totalReserves = roundMoney(socialSecurity + irs + savings)
  const available = roundMoney(gross - totalReserves)

  return { gross, socialSecurity, irs, savings, totalReserves, available }
}

function appointmentKey(patientId: string, date: string) {
  return `${patientId}:${date}`
}

function buildAppointmentFeeMap(
  appointments: Array<{
    patientId: string
    scheduledAt: Date
    sessionFee: { toString(): string }
    notes: string | null
    patient: { fullName: string }
    location: { name: string }
    id: string
  }>,
) {
  const map = new Map<
    string,
    Array<{
      id: string
      sessionFee: number
      notes: string | null
      patientName: string
      locationName: string
      time: string
    }>
  >()

  for (const appointment of appointments) {
    const date = formatAppointmentDate(appointment.scheduledAt)
    const key = appointmentKey(appointment.patientId, date)
    const list = map.get(key) ?? []
    list.push({
      id: appointment.id,
      sessionFee: decimalToNumber(appointment.sessionFee),
      notes: appointment.notes,
      patientName: appointment.patient.fullName,
      locationName: appointment.location.name,
      time: formatAppointmentTime(appointment.scheduledAt),
    })
    map.set(key, list)
  }

  return map
}

function pickAppointmentForAttendance(
  map: Map<string, Array<{ id: string; sessionFee: number; notes: string | null; patientName: string; locationName: string; time: string }>>,
  patientId: string,
  date: string,
) {
  const matches = map.get(appointmentKey(patientId, date)) ?? []
  return matches[0] ?? null
}

function sumFinancials(rows: SessionFinancials[]) {
  return rows.reduce(
    (acc, row) => ({
      gross: roundMoney(acc.gross + row.gross),
      socialSecurity: roundMoney(acc.socialSecurity + row.socialSecurity),
      irs: roundMoney(acc.irs + row.irs),
      savings: roundMoney(acc.savings + row.savings),
      totalReserves: roundMoney(acc.totalReserves + row.totalReserves),
      available: roundMoney(acc.available + row.available),
    }),
    {
      gross: 0,
      socialSecurity: 0,
      irs: 0,
      savings: 0,
      totalReserves: 0,
      available: 0,
    },
  )
}

export type FinancialRow = {
  id: string
  kind: 'realized' | 'forecast'
  date: string
  patientId: string
  patientName: string
  locationName: string
  attendanceStatus: AttendanceStatus | null
  appointmentId: string | null
  notes: string | null
  missingAppointment: boolean
} & SessionFinancials

async function loadMonthContext(therapistId: string, year: number, month: number) {
  const range = parseYearMonth(year, month)
  if (!range) {
    throw new Error('INVALID_MONTH')
  }

  const rates = await getOrCreateFinancialSettings(therapistId)
  const monthEndExclusive = new Date(Date.UTC(year, month, 1, 0, 0, 0))

  const [attendanceRecords, appointments] = await Promise.all([
    prisma.attendanceRecord.findMany({
      where: {
        therapistId,
        status: { in: PAID_ATTENDANCE_STATUSES },
        sessionDate: { gte: range.from, lte: range.to },
      },
      include: {
        patient: { select: { id: true, fullName: true, sessionFee: true, location: { select: { name: true } } } },
      },
      orderBy: [{ sessionDate: 'asc' }, { patientId: 'asc' }],
    }),
    prisma.appointment.findMany({
      where: {
        therapistId,
        scheduledAt: { gte: range.from, lt: monthEndExclusive },
      },
      include: {
        patient: { select: { id: true, fullName: true } },
        location: { select: { name: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    }),
  ])

  const appointmentMap = buildAppointmentFeeMap(appointments)

  const paidKeys = new Set<string>()

  const realizedRows: FinancialRow[] = attendanceRecords.map((record) => {
    const date = formatDateOnly(record.sessionDate)
    paidKeys.add(appointmentKey(record.patientId, date))
    const matched = pickAppointmentForAttendance(appointmentMap, record.patientId, date)
    const patientFee =
      record.patient.sessionFee != null ? decimalToNumber(record.patient.sessionFee) : null
    const gross = matched?.sessionFee ?? patientFee ?? rates.defaultSessionFee
    const financials = computeSessionFinancials(gross, rates)

    return {
      id: record.id,
      kind: 'realized',
      date,
      patientId: record.patientId,
      patientName: record.patient.fullName,
      locationName: matched?.locationName ?? record.patient.location?.name ?? '—',
      attendanceStatus: record.status,
      appointmentId: matched?.id ?? null,
      notes: matched?.notes ?? null,
      missingAppointment: !matched,
      ...financials,
    }
  })

  const now = new Date()
  const today = getClinicTodayIso(now)

  const forecastRows: FinancialRow[] = appointments
    .filter((appointment) => {
      const date = formatAppointmentDate(appointment.scheduledAt)
      if (paidKeys.has(appointmentKey(appointment.patientId, date))) {
        return false
      }
      if (appointment.scheduledAt.getTime() < now.getTime()) {
        return false
      }
      return true
    })
    .map((appointment) => {
      const date = formatAppointmentDate(appointment.scheduledAt)
      const gross = decimalToNumber(appointment.sessionFee)
      const financials = computeSessionFinancials(gross, rates)

      return {
        id: appointment.id,
        kind: 'forecast' as const,
        date,
        patientId: appointment.patientId,
        patientName: appointment.patient.fullName,
        locationName: appointment.location.name,
        attendanceStatus: null,
        appointmentId: appointment.id,
        notes: appointment.notes,
        missingAppointment: false,
        ...financials,
      }
    })

  return {
    year,
    month,
    today,
    rates,
    realizedRows,
    forecastRows,
    summary: {
      realized: sumFinancials(realizedRows),
      forecast: sumFinancials(forecastRows),
    },
  }
}

export async function getTherapistFinancialOverview(
  therapistId: string,
  year: number,
  month: number,
) {
  const context = await loadMonthContext(therapistId, year, month)
  return {
    year: context.year,
    month: context.month,
    rates: context.rates,
    summary: context.summary,
    realizedRows: context.realizedRows,
    forecastRows: context.forecastRows,
  }
}

export async function getTherapistFinancialCharts(therapistId: string, year: number) {
  const months = await Promise.all(
    Array.from({ length: 12 }, (_, index) =>
      loadMonthContext(therapistId, year, index + 1).catch(() => null),
    ),
  )

  return {
    year,
    months: months.map((context, index) => {
      if (!context) {
        return {
          month: index + 1,
          realizedGross: 0,
          forecastGross: 0,
          realizedAvailable: 0,
        }
      }

      return {
        month: index + 1,
        realizedGross: context.summary.realized.gross,
        forecastGross: context.summary.forecast.gross,
        realizedAvailable: context.summary.realized.available,
      }
    }),
  }
}

export async function assertTherapistFinancialAccess(therapistId: string) {
  const user = await prisma.user.findFirst({
    where: { id: therapistId, role: 'therapist', active: true },
    select: { financialOverviewEnabled: true },
  })
  if (!user?.financialOverviewEnabled) {
    throw new Error('FINANCIAL_ACCESS_DENIED')
  }
}
