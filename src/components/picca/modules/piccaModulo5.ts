export type PiccaInstrumentRow = {
  resultados: string
  integracao: string
}

export type PiccaModulo5Answers = {
  mantemAtencao: '' | 'nunca' | 'as_vezes' | 'frequentemente'
  segueInstrucoes: '' | 'sim' | 'parcialmente' | 'nao'
  planeamentoOrganizacao: string
  flexibilidadeCognitiva: string
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
  impulsividade: string
  agressividade: string
  oposicao: string
  rigidez: string
  relacaoPares: string
  relacaoAdultos: string
  empatia: string
  bullying: string
  higienePessoal: string
  gestaoRotinas: string
  trabalhosCasa: string
  qualidadeSono: string
  habitosAlimentares: string
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
  { id: 'bancd2', label: 'BANCD2' },
  { id: 'figura_rey', label: 'Figura Complexa de Rey' },
  { id: 'conners', label: 'Conners' },
  { id: 'aseba', label: 'ASEBA' },
  { id: 'brief', label: 'BRIEF' },
  { id: 'outros', label: 'Outros' },
] as const

export const defaultPiccaModulo5Answers = (): PiccaModulo5Answers => ({
  mantemAtencao: '',
  segueInstrucoes: '',
  planeamentoOrganizacao: '',
  flexibilidadeCognitiva: '',
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
  impulsividade: '',
  agressividade: '',
  oposicao: '',
  rigidez: '',
  relacaoPares: '',
  relacaoAdultos: '',
  empatia: '',
  bullying: '',
  higienePessoal: '',
  gestaoRotinas: '',
  trabalhosCasa: '',
  qualidadeSono: '',
  habitosAlimentares: '',
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
  return { ...defaults, ...(raw as Partial<PiccaModulo5Answers>) }
}
