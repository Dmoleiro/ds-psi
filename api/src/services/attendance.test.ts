import { describe, expect, it } from 'vitest'
import { formatDateOnly, parseDateOnly, parseYearMonth, resolveAttendanceSessionFee } from './attendance.js'

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

describe('resolveAttendanceSessionFee', () => {
  const appointmentFees = new Map<string, number>([['patient-1:2026-07-10', 55]])

  it('uses appointment fee when available', () => {
    expect(
      resolveAttendanceSessionFee('patient-1', '2026-07-10', appointmentFees, 40, 50),
    ).toBe(55)
  })

  it('falls back to patient fee', () => {
    expect(
      resolveAttendanceSessionFee('patient-1', '2026-07-11', appointmentFees, 40, 50),
    ).toBe(40)
  })

  it('falls back to therapist default fee', () => {
    expect(
      resolveAttendanceSessionFee('patient-1', '2026-07-11', appointmentFees, null, 50),
    ).toBe(50)
  })
})
