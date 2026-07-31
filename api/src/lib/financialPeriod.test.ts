import { describe, expect, it } from 'vitest'
import { formatFinancialPeriodRange, parseFinancialPeriod } from '../lib/financialPeriod.js'

describe('parseFinancialPeriod', () => {
  it('uses calendar month boundaries', () => {
    const range = parseFinancialPeriod(2026, 7, 'calendar')
    expect(range?.from.toISOString()).toBe('2026-07-01T00:00:00.000Z')
    expect(range?.to.toISOString()).toBe('2026-07-31T00:00:00.000Z')
    expect(range?.appointmentsEndExclusive.toISOString()).toBe('2026-08-01T00:00:00.000Z')
  })

  it('uses fiscal month from 21st previous month to 20th current month', () => {
    const range = parseFinancialPeriod(2026, 7, 'fiscal')
    expect(range?.from.toISOString()).toBe('2026-06-21T00:00:00.000Z')
    expect(range?.to.toISOString()).toBe('2026-07-20T00:00:00.000Z')
    expect(range?.appointmentsEndExclusive.toISOString()).toBe('2026-07-21T00:00:00.000Z')
  })

  it('handles january fiscal month across years', () => {
    const range = parseFinancialPeriod(2026, 1, 'fiscal')
    expect(range?.from.toISOString()).toBe('2025-12-21T00:00:00.000Z')
    expect(range?.to.toISOString()).toBe('2026-01-20T00:00:00.000Z')
  })
})

describe('formatFinancialPeriodRange', () => {
  it('describes fiscal month range', () => {
    expect(formatFinancialPeriodRange(2026, 7, 'fiscal')).toContain('21')
    expect(formatFinancialPeriodRange(2026, 7, 'fiscal')).toContain('20')
  })
})
