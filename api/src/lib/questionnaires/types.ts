/** Optional free-text notes appended to every questionnaire submission. */
export const QUESTIONNAIRE_NOTES_FIELD = '_notas' as const

export type ResponseType =
  | 'yes_no'
  | 'likert3_sdq'
  | 'likert4'
  | 'likert5'
  | 'likert7'
  | 'frequency0_3'
  | 'frequency0_2'
  | 'forced_choice'
  | 'rating4'

export type QuestionnaireItem = {
  id: string
  text: string
  options?: string[]
  inputType?: 'text' | 'textarea'
}

export type ScoringSubscale = {
  id: string
  label: string
  itemIds: string[]
  reverseItemIds?: string[]
}

export type ScoringRule =
  | { type: 'sum_subscales'; subscales: ScoringSubscale[]; totalLabel?: string; totalExcludeSubscaleIds?: string[] }
  | { type: 'mchat' }
  | { type: 'inventario_asperger' }
  | { type: 'rcmas' }
  | { type: 'cdi' }
  | { type: 'iep' }
  | { type: 'obq44' }
  | { type: 'cars_total' }
  | { type: 'scared' }
  | { type: 'custom'; compute: (answers: Record<string, unknown>) => Record<string, number> }

export type QuestionnaireDefinition = {
  id: string
  title: string
  description: string
  instructions: string
  respondent?: string
  responseType: ResponseType
  responseLabels?: string[]
  items: QuestionnaireItem[]
  scoring?: ScoringRule
  meta?: Record<string, unknown>
}

export type QuestionnaireScores = Record<string, number>

/** Response values stored as 1–N (not zero-based option index). */
export function isOneBasedResponseType(responseType: ResponseType): boolean {
  return responseType === 'likert5' || responseType === 'likert7' || responseType === 'rating4'
}

export const RESPONSE_LABELS: Record<ResponseType, string[]> = {
  yes_no: ['Não', 'Sim'],
  likert3_sdq: ['Não é verdade', 'É um pouco verdade', 'É muito verdade'],
  likert4: ['0', '1', '2', '3'],
  likert5: ['1', '2', '3', '4', '5'],
  likert7: ['1', '2', '3', '4', '5', '6', '7'],
  frequency0_3: ['Nunca / 0', 'Um pouco / 1', 'Frequentemente / 2', 'Muito frequente / 3'],
  frequency0_2: ['Nunca / 0', 'Às vezes / 1', 'Sempre / 2'],
  forced_choice: [],
  rating4: ['1', '2', '3', '4'],
}
