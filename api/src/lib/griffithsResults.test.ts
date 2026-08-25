import { describe, expect, it } from 'vitest'
import {
  computeGriffithsQgRaw,
  computeGriffithsQgQuotient,
  computeGriffithsSubscaleTotal,
  computeGriffithsSubscaleTotalBySlot,
  deriveGriffithsResults,
  emptyGriffithsResults,
  getGriffithsDevelopmentLevel,
  sanitizeGriffithsResults,
} from './griffithsResults.js'
import {
  lookupGriffithsGeneralMentalAgeMonths,
  lookupGriffithsSubscaleMentalAgeMonths,
} from './griffithsNorms.js'

function filledSubscale() {
  return {
    sectionI: ['4', '3'],
    sectionII: ['2', '3'],
    sectionIII: ['1', '2'],
    sectionIV: ['1', '1'],
    developmentalAgeMonths: ['', ''],
    mentalAgeGlobal: ['', ''],
  }
}

describe('griffithsResults', () => {
  it('derives column totals for each subscale', () => {
    const subscale = filledSubscale()

    expect(computeGriffithsSubscaleTotalBySlot(subscale)).toEqual(['8.00', '9.00'])
    expect(computeGriffithsSubscaleTotal(subscale)).toBe('17.00')
  })

  it('migrates legacy triple-value fields into two slots', () => {
    const sanitized = sanitizeGriffithsResults({
      globalMentalAgeMonths: '42',
      subscales: {
        a: {
          sectionI: ['10', '11', '12'],
          percentile: '55',
        },
      },
    })

    expect(sanitized.subscales.a?.sectionI).toEqual(['10', '12'])
    expect(sanitized.subscales.a?.mentalAgeGlobal).toEqual(['', ''])
    expect(sanitized.subscales.a?.developmentalAgeMonths).toEqual(['', ''])
  })

  it('computes 2-8 partial quotient (QDA) from developmental age and IC', () => {
    const results = emptyGriffithsResults()
    results.ageYears = '5'
    results.ageMonths = '9'
    results.subscales.a = {
      sectionI: ['', '12'],
      sectionII: ['', '12'],
      sectionIII: ['', '24'],
      sectionIV: ['', '0'],
      developmentalAgeMonths: ['', ''],
      mentalAgeGlobal: ['', ''],
    }

    const derived = deriveGriffithsResults(results)
    const developmental = Number.parseFloat(derived.subscales.a?.developmentalAgeMonths[1] ?? '')
    const qda = Number.parseFloat(derived.subscales.a?.mentalAgeGlobal[1] ?? '')

    expect(developmental).toBeCloseTo(41.85, 1)
    expect(qda).toBeCloseTo((developmental / 69) * 100, 1)
  })

  it('matches therapist smoke case at 69 months (Salvador)', () => {
    const results = emptyGriffithsResults()
    results.ageYears = '5'
    results.ageMonths = '9'
    const rows: Record<string, [string, string, string, string]> = {
      a: ['12', '12', '24', '0'],
      b: ['12', '12', '30', '10'],
      c: ['12', '16.5', '20', '0'],
      d: ['12', '12', '26', '22'],
      e: ['12', '12', '28', '8'],
      f: ['12', '12', '18', '0'],
    }
    for (const [key, [i, ii, iii, iv]] of Object.entries(rows)) {
      results.subscales[key] = {
        sectionI: ['', i],
        sectionII: ['', ii],
        sectionIII: ['', iii],
        sectionIV: ['', iv],
        developmentalAgeMonths: ['', ''],
        mentalAgeGlobal: ['', ''],
      }
    }

    const derived = deriveGriffithsResults(results)

    for (const key of Object.keys(rows)) {
      const developmental = Number.parseFloat(derived.subscales[key]?.developmentalAgeMonths[1] ?? '')
      const qda = Number.parseFloat(derived.subscales[key]?.mentalAgeGlobal[1] ?? '')
      expect(developmental).toBeGreaterThan(0)
      expect(qda).toBeCloseTo((developmental / 69) * 100, 1)
    }

    expect(Number.parseFloat(derived.qgRaw)).toBeCloseTo(55.75, 1)
    expect(Number.parseFloat(derived.derivedQgQuotient)).toBeCloseTo(80.8, 1)
  })

  it('recomputes developmental ages when section values change, ignoring persisted derived fields', () => {
    const results = emptyGriffithsResults()
    results.ageYears = '1'
    results.ageMonths = '0'
    for (const key of ['a', 'b', 'c', 'd', 'e'] as const) {
      results.subscales[key] = filledSubscale()
      results.subscales[key].developmentalAgeMonths = ['50', '60']
      results.subscales[key].mentalAgeGlobal = ['70', '80']
    }

    const derived = deriveGriffithsResults(results)
    expect(derived.subscales.a?.developmentalAgeMonths[0]).not.toBe('50')
    expect(derived.subscales.a?.mentalAgeGlobal[0]).not.toBe('70')

    results.subscales.a.sectionI[0] = '20'
    const updated = deriveGriffithsResults(results)
    expect(updated.subscales.a?.developmentalAgeMonths[0]).not.toBe(
      derived.subscales.a?.developmentalAgeMonths[0],
    )
    expect(updated.subscales.a?.mentalAgeGlobal[0]).not.toBe(
      derived.subscales.a?.mentalAgeGlobal[0],
    )
  })

  it('auto-scores developmental ages and global mental age for a 12-month child', () => {
    const results = emptyGriffithsResults()
    results.ageYears = '1'
    results.ageMonths = '0'
    for (const key of ['a', 'b', 'c', 'd', 'e', 'f'] as const) {
      results.subscales[key] = filledSubscale()
    }

    const derived = deriveGriffithsResults(results)

    expect(derived.autoScored).toBe(true)
    expect(derived.subscales.a?.developmentalAgeMonths[0]).not.toBe('')
    expect(derived.subscales.a?.mentalAgeGlobal[0]).toBe('2.00')
    expect(derived.qgRaw).toBe('8.00')
    expect(derived.derivedQgQuotient).not.toBe('')
    expect(getGriffithsDevelopmentLevel('100')).toBe('Médio')
  })

  it('auto-scores global mental age from the general raw sum (Table 20)', () => {
    const results = emptyGriffithsResults()
    for (const key of ['a', 'b', 'c', 'd', 'e'] as const) {
      results.subscales[key] = filledSubscale()
    }

    const derived = deriveGriffithsResults(results)

    expect(derived.autoScored).toBe(true)
    expect(derived.derivedQgQuotient).toBe('')
    expect(derived.subscales.a?.mentalAgeGlobal[0]).toBe('2.00')
    expect(lookupGriffithsGeneralMentalAgeMonths('0-2', 40)).toBe(2)
  })

  it('derives QG from the active age-band column totals', () => {
    const results = emptyGriffithsResults()
    results.ageYears = '1'
    results.ageMonths = '0'
    for (const key of ['a', 'b', 'c', 'd', 'e', 'f'] as const) {
      results.subscales[key] = filledSubscale()
    }

    const derived = deriveGriffithsResults(results)
    const subscales = derived.subscales

    expect(computeGriffithsQgRaw(subscales, 0)).toBe('8.00')
    expect(computeGriffithsQgQuotient('8', '12')).toBe('66.67')
    expect(derived.qgRaw).toBe('8.00')
    expect(derived.derivedQgQuotient).toBe('66.67')
  })
})

describe('griffithsNorms', () => {
  it('looks up 0-2 mental ages from norms tables', () => {
    expect(lookupGriffithsSubscaleMentalAgeMonths('0-2', 'a', 20)).not.toBeNull()
    expect(lookupGriffithsGeneralMentalAgeMonths('0-2', 100)).not.toBeNull()
    expect(lookupGriffithsSubscaleMentalAgeMonths('2-8', 'a', 20)).toBeNull()
  })

  it('looks up 2-8 mental ages using inverse median tables', () => {
    expect(lookupGriffithsSubscaleMentalAgeMonths('2-8', 'a', 48, 69)).toBeCloseTo(41.85, 1)
    expect(lookupGriffithsSubscaleMentalAgeMonths('2-8', 'b', 64, 69)).toBeCloseTo(52.5, 0)
    expect(lookupGriffithsSubscaleMentalAgeMonths('2-8', 'e', 60, 69)).toBeCloseTo(54, 0)
    expect(lookupGriffithsGeneralMentalAgeMonths('2-8', 505, null)).toBeNull()
  })
})
