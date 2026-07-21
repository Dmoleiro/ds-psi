import { describe, expect, it } from 'vitest'
import { computeSessionFinancials } from './financialOverview.js'

const defaultRates = {
  socialSecurityRate: 0.15,
  irsRate: 0.2,
  savingsRate: 0.1,
  defaultSessionFee: 50,
}

describe('computeSessionFinancials', () => {
  it('matches Excel for €50 session', () => {
    const result = computeSessionFinancials(50, defaultRates)
    expect(result.socialSecurity).toBe(7.5)
    expect(result.irs).toBe(10)
    expect(result.savings).toBe(5)
    expect(result.totalReserves).toBe(22.5)
    expect(result.available).toBe(27.5)
  })

  it('matches Excel for €40 session', () => {
    const result = computeSessionFinancials(40, defaultRates)
    expect(result.totalReserves).toBe(18)
    expect(result.available).toBe(22)
  })

  it('matches Excel for €80 session', () => {
    const result = computeSessionFinancials(80, defaultRates)
    expect(result.totalReserves).toBe(36)
    expect(result.available).toBe(44)
  })

  it('returns zeros for empty gross', () => {
    const result = computeSessionFinancials(0, defaultRates)
    expect(result.available).toBe(0)
  })
})
