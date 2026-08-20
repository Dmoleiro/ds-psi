import { prisma } from '../lib/prisma.js'
import {
  BANC_EVALUATION_KEYS,
  sanitizeAdditionalMethodSelections,
  sanitizeBancSelections,
  sanitizeQuestionnaireSelections,
  sanitizeWiscSelections,
  WISC_EVALUATION_KEYS,
  ADDITIONAL_METHOD_EVALUATION_KEYS,
  QUESTIONNAIRE_EVALUATION_KEYS,
} from '../lib/patientEvaluations.js'
import { sanitizeWiscResults } from '../lib/wiscResults.js'

export function formatPatientEvaluationSelections(patient: {
  wiscSelections: unknown
  wiscResults?: unknown
  bancSelections: unknown
  additionalMethodSelections?: unknown
  questionnaireSelections?: unknown
}) {
  return {
    wiscSelections: sanitizeWiscSelections(patient.wiscSelections),
    wiscResults: sanitizeWiscResults(patient.wiscResults),
    bancSelections: sanitizeBancSelections(patient.bancSelections),
    additionalMethodSelections: sanitizeAdditionalMethodSelections(patient.additionalMethodSelections),
    questionnaireSelections: sanitizeQuestionnaireSelections(patient.questionnaireSelections),
  }
}

export async function updateTherapistPatientEvaluations(
  therapistId: string,
  patientId: string,
  data: {
    wiscSelections: unknown
    wiscResults: unknown
    bancSelections: unknown
    additionalMethodSelections: unknown
    questionnaireSelections: unknown
  },
) {
  const patient = await prisma.patient.findFirst({
    where: { id: patientId, therapistId },
    select: { id: true },
  })
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND')
  }

  const wiscSelections = sanitizeWiscSelections(data.wiscSelections)
  const wiscResults = sanitizeWiscResults(data.wiscResults)
  const bancSelections = sanitizeBancSelections(data.bancSelections)
  const additionalMethodSelections = sanitizeAdditionalMethodSelections(data.additionalMethodSelections)
  const questionnaireSelections = sanitizeQuestionnaireSelections(data.questionnaireSelections)

  const updated = await prisma.patient.update({
    where: { id: patientId },
    data: {
      wiscSelections,
      wiscResults,
      bancSelections,
      additionalMethodSelections,
      questionnaireSelections,
    },
    select: {
      wiscSelections: true,
      wiscResults: true,
      bancSelections: true,
      additionalMethodSelections: true,
      questionnaireSelections: true,
    },
  })

  return formatPatientEvaluationSelections(updated)
}

export {
  WISC_EVALUATION_KEYS,
  BANC_EVALUATION_KEYS,
  ADDITIONAL_METHOD_EVALUATION_KEYS,
  QUESTIONNAIRE_EVALUATION_KEYS,
}
