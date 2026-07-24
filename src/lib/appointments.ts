import { toIsoDate } from './attendance'
import type { AttendanceStatus } from './api'

export type AppointmentSummary = {
  id: string
  patientId: string
  patientName: string
  locationId: string
  locationName: string
  gabineteId: string
  gabineteName: string
  date: string
  time: string
  scheduledAt: string
  durationMinutes: number
  sessionFee: number
  notes: string | null
  recurrenceGroupId: string | null
}

export type FinancialSettings = {
  socialSecurityRate: number
  irsRate: number
  savingsRate: number
  defaultSessionFee: number
}

export type FinancialSummary = {
  gross: number
  socialSecurity: number
  irs: number
  savings: number
  totalReserves: number
  available: number
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
  gross: number
  socialSecurity: number
  irs: number
  savings: number
  totalReserves: number
  available: number
}

export type FinancialOverview = {
  year: number
  month: number
  rates: FinancialSettings
  summary: {
    realized: FinancialSummary
    forecast: FinancialSummary
  }
  realizedRows: FinancialRow[]
  forecastRows: FinancialRow[]
}

export type FinancialYearCharts = {
  year: number
  months: Array<{
    month: number
    realizedGross: number
    forecastGross: number
    realizedAvailable: number
  }>
}

export const DURATION_OPTIONS = [30, 45, 50, 60, 90] as const

export type GabineteSummary = {
  id: string
  locationId: string
  locationName?: string
  name: string
  active: boolean
  sortOrder: number
}

export function gabinetesForLocation(gabinetes: GabineteSummary[], locationId: string) {
  return gabinetes.filter((gabinete) => gabinete.locationId === locationId)
}

export function resolveGabineteForLocation(
  locationId: string,
  gabinetes: GabineteSummary[],
  currentGabineteId = '',
) {
  const options = gabinetesForLocation(gabinetes, locationId)
  if (options.length === 1) return options[0].id
  if (currentGabineteId && options.some((gabinete) => gabinete.id === currentGabineteId)) {
    return currentGabineteId
  }
  return options[0]?.id ?? ''
}

export type RoomOccupancy = {
  id: string
  gabineteId: string
  gabineteName: string
  date: string
  time: string
  durationMinutes: number
  therapistName: string
  patientName: string
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function occupancyOverlaps(
  slotTime: string,
  slotDuration: number,
  otherTime: string,
  otherDuration: number,
): boolean {
  const startA = parseTimeToMinutes(slotTime)
  const endA = startA + slotDuration
  const startB = parseTimeToMinutes(otherTime)
  const endB = startB + otherDuration
  return startA < endB && startB < endA
}

export function findRoomConflict(
  occupancy: RoomOccupancy[],
  gabineteId: string,
  time: string,
  durationMinutes: number,
  excludeId?: string | null,
): RoomOccupancy | null {
  return (
    occupancy.find(
      (entry) =>
        entry.gabineteId === gabineteId &&
        entry.id !== excludeId &&
        occupancyOverlaps(time, durationMinutes, entry.time, entry.durationMinutes),
    ) ?? null
  )
}

export const RECURRENCE_CADENCE_OPTIONS = [
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quinzenal' },
  { value: 'monthly', label: 'Mensal' },
] as const

export type RecurrenceCadence = (typeof RECURRENCE_CADENCE_OPTIONS)[number]['value']

export const APPOINTMENT_SERIES_SCOPE_OPTIONS = [
  { value: 'single', label: 'Apenas esta consulta' },
  { value: 'following', label: 'Esta e as seguintes' },
  { value: 'series', label: 'Toda a série' },
] as const

export type AppointmentSeriesScope = (typeof APPOINTMENT_SERIES_SCOPE_OPTIONS)[number]['value']

export function addMonthsToIsoDate(date: string, months: number): string {
  const [year, month, day] = date.split('-').map(Number)
  const next = new Date(year, month - 1 + months, day)
  return toIsoDate(next.getFullYear(), next.getMonth() + 1, next.getDate())
}

export const WEEKDAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] as const

export const MONTH_LABELS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
] as const

export type CalendarCell = {
  date: string | null
  day: number | null
  inMonth: boolean
}

export function shiftMonth(year: number, month: number, delta: number) {
  const next = new Date(year, month - 1 + delta, 1)
  return { year: next.getFullYear(), month: next.getMonth() + 1 }
}

export function getCalendarCells(year: number, month: number): CalendarCell[] {
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const startOffset = (firstWeekday + 6) % 7
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells: CalendarCell[] = []

  for (let index = 0; index < startOffset; index += 1) {
    cells.push({ date: null, day: null, inMonth: false })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ date: toIsoDate(year, month, day), day, inMonth: true })
  }

  while (cells.length % 7 !== 0) {
    cells.push({ date: null, day: null, inMonth: false })
  }

  return cells
}

export function formatMonthTitle(year: number, month: number) {
  return `${MONTH_LABELS[month - 1]} ${year}`
}

export function formatAppointmentRange(time: string, durationMinutes: number) {
  const [hours, minutes] = time.split(':').map(Number)
  const start = new Date(Date.UTC(2000, 0, 1, hours, minutes))
  const end = new Date(start.getTime() + durationMinutes * 60_000)
  const endTime = `${String(end.getUTCHours()).padStart(2, '0')}:${String(end.getUTCMinutes()).padStart(2, '0')}`
  return `${time} – ${endTime}`
}

export function formatDayLabel(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  const weekday = new Date(year, month - 1, day).toLocaleDateString('pt-PT', { weekday: 'long' })
  const formatted = new Date(year, month - 1, day).toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return `${weekday}, ${formatted}`
}

export function groupAppointmentsByDate(appointments: AppointmentSummary[]) {
  const map = new Map<string, AppointmentSummary[]>()
  for (const appointment of appointments) {
    const list = map.get(appointment.date) ?? []
    list.push(appointment)
    map.set(appointment.date, list)
  }
  for (const list of map.values()) {
    list.sort((a, b) => a.time.localeCompare(b.time))
  }
  return map
}

export function isToday(date: string) {
  const today = new Date()
  return date === toIsoDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
}
