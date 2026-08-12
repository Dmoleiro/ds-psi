import { describe, expect, it } from 'vitest'
import { formatQuestionnaireAnswers } from './presentation.js'

describe('formatQuestionnaireAnswers', () => {
  it('maps likert5 stored values to matching labels (ADEXI)', () => {
    const fields = formatQuestionnaireAnswers('adexi_other', {
      q1: 3,
      q2: 1,
      q3: 5,
    })

    expect(fields.find((field) => field.key === 'q1')?.value).toBe('3')
    expect(fields.find((field) => field.key === 'q2')?.value).toBe('1')
    expect(fields.find((field) => field.key === 'q3')?.value).toBe('5')
  })

  it('maps likert7 stored values to matching labels (OBQ-44)', () => {
    const fields = formatQuestionnaireAnswers('obq_44', { q1: 4 })

    expect(fields.find((field) => field.key === 'q1')?.value).toBe('4')
  })

  it('maps rating4 stored values to matching labels (CARS)', () => {
    const fields = formatQuestionnaireAnswers('cars', { q1: 2 })

    expect(fields.find((field) => field.key === 'q1')?.value).toBe('2 — Ligeiramente anormal')
  })

  it('maps zero-based scales correctly (SDQ)', () => {
    const fields = formatQuestionnaireAnswers('sdq_4_17', { q1: 2 })

    expect(fields.find((field) => field.key === 'q1')?.value).toBe('É muito verdade')
  })

  it('maps yes/no correctly', () => {
    const fields = formatQuestionnaireAnswers('m_chat', { q1: 0, q2: 1 })

    expect(fields.find((field) => field.key === 'q1')?.value).toBe('Não')
    expect(fields.find((field) => field.key === 'q2')?.value).toBe('Sim')
  })

  it('includes optional notes at the end', () => {
    const fields = formatQuestionnaireAnswers('adexi_other', {
      q1: 3,
      _notas: '  Preenchido em consulta.  ',
    })

    expect(fields.at(-1)).toEqual({
      key: '_notas',
      label: 'Notas',
      value: 'Preenchido em consulta.',
    })
  })
})
