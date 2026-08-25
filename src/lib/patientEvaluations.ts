export const WISC_EVALUATION_OPTIONS = [
  { key: 'complemento_de_gravuras', label: 'Complemento de Gravuras' },
  { key: 'informacao', label: 'Informação' },
  { key: 'codigo', label: 'Código' },
  { key: 'semelhancas', label: 'Semelhanças' },
  { key: 'disposicao_de_gravuras', label: 'Disposição de Gravuras' },
  { key: 'aritmetica', label: 'Aritmética' },
  { key: 'cubos', label: 'Cubos' },
  { key: 'vocabularios', label: 'Vocabulário' },
  { key: 'composicao_de_objectos', label: 'Composição de Objectos' },
  { key: 'compreensao', label: 'Compreensão' },
  { key: 'pesquisa_de_simbolos', label: 'Pesquisa de Símbolos' },
  { key: 'memoria_de_digitos', label: 'Memória de Dígitos' },
  { key: 'labirintos', label: 'Labirintos' },
] as const

export const BANC_EVALUATION_OPTIONS = [
  { key: 'teste_de_orientacao', label: 'Teste de Orientação' },
  { key: 'reconhecimento_de_faces', label: 'Reconhecimento de Faces' },
  { key: 'lateralidade', label: 'Lateralidade' },
  { key: 'nomeacao_rapida', label: 'Nomeação Rápida' },
  { key: 'fluencia_verbal', label: 'Fluência Verbal' },
  { key: 'memoria_de_historias', label: 'Memória de Histórias' },
  { key: 'torre', label: 'Torre' },
  { key: 'cancelamento_de_sinais', label: 'Cancelamento de Sinais' },
  { key: 'figura_complexa_de_rey', label: 'Figura Complexa de Rey' },
  { key: 'compreensao_de_instrucoes', label: 'Compreensão de Instruções' },
  { key: 'consciencia_fonologica', label: 'Consciência Fonológica' },
  { key: 'lista_de_palavras', label: 'Lista de Palavras' },
  { key: 'trilhas', label: 'Trilhas' },
  { key: 'tabuleiro_de_corsi', label: 'Tabuleiro de Corsi' },
  { key: 'tabuleiro_de_motricidade', label: 'Tabuleiro de Motricidade' },
] as const

import {
  PRE_ESCOLAR_SELECTION_KEY,
  PRE_ESCOLAR_SUBTEST_SELECTION_KEYS,
  PRE_ESCOLAR_SUBTESTS,
} from './preEscolarResults'
import type { BancResults } from './bancResults'
import type { GriffithsResults } from './griffithsResults'
import type { PreEscolarResults } from './preEscolarResults'
import type { WiscResults } from './wiscResults'

type EvaluationOption = { key: string; label: string }

export const ADDITIONAL_EVALUATION_METHODS: ReadonlyArray<{
  title: string
  options: ReadonlyArray<EvaluationOption>
}> = [
  {
    title: 'Figura Complexa de Rey',
    options: [{ key: 'figura_complexa_de_rey', label: 'Figura Complexa de Rey' }],
  },
  {
    title: 'D2',
    options: [{ key: 'd2', label: 'D2' }],
  },
  {
    title: 'Matrizes Progressivas de Raven',
    options: [{ key: 'matrizes_progressivas_raven', label: 'Matrizes Progressivas de Raven' }],
  },
  {
    title: 'STROOP',
    options: [{ key: 'stroop', label: 'STROOP' }],
  },
]

export const ADDITIONAL_METHOD_EVALUATION_OPTIONS: ReadonlyArray<EvaluationOption> =
  ADDITIONAL_EVALUATION_METHODS.flatMap((method) => method.options)

export const GRIFFITHS_EVALUATION_KEY = 'escala_desenvolvimento_ruth_griffiths'

export const PRE_ESCOLAR_EVALUATION_OPTIONS = PRE_ESCOLAR_SUBTESTS.map((subtest) => ({
  key: subtest.selectionKey,
  label: subtest.label,
}))

export const QUESTIONNAIRE_EVALUATION_OPTIONS = [
  { key: 'sdq_por', label: 'SDQ-Por' },
  { key: 'aseba_cbcl', label: 'ASEBA-CBCL' },
  { key: 'aseba_trf', label: 'ASEBA-TRF' },
  { key: 'aseba_ysr', label: 'ASEBA-YSR' },
  { key: 'conners_pais', label: 'Conners-pais' },
  { key: 'conners_professores', label: 'Conners-professores' },
  { key: 'brief', label: 'BRIEF' },
  { key: 'scared', label: 'SCARED' },
  { key: 'rcmas', label: 'RCMAS' },
  { key: 'chexi', label: 'CHEXI' },
  { key: 'adexi', label: 'ADEXI' },
  { key: 'diva', label: 'DIVA' },
  { key: 'estilos_parentais', label: 'Estilos Parentais' },
  { key: 'psvc', label: 'PSVC' },
  { key: 'fssr', label: 'FSSR' },
  { key: 'm_chat', label: 'M-chat' },
  { key: 'inventario_de_estereotipias', label: 'Inventário de Estereotipias' },
  { key: 'cars', label: 'CARS' },
  { key: 'obq_44', label: 'OBQ-44' },
  { key: 'cdi', label: 'CDI' },
] as const

export const WISC_EVALUATION_KEYS = WISC_EVALUATION_OPTIONS.map((option) => option.key)
export const BANC_EVALUATION_KEYS = BANC_EVALUATION_OPTIONS.map((option) => option.key)

export const ADDITIONAL_METHOD_EVALUATION_KEYS = [
  GRIFFITHS_EVALUATION_KEY,
  ...ADDITIONAL_METHOD_EVALUATION_OPTIONS.map((option) => option.key),
  PRE_ESCOLAR_SELECTION_KEY,
  ...PRE_ESCOLAR_SUBTEST_SELECTION_KEYS,
]
export const QUESTIONNAIRE_EVALUATION_KEYS = QUESTIONNAIRE_EVALUATION_OPTIONS.map(
  (option) => option.key,
)

export type PatientEvaluationSelections = {
  wiscSelections: string[]
  bancSelections: string[]
  additionalMethodSelections: string[]
  wiscResults: WiscResults
  bancResults: BancResults
  griffithsResults: GriffithsResults
  preEscolarResults: PreEscolarResults
}
