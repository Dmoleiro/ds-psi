import { describe, expect, it } from 'vitest'
import {
  computeBancRpFromRegression,
  deriveBancResults,
  emptyBancResults,
  lookupBancRpFromTable,
} from './bancResults.js'

describe('bancResults', () => {
  it('computes RP from regression for Lista de Palavras EI at age 16', () => {
    const rp = computeBancRpFromRegression('lista_palavras_ei', 8, 16)
    expect(rp).toBe(10)
  })

  it('looks up Teste de Orientação from Anexo A at age 10', () => {
    expect(lookupBancRpFromTable(10, 'teste_orientacao', 94)).toBe(10)
    expect(lookupBancRpFromTable(10, 'teste_orientacao', 83)).toBe(1)
  })

  it('looks up RP from Anexo A tables for ages 5–15', () => {
    const rp = lookupBancRpFromTable(10, 'compreensao_instrucoes', 18)
    expect(rp).not.toBeNull()
    expect(rp).toBeGreaterThanOrEqual(1)
    expect(rp).toBeLessThanOrEqual(19)
  })

  it('uses regression for ages 16–17 when RB is entered', () => {
    const raw = emptyBancResults()
    raw.ageYears = '16'
    raw.ageMonths = '0'
    raw.measures.lista_palavras_ei = { rb: '8', rp: '' }

    const derived = deriveBancResults(raw)
    expect(derived.measures.lista_palavras_ei.rp).toBe('10')
  })

  it('updates norm group when age changes', () => {
    const raw = emptyBancResults()
    raw.ageYears = '10'
    raw.ageMonths = '0'
    raw.normGroup = '10 – 15 anos'

    expect(deriveBancResults(raw).normGroup).toBe('10 – 15 anos')

    raw.ageYears = '16'
    expect(deriveBancResults(raw).normGroup).toBe('16 anos (estimativa por regressão)')

    raw.ageYears = '6'
    expect(deriveBancResults(raw).normGroup).toBe('6 anos')
  })

  it('derives composite sums and global indices from perfil RP values', () => {
    const raw = emptyBancResults()
    raw.ageYears = '10'
    raw.ageMonths = '0'
    raw.measures.reconhecimento_diferido = { rb: '12', rp: '' }
    raw.measures.memoria_historias_ed = { rb: '20', rp: '' }
    raw.measures.fc_rey_edil = { rb: '15', rp: '' }
    raw.measures.lista_palavras_edil = { rb: '8', rp: '' }
    raw.measures.nomeacao_rapida_digitos = { rb: '30', rp: '' }
    raw.measures.compreensao_instrucoes = { rb: '18', rp: '' }
    raw.measures.cf_eliminacao = { rb: '10', rp: '' }
    raw.measures.cf_substituicao = { rb: '8', rp: '' }
    raw.measures.fluencia_fonemica = { rb: '12', rp: '' }
    raw.measures.fluencia_semantica = { rb: '40', rp: '' }
    raw.measures.torre_ensaios = { rb: '18', rp: '' }
    raw.measures.cancelamento_sinais = { rb: '8', rp: '' }
    raw.measures.trilhas_a = { rb: '45', rp: '' }
    raw.measures.trilhas_b = { rb: '90', rp: '' }

    const derived = deriveBancResults(raw)

    expect(derived.measures.reconhecimento_diferido.rp).not.toBe('')
    expect(derived.globalIndices.memoria.somatorio).not.toBe('')
    expect(derived.globalIndices.linguagem.somatorio).not.toBe('')
    expect(derived.globalIndices.atencao.somatorio).not.toBe('')
    expect(Object.keys(derived.compositeMemoria)).toHaveLength(4)
  })

  it('derives years, months and norm group from birth and evaluation dates', () => {
    const raw = emptyBancResults()
    raw.ageInputMode = 'dates'
    raw.birthDate = '2015-03-10'
    raw.evaluationDate = '2025-09-10'

    const derived = deriveBancResults(raw)
    expect(derived.ageYears).toBe('10')
    expect(derived.ageMonths).toBe('6')
    expect(derived.normGroup).toBe('10 – 15 anos')
  })
})
