import { describe, expect, it } from 'vitest'
import {
  computeConnersScores,
  computeConnersSummary,
  qualitativeFromStandardScore,
} from './connersScoring.js'

describe('qualitativeFromStandardScore', () => {
  it('maps T-scores to Portuguese qualitative bands', () => {
    expect(qualitativeFromStandardScore(50)).toBe('Típico')
    expect(qualitativeFromStandardScore(58)).toBe('Ligeiramente atípico')
    expect(qualitativeFromStandardScore(63)).toBe('Possivelmente atípico')
    expect(qualitativeFromStandardScore(68)).toBe('Moderadamente atípico')
    expect(qualitativeFromStandardScore(75)).toBe('Marcadamente atípico')
  })
})

describe('computeConnersSummary', () => {
  it('sums all items for total raw on pais form', () => {
    const answers: Record<string, unknown> = {
      conners_sexo: 0,
      conners_idade: 8,
      q1: 1,
      q2: 2,
      q3: 0,
    }
    const summary = computeConnersSummary('pais', answers, 27)
    expect(summary.total.raw).toBe(3)
  })

  it('scores pais opposition using professores norm table', () => {
    const answers: Record<string, unknown> = {
      conners_sexo: 0,
      conners_idade: 8,
      q2: 3,
      q6: 3,
      q10: 3,
      q15: 3,
      q20: 3,
    }
    const summary = computeConnersSummary('pais', answers, 27)
    expect(summary.subscales.opposition.raw).toBe(15)
    expect(summary.subscales.opposition.standardScore).not.toBeNull()
    expect(summary.subscales.opposition.qualitative).toBe('Marcadamente atípico')
  })

  it('looks up standard scores when sex and age are in norm band', () => {
    const answers: Record<string, unknown> = {
      conners_sexo: 0,
      conners_idade: 8,
    }
    for (const n of [3, 8, 12, 17, 21, 25]) {
      answers[`q${n}`] = 3
    }
    const summary = computeConnersSummary('pais', answers, 27)
    expect(summary.subscales.cognitive.raw).toBe(18)
    expect(summary.subscales.cognitive.standardScore).not.toBeNull()
    expect(summary.subscales.cognitive.qualitative).not.toBeNull()
  })

  it('scores professores hyperactivity from fixed norm table', () => {
    const answers: Record<string, unknown> = {
      conners_sexo: 0,
      conners_idade: 8,
      q3: 3,
      q7: 3,
      q11: 3,
      q17: 3,
      q21: 3,
      q24: 3,
    }
    const summary = computeConnersSummary('professores', answers, 25)
    expect(summary.subscales.hyperactivity.raw).toBe(18)
    expect(summary.subscales.hyperactivity.standardScore).not.toBeNull()
    expect(summary.subscales.hyperactivity.percentile).not.toBeNull()
  })

  it('includes opposition subscale for professores', () => {
    const answers: Record<string, unknown> = {
      conners_sexo: 1,
      conners_idade: 7,
    }
    for (const n of [2, 6, 10, 15, 20]) {
      answers[`q${n}`] = 2
    }
    const summary = computeConnersSummary('professores', answers, 25)
    expect(summary.subscales.opposition.raw).toBe(10)
    expect(summary.subscales.opposition.standardScore).not.toBeNull()
  })
})

describe('computeConnersScores', () => {
  it('uses closest lower T row for percentile when PT cell is missing', () => {
    const answers: Record<string, unknown> = {
      conners_sexo: 0,
      conners_idade: 8,
      q3: 2,
      q8: 2,
      q12: 2,
      q17: 2,
      q21: 2,
      q25: 2,
    }
    const summary = computeConnersSummary('pais', answers, 27)
    const cognitive = summary.subscales.cognitive
    expect(cognitive.standardScore).toBe(71)
    expect(cognitive.percentile).toBe('95-96')
  })

  it('returns flat score keys for API storage', () => {
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
    const scores = computeConnersScores('pais', answers, 27)
    expect(scores.hyperactivity_raw).toBe(18)
    expect(scores.total_raw).toBe(18)
    expect(typeof scores.hyperactivity_standard).toBe('number')
  })
})
