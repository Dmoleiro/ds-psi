import { FormStatus, SessionStatus, type Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { buildPatientUrl, generatePatientToken, hashPatientToken } from '../lib/tokens.js'
import { config, createPatientSchema, createSessionSchema } from '../lib/schemas.js'

type SessionWithUrl = {
  status: SessionStatus
  patientToken: string | null
  expiresAt: Date | null
}

export function getAccessibleSessionUrl(session: SessionWithUrl): string | null {
  if (!session.patientToken) return null
  if (session.status === SessionStatus.completed || session.status === SessionStatus.revoked) {
    return null
  }
  if (session.expiresAt && session.expiresAt < new Date()) {
    return null
  }
  return buildPatientUrl(session.patientToken, config.frontendUrl)
}

type TherapistPatient = Prisma.PatientGetPayload<{
  include: {
    location: { select: { id: true; name: true } }
    intakeSessions: {
      include: {
        forms: {
          include: { definition: true; submission: true }
          orderBy: { sortOrder: 'asc' }
        }
      }
      orderBy: { createdAt: 'desc' }
    }
  }
}>

export function formatTherapistPatient(patient: TherapistPatient) {
  return {
    ...patient,
    intakeSessions: patient.intakeSessions.map((session) => ({
      id: session.id,
      status: session.status,
      createdAt: session.createdAt,
      completedAt: session.completedAt,
      expiresAt: session.expiresAt,
      forms: session.forms,
      url: getAccessibleSessionUrl(session),
    })),
  }
}

export async function completeSessionIfReady(sessionId: string) {
  const forms = await prisma.sessionForm.findMany({ where: { sessionId } })
  const allSubmitted = forms.length > 0 && forms.every((f) => f.status === FormStatus.submitted)
  if (!allSubmitted) return

  await prisma.intakeSession.update({
    where: { id: sessionId },
    data: {
      status: SessionStatus.completed,
      completedAt: new Date(),
      patientToken: null,
    },
  })
}

export async function createPatientSession(
  therapistId: string,
  patientId: string,
  formIds: string[],
  expiresAt?: Date,
) {
  const definitions = await prisma.formDefinition.findMany({
    where: { id: { in: formIds }, active: true },
  })
  if (definitions.length !== formIds.length) {
    throw new Error('INVALID_FORMS')
  }

  const rawToken = generatePatientToken()
  const tokenHash = hashPatientToken(rawToken)

  const session = await prisma.intakeSession.create({
    data: {
      patientId,
      therapistId,
      tokenHash,
      patientToken: rawToken,
      expiresAt,
      forms: {
        create: formIds.map((formId, index) => ({
          formId,
          sortOrder: index,
        })),
      },
    },
    include: {
      forms: {
        include: { definition: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  return {
    session,
    url: buildPatientUrl(rawToken, config.frontendUrl),
    token: rawToken,
  }
}

export function parseCreatePatientInput(body: unknown) {
  return createPatientSchema.safeParse(body)
}

export function parseCreateSessionInput(body: unknown) {
  return createSessionSchema.safeParse(body)
}

export async function getTherapistPatient(therapistId: string, patientId: string) {
  return prisma.patient.findFirst({
    where: { id: patientId, therapistId },
    include: {
      location: { select: { id: true, name: true } },
      intakeSessions: {
        include: {
          forms: {
            include: { definition: true, submission: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

export async function deleteTherapistPatient(therapistId: string, patientId: string) {
  const patient = await prisma.patient.findFirst({
    where: { id: patientId, therapistId },
    select: { id: true },
  })
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND')
  }

  await prisma.patient.delete({ where: { id: patientId } })
}
