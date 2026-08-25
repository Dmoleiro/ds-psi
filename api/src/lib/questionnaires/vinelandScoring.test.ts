import { describe, expect, it } from 'vitest'
import { computeVinelandScores } from './vinelandScoring.js'

describe('computeVinelandScores', () => {
  it('sums adaptive subdomain totals, page partials, N/D and maladaptive', () => {
    const scores = computeVinelandScores({
      com_01: 2,
      com_02: 1,
      com_03: 'N',
      com_34: 2,
      com_07: 2,
      mbd_01: 1,
      mbd_28: 2,
    })

    expect(scores.comunicacao_receptiva).toBe(3)
    expect(scores.comunicacao_receptiva_n).toBe(1)
    expect(scores.comunicacao_expressiva).toBe(4)
    expect(scores.comunicacao_pag2_receptiva).toBe(3)
    expect(scores.comunicacao_pag2_expressiva).toBe(2)
    expect(scores.comunicacao_pag3_expressiva).toBe(2)
    expect(scores.comunicacao_pag3_receptiva).toBe(0)
    expect(scores.maladaptativo_parte1).toBe(1)
    expect(scores.maladaptativo_parte2).toBe(2)
    expect(scores.maladaptativo_total).toBe(3)
  })
})
