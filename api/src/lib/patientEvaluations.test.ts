import { describe, expect, it } from 'vitest'
import {
  sanitizeAdditionalMethodSelections,
  sanitizeBancSelections,
  sanitizeQuestionnaireSelections,
  sanitizeWiscSelections,
} from '../lib/patientEvaluations.js'

describe('patientEvaluations', () => {
  it('keeps only valid WISC keys in canonical order', () => {
    expect(sanitizeWiscSelections(['codigo', 'invalid', 'informacao'])).toEqual([
      'informacao',
      'codigo',
    ])
  })

  it('keeps only valid BANC keys in canonical order', () => {
    expect(sanitizeBancSelections(['torre', 'invalid', 'lateralidade'])).toEqual([
      'lateralidade',
      'torre',
    ])
  })

  it('keeps only valid additional method keys in canonical order', () => {
    expect(
      sanitizeAdditionalMethodSelections(['stroop', 'invalid', 'd2']),
    ).toEqual(['d2', 'stroop'])
  })

  it('keeps only valid questionnaire keys in canonical order', () => {
    expect(sanitizeQuestionnaireSelections(['cdi', 'invalid', 'sdq_por'])).toEqual([
      'sdq_por',
      'cdi',
    ])
  })
})
