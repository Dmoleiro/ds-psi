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

  it('includes Conners cotação table for therapist view', () => {
    const answers: Record<string, unknown> = {
      conners_sexo: 0,
      conners_idade: 8,
      q4: 3,
      q9: 3,
      q14: 3,
      q18: 3,
      q22: 3,
      q26: 3,
    }
    const fields = formatQuestionnaireAnswers('conners_pais', answers)
    const cotation = fields.find((f) => f.key === 'conners_cotation_table')

    expect(cotation?.value).toContain('6-10')
    expect(cotation?.table?.columns).toEqual([
      'Subescala',
      'Soma bruta',
      'Score padrão',
      'Percentil',
      'Resultado qualitativo',
    ])
    const hyperRow = cotation?.table?.rows.find((row) =>
      row.cells[0]?.includes('Excesso de actividade motora'),
    )
    expect(hyperRow?.cells[1]).toBe('18')
    expect(hyperRow?.cells[2]).not.toBe('—')
    expect(hyperRow?.cells[4]).not.toBe('—')
    expect(fields.find((f) => f.key === '_score_hyperactivity_raw')).toBeUndefined()
  })
})
