import { describe, expect, it } from 'vitest'
import { queixaInicialFormSchema } from './schemas.js'

const validPayload = {
  concernOrigin: 'Preocupação com dificuldades escolares',
  requestObjective: 'Avaliação neuropsicológica',
}

describe('queixaInicialFormSchema', () => {
  it('accepts a minimal valid payload', () => {
    expect(queixaInicialFormSchema.safeParse(validPayload).success).toBe(true)
  })

  it('accepts null optional fields from saved drafts', () => {
    const parsed = queixaInicialFormSchema.safeParse({
      ...validPayload,
      mainSymptoms: null,
      concernStartAge: null,
      interventionsAtHome: null,
      interventionsAtSchool: null,
      familyDynamicsEffect: null,
      referredBy: null,
    })

    expect(parsed.success).toBe(true)
  })

  it('rejects required fields shorter than 5 characters after trimming', () => {
    const parsed = queixaInicialFormSchema.safeParse({
      ...validPayload,
      concernOrigin: '  ab  ',
    })

    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(parsed.error.flatten().fieldErrors.concernOrigin?.[0]).toContain('5 caracteres')
    }
  })
})
