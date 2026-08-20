import { describe, expect, it } from 'vitest'
import {
  canAutoConvertWiscRawScores,
  computeWiscSomaPadronizados,
  deriveWiscResults,
  emptyWiscGaiSummary,
  emptyWiscPadronizadoColumns,
  emptyWiscSubtestResult,
  getWiscAutoScoreBlockReason,
  getWiscPadronizadoMediaDesignation,
  getWiscQiClassificacao,
  getWiscScadAcidDesignation,
  lookupWiscGai,
  lookupWiscQi,
  lookupWiscScaledScore,
  sanitizeWiscResults,
  WISC_ACID_SUBTEST_KEYS,
  WISC_SCAD_SUBTEST_KEYS,
} from './wiscResults.js'

function scaled(values: Partial<ReturnType<typeof emptyWiscPadronizadoColumns>>) {
  return { ...emptyWiscPadronizadoColumns(), ...values }
}

function profileSubtests(scaledByKey: Record<string, number>) {
  const subtests: Record<string, ReturnType<typeof emptyWiscSubtestResult>> = {}
  for (const [key, value] of Object.entries(scaledByKey)) {
    const padronizado = emptyWiscPadronizadoColumns()
    const text = String(value)
    if (key === 'informacao') {
      padronizado.verbal = text
      padronizado.cv = text
    } else if (key === 'aritmetica' || key === 'memoria_de_digitos') {
      padronizado.verbal = text
    } else if (key === 'codigo' || key === 'pesquisa_de_simbolos') {
      padronizado.performance = text
      padronizado.vp = text
    }
    subtests[key] = { brutos: '', padronizado }
  }
  return subtests
}

