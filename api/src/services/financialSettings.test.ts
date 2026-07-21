import { describe, expect, it, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => ({
  findFirstPatient: vi.fn(),
  findUniqueSettings: vi.fn(),
  createSettings: vi.fn(),
}))

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    patient: {
      findFirst: mocks.findFirstPatient,
    },
    therapistFinancialSettings: {
      findUnique: mocks.findUniqueSettings,
      create: mocks.createSettings,
    },
  },
}))

import { resolveSessionFee } from './financialSettings.js'

describe('resolveSessionFee', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uses explicit consulta fee when provided', async () => {
    const fee = await resolveSessionFee('therapist-1', { sessionFee: 80 })
    expect(fee).toBe(80)
    expect(mocks.findFirstPatient).not.toHaveBeenCalled()
  })

  it('uses patient fee when set', async () => {
    mocks.findFirstPatient.mockResolvedValue({ sessionFee: { toString: () => '40' } })

    const fee = await resolveSessionFee('therapist-1', { patientId: 'patient-1' })
    expect(fee).toBe(40)
  })

  it('falls back to therapist default when patient has no fee', async () => {
    mocks.findFirstPatient.mockResolvedValue({ sessionFee: null })
    mocks.findUniqueSettings.mockResolvedValue({
      socialSecurityRate: { toString: () => '0.15' },
      irsRate: { toString: () => '0.2' },
      savingsRate: { toString: () => '0.1' },
      defaultSessionFee: { toString: () => '50' },
    })

    const fee = await resolveSessionFee('therapist-1', { patientId: 'patient-1' })
    expect(fee).toBe(50)
  })
})
