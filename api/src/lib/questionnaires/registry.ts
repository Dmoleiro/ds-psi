import type { QuestionnaireDefinition } from './types.js'
import { sdqQuestionnaires } from './definitions/sdq.js'
import { rcmasQuestionnaire } from './definitions/rcmas.js'
import { mChatQuestionnaire } from './definitions/mchat.js'
import { adexiChexiQuestionnaires } from './definitions/adexi-chexi.js'
import { obq44Questionnaire } from './definitions/obq44.js'
import { cdiQuestionnaire } from './definitions/cdi.js'
import { iepQuestionnaire } from './definitions/iep.js'
import { edahQuestionnaire } from './definitions/edah.js'
import { briefQuestionnaires } from './definitions/brief.js'
import { scaredQuestionnaires } from './definitions/scared.js'
import { connersQuestionnaires } from './definitions/conners.js'
import { carsQuestionnaire } from './definitions/cars.js'
import { asebaQuestionnaires } from './definitions/aseba.js'
import { psvcQuestionnaire } from './definitions/psvc.js'
import { fssrQuestionnaire } from './definitions/fssr.js'
import { stereotypiesQuestionnaire } from './definitions/stereotypies.js'
import { divaQuestionnaire } from './definitions/diva.js'

const ALL_QUESTIONNAIRES: QuestionnaireDefinition[] = [
  ...sdqQuestionnaires,
  rcmasQuestionnaire,
  mChatQuestionnaire,
  ...adexiChexiQuestionnaires,
  obq44Questionnaire,
  cdiQuestionnaire,
  iepQuestionnaire,
  edahQuestionnaire,
  ...briefQuestionnaires,
  ...scaredQuestionnaires,
  ...connersQuestionnaires,
  carsQuestionnaire,
  ...asebaQuestionnaires,
  psvcQuestionnaire,
  fssrQuestionnaire,
  stereotypiesQuestionnaire,
  divaQuestionnaire,
]

const QUESTIONNAIRE_MAP = new Map(ALL_QUESTIONNAIRES.map((q) => [q.id, q]))

export const QUESTIONNAIRE_IDS = ALL_QUESTIONNAIRES.map((q) => q.id)

export function isQuestionnaireId(formId: string): boolean {
  return QUESTIONNAIRE_MAP.has(formId)
}

export function getQuestionnaireDefinition(formId: string): QuestionnaireDefinition | null {
  return QUESTIONNAIRE_MAP.get(formId) ?? null
}

export function listQuestionnaireDefinitions(): QuestionnaireDefinition[] {
  return ALL_QUESTIONNAIRES
}

export function listQuestionnaireCatalog() {
  return ALL_QUESTIONNAIRES.map((q) => ({
    id: q.id,
    title: q.title,
    description: q.description,
    respondent: q.respondent,
  }))
}