describe('wiscResults', () => {
  it('keeps known subtests, maps legacy confidence intervals, and does not sum incomplete cores', () => {
    expect(
      sanitizeWiscResults({
        subtests: {
          codigo: {
            brutos: ' 12 ',
            padronizado: { verbal: '8', performance: '9', cv: 'bad', op: '7', vp: '6' },
          },
          invalid: { brutos: '1' },
        },
        somaPadronizados: { verbal: '99' },
        scaleSummary: {
          verbal: { qi: '110', percentil: '75', intervaloConfianca: '105-115', resultado: '55' },
          unknown: { qi: '90' },
        },
      }),
    ).toEqual({
      ageYears: '',
      ageMonths: '',
      subtests: {
        codigo: {
          brutos: '12',
          padronizado: scaled({ performance: '9', vp: '6' }),
        },
      },
      somaPadronizados: emptyWiscPadronizadoColumns(),
      scaleSummary: {
        verbal: {
          resultado: '',
          qi: '110',
          percentil: '75',
          intervaloConfianca90: '105-115',
          intervaloConfianca95: '',
        },
        performance: {
          resultado: '',
          qi: '',
          percentil: '',
          intervaloConfianca90: '',
          intervaloConfianca95: '',
        },
        full_scale: {
          resultado: '',
          qi: '',
          percentil: '',
          intervaloConfianca90: '',
          intervaloConfianca95: '',
        },
        cv: {
          resultado: '',
          qi: '',
          percentil: '',
          intervaloConfianca90: '',
          intervaloConfianca95: '',
        },
        op: {
          resultado: '',
          qi: '',
          percentil: '',
          intervaloConfianca90: '',
          intervaloConfianca95: '',
        },
        vp: {
          resultado: '',
          qi: '',
          percentil: '',
          intervaloConfianca90: '',
          intervaloConfianca95: '',
        },
      },
      gaiSummary: {
        resultado: '',
        gai: '',
        percentil: '',
        intervaloConfianca90: '',
        intervaloConfianca95: '',
      },
    })
  })

  it('sums only complete nuclear cores and leaves QI blank without a usable age', () => {
    const derived = deriveWiscResults({
      ageYears: '',
      ageMonths: '',
      subtests: {
        informacao: { brutos: '', padronizado: scaled({ verbal: '10', cv: '10' }) },
        semelhancas: { brutos: '', padronizado: scaled({ verbal: '10', cv: '10' }) },
        aritmetica: { brutos: '', padronizado: scaled({ verbal: '10' }) },
        vocabularios: { brutos: '', padronizado: scaled({ verbal: '10', cv: '10' }) },
        compreensao: { brutos: '', padronizado: scaled({ verbal: '10', cv: '10' }) },
        memoria_de_digitos: { brutos: '', padronizado: scaled({ verbal: '19' }) },
        codigo: { brutos: '', padronizado: scaled({ performance: '8', vp: '8' }) },
      },
      somaPadronizados: emptyWiscPadronizadoColumns(),
      scaleSummary: {},
      gaiSummary: emptyWiscGaiSummary(),
    })

    expect(derived.somaPadronizados).toEqual({
      verbal: '50',
      performance: '',
      cv: '40',
      op: '',
      vp: '',
    })
    expect(derived.scaleSummary.verbal).toMatchObject({
      resultado: '50',
      qi: '',
      percentil: '',
    })
    expect(computeWiscSomaPadronizados(derived.subtests)).toEqual(derived.somaPadronizados)
  })

  it('converts Tabela 36 raw scores at 6;0 and looks up QI 100 from verbal sum 50', () => {
    expect(lookupWiscScaledScore(6, 0, 'informacao', 0)).toBe(2)
    expect(lookupWiscQi('verbal', '50')).toEqual({
      qi: '100',
      percentil: '50',
      ic90: '94-106',
      ic95: '93-107',
    })
  })

  it('auto-fills scaled scores, core sums, QI, percentile and both CIs when age is in the tables', () => {
    const derived = deriveWiscResults({
      ageYears: '10',
      ageMonths: '0',
      subtests: {
        informacao: { ...emptyWiscSubtestResult(), brutos: '14' },
        semelhancas: { ...emptyWiscSubtestResult(), brutos: '10' },
        aritmetica: { ...emptyWiscSubtestResult(), brutos: '13' },
        vocabularios: { ...emptyWiscSubtestResult(), brutos: '19' },
        compreensao: { ...emptyWiscSubtestResult(), brutos: '13' },
        complemento_de_gravuras: { ...emptyWiscSubtestResult(), brutos: '19' },
        codigo: { ...emptyWiscSubtestResult(), brutos: '43' },
        disposicao_de_gravuras: { ...emptyWiscSubtestResult(), brutos: '25' },
        cubos: { ...emptyWiscSubtestResult(), brutos: '35' },
        composicao_de_objectos: { ...emptyWiscSubtestResult(), brutos: '28' },
        pesquisa_de_simbolos: { ...emptyWiscSubtestResult(), brutos: '21' },
      },
      somaPadronizados: emptyWiscPadronizadoColumns(),
      scaleSummary: {},
      gaiSummary: emptyWiscGaiSummary(),
    })

    expect(derived.subtests.informacao.padronizado.verbal).toBe('10')
    expect(derived.subtests.informacao.padronizado.cv).toBe('10')
    expect(derived.subtests.pesquisa_de_simbolos.padronizado.performance).toBe(
      derived.subtests.pesquisa_de_simbolos.padronizado.vp,
    )
    expect(derived.somaPadronizados.verbal).toBe('50')
    expect(derived.somaPadronizados.vp).toBe('20')
    expect(derived.scaleSummary.verbal).toMatchObject({
      resultado: '50',
      qi: '100',
      percentil: '50',
      intervaloConfianca90: '94-106',
      intervaloConfianca95: '93-107',
    })
    expect(derived.scaleSummary.vp).toMatchObject({
      resultado: '20',
      qi: '100',
      percentil: '50',
    })
  })

  it('looks up GAI from CV + OP sum using Tabela 1.5', () => {
    expect(lookupWiscGai('76')).toEqual({
      gai: '97',
      percentil: '42',
      ic90: '92-102',
      ic95: '91-103',
    })

    const derived = deriveWiscResults({
      ageYears: '',
      ageMonths: '',
      subtests: {
        informacao: { brutos: '', padronizado: scaled({ verbal: '10', cv: '10' }) },
        semelhancas: { brutos: '', padronizado: scaled({ verbal: '10', cv: '10' }) },
        vocabularios: { brutos: '', padronizado: scaled({ verbal: '10', cv: '10' }) },
        compreensao: { brutos: '', padronizado: scaled({ verbal: '10', cv: '10' }) },
        complemento_de_gravuras: { brutos: '', padronizado: scaled({ performance: '9', op: '9' }) },
        disposicao_de_gravuras: { brutos: '', padronizado: scaled({ performance: '9', op: '9' }) },
        cubos: { brutos: '', padronizado: scaled({ performance: '9', op: '9' }) },
        composicao_de_objectos: { brutos: '', padronizado: scaled({ performance: '9', op: '9' }) },
      },
      somaPadronizados: emptyWiscPadronizadoColumns(),
      scaleSummary: {},
      gaiSummary: emptyWiscGaiSummary(),
    })

    expect(derived.somaPadronizados.cv).toBe('40')
    expect(derived.somaPadronizados.op).toBe('36')
    expect(derived.gaiSummary).toMatchObject({
      resultado: '76',
      gai: '97',
      percentil: '42',
      intervaloConfianca90: '92-102',
      intervaloConfianca95: '91-103',
    })
  })

  it('classifies scaled scores relative to the normative average', () => {
    expect(getWiscPadronizadoMediaDesignation(7)).toBe('Inferior à média')
    expect(getWiscPadronizadoMediaDesignation(8)).toBe('Média inferior')
    expect(getWiscPadronizadoMediaDesignation(10)).toBe('Média')
    expect(getWiscPadronizadoMediaDesignation(12)).toBe('Média superior')
    expect(getWiscPadronizadoMediaDesignation(15)).toBe('Acima da média')
  })

  it('classifies QI and index scores', () => {
    expect(getWiscQiClassificacao('135')).toBe('Muito Superior')
    expect(getWiscQiClassificacao('>160')).toBe('Muito Superior')
    expect(getWiscQiClassificacao('125')).toBe('Superior')
    expect(getWiscQiClassificacao('115')).toBe('Médio Superior')
    expect(getWiscQiClassificacao('100')).toBe('Médio')
    expect(getWiscQiClassificacao('85')).toBe('Médio Inferior')
    expect(getWiscQiClassificacao('75')).toBe('Inferior')
    expect(getWiscQiClassificacao('65')).toBe('Muito Inferior')
  })

  it('classifies SCAD and ACID profiles from low scaled scores', () => {
    const noneLow = profileSubtests({
      informacao: 9,
      aritmetica: 10,
      codigo: 11,
      memoria_de_digitos: 12,
      pesquisa_de_simbolos: 11,
    })

    expect(getWiscScadAcidDesignation(noneLow, WISC_SCAD_SUBTEST_KEYS)).toBe('Não há perfil')
    expect(getWiscScadAcidDesignation(noneLow, WISC_ACID_SUBTEST_KEYS)).toBe('Não há perfil')

    const oneLow = profileSubtests({
      informacao: 8,
      aritmetica: 10,
      codigo: 11,
      memoria_de_digitos: 12,
    })
    expect(getWiscScadAcidDesignation(oneLow, WISC_SCAD_SUBTEST_KEYS)).toBe('Não há perfil')

    const partial = profileSubtests({
      informacao: 8,
      aritmetica: 7,
      codigo: 11,
      memoria_de_digitos: 12,
      pesquisa_de_simbolos: 6,
    })
    expect(getWiscScadAcidDesignation(partial, WISC_SCAD_SUBTEST_KEYS)).toBe('Parcial')
    expect(getWiscScadAcidDesignation(partial, WISC_ACID_SUBTEST_KEYS)).toBe('Parcial')

    const total = profileSubtests({
      informacao: 8,
      aritmetica: 7,
      codigo: 6,
      memoria_de_digitos: 5,
      pesquisa_de_simbolos: 4,
    })
    expect(getWiscScadAcidDesignation(total, WISC_SCAD_SUBTEST_KEYS)).toBe('Total')
    expect(getWiscScadAcidDesignation(total, WISC_ACID_SUBTEST_KEYS)).toBe('Total')
  })

  it('explains missing 8;6–9;5 norms and still keeps manual scaled scores', () => {
    const results = {
      ageYears: '8',
      ageMonths: '6',
      subtests: {
        informacao: { brutos: '12', padronizado: scaled({ verbal: '11', cv: '11' }) },
      },
      somaPadronizados: emptyWiscPadronizadoColumns(),
      scaleSummary: {
        verbal: {
          resultado: '',
          qi: '102',
          percentil: '55',
          intervaloConfianca90: '96-108',
          intervaloConfianca95: '95-109',
        },
      },
    }

    expect(canAutoConvertWiscRawScores(results)).toBe(false)
    expect(getWiscAutoScoreBlockReason(results)).toMatch(/8;6 a 9;5/)

    const derived = deriveWiscResults(results)
    expect(derived.subtests.informacao.padronizado.verbal).toBe('11')
    expect(derived.scaleSummary.verbal.qi).toBe('102')
    expect(derived.scaleSummary.verbal.intervaloConfianca90).toBe('96-108')
    expect(derived.scaleSummary.verbal.intervaloConfianca95).toBe('95-109')
  })
})
