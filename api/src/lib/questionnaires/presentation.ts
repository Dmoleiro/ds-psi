import type { FormattedField } from '../formPresentation.js'
import { QUESTIONNAIRE_NOTES_FIELD, RESPONSE_LABELS, isOneBasedResponseType } from './types.js'
import type { ResponseType } from './types.js'
import { getQuestionnaireDefinition } from './registry.js'
import {
  ADIR_CONCERNS_CODES,
  ADIR_IDENTIFICATION,
  ADIR_LOSS_CODES,
  ADIR_RETRO_CODES,
  ADIR_SECTIONS,
  ADIR_TIMEPOINT_LABELS,
  adirFieldId,
} from './definitions/adir.js'
import { VINELAND_SCORE_LABELS } from './vinelandScoring.js'

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

  if (formId === 'inventario_asperger') {
    if (itemId.startsWith('item_')) {
      const labels = definition.responseLabels ?? RESPONSE_LABELS.likert4
      const numeric = typeof value === 'number' ? value : Number(value)
      if (Number.isFinite(numeric) && numeric >= 0 && numeric < labels.length) {
        return labels[numeric] ?? String(value)
      }
    }
    if (itemId.startsWith('comp_') && !itemId.includes('idade')) {
      if (value === 1 || value === true) return 'Sim'
      if (value === 0 || value === false) return 'Não'
    }
    if (itemId === 'id_sexo' && itemOptions?.length) {
      const index = typeof value === 'number' ? value : Number(value)
      return itemOptions[index] ?? String(value ?? '')
    }
  }

  if (formId === 'adir' && itemId === 'id_informador_relacao' && itemOptions?.length) {
    const index = typeof value === 'number' ? value : Number(value)
    return itemOptions[index] ?? String(value ?? '')
  }

  if (formId === 'adir') {
    return formatAdirCodeValue(itemId, value)
  }

  if (formId === 'vineland') {
    if (itemId.endsWith('_sev')) {
      if (value === 'S') return 'S — Severo'
      if (value === 'M') return 'M — Moderado'
    }
    if (value === 2 || value === 1 || value === 0) {
      const labels = definition.responseLabels ?? RESPONSE_LABELS.vineland_item
      const index = value === 2 ? 0 : value === 1 ? 1 : 2
      return labels[index] ?? String(value)
    }
    if (value === 'N' || value === 'D') {
      const labels = definition.responseLabels ?? RESPONSE_LABELS.vineland_item
      return value === 'N' ? labels[3] ?? 'N' : labels[4] ?? 'D'
    }
  }

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

function lookupCodeLabel(
  codes: ReadonlyArray<{ code: number; text: string }>,
  value: number,
): string | null {
  const match = codes.find((entry) => entry.code === value)
  return match ? `${match.code} — ${match.text}` : null
}

function formatAdirCodeValue(itemId: string, value: unknown): string {
  const numeric = typeof value === 'number' ? value : Number(value)
  if (Number.isFinite(numeric)) {
    for (const section of ADIR_SECTIONS) {
      for (const item of section.items) {
        if (item.type === 'concerns') {
          for (const box of ['a', 'b', 'c', 'd'] as const) {
            if (itemId === adirFieldId(item.id, box)) {
              return lookupCodeLabel(ADIR_CONCERNS_CODES, numeric) ?? String(value)
            }
          }
        }
        if (item.type === 'retrospective' && itemId === item.id) {
          return lookupCodeLabel(ADIR_RETRO_CODES, numeric) ?? String(value)
        }
        if (item.type === 'loss' && itemId === adirFieldId(item.id, 'ever')) {
          return lookupCodeLabel(ADIR_LOSS_CODES, numeric) ?? String(value)
        }
        if (item.type === 'coded') {
          for (const tp of item.timepoints ?? ['actual']) {
            if (itemId === adirFieldId(item.id, tp)) {
              return lookupCodeLabel(item.codes ?? [], numeric) ?? String(value)
            }
          }
        }
      }
    }
  }
  return String(value ?? '')
}

