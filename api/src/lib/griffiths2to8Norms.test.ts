import { describe, expect, it } from 'vitest'
import {
  lookupGriffithsGeneralMentalAgeMonths,
  lookupGriffithsSubscaleGlobalMentalAgeMonths,
  lookupGriffithsSubscaleMentalAgeMonths,
} from './griffithsNorms.js'
import {
  parseGriffiths28GridPage,
  parseMedianColumnRows,
  parseMentalValueToken,
  parseSingleLineRawMentalRow,
} from '../../../scripts/build_griffiths_2to8_norms.mjs'

describe('griffiths 2-8 norm extraction', () => {
  it('parses pseudo-decimal mental values from OCR tokens', () => {
    expect(parseMentalValueToken('840')).toBe(84)
    expect(parseMentalValueToken('574')).toBe(57.4)
    expect(parseMentalValueToken('30.6')).toBe(30.6)
  })

  it('parses single-line general rows as raw→mental pairs', () => {
    const entries = parseSingleLineRawMentalRow('72.0 840 841 843 844 845 847 848 849 850 851 72.0')
    expect(entries).not.toBeNull()
    expect(entries?.[0]).toEqual([72, 840, 84])
    expect(entries?.[1]).toEqual([72, 841, 84.1])
  })

  it('parses paired general rows from OCR text', () => {
    const pageText = [
      '26.0 294 295 296 297 298 299 300 301 302',
      '26.5 30.0 30.1 30.2 30.3 30.4 30.5 30.6 30.7 30.8',
    ].join('\n')

    const entries = parseGriffiths28GridPage(pageText, { mode: 'general' })
    expect(entries.length).toBeGreaterThan(5)
    expect(entries).toContainEqual([26, 294, 30])
  })

  it('parses median column rows for inverse lookup', () => {
    const pageText = [
      '60.0 705 708 710 712 714 717 719 721 723 726',
      '60.5 712 715 717 719 721 723 725 727 729 732',
    ].join('\n')

    const rows = parseMedianColumnRows(pageText)
    expect(rows).toContainEqual([60, 72.6])
    expect(rows).toContainEqual([60.5, 73.2])
  })
})

describe('griffiths 2-8 norm lookups', () => {
  it('looks up subscale developmental mental age via inverse median table', () => {
    const developmental = lookupGriffithsSubscaleMentalAgeMonths('2-8', 'a', 48, 60)
    expect(developmental).not.toBeNull()
    expect(developmental!).toBeGreaterThan(40)
    expect(developmental!).toBeLessThan(43)
  })

  it('looks up per-subscale global mental age from general median table', () => {
    const global = lookupGriffithsSubscaleGlobalMentalAgeMonths(64, 69)
    expect(global).not.toBeNull()
    expect(global!).toBeGreaterThan(50)
    expect(global!).toBeLessThan(65)
  })

  it('looks up general mental age from raw on 2-8 band', () => {
    const mentalAge = lookupGriffithsGeneralMentalAgeMonths('2-8', 72, 69)
    expect(mentalAge).not.toBeNull()
    expect(mentalAge!).toBeGreaterThan(55)
    expect(mentalAge!).toBeLessThan(62)
  })

  it('returns null for 2-8 lookups without chronological age', () => {
    expect(lookupGriffithsGeneralMentalAgeMonths('2-8', 505, null)).toBeNull()
    expect(lookupGriffithsSubscaleGlobalMentalAgeMonths(60, null)).toBeNull()
  })
})
