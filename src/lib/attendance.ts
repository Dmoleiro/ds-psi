import type { AttendanceStatus } from './api'

export const STATUS_CYCLE: Array<AttendanceStatus | null> = [
  null,
  'present_unpaid',
  'present_paid',
  'receipt_issued',
  'absent',
]

export const STATUS_LABELS: Record<AttendanceStatus, string> = {
  present_unpaid: 'Presente por pagar',
  present_paid: 'Presente pago',
  receipt_issued: 'Recibo passado',
  absent: 'Falta',
}

export const RECEIPT_TOGGLE_STATUSES: AttendanceStatus[] = ['present_paid', 'receipt_issued']

export const SCHEDULED_APPOINTMENT_LABEL = 'Consulta agendada'

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
