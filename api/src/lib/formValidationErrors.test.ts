import { describe, expect, it } from 'vitest'
import { ZodError } from 'zod'
import { queixaInicialFormSchema } from './schemas.js'
import { formatZodFormValidationError } from './formValidationErrors.js'

describe('formatZodFormValidationError', () => {
  it('returns a single field message with label', () => {
    const parsed = queixaInicialFormSchema.safeParse({
      concernOrigin: 'abc',
      requestObjective: 'Avaliação neuropsicológica',
    })
    expect(parsed.success).toBe(false)
    if (parsed.success) return

    const message = formatZodFormValidationError('queixa-inicial', parsed.error)
    expect(message).toContain('Como surgiu a preocupação')
    expect(message).toContain('5 caracteres')
  })

  it('lists multiple field errors', () => {
    const error = new ZodError([
      {
        code: 'too_small',
        minimum: 5,
        type: 'string',
        inclusive: true,
        exact: false,
        message: 'Preencha com pelo menos 5 caracteres',
        path: ['concernOrigin'],
      },
      {
        code: 'too_small',
        minimum: 5,
        type: 'string',
        inclusive: true,
        exact: false,
        message: 'Preencha com pelo menos 5 caracteres',
        path: ['requestObjective'],
      },
    ])

    const message = formatZodFormValidationError('queixa-inicial', error)
    expect(message).toContain('Verifique os seguintes campos')
    expect(message).toContain('Como surgiu a preocupação')
    expect(message).toContain('Objetivo do pedido')
  })
})
