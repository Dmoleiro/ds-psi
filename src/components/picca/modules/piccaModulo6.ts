export type PiccaAcademicLevel = '' | 'sem' | 'alguma' | 'significativa'

export type PiccaModulo6Answers = {
  crecheIngresso: string
  crecheAdaptacao: '' | 'facil' | 'moderada' | 'dificil'
  crecheEducadores: string
  crechePares: string
  crecheObs: string
  crecheHorasSemana: string
  preEscolarIngresso: string
  preEscolarAdaptacao: '' | 'facil' | 'moderada' | 'dificil'
  preEscolarEducadores: string
  preEscolarPares: string
  preEscolarObs: string
  preEscolarHorasSemana: string
  ciclo1Adaptacao: string
  ciclo1Leitura: string
  ciclo1Escrita: string
  ciclo1Matematica: string
  ciclo1Comportamento: string
  ciclo23Adaptacao: string
  ciclo23Organizacao: string
  ciclo23Motivacao: string
  ciclo23Professores: string
  ciclo23Colegas: string
  academicoAtual: Record<string, PiccaAcademicLevel>
  apoiosEducativos: string[]
  apoiosOutro: string
  assiduidade: string
  pontualidade: string
  participacaoSala: string
  autonomiaTarefas: string
  integracaoProtetores: string
  integracaoRiscos: string
  integracaoImpacto: string
  integracaoNecessidades: string
  integracaoRecomendacoes: string
}

export const PICCA_MOD6_ACADEMIC_ROWS = [
  { id: 'leitura', label: 'Leitura' },
  { id: 'escrita', label: 'Escrita' },
  { id: 'ortografia', label: 'Ortografia' },
  { id: 'expressao_escrita', label: 'Expressão escrita' },
  { id: 'matematica', label: 'Matemática' },
  { id: 'atencao', label: 'Atenção' },
  { id: 'organizacao', label: 'Organização' },
  { id: 'trabalho_casa', label: 'Trabalho de casa' },
  { id: 'estudo_autonomo', label: 'Estudo autónomo' },
] as const

export const defaultPiccaModulo6Answers = (): PiccaModulo6Answers => ({
  crecheIngresso: '',
  crecheAdaptacao: '',
  crecheEducadores: '',
  crechePares: '',
  crecheObs: '',
  crecheHorasSemana: '',
  preEscolarIngresso: '',
  preEscolarAdaptacao: '',
  preEscolarEducadores: '',
  preEscolarPares: '',
  preEscolarObs: '',
  preEscolarHorasSemana: '',
  ciclo1Adaptacao: '',
  ciclo1Leitura: '',
  ciclo1Escrita: '',
  ciclo1Matematica: '',
  ciclo1Comportamento: '',
  ciclo23Adaptacao: '',
  ciclo23Organizacao: '',
  ciclo23Motivacao: '',
  ciclo23Professores: '',
  ciclo23Colegas: '',
  academicoAtual: {},
  apoiosEducativos: [],
  apoiosOutro: '',
  assiduidade: '',
  pontualidade: '',
  participacaoSala: '',
  autonomiaTarefas: '',
  integracaoProtetores: '',
  integracaoRiscos: '',
  integracaoImpacto: '',
  integracaoNecessidades: '',
  integracaoRecomendacoes: '',
})

export function mergePiccaModulo6Answers(raw: Record<string, unknown>): PiccaModulo6Answers {
  const defaults = defaultPiccaModulo6Answers()
  return { ...defaults, ...(raw as Partial<PiccaModulo6Answers>) }
}
