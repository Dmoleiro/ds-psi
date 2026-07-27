import { toIsoDate } from './attendance'

export function getWeekStartMonday(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const weekday = date.getDay()
  const daysSinceMonday = (weekday + 6) % 7
  date.setDate(date.getDate() - daysSinceMonday)
  return toIsoDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

export function getWeekDates(weekStartMonday: string): string[] {
  const [year, month, day] = weekStartMonday.split('-').map(Number)
  const start = new Date(year, month - 1, day)
  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(start)
    next.setDate(start.getDate() + index)
    return toIsoDate(next.getFullYear(), next.getMonth() + 1, next.getDate())
  })
}

export function formatDayLabelShort(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatWeekLabel(weekStartMonday: string): string {
  const dates = getWeekDates(weekStartMonday)
  const [startYear, startMonth, startDay] = dates[0].split('-').map(Number)
  const [endYear, endMonth, endDay] = dates[6].split('-').map(Number)
  const start = new Date(startYear, startMonth - 1, startDay)
  const end = new Date(endYear, endMonth - 1, endDay)
  const startLabel = start.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })
  const endLabel = end.toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return `${startLabel} – ${endLabel}`
}
