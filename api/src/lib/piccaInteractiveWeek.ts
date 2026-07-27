function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function parseIsoDateParts(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return { year, month, day }
}

export function getWeekStartMonday(isoDate: string): string {
  const { year, month, day } = parseIsoDateParts(isoDate)
  const date = new Date(year, month - 1, day)
  const weekday = date.getDay()
  const daysSinceMonday = (weekday + 6) % 7
  date.setDate(date.getDate() - daysSinceMonday)
  return toIsoDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

export function getWeekDates(weekStartMonday: string): string[] {
  const { year, month, day } = parseIsoDateParts(weekStartMonday)
  const start = new Date(year, month - 1, day)
  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(start)
    next.setDate(start.getDate() + index)
    return toIsoDate(next.getFullYear(), next.getMonth() + 1, next.getDate())
  })
}

export function formatWeekdayPt(isoDate: string): string {
  const { year, month, day } = parseIsoDateParts(isoDate)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('pt-PT', { weekday: 'long' })
}

export function isWeekEditable(weekStartMonday: string, todayIso: string): boolean {
  return getWeekStartMonday(todayIso) === weekStartMonday
}

export function isDayEditable(dayIso: string, todayIso: string): boolean {
  return dayIso === todayIso
}
