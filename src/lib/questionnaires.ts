/** Optional free-text notes field on every questionnaire — keep in sync with api types. */
export const QUESTIONNAIRE_NOTES_FIELD = '_notas'

/** Questionnaire form IDs — keep in sync with api/src/lib/questionnaires/registry.ts */
export const QUESTIONNAIRE_IDS = [
  'sdq_p_3_4',
  'sdq_4_17',
  'sdq_autoavaliacao_4_17',
  'sdq_prof',
  'cbcl_18m_5',
  'cbcl',
  'ctrf_18m_5',
  'trf',
  'ysr',
  'conners_pais',
  'conners_professores',
  'conners_pre_escolar',
  'conners_idade_escolar_pais',
  'scared_crianca',
  'scared_pais',
  'adexi_self',
  'adexi_other',
  'brief_pre_escolar',
  'brief_idade_escolar_pais',
  'rcmas',
  'chexi',
  'diva',
  'iep',
  'psvc',
  'fssr',
  'm_chat',
  'inventario_estereotipias',
  'cars',
  'obq_44',
  'cdi',
  'edah',
] as const

export type QuestionnaireItem = {
  id: string
  text: string
  options?: string[]
  inputType?: 'text' | 'textarea'
}

export type QuestionnaireDefinition = {
  id: string
  title: string
  description: string
  instructions: string
  respondent?: string
  responseType: string
  responseLabels?: string[]
  items: QuestionnaireItem[]
}

export function isQuestionnaireId(formId: string): boolean {
  return (QUESTIONNAIRE_IDS as readonly string[]).includes(formId)
}
