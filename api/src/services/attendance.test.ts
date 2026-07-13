import { describe, expect, it } from 'vitest'
import { formatDateOnly, parseDateOnly, parseYearMonth } from './attendance.js'

describe('attendance dates', () => {
  it('parses and formats ISO dates', () => {
    const date = parseDateOnly('2026-07-13')
    expect(date).not.toBeNull()
    expect(formatDateOnly(date!)).toBe('2026-07-13')
  })

  it('rejects invalid dates', () => {
    expect(parseDateOnly('2026-13-01')).toBeNull()
    expect(parseDateOnly('bad')).toBeNull()
  })

  it('builds month ranges', () => {
    const range = parseYearMonth(2026, 7)
    expect(range).not.toBeNull()
    expect(formatDateOnly(range!.from)).toBe('2026-07-01')
    expect(formatDateOnly(range!.to)).toBe('2026-07-31')
  })
})
