import { FormStatus, SessionStatus, type Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { buildPatientUrl, generatePatientToken, hashPatientToken } from '../lib/tokens.js'
import { config, createPatientSchema, createSessionSchema, updatePatientSchema } from '../lib/schemas.js'
import { decimalToNumber } from './financialSettings.js'

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

export function formatPatientSummary(patient: {
  id: string
  fullName: string
  email: string | null
  email2: string | null
  phone: string | null
  phone2: string | null
  birthDate: Date | null
  createdAt: Date
  sessionFee?: { toString(): string } | null
  location?: { id: string; name: string } | null
  intakeSessions?: Array<{
    id: string
    status: SessionStatus
    createdAt: Date
    completedAt: Date | null
  }>
}) {
  return {
    id: patient.id,
    fullName: patient.fullName,
    email: patient.email,
    email2: patient.email2,
    phone: patient.phone,
    phone2: patient.phone2,
    birthDate: patient.birthDate,
    createdAt: patient.createdAt,
    sessionFee: patient.sessionFee != null ? decimalToNumber(patient.sessionFee) : null,
    location: patient.location ?? undefined,
    intakeSessions: patient.intakeSessions,
  }
}

export function formatTherapistPatient(patient: TherapistPatient) {
  return {
    ...formatPatientSummary(patient),
    internalNotes: patient.internalNotes,
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

export async function deleteTherapistSession(therapistId: string, sessionId: string) {
  const session = await prisma.intakeSession.findFirst({
    where: { id: sessionId, therapistId },
    include: {
      forms: { select: { status: true } },
    },
  })
  if (!session) {
    throw new Error('SESSION_NOT_FOUND')
  }
  if (session.status === SessionStatus.completed) {
    throw new Error('SESSION_COMPLETED')
  }
  const hasSubmissions = session.forms.some((form) => form.status === FormStatus.submitted)
  if (hasSubmissions) {
    throw new Error('SESSION_HAS_SUBMISSIONS')
  }

  await prisma.intakeSession.delete({ where: { id: sessionId } })
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

export function parseUpdatePatientInput(body: unknown) {
  return updatePatientSchema.safeParse(body)
}

export async function updateTherapistPatient(
  therapistId: string,
  patientId: string,
  data: {
    fullName: string
    locationId: string
    email?: string
    email2?: string
    phone?: string
    phone2?: string
    birthDate?: string
    internalNotes?: string
    sessionFee?: number | null
  },
) {
  const patient = await prisma.patient.findFirst({
    where: { id: patientId, therapistId },
    select: { id: true },
  })
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND')
  }

  const location = await prisma.location.findFirst({
    where: { id: data.locationId, active: true },
  })
  if (!location) {
    throw new Error('INVALID_LOCATION')
  }

  const updated = await prisma.patient.update({
    where: { id: patientId },
    data: {
      fullName: data.fullName,
      locationId: data.locationId,
      email: data.email || null,
      email2: data.email2 || null,
      phone: data.phone || null,
      phone2: data.phone2 || null,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      internalNotes: data.internalNotes || null,
      ...(data.sessionFee !== undefined ? { sessionFee: data.sessionFee } : {}),
    },
    include: {
      location: { select: { id: true, name: true } },
    },
  })

  return {
    ...formatPatientSummary(updated),
    internalNotes: updated.internalNotes,
  }
}
