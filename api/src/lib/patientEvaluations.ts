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
  {
    title: 'Prova Avaliação Pré-Escolar',
    options: [
      { key: 'prova_pre_escolar_verbal', label: 'Verbal' },
      { key: 'prova_pre_escolar_conceitos_quantitativos', label: 'Conceitos Quantitativos' },
      { key: 'prova_pre_escolar_memoria_auditiva', label: 'Memória Auditiva' },
      { key: 'prova_pre_escolar_constancia_de_forma', label: 'Constância de Forma' },
      { key: 'prova_pre_escolar_posicoes_espaco', label: 'Posições Espaço' },
      { key: 'prova_pre_escolar_orientacao_espacial', label: 'Orientação Espacial' },
      { key: 'prova_pre_escolar_coordenacao_visiomotora', label: 'Coordenação Visiomotora' },
      { key: 'prova_pre_escolar_figura_fundo', label: 'Figura Fundo' },
    ],
  },
]

export const ADDITIONAL_METHOD_EVALUATION_OPTIONS: ReadonlyArray<EvaluationOption> =
  ADDITIONAL_EVALUATION_METHODS.flatMap((method) => method.options)

export const GRIFFITHS_EVALUATION_KEY = 'escala_desenvolvimento_ruth_griffiths'

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
]
export const QUESTIONNAIRE_EVALUATION_KEYS = QUESTIONNAIRE_EVALUATION_OPTIONS.map(
  (option) => option.key,
)

const WISC_KEY_SET = new Set<string>(WISC_EVALUATION_KEYS)
const BANC_KEY_SET = new Set<string>(BANC_EVALUATION_KEYS)
const ADDITIONAL_METHOD_KEY_SET = new Set<string>(ADDITIONAL_METHOD_EVALUATION_KEYS)
const QUESTIONNAIRE_KEY_SET = new Set<string>(QUESTIONNAIRE_EVALUATION_KEYS)

export function sanitizeEvaluationSelections(
  value: unknown,
  allowedKeys: ReadonlySet<string>,
  canonicalOrder: readonly string[],
): string[] {
  if (!Array.isArray(value)) return []

  const selected = new Set(value.filter((item): item is string => typeof item === 'string' && allowedKeys.has(item)))
  return canonicalOrder.filter((key) => selected.has(key))
}

export function sanitizeWiscSelections(value: unknown): string[] {
  return sanitizeEvaluationSelections(value, WISC_KEY_SET, WISC_EVALUATION_KEYS)
}

export function sanitizeBancSelections(value: unknown): string[] {
  return sanitizeEvaluationSelections(value, BANC_KEY_SET, BANC_EVALUATION_KEYS)
}

export function sanitizeAdditionalMethodSelections(value: unknown): string[] {
  return sanitizeEvaluationSelections(value, ADDITIONAL_METHOD_KEY_SET, ADDITIONAL_METHOD_EVALUATION_KEYS)
}

export function sanitizeQuestionnaireSelections(value: unknown): string[] {
  return sanitizeEvaluationSelections(value, QUESTIONNAIRE_KEY_SET, QUESTIONNAIRE_EVALUATION_KEYS)
}
