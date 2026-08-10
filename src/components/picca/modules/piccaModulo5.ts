export type PiccaInstrumentRow = {
  resultados: string
  integracao: string
}

export type PiccaModulo5Answers = {
  mantemAtencao: '' | 'nunca' | 'as_vezes' | 'frequentemente'
  segueInstrucoes: '' | 'sim' | 'parcialmente' | 'nao'
  planeamentoOrganizacao: string
  flexibilidadeCognitiva: string
  completaTarefas: string
  memoriaImediata: string
  memoriaTrabalho: string
  leitura: string
  escrita: string
  matematica: string
  compreensaoVerbal: string
  expressaoVerbal: string
  pragmatica: string
  reconhecimentoEmocional: string
  regulacaoEmocional: string
  ansiedade: '' | 'ausente' | 'ligeira' | 'moderada' | 'grave'
  autoestima: string
  medos: string
  evitamentos: string
  recusas: string
  impulsividade: string
  agressividade: string
  oposicao: string
  rigidez: string
  relacaoPares: string
  relacaoAdultos: string
  empatia: string
  bullying: string
  prefereAdultos: '' | 'sim' | 'nao'
  amigosPreferidos: '' | 'sim' | 'nao'
  higienePessoal: string
  gestaoRotinas: string
  trabalhosCasa: string
  precisaAjudaTarefas: '' | 'sim' | 'nao'
  qualidadeSono: string
  habitosAlimentares: string
  horasSono: string
  horaDeitar: string
  horaAcordar: string
  despertaresNoturnos: '' | 'sim' | 'nao'
  instrumentos: Record<string, PiccaInstrumentRow>
  sinteseFortes: string
  sinteseDificuldades: string
  sinteseImpacto: string
  sinteseManutencao: string
  sinteseObjetivos: string
  notasClinicas: string
}

export const PICCA_MOD5_INSTRUMENTS = [
  { id: 'wisc', label: 'WISC/WPPSI' },
  { id: 'griffiths', label: 'Griffiths' },
  { id: 'banc', label: 'BANC' },
  { id: 'd2', label: 'D2' },
  { id: 'figura_rey', label: 'Figura Complexa de Rey' },
  { id: 'conners', label: 'Conners pais/professores' },
  { id: 'aseba', label: 'ASEBA pais/professores' },
  { id: 'brief', label: 'BRIEF pais/autopreenchimento' },
  { id: 'ysr', label: 'YSR autopreenchimento' },
  { id: 'adexi', label: 'Adexi' },
  { id: 'chexi', label: 'Chexi' },
  { id: 'sqp', label: 'SQP pais e professores' },
  { id: 'outros', label: 'Outros' },
] as const

function migrateMod5Instruments(
  instrumentos: Record<string, PiccaInstrumentRow>,
): Record<string, PiccaInstrumentRow> {
  const result = { ...instrumentos }
  const legacy = result.bancd2
  if (legacy && !result.banc?.resultados && !result.banc?.integracao) {
    result.banc = { ...legacy }
  }
  if (legacy && !result.d2?.resultados && !result.d2?.integracao) {
    result.d2 = { ...legacy }
  }
  return result
}

export const defaultPiccaModulo5Answers = (): PiccaModulo5Answers => ({
  mantemAtencao: '',
  segueInstrucoes: '',
  planeamentoOrganizacao: '',
  flexibilidadeCognitiva: '',
  completaTarefas: '',
  memoriaImediata: '',
  memoriaTrabalho: '',
  leitura: '',
  escrita: '',
  matematica: '',
  compreensaoVerbal: '',
  expressaoVerbal: '',
  pragmatica: '',
  reconhecimentoEmocional: '',
  regulacaoEmocional: '',
  ansiedade: '',
  autoestima: '',
  medos: '',
  evitamentos: '',
  recusas: '',
  impulsividade: '',
  agressividade: '',
  oposicao: '',
  rigidez: '',
  relacaoPares: '',
  relacaoAdultos: '',
  empatia: '',
  bullying: '',
  prefereAdultos: '',
  amigosPreferidos: '',
  higienePessoal: '',
  gestaoRotinas: '',
  trabalhosCasa: '',
  precisaAjudaTarefas: '',
  qualidadeSono: '',
  habitosAlimentares: '',
  horasSono: '',
  horaDeitar: '',
  horaAcordar: '',
  despertaresNoturnos: '',
  instrumentos: {},
  sinteseFortes: '',
  sinteseDificuldades: '',
  sinteseImpacto: '',
  sinteseManutencao: '',
  sinteseObjetivos: '',
  notasClinicas: '',
})

export function mergePiccaModulo5Answers(raw: Record<string, unknown>): PiccaModulo5Answers {
  const defaults = defaultPiccaModulo5Answers()
  const partial = raw as Partial<PiccaModulo5Answers>
  return {
    ...defaults,
    ...partial,
    instrumentos: migrateMod5Instruments({
      ...defaults.instrumentos,
      ...partial.instrumentos,
    }),
  }
}
