import { prisma } from '../lib/prisma.js'
import {
  mergeDeliveredFormIds,
  sanitizeDeliveredFormIds,
  setFormDelivered,
} from '../lib/deliveredForms.js'

export async function markPatientFormsDelivered(patientId: string, formIds: string[]) {
  if (formIds.length === 0) return

  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    select: { deliveredFormIds: true },
  })
  if (!patient) return

  const deliveredFormIds = mergeDeliveredFormIds(
    sanitizeDeliveredFormIds(patient.deliveredFormIds),
    formIds,
  )

  await prisma.patient.update({
    where: { id: patientId },
    data: { deliveredFormIds },
  })
}

export async function updateTherapistPatientFormDelivery(
  therapistId: string,
  patientId: string,
  formId: string,
  delivered: boolean,
) {
  const patient = await prisma.patient.findFirst({
    where: { id: patientId, therapistId },
    select: { id: true, deliveredFormIds: true },
  })
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND')
  }

  const definition = await prisma.formDefinition.findFirst({
    where: { id: formId.trim(), active: true },
    select: { id: true },
  })
  if (!definition) {
    throw new Error('FORM_NOT_FOUND')
  }

  const deliveredFormIds = setFormDelivered(
    sanitizeDeliveredFormIds(patient.deliveredFormIds),
    definition.id,
    delivered,
  )

  const updated = await prisma.patient.update({
    where: { id: patientId },
    data: { deliveredFormIds },
    select: { deliveredFormIds: true },
  })

  return sanitizeDeliveredFormIds(updated.deliveredFormIds)
}
