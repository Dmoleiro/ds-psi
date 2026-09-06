import { describe, expect, it } from 'vitest'
import { emptyBancResults } from './bancResults'
import { emptyGriffithsResults } from './griffithsResults'
import {
  buildEvaluationResultsPrintHtml,
  resolveEvaluationExportMethodIds,
} from './evaluationResultsPrint'
import { emptyPreEscolarResults } from './preEscolarResults'
import { emptyWiscResults, emptyWiscSubtestResult } from './wiscResults'

describe('evaluationResultsPrint', () => {
  it('throws when there is nothing to export', () => {
    expect(() =>
      buildEvaluationResultsPrintHtml({
        patientName: 'Ana Silva',
        selections: {
          wiscSelections: [],
          bancSelections: [],
          additionalMethodSelections: [],
          wiscResults: emptyWiscResults(),
          bancResults: emptyBancResults(),
          griffithsResults: emptyGriffithsResults(),
          preEscolarResults: emptyPreEscolarResults(),
        },
      }),
    ).toThrow('Não existem resultados de avaliação para exportar.')
  })

  it('includes Griffiths derived values in the generated HTML', () => {
    const griffithsResults = emptyGriffithsResults()
    griffithsResults.ageYears = '4'
    griffithsResults.ageMonths = '6'
    griffithsResults.subscales.a.sectionI = ['12', '']

    const html = buildEvaluationResultsPrintHtml({
      patientName: 'João Costa',
      patientBirthDate: '2020-01-15',
      selections: {
        wiscSelections: [],
        bancSelections: [],
        additionalMethodSelections: [],
        wiscResults: emptyWiscResults(),
        bancResults: emptyBancResults(),
        griffithsResults,
        preEscolarResults: emptyPreEscolarResults(),
      },
      methodIds: ['griffiths'],
    })

    expect(html).toContain('João Costa')
    expect(html).toContain('Ruth Griffiths')
    expect(html).toContain('Secção I (meses)')
    expect(html).toContain('12')
  })

  it('resolves exportable method ids from stored results', () => {
    const wiscResults = emptyWiscResults()
    wiscResults.subtests = {
      informacao: { ...emptyWiscSubtestResult(), brutos: '14' },
    }

    const ids = resolveEvaluationExportMethodIds({
      wiscSelections: [],
      bancSelections: [],
      additionalMethodSelections: [],
      wiscResults,
      bancResults: emptyBancResults(),
      griffithsResults: emptyGriffithsResults(),
      preEscolarResults: emptyPreEscolarResults(),
    })

    expect(ids).toContain('wisc')
  })
})
