import { SessionStatus, UserRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { formatAppointmentDate } from './appointments.js'
import { formatDateOnly, parseDateOnly, parseYearMonth } from './attendance.js'
import { formatClinicDateLong, getClinicTodayIso, getGreetingLabel } from './dashboard.js'

const CLINIC_TIMEZONE = 'Europe/Lisbon'

function addDaysToIsoDate(isoDate: string, days: number): string {
  const date = parseDateOnly(isoDate)
  if (!date) return isoDate
  date.setUTCDate(date.getUTCDate() + days)
  return formatDateOnly(date)
}

const ATTENDANCE_STATUS_LABELS: Record<string, string> = {
  present_unpaid: 'Por pagar',
  present_paid: 'Pago',
  receipt_issued: 'Recibo passado',
  absent: 'Falta',
}

export async function getAdminDashboard() {
  const now = new Date()
  const today = getClinicTodayIso(now)
  const weekEnd = addDaysToIsoDate(today, 7)
  const todayStart = parseDateOnly(today)
  const horizonEnd = parseDateOnly(weekEnd)
  const tomorrowStart = parseDateOnly(addDaysToIsoDate(today, 1))

  if (!todayStart || !horizonEnd || !tomorrowStart) {
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

  const [
    therapists,
    coordinators,
    locations,
    gabinetes,
    totalPatients,
    newPatientsThisMonth,
    openIntakeSessions,
    appointmentsInHorizon,
    appointmentsThisMonth,
    appointmentsToday,
    attendanceByStatus,
    upcomingWorkshops,
    piccaEnabledTherapists,
  ] = await Promise.all([
    prisma.user.findMany({
      where: { role: UserRole.therapist },
      select: { id: true, name: true, active: true },
      orderBy: { name: 'asc' },
    }),
    prisma.user.findMany({
      where: { role: UserRole.coordinator },
      select: { id: true, active: true },
    }),
    prisma.location.findMany({
      select: { id: true, name: true, active: true },
      orderBy: { name: 'asc' },
    }),
    prisma.gabinete.findMany({
      select: { id: true, active: true },
    }),
    prisma.patient.count(),
    monthRange
      ? prisma.patient.count({
          where: {
            createdAt: { gte: monthRange.from, lte: monthRange.to },
          },
        })
      : Promise.resolve(0),
    prisma.intakeSession.count({
      where: {
        status: { in: [SessionStatus.active, SessionStatus.in_progress] },
      },
    }),
    prisma.appointment.findMany({
      where: {
        scheduledAt: { gte: todayStart, lt: horizonEnd },
      },
      select: {
        scheduledAt: true,
        therapistId: true,
        locationId: true,
      },
    }),
    monthRange
      ? prisma.appointment.findMany({
          where: {
            scheduledAt: { gte: monthRange.from, lte: monthRange.to },
          },
          select: {
            therapistId: true,
            locationId: true,
          },
        })
      : Promise.resolve([]),
    prisma.appointment.findMany({
      where: {
        scheduledAt: { gte: todayStart, lt: tomorrowStart },
      },
      select: { locationId: true },
    }),
    monthRange
      ? prisma.attendanceRecord.groupBy({
          by: ['status'],
          where: {
            sessionDate: { gte: monthRange.from, lte: monthRange.to },
          },
          _count: { _all: true },
        })
      : Promise.resolve([]),
    prisma.workshop.count({
      where: {
        eventDate: { gte: todayStart },
      },
    }),
    prisma.user.count({
      where: {
        role: UserRole.therapist,
        active: true,
        piccaEnabled: true,
      },
    }),
  ])

  const activeTherapists = therapists.filter((therapist) => therapist.active)
  const activeCoordinators = coordinators.filter((coordinator) => coordinator.active)
  const activeLocations = locations.filter((location) => location.active)
  const activeGabinetes = gabinetes.filter((gabinete) => gabinete.active)

  const appointmentCountsByDate = new Map<string, number>()
  for (const appointment of appointmentsInHorizon) {
    const date = formatAppointmentDate(appointment.scheduledAt)
    appointmentCountsByDate.set(date, (appointmentCountsByDate.get(date) ?? 0) + 1)
  }

  const weekAppointments = Array.from({ length: 7 }, (_, index) => {
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

  const locationNameById = new Map(locations.map((location) => [location.id, location.name]))
  const therapistById = new Map(therapists.map((therapist) => [therapist.id, therapist]))

  const monthLocationCounts = new Map<string, number>()
  for (const appointment of appointmentsThisMonth) {
    monthLocationCounts.set(
      appointment.locationId,
      (monthLocationCounts.get(appointment.locationId) ?? 0) + 1,
    )
  }

  const monthByLocation = [...monthLocationCounts.entries()]
    .map(([locationId, count]) => ({
      locationId,
      locationName: locationNameById.get(locationId) ?? 'Local desconhecido',
      count,
    }))
    .sort((a, b) => b.count - a.count)

  const monthTherapistCounts = new Map<string, number>()
  for (const appointment of appointmentsThisMonth) {
    monthTherapistCounts.set(
      appointment.therapistId,
      (monthTherapistCounts.get(appointment.therapistId) ?? 0) + 1,
    )
  }

  const monthByTherapist = [...monthTherapistCounts.entries()]
    .map(([therapistId, count]) => {
      const therapist = therapistById.get(therapistId)
      return {
        therapistId,
        therapistName: therapist?.name ?? 'Terapeuta desconhecido',
        active: therapist?.active ?? false,
        count,
      }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const attendanceChart = Object.entries(ATTENDANCE_STATUS_LABELS).map(([status, label]) => ({
    status,
    label,
    count: attendanceByStatus.find((entry) => entry.status === status)?._count._all ?? 0,
  }))
  const monthAttendanceTotal = attendanceChart.reduce((sum, entry) => sum + entry.count, 0)

  const therapistIdsWithWeekAppointments = new Set(
    appointmentsInHorizon.map((appointment) => appointment.therapistId),
  )
  const therapistsWithoutWeekAppointments = activeTherapists
    .filter((therapist) => !therapistIdsWithWeekAppointments.has(therapist.id))
    .map((therapist) => ({ id: therapist.id, name: therapist.name }))

  const todayByLocationCounts = new Map<string, number>()
  for (const appointment of appointmentsToday) {
    todayByLocationCounts.set(
      appointment.locationId,
      (todayByLocationCounts.get(appointment.locationId) ?? 0) + 1,
    )
  }

  const todayByLocation = [...todayByLocationCounts.entries()]
    .map(([locationId, count]) => ({
      locationId,
      locationName: locationNameById.get(locationId) ?? 'Local desconhecido',
      count,
    }))
    .sort((a, b) => b.count - a.count)

  return {
    today,
    todayLabel: formatClinicDateLong(today),
    greeting: getGreetingLabel(now),
    stats: {
      activeTherapists: activeTherapists.length,
      totalTherapists: therapists.length,
      activeCoordinators: activeCoordinators.length,
      totalCoordinators: coordinators.length,
      activeLocations: activeLocations.length,
      totalLocations: locations.length,
      activeGabinetes: activeGabinetes.length,
      totalGabinetes: gabinetes.length,
      totalPatients,
      newPatientsThisMonth,
      openIntakeSessions,
      appointmentsToday: appointmentsToday.length,
      appointmentsThisWeek: appointmentsInHorizon.length,
      appointmentsThisMonth: appointmentsThisMonth.length,
      attendanceThisMonth: monthAttendanceTotal,
      upcomingWorkshops,
      piccaEnabledTherapists,
    },
    charts: {
      weekAppointments,
      monthByLocation,
      monthByTherapist,
      monthAttendance: attendanceChart,
      monthAttendanceTotal,
    },
    monitoring: {
      therapistsWithoutWeekAppointments,
      todayByLocation,
    },
  }
}
