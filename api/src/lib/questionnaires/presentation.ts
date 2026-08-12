import type { FormattedField } from '../formPresentation.js'
import { QUESTIONNAIRE_NOTES_FIELD, RESPONSE_LABELS, isOneBasedResponseType } from './types.js'
import type { ResponseType } from './types.js'
import { getQuestionnaireDefinition } from './registry.js'

function labelForStoredValue(
  responseType: ResponseType,
  value: number,
  labels: string[],
): string | null {
  const index = isOneBasedResponseType(responseType) ? value - 1 : value
  if (index >= 0 && index < labels.length) return labels[index] ?? null
  return null
}

function formatAnswerValue(
  formId: string,
  itemId: string,
  value: unknown,
  itemOptions?: string[],
): string {
  const definition = getQuestionnaireDefinition(formId)
  if (!definition) return String(value ?? '')

  if (definition.responseType === 'forced_choice' && itemOptions?.length) {
    const index = typeof value === 'number' ? value : Number(value)
    return itemOptions[index] ?? String(value ?? '')
  }

  const labels = definition.responseLabels ?? RESPONSE_LABELS[definition.responseType]
  const numeric = typeof value === 'number' ? value : Number(value)
  if (Number.isFinite(numeric)) {
    const label = labelForStoredValue(definition.responseType, numeric, labels)
    if (label !== null) return label
  }
  if (value === 1 || value === true) return 'Sim'
  if (value === 0 || value === false) return 'Não'
  return String(value ?? '')
}

export function formatQuestionnaireAnswers(
  formId: string,
  answers: Record<string, unknown>,
): FormattedField[] {
  const definition = getQuestionnaireDefinition(formId)
  if (!definition) return []

  const fields: FormattedField[] = []
  for (const item of definition.items) {
    const value = answers[item.id]
    if (value === undefined || value === null || value === '') continue
    if (item.inputType === 'text' || item.inputType === 'textarea') {
      fields.push({
        key: item.id,
        label: item.text,
        value: String(value),
      })
      continue
    }
    fields.push({
      key: item.id,
      label: item.text,
      value: formatAnswerValue(formId, item.id, value, item.options),
    })
  }

  const notes = answers[QUESTIONNAIRE_NOTES_FIELD]
  if (typeof notes === 'string' && notes.trim() !== '') {
    fields.push({
      key: QUESTIONNAIRE_NOTES_FIELD,
      label: 'Notas',
      value: notes.trim(),
    })
  }

  const scores = answers._scores
  if (scores && typeof scores === 'object' && !Array.isArray(scores)) {
    for (const [key, score] of Object.entries(scores as Record<string, unknown>)) {
      if (typeof score === 'number') {
        fields.push({
          key: `_score_${key}`,
          label: `Pontuação — ${key}`,
          value: String(score),
        })
      }
    }
  }

  return fields
}
