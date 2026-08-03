import { describe, expect, it } from 'vitest'
import { sanitizeBancSelections, sanitizeWiscSelections } from '../lib/patientEvaluations.js'

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
})
