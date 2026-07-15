import { describe, expect, it } from 'vitest'
import { formatFormAnswers } from './formPresentation.js'

describe('formatFormAnswers', () => {
  it('formats intake answers with Portuguese labels', () => {
    const fields = formatFormAnswers('intake', {
      fullName: 'Maria Silva',
      previousTherapy: 'yes',
      email: '',
    })

    expect(fields[0]).toEqual({
      key: 'fullName',
      label: 'Nome completo',
      value: 'Maria Silva',
    })
    expect(fields.find((field) => field.key === 'previousTherapy')?.value).toBe('Sim')
    expect(fields.find((field) => field.key === 'email')).toBeUndefined()
  })

  it('formats consent booleans as Sim', () => {
    const fields = formatFormAnswers('consent', {
      readAndUnderstood: true,
      consentToTreatment: true,
      consentToDataProcessing: true,
      signatureName: 'Maria Silva',
      signedAt: '2026-07-14',
    })

    expect(fields.find((field) => field.key === 'readAndUnderstood')?.value).toBe('Sim')
    expect(fields.find((field) => field.key === 'signatureName')?.value).toBe('Maria Silva')
  })
})
