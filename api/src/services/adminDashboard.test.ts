import { describe, expect, it } from 'vitest'
import { getClinicTodayIso } from './dashboard.js'

describe('admin dashboard', () => {
  it('uses clinic today iso for date boundaries', () => {
    const iso = getClinicTodayIso(new Date('2026-07-30T10:00:00Z'))
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
