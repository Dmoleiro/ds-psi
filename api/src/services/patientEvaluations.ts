import { prisma } from '../lib/prisma.js'
import {
  BANC_EVALUATION_KEYS,
  sanitizeBancSelections,
  sanitizeWiscSelections,
  WISC_EVALUATION_KEYS,
} from '../lib/patientEvaluations.js'

export function formatPatientEvaluationSelections(patient: {
  wiscSelections: unknown
  bancSelections: unknown
}) {
  return {
    wiscSelections: sanitizeWiscSelections(patient.wiscSelections),
    bancSelections: sanitizeBancSelections(patient.bancSelections),
  }
}

export async function updateTherapistPatientEvaluations(
  therapistId: string,
  patientId: string,
  data: { wiscSelections: unknown; bancSelections: unknown },
) {
  const patient = await prisma.patient.findFirst({
    where: { id: patientId, therapistId },
    select: { id: true },
  })
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND')
  }

  const wiscSelections = sanitizeWiscSelections(data.wiscSelections)
  const bancSelections = sanitizeBancSelections(data.bancSelections)

  const updated = await prisma.patient.update({
    where: { id: patientId },
    data: {
      wiscSelections,
      bancSelections,
    },
    select: {
      wiscSelections: true,
      bancSelections: true,
    },
  })

  return formatPatientEvaluationSelections(updated)
}

export { WISC_EVALUATION_KEYS, BANC_EVALUATION_KEYS }
