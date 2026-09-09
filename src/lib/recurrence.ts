function getWeekdayOccurrenceInMonth(date: Date): { weekday: number; occurrence: number } {
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

function nthWeekdayOfMonth(
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

function parseDateOnly(date: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const parsed = new Date(Date.UTC(year, month - 1, day))
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null
  }
  return parsed
}

function formatDateOnly(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

export function generateRecurrenceDates(
  startDate: string,
  endDate: string,
  cadence: 'weekly' | 'biweekly' | 'monthly',
  maxCount = 104,
): string[] {
  const start = parseDateOnly(startDate)
  const end = parseDateOnly(endDate)
  if (!start || !end || end < start) {
    return []
  }

  const dates: string[] = []
  let current = start

  while (current <= end) {
    dates.push(formatDateOnly(current))
    if (dates.length >= maxCount) {
      break
    }

    if (cadence === 'weekly') {
      current = addDays(current, 7)
    } else if (cadence === 'biweekly') {
      current = addDays(current, 14)
    } else {
      const next = nextMonthlyRecurrenceDate(current)
      if (!next) break
      current = next
    }
  }

  return dates
}
