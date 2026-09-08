import { describe, expect, it } from 'vitest'
import {
  getWeekdayOccurrenceInMonth,
  nextMonthlyRecurrenceDate,
  nthWeekdayOfMonth,
} from './recurrence.js'

describe('recurrence', () => {
  const date = (iso: string) => {
    const [year, month, day] = iso.split('-').map(Number)
    return new Date(Date.UTC(year, month - 1, day))
  }

  it('identifies the first Monday of the month', () => {
    expect(getWeekdayOccurrenceInMonth(date('2026-01-05'))).toEqual({ weekday: 1, occurrence: 1 })
  })

  it('identifies the third Thursday of the month', () => {
    expect(getWeekdayOccurrenceInMonth(date('2026-01-15'))).toEqual({ weekday: 4, occurrence: 3 })
  })

  it('finds the nth weekday in a target month', () => {
    expect(nthWeekdayOfMonth(2026, 1, 1, 1)?.toISOString().slice(0, 10)).toBe('2026-02-02')
  })

  it('advances to the same weekday occurrence next month', () => {
    expect(nextMonthlyRecurrenceDate(date('2026-01-05'))?.toISOString().slice(0, 10)).toBe('2026-02-02')
    expect(nextMonthlyRecurrenceDate(date('2026-02-02'))?.toISOString().slice(0, 10)).toBe('2026-03-02')
  })
})
