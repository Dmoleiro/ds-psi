import { z } from 'zod'
import type { QuestionnaireDefinition, ResponseType } from './types.js'
import { QUESTIONNAIRE_NOTES_FIELD } from './types.js'
import { buildInventarioAspergerSchema } from './definitions/inventario_asperger.js'
import { buildAdirSchema } from './definitions/adir.js'
import { getQuestionnaireDefinition, isQuestionnaireId } from './registry.js'

function numericAnswerSchema(responseType: ResponseType) {
  switch (responseType) {
    case 'yes_no':
      return z.union([z.literal(0), z.literal(1)])
    case 'likert3_sdq':
      return z.union([z.literal(0), z.literal(1), z.literal(2)])
    case 'likert4':
    case 'frequency0_3':
      return z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
    case 'likert5':
      return z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])
    case 'likert7':
      return z.union([
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
        z.literal(6),
        z.literal(7),
      ])
    case 'frequency0_2':
      return z.union([z.literal(0), z.literal(1), z.literal(2)])
    case 'rating4':
      return z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
    case 'forced_choice':
      return z.number().int().min(0)
    default:
      return z.number()
  }
}

export function buildQuestionnaireSchema(definition: QuestionnaireDefinition) {
  const itemShape: Record<string, z.ZodTypeAny> = {}
  for (const item of definition.items) {
    if (item.inputType === 'text' || item.inputType === 'textarea') {
      itemShape[item.id] = z.string()
      continue
    }
    if (definition.responseType === 'forced_choice') {
      const max = (item.options?.length ?? 3) - 1
      itemShape[item.id] = z.number().int().min(0).max(max)
    } else {
      itemShape[item.id] = numericAnswerSchema(definition.responseType)
    }
  }
  return z
    .object({
      ...itemShape,
      [QUESTIONNAIRE_NOTES_FIELD]: z.string().optional(),
    })
    .strict()
}

export function getQuestionnaireFormSchema(formId: string) {
  if (formId === 'inventario_asperger') return buildInventarioAspergerSchema()
  if (formId === 'adir') return buildAdirSchema()
  if (!isQuestionnaireId(formId)) return null
  const definition = getQuestionnaireDefinition(formId)
  if (!definition) return null
  return buildQuestionnaireSchema(definition)
}

export function getQuestionnaireDefinitionForClient(formId: string) {
  const definition = getQuestionnaireDefinition(formId)
  if (!definition) return null
  return {
    id: definition.id,
    title: definition.title,
    description: definition.description,
    instructions: definition.instructions,
    respondent: definition.respondent,
    responseType: definition.responseType,
    responseLabels: definition.responseLabels,
    items: definition.items,
    ...(definition.meta ? { meta: definition.meta } : {}),
  }
}
