import { prisma } from '../lib/prisma.js'
import { assertCoordinatorHasTherapist } from './coordinatorTherapists.js'
import { formatPatientSummary } from './sessions.js'
import { formatPatientEvaluationSelections } from './patientEvaluations.js'

const patientListInclude = {
  location: { select: { id: true, name: true } },
  therapist: { select: { id: true, name: true } },
  intakeSessions: {
    select: { id: true, status: true, createdAt: true, completedAt: true },
    orderBy: { createdAt: 'desc' as const },
    take: 1,
  },
} as const

const patientDetailInclude = {
  therapist: { select: { id: true, name: true } },
  location: { select: { id: true, name: true } },
  intakeSessions: {
    include: {
      forms: {
        include: { definition: true, submission: true },
        orderBy: { sortOrder: 'asc' as const },
      },
    },
    orderBy: { createdAt: 'desc' as const },
  },
} as const

export async function listCoordinatorPatients(coordinatorId: string, therapistId: string) {
  await assertCoordinatorHasTherapist(coordinatorId, therapistId)

  const patients = await prisma.patient.findMany({
    where: { therapistId },
    orderBy: { fullName: 'asc' },
    include: patientListInclude,
  })

  return patients.map((patient) => ({
    ...formatPatientSummary(patient),
    therapist: patient.therapist,
  }))
}

export async function getCoordinatorPatient(coordinatorId: string, patientId: string) {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: patientDetailInclude,
  })

  if (!patient) return null

  try {
    await assertCoordinatorHasTherapist(coordinatorId, patient.therapistId)
  } catch {
    return null
  }

  return {
    ...formatPatientSummary(patient),
    internalNotes: patient.internalNotes,
    appointmentNotes: patient.appointmentNotes,
    ...formatPatientEvaluationSelections(patient),
    therapist: patient.therapist,
    intakeSessions: patient.intakeSessions.map((session) => ({
      id: session.id,
      status: session.status,
      createdAt: session.createdAt,
      completedAt: session.completedAt,
      expiresAt: session.expiresAt,
      forms: session.forms,
      url: null,
    })),
  }
}

export async function assertCoordinatorPatientAccess(coordinatorId: string, patientId: string) {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    select: { id: true, therapistId: true },
  })
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND')
  }
  await assertCoordinatorHasTherapist(coordinatorId, patient.therapistId)
  return patient
}
