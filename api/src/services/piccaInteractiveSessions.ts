import { PiccaInteractiveFormKind, PiccaSessionStatus, type Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { isDailyPiccaInteractiveKind } from '../lib/piccaInteractiveKinds.js'
import { sortPiccaInteractiveFormIds } from '../lib/piccaInteractiveFormIds.js'
import {
  getWeekStartMonday,
  isDayEditable,
  isWeekEditable,
} from '../lib/piccaInteractiveWeek.js'
import { config } from '../lib/schemas.js'
import {
  buildPiccaInteractivePatientUrl,
  generatePatientToken,
  hashPatientToken,
} from '../lib/tokens.js'
import { assertTherapistPiccaEnabled } from './piccaSessions.js'

function asJson(answers: Record<string, unknown>): Prisma.InputJsonValue {
  return answers as Prisma.InputJsonValue
}

function todayIsoLisbon(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Lisbon' }).format(new Date())
}

type InteractiveSessionWithUrl = {
  status: PiccaSessionStatus
  patientToken: string | null
}

export function getAccessiblePiccaInteractiveSessionUrl(session: InteractiveSessionWithUrl): string | null {
  if (!session.patientToken) return null
  if (session.status === PiccaSessionStatus.revoked) return null
  return buildPiccaInteractivePatientUrl(session.patientToken, config.frontendUrl)
}

const sessionFormsInclude = {
  form: true,
} satisfies Prisma.PiccaInteractiveSessionFormInclude

type TherapistInteractivePatient = Prisma.PatientGetPayload<{
  include: {
    piccaInteractiveSessions: {
      include: {
        forms: {
          include: typeof sessionFormsInclude
          orderBy: { sortOrder: 'asc' }
        }
      }
      orderBy: { createdAt: 'desc' }
    }
  }
}>

export function formatPiccaInteractiveSessionSummary(session: {
  id: string
  status: PiccaSessionStatus
  createdAt: Date
  revokedAt: Date | null
  patientToken: string | null
  forms: Array<{
    formId: string
    form: { title: string; kind: PiccaInteractiveFormKind }
  }>
}) {
  return {
    id: session.id,
    status: session.status,
    createdAt: session.createdAt,
    revokedAt: session.revokedAt,
    url: getAccessiblePiccaInteractiveSessionUrl(session),
    forms: session.forms.map((entry) => ({
      formId: entry.formId,
      title: entry.form.title,
      kind: entry.form.kind,
    })),
  }
}

export function formatTherapistPatientWithPiccaInteractive(patient: TherapistInteractivePatient) {
  return {
    piccaInteractiveSessions: patient.piccaInteractiveSessions.map((session) =>
      formatPiccaInteractiveSessionSummary({
        ...session,
        forms: session.forms.map((entry) => ({
          formId: entry.formId,
          form: entry.form,
        })),
      }),
    ),
  }
}

export async function listPiccaInteractiveForms() {
  return prisma.piccaInteractiveForm.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function createPiccaInteractiveSession(
  therapistId: string,
  patientId: string,
  formIds: string[],
) {
  await assertTherapistPiccaEnabled(therapistId)

  const sortedIds = sortPiccaInteractiveFormIds(formIds)
  const definitions = await prisma.piccaInteractiveForm.findMany({
    where: { id: { in: sortedIds }, active: true },
  })
  if (definitions.length !== sortedIds.length) {
    throw new Error('INVALID_FORMS')
  }

  const patient = await prisma.patient.findFirst({
    where: { id: patientId, therapistId },
  })
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND')
  }

  const rawToken = generatePatientToken()
  const tokenHash = hashPatientToken(rawToken)

  const session = await prisma.piccaInteractiveSession.create({
    data: {
      patientId,
      therapistId,
      tokenHash,
      patientToken: rawToken,
      forms: {
        create: sortedIds.map((formId, index) => ({
          formId,
          sortOrder: index,
        })),
      },
    },
    include: {
      forms: { include: sessionFormsInclude, orderBy: { sortOrder: 'asc' } },
    },
  })

  return {
    session,
    url: buildPiccaInteractivePatientUrl(rawToken, config.frontendUrl),
  }
}

export async function revokePiccaInteractiveSession(therapistId: string, sessionId: string) {
  await assertTherapistPiccaEnabled(therapistId)

  const session = await prisma.piccaInteractiveSession.findFirst({
    where: { id: sessionId, therapistId },
  })
  if (!session) {
    throw new Error('SESSION_NOT_FOUND')
  }
  if (session.status === PiccaSessionStatus.revoked) {
    throw new Error('SESSION_ALREADY_REVOKED')
  }

  const updated = await prisma.piccaInteractiveSession.update({
    where: { id: sessionId },
    data: {
      status: PiccaSessionStatus.revoked,
      revokedAt: new Date(),
      patientToken: null,
    },
  })

  return formatPiccaInteractiveSessionSummary({
    ...updated,
    patientToken: null,
    forms: [],
  })
}

export async function deletePiccaInteractiveSession(therapistId: string, sessionId: string) {
  await assertTherapistPiccaEnabled(therapistId)

  const session = await prisma.piccaInteractiveSession.findFirst({
    where: { id: sessionId, therapistId },
    select: { id: true },
  })
  if (!session) {
    throw new Error('SESSION_NOT_FOUND')
  }

  await prisma.piccaInteractiveSession.delete({ where: { id: sessionId } })
}

export async function getPiccaInteractiveEntriesForTherapist(
  therapistId: string,
  sessionId: string,
) {
  await assertTherapistPiccaEnabled(therapistId)

  const session = await prisma.piccaInteractiveSession.findFirst({
    where: { id: sessionId, therapistId },
    include: {
      patient: { select: { id: true, fullName: true } },
      forms: { include: { form: true }, orderBy: { sortOrder: 'asc' } },
      entries: {
        include: { form: true },
        orderBy: [{ formId: 'asc' }, { periodKey: 'desc' }],
      },
    },
  })
  if (!session) return null

  return {
    id: session.id,
    status: session.status,
    patient: session.patient,
    forms: session.forms.map((entry) => ({
      formId: entry.formId,
      title: entry.form.title,
      kind: entry.form.kind,
    })),
    entries: session.entries.map((entry) => ({
      id: entry.id,
      formId: entry.formId,
      formTitle: entry.form.title,
      kind: entry.form.kind,
      periodKey: entry.periodKey,
      answers: entry.answersJson as Record<string, unknown>,
      submittedAt: entry.submittedAt,
      updatedAt: entry.updatedAt,
    })),
  }
}

export async function updatePiccaInteractiveEntryForTherapist(
  therapistId: string,
  sessionId: string,
  entryId: string,
  answers: Record<string, unknown>,
) {
  await assertTherapistPiccaEnabled(therapistId)

  const entry = await prisma.piccaInteractiveEntry.findFirst({
    where: { id: entryId, sessionId, session: { therapistId } },
  })
  if (!entry) {
    throw new Error('ENTRY_NOT_FOUND')
  }

  const updated = await prisma.piccaInteractiveEntry.update({
    where: { id: entryId },
    data: { answersJson: asJson(answers) },
  })

  return {
    id: updated.id,
    answers: updated.answersJson as Record<string, unknown>,
    updatedAt: updated.updatedAt,
  }
}

async function getSessionFormOrThrow(sessionId: string, formId: string) {
  const sessionForm = await prisma.piccaInteractiveSessionForm.findFirst({
    where: { sessionId, formId },
    include: { form: true, session: true },
  })
  if (!sessionForm) {
    throw new Error('FORM_NOT_FOUND')
  }
  return sessionForm
}

export async function getPiccaInteractivePatientForm(
  sessionId: string,
  formId: string,
  periodKey?: string,
) {
  const sessionForm = await getSessionFormOrThrow(sessionId, formId)
  const today = todayIsoLisbon()
  const resolvedPeriodKey =
    periodKey ??
    (isDailyPiccaInteractiveKind(sessionForm.form.kind)
      ? today
      : getWeekStartMonday(today))

  const entry = await prisma.piccaInteractiveEntry.findUnique({
    where: {
      sessionId_formId_periodKey: {
        sessionId,
        formId,
        periodKey: resolvedPeriodKey,
      },
    },
  })

  const readOnly = isDailyPiccaInteractiveKind(sessionForm.form.kind)
    ? !isDayEditable(resolvedPeriodKey, today)
    : !isWeekEditable(resolvedPeriodKey, today)

  return {
    formId: sessionForm.formId,
    title: sessionForm.form.title,
    kind: sessionForm.form.kind,
    periodKey: resolvedPeriodKey,
    weekStart: isDailyPiccaInteractiveKind(sessionForm.form.kind)
      ? getWeekStartMonday(resolvedPeriodKey)
      : resolvedPeriodKey,
    readOnly,
    answers: (entry?.answersJson as Record<string, unknown> | undefined) ?? {},
    submittedAt: entry?.submittedAt ?? null,
  }
}

export async function listPiccaInteractivePatientWeekEntries(
  sessionId: string,
  formId: string,
  weekStart: string,
) {
  const sessionForm = await getSessionFormOrThrow(sessionId, formId)
  if (!isDailyPiccaInteractiveKind(sessionForm.form.kind)) {
    throw new Error('INVALID_FORM_KIND')
  }

  const entries = await prisma.piccaInteractiveEntry.findMany({
    where: {
      sessionId,
      formId,
      periodKey: { gte: weekStart, lte: addDaysIso(weekStart, 6) },
    },
    orderBy: { periodKey: 'asc' },
  })

  return entries.map((entry) => ({
    periodKey: entry.periodKey,
    answers: entry.answersJson as Record<string, unknown>,
    submittedAt: entry.submittedAt,
    updatedAt: entry.updatedAt,
  }))
}

function addDaysIso(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const next = new Date(year, month - 1, day + days)
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`
}

export async function savePiccaInteractivePatientEntry(
  sessionId: string,
  formId: string,
  periodKey: string,
  answers: Record<string, unknown>,
) {
  const sessionForm = await getSessionFormOrThrow(sessionId, formId)
  const today = todayIsoLisbon()

  if (isDailyPiccaInteractiveKind(sessionForm.form.kind)) {
    if (!isDayEditable(periodKey, today)) {
      throw new Error('ENTRY_NOT_EDITABLE')
    }
  } else if (!isWeekEditable(periodKey, today)) {
    throw new Error('ENTRY_NOT_EDITABLE')
  }

  const entry = await prisma.piccaInteractiveEntry.upsert({
    where: {
      sessionId_formId_periodKey: {
        sessionId,
        formId,
        periodKey,
      },
    },
    create: {
      sessionId,
      formId,
      periodKey,
      answersJson: asJson(answers),
    },
    update: {
      answersJson: asJson(answers),
    },
  })

  return {
    id: entry.id,
    periodKey: entry.periodKey,
    submittedAt: entry.submittedAt,
    updatedAt: entry.updatedAt,
  }
}
