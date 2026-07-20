import { describe, expect, it } from 'vitest'
import { getClinicTodayIso, getGreetingLabel } from './dashboard.js'

describe('dashboard helpers', () => {
  it('formats clinic today as ISO date', () => {
    const iso = getClinicTodayIso(new Date('2026-07-20T10:00:00Z'))
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('returns time-appropriate greeting', () => {
    expect(getGreetingLabel(new Date('2026-07-20T08:00:00Z'))).toBe('Bom dia')
    expect(getGreetingLabel(new Date('2026-07-20T14:00:00Z'))).toBe('Boa tarde')
    expect(getGreetingLabel(new Date('2026-07-20T21:00:00Z'))).toBe('Boa noite')
  })
})