function formatAdirAnswers(answers: Record<string, unknown>): FormattedField[] {
  const fields: FormattedField[] = []

  for (const field of ADIR_IDENTIFICATION) {
    const value = answers[field.id]
    if (value === undefined || value === null || value === '') continue
    if (field.inputType === 'choice' && field.options) {
      const index = typeof value === 'number' ? value : Number(value)
      fields.push({ key: field.id, label: field.text, value: field.options[index] ?? String(value) })
    } else {
      fields.push({ key: field.id, label: field.text, value: String(value) })
    }
  }

  for (const section of ADIR_SECTIONS) {
    for (const item of section.items) {
      const baseLabel = `${item.num}. ${item.text}`

      if (item.type === 'concerns') {
        for (const [box, boxLabel] of [
          ['a', 'A'],
          ['b', 'B'],
          ['c', 'C'],
          ['d', 'D'],
        ] as const) {
          const key = adirFieldId(item.id, box)
          const value = answers[key]
          if (value === undefined || value === null || value === '') continue
          fields.push({
            key,
            label: `${baseLabel} — preocupação ${boxLabel}`,
            value: formatAdirCodeValue(key, value),
          })
        }
      } else if (item.type === 'age') {
        const value = answers[item.id]
        if (value !== undefined && value !== null && value !== '') {
          fields.push({ key: item.id, label: `${baseLabel} — idade (meses)`, value: String(value) })
        }
      } else if (item.type === 'retrospective') {
        const value = answers[item.id]
        if (value !== undefined && value !== null && value !== '') {
          fields.push({ key: item.id, label: baseLabel, value: formatAdirCodeValue(item.id, value) })
        }
      } else if (item.type === 'loss') {
        const key = adirFieldId(item.id, 'ever')
        const value = answers[key]
        if (value !== undefined && value !== null && value !== '') {
          fields.push({
            key,
            label: `${baseLabel} — ${ADIR_TIMEPOINT_LABELS.ever}`,
            value: formatAdirCodeValue(key, value),
          })
        }
      } else {
        for (const tp of item.timepoints ?? ['actual']) {
          const key = adirFieldId(item.id, tp)
          const value = answers[key]
          if (value === undefined || value === null || value === '') continue
          const tpLabel = ADIR_TIMEPOINT_LABELS[tp as keyof typeof ADIR_TIMEPOINT_LABELS] ?? tp
          fields.push({
            key,
            label: `${baseLabel} — ${tpLabel}`,
            value: formatAdirCodeValue(key, value),
          })
        }
      }

      const detailKey = adirFieldId(item.id, 'detalhe')
      const detail = answers[detailKey]
      if (typeof detail === 'string' && detail.trim() !== '') {
        fields.push({ key: detailKey, label: `${baseLabel} — detalhes`, value: detail.trim() })
      }
    }
  }

  return fields
}

export function formatQuestionnaireAnswers(
  formId: string,
  answers: Record<string, unknown>,
): FormattedField[] {
  const definition = getQuestionnaireDefinition(formId)
  if (!definition) return []

  if (formId === 'adir') {
    const fields = formatAdirAnswers(answers)
    const notes = answers[QUESTIONNAIRE_NOTES_FIELD]
    if (typeof notes === 'string' && notes.trim() !== '') {
      fields.push({ key: QUESTIONNAIRE_NOTES_FIELD, label: 'Notas', value: notes.trim() })
    }
    return fields
  }

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
    const scoreEntries = scores as Record<string, unknown>
    for (const [key, score] of Object.entries(scoreEntries)) {
      if (typeof score === 'number') {
        let label = `Pontuação — ${key}`
        if (formId === 'vineland') {
          label = VINELAND_SCORE_LABELS[key] ?? label
        }
        fields.push({
          key: `_score_${key}`,
          label,
          value: String(score),
        })
      }
    }
  }

  return fields
}
