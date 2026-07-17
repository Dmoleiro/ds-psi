export function getTodayInLisbon(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Lisbon' }).format(new Date())
}

export function formatWorkshopDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function isWorkshopUpcoming(eventDate: Date): boolean {
  return formatWorkshopDate(eventDate) >= getTodayInLisbon()
}

export function formatWorkshopDatePt(date: Date): string {
  const [year, month, day] = formatWorkshopDate(date).split('-').map(Number)
  const local = new Date(year, month - 1, day)
  return local.toLocaleDateString('pt-PT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
