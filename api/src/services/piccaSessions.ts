import { FormStatus, PiccaEditedBy, PiccaSessionStatus, type Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import {
  canPatientAccessPiccaModule,
  isPiccaModuleReadOnly,
} from '../lib/piccaAccess.js'
import { sortPiccaModuleIds } from '../lib/piccaModuleIds.js'
import { buildPiccaPatientUrl, generatePatientToken, hashPatientToken } from '../lib/tokens.js'
import { config } from '../lib/schemas.js'

function asJson(answers: Record<string, unknown>): Prisma.InputJsonValue {
  return answers as Prisma.InputJsonValue
}

type PiccaSessionWithUrl = {
  status: PiccaSessionStatus
  patientToken: string | null
}

export function getAccessiblePiccaSessionUrl(session: PiccaSessionWithUrl): string | null {
  if (!session.patientToken) return null
  if (session.status === PiccaSessionStatus.revoked) return null
  return buildPiccaPatientUrl(session.patientToken, config.frontendUrl)
}

const sessionModulesInclude = {
  module: true,
  draft: true,
  submission: true,
} satisfies Prisma.PiccaSessionModuleInclude

type TherapistPiccaPatient = Prisma.PatientGetPayload<{
  include: {
    location: { select: { id: true; name: true } }
    piccaSessions: {
      include: {
        modules: {
          include: typeof sessionModulesInclude
          orderBy: { sortOrder: 'asc' }
        }
      }
      orderBy: { createdAt: 'desc' }
    }
  }
}>

export function formatPiccaSessionSummary(session: {
  id: string
  status: PiccaSessionStatus
  createdAt: Date
  revokedAt: Date | null
  patientToken: string | null
  modules: Array<{
    moduleId: string
    status: FormStatus
    module: { title: string; volume: number; moduleNumber: number }
  }>
}) {
  return {
    id: session.id,
    status: session.status,
    createdAt: session.createdAt,
    revokedAt: session.revokedAt,
    url: getAccessiblePiccaSessionUrl(session),
    modules: session.modules.map((m) => ({
      moduleId: m.moduleId,
      title: m.module.title,
      status: m.status,
      volume: m.module.volume,
      moduleNumber: m.module.moduleNumber,
    })),
  }
}

export function formatTherapistPatientWithPicca(patient: TherapistPiccaPatient) {
  return {
    piccaSessions: patient.piccaSessions.map((session) =>
      formatPiccaSessionSummary({
        ...session,
        modules: session.modules.map((m) => ({
          moduleId: m.moduleId,
          status: m.status,
          module: m.module,
        })),
      }),
    ),
  }
}

export async function assertTherapistPiccaEnabled(therapistId: string) {
  const user = await prisma.user.findUnique({
    where: { id: therapistId },
    select: { piccaEnabled: true },
  })
  if (!user?.piccaEnabled) {
    throw new Error('PICCA_DISABLED')
  }
}

export async function listPiccaModules() {
  return prisma.piccaModule.findMany({
    where: { active: true },
    orderBy: [{ volume: 'asc' }, { sortOrder: 'asc' }],
  })
}

export async function createPiccaSession(
  therapistId: string,
  patientId: string,
  moduleIds: string[],
) {
  await assertTherapistPiccaEnabled(therapistId)

  const sortedIds = sortPiccaModuleIds(moduleIds)
  const definitions = await prisma.piccaModule.findMany({
    where: { id: { in: sortedIds }, active: true },
  })
  if (definitions.length !== sortedIds.length) {
    throw new Error('INVALID_MODULES')
  }

  const patient = await prisma.patient.findFirst({
    where: { id: patientId, therapistId },
    select: { id: true },
  })
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND')
  }

  const rawToken = generatePatientToken()
  const tokenHash = hashPatientToken(rawToken)

  const session = await prisma.piccaSession.create({
    data: {
      patientId,
      therapistId,
      tokenHash,
      patientToken: rawToken,
      modules: {
        create: sortedIds.map((moduleId, index) => ({
          moduleId,
          sortOrder: index,
        })),
      },
    },
    include: {
      modules: {
        include: sessionModulesInclude,
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  return {
    session,
    url: buildPiccaPatientUrl(rawToken, config.frontendUrl),
    token: rawToken,
  }
}

export async function revokePiccaSession(therapistId: string, sessionId: string) {
  const session = await prisma.piccaSession.findFirst({
    where: { id: sessionId, therapistId },
  })
  if (!session) {
    throw new Error('SESSION_NOT_FOUND')
  }
  if (session.status === PiccaSessionStatus.revoked) {
    throw new Error('SESSION_ALREADY_REVOKED')
  }

  return prisma.piccaSession.update({
    where: { id: sessionId },
    data: {
      status: PiccaSessionStatus.revoked,
      patientToken: null,
      revokedAt: new Date(),
    },
  })
}

export async function getPiccaSessionForTherapist(therapistId: string, sessionId: string) {
  return prisma.piccaSession.findFirst({
    where: { id: sessionId, therapistId },
    include: {
      patient: {
        select: {
          id: true,
          fullName: true,
          location: { select: { name: true } },
        },
      },
      modules: {
        include: sessionModulesInclude,
        orderBy: { sortOrder: 'asc' },
      },
    },
  })
}

export async function getPiccaSubmissionsForTherapist(therapistId: string, sessionId: string) {
  const session = await getPiccaSessionForTherapist(therapistId, sessionId)
  if (!session) return null

  return {
    id: session.id,
    status: session.status,
    patient: session.patient,
    location: session.patient.location,
    modules: session.modules
      .filter((m) => m.submission)
      .map((m) => ({
        moduleId: m.moduleId,
        title: m.module.title,
        volume: m.module.volume,
        moduleNumber: m.module.moduleNumber,
        submittedAt: m.submission!.submittedAt,
        answers: m.submission!.answersJson as Record<string, unknown>,
      })),
  }
}

export async function updatePiccaModuleAnswers(
  therapistId: string,
  sessionId: string,
  moduleId: string,
  answers: Record<string, unknown>,
) {
  await assertTherapistPiccaEnabled(therapistId)

  const sessionModule = await prisma.piccaSessionModule.findFirst({
    where: {
      sessionId,
      moduleId,
      session: { therapistId },
    },
    include: { submission: true },
  })
  if (!sessionModule) {
    throw new Error('MODULE_NOT_FOUND')
  }

  if (sessionModule.submission) {
    await prisma.piccaModuleSubmission.update({
      where: { sessionModuleId: sessionModule.id },
      data: {
        answersJson: asJson(answers),
        lastEditedAt: new Date(),
        lastEditedBy: PiccaEditedBy.therapist,
      },
    })
    return { status: FormStatus.submitted }
  }

  await prisma.$transaction([
    prisma.piccaModuleDraft.upsert({
      where: { sessionModuleId: sessionModule.id },
      create: {
        sessionModuleId: sessionModule.id,
        answersJson: asJson(answers),
        lastEditedBy: PiccaEditedBy.therapist,
      },
      update: {
        answersJson: asJson(answers),
        lastEditedBy: PiccaEditedBy.therapist,
      },
    }),
    prisma.piccaSessionModule.update({
      where: { id: sessionModule.id },
      data: {
        status:
          sessionModule.status === FormStatus.not_started
            ? FormStatus.in_progress
            : sessionModule.status,
      },
    }),
    prisma.piccaSession.updateMany({
      where: {
        id: sessionId,
        status: PiccaSessionStatus.active,
      },
      data: { status: PiccaSessionStatus.in_progress },
    }),
  ])

  return { status: FormStatus.in_progress }
}

export function assertPatientCanAccessModule(
  modules: Array<{ status: FormStatus }>,
  moduleIndex: number,
) {
  if (!canPatientAccessPiccaModule(modules, moduleIndex)) {
    throw new Error('MODULE_LOCKED')
  }
}

export function getPatientModuleReadOnly(
  modules: Array<{ status: FormStatus }>,
  moduleIndex: number,
) {
  return isPiccaModuleReadOnly(modules, moduleIndex)
}

export async function savePiccaPatientDraft(
  sessionModuleId: string,
  answers: Record<string, unknown>,
) {
  await prisma.$transaction([
    prisma.piccaModuleDraft.upsert({
      where: { sessionModuleId },
      create: {
        sessionModuleId,
        answersJson: asJson(answers),
        lastEditedBy: PiccaEditedBy.patient,
      },
      update: {
        answersJson: asJson(answers),
        lastEditedBy: PiccaEditedBy.patient,
      },
    }),
    prisma.piccaSessionModule.update({
      where: { id: sessionModuleId },
      data: { status: FormStatus.in_progress },
    }),
  ])
}

export async function submitPiccaPatientModule(
  sessionModuleId: string,
  sessionId: string,
  answers: Record<string, unknown>,
) {
  await prisma.$transaction([
    prisma.piccaModuleSubmission.upsert({
      where: { sessionModuleId },
      create: {
        sessionModuleId,
        answersJson: asJson(answers),
        submittedBy: PiccaEditedBy.patient,
      },
      update: {
        answersJson: asJson(answers),
        submittedBy: PiccaEditedBy.patient,
        lastEditedAt: new Date(),
        lastEditedBy: PiccaEditedBy.patient,
      },
    }),
    prisma.piccaModuleDraft.deleteMany({ where: { sessionModuleId } }),
    prisma.piccaSessionModule.update({
      where: { id: sessionModuleId },
      data: { status: FormStatus.submitted },
    }),
    prisma.piccaSession.updateMany({
      where: {
        id: sessionId,
        status: PiccaSessionStatus.active,
      },
      data: { status: PiccaSessionStatus.in_progress },
    }),
  ])
}
