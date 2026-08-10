export type PiccaInstrumentIntegrationRow = {
  resultados: string
  integracao: string
}

export type PiccaModulo8Answers = {
  motivoPrincipal: string
  sinteseInformacao: string
  instrumentos: Record<string, PiccaInstrumentIntegrationRow>
  cincoPsProblema: string
  cincoPsPredisponentes: string
  cincoPsPrecipitantes: string
  cincoPsPerpetuantes: string
  cincoPsProtetores: string
  cbtSituacaoDesencadeante: string
  cbtPensamentosAutomaticos: string
  cbtEmocoes: string
  cbtRespostasFisiologicas: string
  cbtComportamentos: string
  cbtConsequencias: string
  cbtManutencao: string
  areasFortes: string
  vulnerabilidades: string
  hipotesesClinicas: string
  impactoFuncional: string
  objetivosCurtoPrazo: string[]
  objetivosMedioPrazo: string[]
  objetivosLongoPrazo: string[]
  recomendacoesIniciais: string
  impressaoClinicaGlobal: string
}

export const PICCA_MOD8_INSTRUMENTS = [
  { id: 'griffiths', label: 'Griffiths' },
  { id: 'wisc', label: 'WPPSI/WISC' },
  { id: 'banc', label: 'BANC' },
  { id: 'd2', label: 'D2' },
  { id: 'figura_rey', label: 'Figura Complexa de Rey' },
  { id: 'aseba', label: 'ASEBA' },
  { id: 'conners', label: 'Conners' },
  { id: 'brief', label: 'BRIEF' },
  { id: 'outros', label: 'Outros' },
] as const

const emptyObjectives = () => ['', '', '']

export const defaultPiccaModulo8Answers = (): PiccaModulo8Answers => ({
  motivoPrincipal: '',
  sinteseInformacao: '',
  instrumentos: {},
  cincoPsProblema: '',
  cincoPsPredisponentes: '',
  cincoPsPrecipitantes: '',
  cincoPsPerpetuantes: '',
  cincoPsProtetores: '',
  cbtSituacaoDesencadeante: '',
  cbtPensamentosAutomaticos: '',
  cbtEmocoes: '',
  cbtRespostasFisiologicas: '',
  cbtComportamentos: '',
  cbtConsequencias: '',
  cbtManutencao: '',
  areasFortes: '',
  vulnerabilidades: '',
  hipotesesClinicas: '',
  impactoFuncional: '',
  objetivosCurtoPrazo: emptyObjectives(),
  objetivosMedioPrazo: emptyObjectives(),
  objetivosLongoPrazo: emptyObjectives(),
  recomendacoesIniciais: '',
  impressaoClinicaGlobal: '',
})

export function mergePiccaModulo8Answers(raw: Record<string, unknown>): PiccaModulo8Answers {
  const defaults = defaultPiccaModulo8Answers()
  const partial = raw as Partial<PiccaModulo8Answers>
  const instrumentos = { ...defaults.instrumentos, ...partial.instrumentos }
  const legacy = instrumentos.bancd2
  if (legacy && !instrumentos.banc?.resultados && !instrumentos.banc?.integracao) {
    instrumentos.banc = { ...legacy }
  }
  if (legacy && !instrumentos.d2?.resultados && !instrumentos.d2?.integracao) {
    instrumentos.d2 = { ...legacy }
  }
  return {
    ...defaults,
    ...partial,
    instrumentos,
    objetivosCurtoPrazo: partial.objetivosCurtoPrazo ?? defaults.objetivosCurtoPrazo,
    objetivosMedioPrazo: partial.objetivosMedioPrazo ?? defaults.objetivosMedioPrazo,
    objetivosLongoPrazo: partial.objetivosLongoPrazo ?? defaults.objetivosLongoPrazo,
  }
}
