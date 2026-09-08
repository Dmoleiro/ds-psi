const ICS_WEEKDAY_CODES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'] as const

export function getWeekdayOccurrenceInMonth(date: Date): { weekday: number; occurrence: number } {
  const weekday = date.getUTCDay()
  const dayOfMonth = date.getUTCDate()

  let occurrence = 0
  for (let day = 1; day <= dayOfMonth; day += 1) {
    const candidate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), day))
    if (candidate.getUTCDay() === weekday) {
      occurrence += 1
    }
  }

  return { weekday, occurrence }
}

export function nthWeekdayOfMonth(
  year: number,
  monthIndex: number,
  weekday: number,
  occurrence: number,
): Date | null {
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()

  let count = 0
  for (let day = 1; day <= daysInMonth; day += 1) {
    const candidate = new Date(Date.UTC(year, monthIndex, day))
    if (candidate.getUTCDay() !== weekday) continue
    count += 1
    if (count === occurrence) {
      return candidate
    }
  }

  return null
}

export function nextMonthlyRecurrenceDate(current: Date): Date | null {
  const { weekday, occurrence } = getWeekdayOccurrenceInMonth(current)
  let year = current.getUTCFullYear()
  let monthIndex = current.getUTCMonth()

  for (let attempt = 0; attempt < 24; attempt += 1) {
    monthIndex += 1
    if (monthIndex > 11) {
      monthIndex = 0
      year += 1
    }

    const candidate = nthWeekdayOfMonth(year, monthIndex, weekday, occurrence)
    if (candidate) {
      return candidate
    }
  }

  return null
}

export function formatMonthlyIcsByDay(date: Date): string {
  const { weekday, occurrence } = getWeekdayOccurrenceInMonth(date)
  return `${occurrence}${ICS_WEEKDAY_CODES[weekday]}`
}
