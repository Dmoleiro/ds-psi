import { describe, expect, it } from 'vitest'
import {
  chronologicalAgeYearsMonths,
  isEvaluationBeforeBirth,
  resolveEvaluationAge,
  sanitizeIsoDate,
} from './chronologicalAge'

describe('chronologicalAge', () => {
  it('counts completed years and months on the birthday', () => {
    expect(chronologicalAgeYearsMonths('2015-03-10', '2025-03-10')).toEqual({ years: 10, months: 0 })
  })

  it('borrows a month when the day of month has not been reached', () => {
    expect(chronologicalAgeYearsMonths('2015-03-10', '2025-03-09')).toEqual({ years: 9, months: 11 })
    expect(chronologicalAgeYearsMonths('2015-03-31', '2025-03-01')).toEqual({ years: 9, months: 11 })
  })

  it('uses six-month bands the same way WISC tables do', () => {
    expect(chronologicalAgeYearsMonths('2015-03-10', '2025-09-10')).toEqual({ years: 10, months: 6 })
    expect(chronologicalAgeYearsMonths('2016-02-20', '2024-08-19')).toEqual({ years: 8, months: 5 })
    expect(chronologicalAgeYearsMonths('2016-02-20', '2024-08-20')).toEqual({ years: 8, months: 6 })
  })

  it('rejects evaluation dates before birth', () => {
    expect(chronologicalAgeYearsMonths('2015-03-10', '2014-03-10')).toBeNull()
    expect(isEvaluationBeforeBirth('2015-03-10', '2014-03-10')).toBe(true)
    expect(isEvaluationBeforeBirth('2015-03-10', '2015-03-10')).toBe(false)
  })

  it('ignores invalid calendar dates', () => {
    expect(sanitizeIsoDate('2025-02-30')).toBe('')
    expect(chronologicalAgeYearsMonths('2015-02-30', '2025-03-10')).toBeNull()
  })

  it('fills years and months from dates only in dates mode', () => {
    expect(
      resolveEvaluationAge({
        ageInputMode: 'dates',
        birthDate: '2015-03-10',
        evaluationDate: '2025-09-10',
        ageYears: '99',
        ageMonths: '99',
      }),
    ).toMatchObject({ ageYears: '10', ageMonths: '6' })

    expect(
      resolveEvaluationAge({
        ageInputMode: 'years_months',
        birthDate: '2015-03-10',
        evaluationDate: '2025-09-10',
        ageYears: '7',
        ageMonths: '2',
      }),
    ).toMatchObject({ ageYears: '7', ageMonths: '2' })
  })
})
