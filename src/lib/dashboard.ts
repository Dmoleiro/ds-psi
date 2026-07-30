export function formatAppointmentDayLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`)
  if (Number.isNaN(date.getTime())) return isoDate

  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Lisbon' }).format(new Date())
  const tomorrow = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Lisbon',
  }).format(new Date(Date.now() + 86_400_000))

  if (isoDate === today) return 'Hoje'
  if (isoDate === tomorrow) return 'Amanhã'

  return new Intl.DateTimeFormat('pt-PT', {
    timeZone: 'Europe/Lisbon',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date)
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function isIsoDateString(value: string): boolean {
  return ISO_DATE_RE.test(value)
}

export function appointmentsDayHref(date: string): string {
  return `/backoffice/appointments?date=${encodeURIComponent(date)}`
}
