import { SessionStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { formatAppointmentDate, formatAppointmentTime } from './appointments.js'
import { formatDateOnly, parseDateOnly, parseYearMonth } from './attendance.js'

const CLINIC_TIMEZONE = 'Europe/Lisbon'

export function getClinicTodayIso(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: CLINIC_TIMEZONE }).format(date)
}

function addDaysToIsoDate(isoDate: string, days: number): string {
  const date = parseDateOnly(isoDate)
  if (!date) return isoDate
  date.setUTCDate(date.getUTCDate() + days)
  return formatDateOnly(date)
}

function getGreetingHour(date = new Date()): number {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: CLINIC_TIMEZONE,
      hour: 'numeric',
      hour12: false,
    }).format(date),
  )
  return hour
}

export function getGreetingLabel(date = new Date()): 'Bom dia' | 'Boa tarde' | 'Boa noite' {
  const hour = getGreetingHour(date)
  if (hour < 12) return 'Bom dia'
  if (hour < 19) return 'Boa tarde'
  return 'Boa noite'
}

export function formatClinicDateLong(isoDate: string): string {
  const date = parseDateOnly(isoDate)
  if (!date) return isoDate
  return new Intl.DateTimeFormat('pt-PT', {
    timeZone: CLINIC_TIMEZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

type AppointmentRow = {
  id: string
  scheduledAt: Date
  durationMinutes: number
  notes: string | null
  patient: { id: string; fullName: string }
  location: { name: string }
}

function mapDashboardAppointment(record: AppointmentRow, now: Date) {
  const date = formatAppointmentDate(record.scheduledAt)
  const isToday = date === getClinicTodayIso(now)
  const isPast = record.scheduledAt.getTime() < now.getTime()

  return {
    id: record.id,
    patientId: record.patient.id,
    patientName: record.patient.fullName,
    locationName: record.location.name,
    date,
    time: formatAppointmentTime(record.scheduledAt),
    durationMinutes: record.durationMinutes,
    notes: record.notes,
    isPast,
    isToday,
  }
}

export async function getTherapistDashboard(therapistId: string) {
  const now = new Date()
  const today = getClinicTodayIso(now)
  const weekEnd = addDaysToIsoDate(today, 7)
  const todayStart = parseDateOnly(today)
  const horizonEnd = parseDateOnly(weekEnd)

  if (!todayStart || !horizonEnd) {
    throw new Error('INVALID_DATE')
  }

  horizonEnd.setUTCDate(horizonEnd.getUTCDate() + 1)

  const lisbonParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: CLINIC_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
  })
    .formatToParts(now)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== 'literal') acc[part.type] = part.value
      return acc
    }, {})

  const year = Number(lisbonParts.year)
  const month = Number(lisbonParts.month)
  const monthRange = parseYearMonth(year, month)

  const appointmentInclude = {
    patient: { select: { id: true, fullName: true } },
    location: { select: { name: true } },
  } as const

  const [
    patientCount,
    appointments,
    openSessions,
    unpaidThisMonth,
    attendanceByStatus,
  ] = await Promise.all([
    prisma.patient.count({ where: { therapistId } }),
    prisma.appointment.findMany({
      where: {
        therapistId,
        scheduledAt: { gte: todayStart, lt: horizonEnd },
      },
      include: appointmentInclude,
      orderBy: { scheduledAt: 'asc' },
    }),
    prisma.intakeSession.findMany({
      where: {
        therapistId,
        status: { in: [SessionStatus.active, SessionStatus.in_progress] },
      },
      include: {
        patient: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    monthRange
      ? prisma.attendanceRecord.count({
          where: {
            therapistId,
            status: 'present_unpaid',
            sessionDate: { gte: monthRange.from, lte: monthRange.to },
          },
        })
      : Promise.resolve(0),
    monthRange
      ? prisma.attendanceRecord.groupBy({
          by: ['status'],
          where: {
            therapistId,
            sessionDate: { gte: monthRange.from, lte: monthRange.to },
          },
          _count: { _all: true },
        })
      : Promise.resolve([]),
  ])

  const mapped = appointments.map((appointment) => mapDashboardAppointment(appointment, now))
  const todayAppointments = mapped.filter((appointment) => appointment.isToday)
  const upcomingAppointments = mapped
    .filter((appointment) => !appointment.isToday)
    .slice(0, 5)

  const weekAppointments = mapped.length

  const appointmentCountsByDate = new Map<string, number>()
  for (const appointment of mapped) {
    appointmentCountsByDate.set(
      appointment.date,
      (appointmentCountsByDate.get(appointment.date) ?? 0) + 1,
    )
  }

  const weekChart = Array.from({ length: 7 }, (_, index) => {
    const date = addDaysToIsoDate(today, index)
    const dateObj = parseDateOnly(date)
    const label = dateObj
      ? new Intl.DateTimeFormat('pt-PT', {
          timeZone: CLINIC_TIMEZONE,
          weekday: 'short',
          day: 'numeric',
        }).format(dateObj)
      : date

    return {
      date,
      label,
      count: appointmentCountsByDate.get(date) ?? 0,
      isToday: date === today,
    }
  })

  const attendanceStatusLabels: Record<string, string> = {
    present_unpaid: 'Por pagar',
    present_paid: 'Pago',
    receipt_issued: 'Recibo passado',
    absent: 'Falta',
  }

  const attendanceChart = Object.entries(attendanceStatusLabels).map(([status, label]) => ({
    status,
    label,
    count:
      attendanceByStatus.find((entry) => entry.status === status)?._count._all ?? 0,
  }))

  const monthAttendanceTotal = attendanceChart.reduce((sum, entry) => sum + entry.count, 0)

  return {
    today,
    todayLabel: formatClinicDateLong(today),
    greeting: getGreetingLabel(now),
    stats: {
      patients: patientCount,
      todayAppointments: todayAppointments.length,
      weekAppointments,
      openFormSessions: openSessions.length,
      unpaidThisMonth,
    },
    todayAppointments,
    upcomingAppointments,
    pendingForms: openSessions.map((session) => ({
      sessionId: session.id,
      patientId: session.patient.id,
      patientName: session.patient.fullName,
      status: session.status,
      createdAt: session.createdAt.toISOString(),
    })),
    charts: {
      weekAppointments: weekChart,
      monthAttendance: attendanceChart,
      monthAttendanceTotal,
    },
  }
}
