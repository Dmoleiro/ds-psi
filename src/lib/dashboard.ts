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
