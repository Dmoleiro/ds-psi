import type { AttendanceStatus } from './api'

export const STATUS_CYCLE: Array<AttendanceStatus | null> = [
  null,
  'present_unpaid',
  'present_paid',
  'absent',
]

export const STATUS_LABELS: Record<AttendanceStatus, string> = {
  present_unpaid: 'Presente por pagar',
  present_paid: 'Presente pago',
  absent: 'Falta',
}

export function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function getMonthDays(year: number, month: number) {
  const daysInMonth = new Date(year, month, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1
    const date = toIsoDate(year, month, day)
    const weekday = new Date(year, month - 1, day).toLocaleDateString('pt-PT', { weekday: 'narrow' })
    return { day, date, weekday }
  })
}
