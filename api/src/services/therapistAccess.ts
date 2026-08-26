import { UserRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { assertInternHasSupervisor } from './therapistSupervisors.js'

export async function getTherapistActor(actorId: string) {
  const user = await prisma.user.findUnique({
    where: { id: actorId },
    select: { id: true, readOnly: true, role: true, active: true },
  })
  if (!user || user.role !== UserRole.therapist || !user.active) {
    throw new Error('NOT_THERAPIST')
  }
  return user
}

export async function resolveListTherapistId(actorId: string, requestedTherapistId?: string): Promise<string> {
  const user = await getTherapistActor(actorId)

  if (!user.readOnly) {
    if (requestedTherapistId && requestedTherapistId !== actorId) {
      throw new Error('THERAPIST_ACCESS_DENIED')
    }
    return actorId
  }

  if (!requestedTherapistId) {
    throw new Error('THERAPIST_ID_REQUIRED')
  }

  await assertInternHasSupervisor(actorId, requestedTherapistId)
  return requestedTherapistId
}

export async function assertTherapistCanAccessPatient(actorId: string, patientId: string) {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    select: { id: true, therapistId: true },
  })
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND')
  }

  if (patient.therapistId === actorId) {
    await getTherapistActor(actorId)
    return { patientId: patient.id, therapistId: patient.therapistId }
  }

  const user = await getTherapistActor(actorId)
  if (!user.readOnly) {
    throw new Error('PATIENT_NOT_FOUND')
  }

  await assertInternHasSupervisor(actorId, patient.therapistId)
  return { patientId: patient.id, therapistId: patient.therapistId }
}

export async function assertTherapistCanAccessSession(actorId: string, sessionId: string) {
  const session = await prisma.intakeSession.findUnique({
    where: { id: sessionId },
    select: { id: true, therapistId: true, patientId: true },
  })
  if (!session) {
    throw new Error('SESSION_NOT_FOUND')
  }

  const access = await assertTherapistCanAccessPatient(actorId, session.patientId)
  if (session.therapistId !== access.therapistId) {
    throw new Error('SESSION_NOT_FOUND')
  }

  return { sessionId: session.id, therapistId: access.therapistId, patientId: session.patientId }
}
