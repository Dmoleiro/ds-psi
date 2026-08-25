import { describe, expect, it } from 'vitest'
import {
  derivePreEscolarResults,
  emptyPreEscolarResults,
  getPreEscolarQualitativeLevel,
  sanitizePreEscolarResults,
} from './preEscolarResults.js'

function setSubtest(
  results: ReturnType<typeof emptyPreEscolarResults>,
  key: string,
  correct: string,
  errors = '',
) {
  results.subtests[key] = {
    ...results.subtests[key],
    correct,
    errors,
    points: '',
    percentile: '',
    stanine: '',
  }
}

describe('preEscolarResults', () => {
  it('computes P = C for verbal', () => {
    const results = emptyPreEscolarResults()
    setSubtest(results, 'verbal', '14')
    const derived = derivePreEscolarResults(results)
    expect(derived.subtests.verbal.derivedPoints).toBe('14')
  })

  it('computes P = C - E with zero when errors >= correct', () => {
    const results = emptyPreEscolarResults()
    setSubtest(results, 'memoria_auditiva', '5', '2')
    const derived = derivePreEscolarResults(results)
    expect(derived.subtests.memoria_auditiva.derivedPoints).toBe('3')

    setSubtest(results, 'memoria_auditiva', '2', '3')
    const zero = derivePreEscolarResults(results)
    expect(zero.subtests.memoria_auditiva.derivedPoints).toBe('0')
  })

  it('sums subtests and looks up total percentile (pré-escolar)', () => {
    const results = emptyPreEscolarResults()
    setSubtest(results, 'verbal', '13')
    setSubtest(results, 'conceitos_quantitativos', '10')
    setSubtest(results, 'memoria_auditiva', '4', '0')
    setSubtest(results, 'constancia_de_forma', '9', '0')
    setSubtest(results, 'posicoes_espaco', '9', '0')
    setSubtest(results, 'orientacao_espacial', '6')
    setSubtest(results, 'coordenacao_visiomotora', '6', '0')
    setSubtest(results, 'figura_fundo', '4', '0')
    const derived = derivePreEscolarResults(results)
    expect(derived.derivedTotalPoints).toBe('61')
    expect(derived.derivedTotalPercentile).toBe('50')
    expect(derived.derivedTotalStanine).toBe('5')
  })

  it('uses primeiro ano norms when selected', () => {
    const results = emptyPreEscolarResults()
    results.normLevel = 'primeiro_ano'
    setSubtest(results, 'verbal', '14')
    const derived = derivePreEscolarResults(results)
    expect(derived.subtests.verbal.derivedPercentile).toBe('50')
  })

  it('sanitizes unknown input', () => {
    const sanitized = sanitizePreEscolarResults({
      subtests: {
        verbal: { correct: '12', errors: 'oops-too-long-field-name' },
      },
    })
    expect(sanitized.subtests.verbal.correct).toBe('12')
    expect(sanitized.subtests.verbal.derivedPoints).toBe('12')
  })

  it('maps qualitative level from percentile', () => {
    expect(getPreEscolarQualitativeLevel('90')).toBe('Acima da média')
    expect(getPreEscolarQualitativeLevel('50')).toBe('Na média')
    expect(getPreEscolarQualitativeLevel('10')).toBe('Abaixo da média')
  })
})
