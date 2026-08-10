export type PiccaInstrumentReportRow = {
  data: string
  conclusoes: string
}

export type PiccaModulo10Answers = {
  identificacaoCaso: string
  motivoAvaliacao: string
  instrumentosAplicados: Record<string, PiccaInstrumentReportRow>
  sinteseResultados: string
  formulacaoClinica: string
  hipotesesDiagnosticas: string
  diagnosticoDiferencial: string
  recomendacoes: string
  planoFollowup: Array<Record<string, string>>
  devolucao: string[]
  devolucaoObservacoes: string
  assinaturaPsicologo: string
}

export const PICCA_MOD10_INSTRUMENTS = [
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

export const PICCA_MOD10_FOLLOWUP_COLUMNS = [
  { key: 'objetivo', label: 'Objetivo' },
  { key: 'responsavel', label: 'Responsável' },
  { key: 'prazo', label: 'Prazo' },
  { key: 'estado', label: 'Estado' },
] as const

export const defaultPiccaModulo10Answers = (): PiccaModulo10Answers => ({
  identificacaoCaso: '',
  motivoAvaliacao: '',
  instrumentosAplicados: {},
  sinteseResultados: '',
  formulacaoClinica: '',
  hipotesesDiagnosticas: '',
  diagnosticoDiferencial: '',
  recomendacoes: '',
  planoFollowup: [{ objetivo: '', responsavel: '', prazo: '', estado: '' }],
  devolucao: [],
  devolucaoObservacoes: '',
  assinaturaPsicologo: '',
})

export function mergePiccaModulo10Answers(raw: Record<string, unknown>): PiccaModulo10Answers {
  const defaults = defaultPiccaModulo10Answers()
  const partial = raw as Partial<PiccaModulo10Answers>
  const instrumentosAplicados = { ...defaults.instrumentosAplicados, ...partial.instrumentosAplicados }
  const legacy = instrumentosAplicados.bancd2
  if (legacy && !instrumentosAplicados.banc?.data && !instrumentosAplicados.banc?.conclusoes) {
    instrumentosAplicados.banc = { ...legacy }
  }
  if (legacy && !instrumentosAplicados.d2?.data && !instrumentosAplicados.d2?.conclusoes) {
    instrumentosAplicados.d2 = { ...legacy }
  }
  return {
    ...defaults,
    ...partial,
    instrumentosAplicados,
    planoFollowup: partial.planoFollowup?.length ? partial.planoFollowup : defaults.planoFollowup,
  }
}
