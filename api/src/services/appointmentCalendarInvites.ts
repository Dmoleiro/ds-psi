import { CalendarInviteStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import {
  buildCalendarUid,
  buildIcsEvent,
  resolveIcsDeliveryForRecipient,
  resolveIcsEmailMethod,
  resolvePatientInviteEmails,
  type IcsEventInput,
  type IcsInviteMethod,
  type IcsRecurrence,
} from '../lib/icalendar.js'
import { isMailConfigured, sendAppointmentCalendarInvite } from '../lib/mail.js'
import { formatAppointmentDate, formatAppointmentTime } from './appointments.js'
import type { AppointmentSeriesScope } from './appointments.js'

export type InviteRecipients = 'email' | 'email2' | 'both'

type InviteContext = {
  allowed: boolean
  enabled: boolean
  recipients: InviteRecipients
  copyToTherapist: boolean
  mailConfigured: boolean
}

type SeriesInviteOptions = {
  exdates?: Date[]
  recurrenceId?: Date
  scheduledAt?: Date
}

const appointmentInviteSelect = {
  id: true,
  therapistId: true,
  scheduledAt: true,
  durationMinutes: true,
  notes: true,
  recurrenceGroupId: true,
  recurrenceCadence: true,
  recurrenceUntil: true,
  calendarUid: true,
  calendarSequence: true,
  calendarInviteStatus: true,
  patient: {
    select: {
      fullName: true,
      email: true,
      email2: true,
    },
  },
  therapist: {
    select: {
      name: true,
      email: true,
      appointmentInvitesAllowed: true,
      appointmentInvitesEnabled: true,
      appointmentInviteRecipients: true,
      appointmentInviteCopyToTherapist: true,
    },
  },
  location: {
    select: {
      name: true,
      address: true,
    },
  },
  gabinete: {
    select: {
      name: true,
    },
  },
} as const

type AppointmentInviteRecord = {
  id: string
  therapistId: string
  scheduledAt: Date
  durationMinutes: number
  notes: string | null
  recurrenceGroupId: string | null
  recurrenceCadence: string | null
  recurrenceUntil: string | null
  calendarUid: string | null
  calendarSequence: number
  calendarInviteStatus: CalendarInviteStatus
  patient: {
    fullName: string
    email: string | null
    email2: string | null
  }
  therapist: {
    name: string
    email: string
    appointmentInvitesAllowed: boolean
    appointmentInvitesEnabled: boolean
    appointmentInviteRecipients: string
    appointmentInviteCopyToTherapist: boolean
  }
  location: {
    name: string
    address: string | null
  }
  gabinete: {
    name: string
  }
}

async function getInviteContext(therapistId: string): Promise<InviteContext | null> {
  const therapist = await prisma.user.findFirst({
    where: { id: therapistId, role: 'therapist' },
    select: {
      appointmentInvitesAllowed: true,
      appointmentInvitesEnabled: true,
      appointmentInviteRecipients: true,
      appointmentInviteCopyToTherapist: true,
    },
  })
  if (!therapist) return null

  return {
    allowed: therapist.appointmentInvitesAllowed,
    enabled: therapist.appointmentInvitesEnabled,
    recipients: therapist.appointmentInviteRecipients as InviteRecipients,
    copyToTherapist: therapist.appointmentInviteCopyToTherapist,
    mailConfigured: isMailConfigured(),
  }
}

function buildLocationLabel(
  location: { name: string; address: string | null },
  gabinete: { name: string },
) {
  const parts = [location.name, gabinete.name]
  if (location.address?.trim()) parts.push(location.address.trim())
  return parts.join(' · ')
}

function buildInviteSummary(patientName: string, recurring = false) {
  return recurring ? `Consulta (série) — ${patientName}` : `Consulta — ${patientName}`
}

function buildInviteDescription(
  appointment: {
    notes: string | null
    scheduledAt: Date
    durationMinutes: number
    location: { name: string }
    gabinete: { name: string }
  },
  patientName: string,
  recurrence?: IcsRecurrence | null,
) {
  const date = formatAppointmentDate(appointment.scheduledAt)
  const time = formatAppointmentTime(appointment.scheduledAt)
  const lines = [
    `Consulta com ${patientName}`,
    recurrence
      ? `Série recorrente a partir de ${date} às ${time}`
      : `Data: ${date} às ${time}`,
    `Duração: ${appointment.durationMinutes} minutos`,
    `Local: ${appointment.location.name} · ${appointment.gabinete.name}`,
  ]
  if (recurrence) {
    lines.push(`Repetição até ${recurrence.until}`)
  }
  if (appointment.notes?.trim()) {
    lines.push('', appointment.notes.trim())
  }
  return lines.join('\n')
}

function resolveSeriesRecurrence(appointment: AppointmentInviteRecord): IcsRecurrence | null {
  if (!appointment.recurrenceCadence || !appointment.recurrenceUntil) return null
  return {
    cadence: appointment.recurrenceCadence as IcsRecurrence['cadence'],
    until: appointment.recurrenceUntil,
  }
}

function resolveInviteRecipients(
  appointment: AppointmentInviteRecord,
  context: InviteContext,
): Array<{ name: string; email: string }> {
  const patientEmails = resolvePatientInviteEmails(appointment.patient, context.recipients)
  const recipients: Array<{ name: string; email: string }> = patientEmails.map((email) => ({
    name: appointment.patient.fullName,
    email,
  }))

  if (context.copyToTherapist) {
    recipients.push({
      name: appointment.therapist.name,
      email: appointment.therapist.email,
    })
  }

  return [...new Map(recipients.map((entry) => [entry.email, entry])).values()]
}

async function getSeriesAppointments(recurrenceGroupId: string) {
  return prisma.appointment.findMany({
    where: { recurrenceGroupId },
    select: appointmentInviteSelect,
    orderBy: { scheduledAt: 'asc' },
  })
}

async function getSeriesAnchor(recurrenceGroupId: string) {
  const appointments = await getSeriesAppointments(recurrenceGroupId)
  return appointments[0] ?? null
}

async function ensureSeriesCalendarUid(recurrenceGroupId: string, anchorId: string) {
  const existing = await prisma.appointment.findFirst({
    where: { recurrenceGroupId, calendarUid: { not: null } },
    select: { calendarUid: true },
  })
  if (existing?.calendarUid) return existing.calendarUid

  const calendarUid = buildCalendarUid(recurrenceGroupId)
  await prisma.appointment.update({
    where: { id: anchorId },
    data: { calendarUid },
  })
  return calendarUid
}

async function ensureCalendarUid(appointmentId: string, existingUid: string | null) {
  if (existingUid) return existingUid
  const calendarUid = buildCalendarUid(appointmentId)
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { calendarUid },
  })
  return calendarUid
}

async function markSeriesInvitePending(recurrenceGroupId: string) {
  await prisma.appointment.updateMany({
    where: { recurrenceGroupId },
    data: {
      calendarInviteStatus: CalendarInviteStatus.pending,
      calendarInviteError: null,
    },
  })
}

async function markSeriesInviteSuccess(recurrenceGroupId: string, sequence: number) {
  await prisma.appointment.updateMany({
    where: { recurrenceGroupId },
    data: {
      calendarSequence: sequence,
      calendarInviteStatus: CalendarInviteStatus.sent,
      calendarInvitedAt: new Date(),
      calendarInviteError: null,
    },
  })
}

async function markSeriesInviteFailed(recurrenceGroupId: string, error: unknown) {
  const message =
    error instanceof Error ? error.message.slice(0, 240) : 'Não foi possível enviar o convite'
  await prisma.appointment.updateMany({
    where: { recurrenceGroupId },
    data: {
      calendarInviteStatus: CalendarInviteStatus.failed,
      calendarInviteError: message,
    },
  })
}

async function markSeriesInviteCancelled(recurrenceGroupId: string) {
  await prisma.appointment.updateMany({
    where: { recurrenceGroupId },
    data: {
      calendarInviteStatus: CalendarInviteStatus.cancelled,
      calendarInviteError: null,
    },
  })
}

async function markSeriesInviteNotSent(recurrenceGroupId: string) {
  await prisma.appointment.updateMany({
    where: { recurrenceGroupId },
    data: {
      calendarInviteStatus: CalendarInviteStatus.not_sent,
      calendarInviteError: null,
    },
  })
}

async function markInvitePending(appointmentId: string) {
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      calendarInviteStatus: CalendarInviteStatus.pending,
      calendarInviteError: null,
    },
  })
}

async function markInviteSuccess(appointmentId: string, sequence: number) {
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      calendarSequence: sequence,
      calendarInviteStatus: CalendarInviteStatus.sent,
      calendarInvitedAt: new Date(),
      calendarInviteError: null,
    },
  })
}

async function markInviteFailed(appointmentId: string, error: unknown) {
  const message =
    error instanceof Error ? error.message.slice(0, 240) : 'Não foi possível enviar o convite'
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      calendarInviteStatus: CalendarInviteStatus.failed,
      calendarInviteError: message,
    },
  })
}

async function markInviteCancelled(appointmentId: string) {
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      calendarInviteStatus: CalendarInviteStatus.cancelled,
      calendarInviteError: null,
    },
  })
}

function resolveNextSequence(
  method: IcsInviteMethod,
  currentStatus: CalendarInviteStatus,
  currentSequence: number,
  sequenceOverride?: number,
) {
  if (sequenceOverride !== undefined) return sequenceOverride
  if (method === 'CANCEL') return currentSequence
  if (currentStatus === CalendarInviteStatus.sent || currentStatus === CalendarInviteStatus.failed) {
    return currentSequence + 1
  }
  return 0
}

async function deliverInviteEmail(
  appointment: AppointmentInviteRecord,
  method: IcsInviteMethod,
  recipients: Array<{ name: string; email: string }>,
  eventInput: Omit<IcsEventInput, 'attendees' | 'method' | 'delivery'>,
  recurring = false,
) {
  const subjectPrefix = method === 'CANCEL' ? 'Cancelamento' : 'Consulta'
  const subject = recurring
    ? `${subjectPrefix} (série) — ${appointment.patient.fullName}`
    : `${subjectPrefix} — ${appointment.patient.fullName} (${formatAppointmentDate(appointment.scheduledAt)} ${formatAppointmentTime(appointment.scheduledAt)})`
  const text =
    method === 'CANCEL'
      ? recurring
        ? `A série de consultas com ${appointment.patient.fullName} foi cancelada. O ficheiro em anexo remove os eventos do seu calendário.`
        : `A consulta com ${appointment.patient.fullName} foi cancelada. O ficheiro em anexo remove o evento do seu calendário.`
      : recurring
        ? `Série de consultas com ${appointment.patient.fullName}. Abra o anexo para adicionar ou atualizar os eventos no seu calendário.`
        : `Consulta com ${appointment.patient.fullName}. Abra o anexo para adicionar ou atualizar o evento no seu calendário.`

  for (const recipient of recipients) {
    const delivery = resolveIcsDeliveryForRecipient(
      method,
      recipient.email,
      appointment.therapist.email,
    )
    const ics = buildIcsEvent({
      ...eventInput,
      method,
      delivery,
      attendees: delivery === 'import' ? [] : [{ name: recipient.name, email: recipient.email }],
    })

    await sendAppointmentCalendarInvite({
      to: recipient.email,
      toName: recipient.name,
      subject,
      text,
      ics,
      method: resolveIcsEmailMethod(method, delivery),
    })
  }
}

async function sendInviteForSeries(
  recurrenceGroupId: string,
  method: IcsInviteMethod,
  options: SeriesInviteOptions = {},
) {
  const anchor = await getSeriesAnchor(recurrenceGroupId)
  if (!anchor) return

  const context = await getInviteContext(anchor.therapistId)
  if (!context?.allowed || !context.enabled || !context.mailConfigured) {
    await markSeriesInviteNotSent(recurrenceGroupId)
    return
  }

  const recipients = resolveInviteRecipients(anchor, context)
  if (recipients.length === 0) {
    await markSeriesInviteFailed(recurrenceGroupId, new Error('PACIENTE_SEM_EMAIL'))
    return
  }

  const recurrence = resolveSeriesRecurrence(anchor)
  if (!recurrence) {
    await sendInviteForAppointment(anchor.id, method)
    return
  }

  await markSeriesInvitePending(recurrenceGroupId)

  const calendarUid = await ensureSeriesCalendarUid(recurrenceGroupId, anchor.id)
  const sequence = resolveNextSequence(
    method,
    anchor.calendarInviteStatus,
    anchor.calendarSequence,
  )
  const scheduledAt = options.scheduledAt ?? anchor.scheduledAt

  const eventInput = {
    uid: calendarUid,
    sequence,
    summary: buildInviteSummary(anchor.patient.fullName, true),
    description: buildInviteDescription(anchor, anchor.patient.fullName, recurrence),
    location: buildLocationLabel(anchor.location, anchor.gabinete),
    scheduledAt,
    durationMinutes: anchor.durationMinutes,
    organizer: {
      name: anchor.therapist.name,
      email: anchor.therapist.email,
    },
    recurrence,
    recurrenceId: options.recurrenceId,
    exdates: options.exdates,
  }

  try {
    await deliverInviteEmail(anchor, method, recipients, eventInput, true)

    if (method === 'CANCEL') {
      await markSeriesInviteCancelled(recurrenceGroupId)
    } else {
      await markSeriesInviteSuccess(recurrenceGroupId, sequence)
    }
  } catch (error) {
    await markSeriesInviteFailed(recurrenceGroupId, error)
    throw error
  }
}

async function sendInviteForAppointment(
  appointmentId: string,
  method: IcsInviteMethod,
  options: SeriesInviteOptions = {},
) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: appointmentInviteSelect,
  })
  if (!appointment) return

  const isSeriesException = Boolean(options.recurrenceId || options.exdates?.length)

  if (appointment.recurrenceGroupId && !isSeriesException) {
    await sendInviteForSeries(appointment.recurrenceGroupId, method, options)
    return
  }

  const context = await getInviteContext(appointment.therapistId)
  if (!context?.allowed || !context.enabled || !context.mailConfigured) {
    if (appointment.recurrenceGroupId) {
      await markSeriesInviteNotSent(appointment.recurrenceGroupId)
    } else {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          calendarInviteStatus: CalendarInviteStatus.not_sent,
          calendarInviteError: null,
        },
      })
    }
    return
  }

  const recipients = resolveInviteRecipients(appointment, context)
  if (recipients.length === 0) {
    if (appointment.recurrenceGroupId) {
      await markSeriesInviteFailed(appointment.recurrenceGroupId, new Error('PACIENTE_SEM_EMAIL'))
    } else {
      await markInviteFailed(appointmentId, new Error('PACIENTE_SEM_EMAIL'))
    }
    return
  }

  const seriesGroupId = appointment.recurrenceGroupId
  const anchor = seriesGroupId ? await getSeriesAnchor(seriesGroupId) : null
  const recurrence =
    seriesGroupId && anchor && !options.recurrenceId ? resolveSeriesRecurrence(anchor) : null

  if (seriesGroupId) {
    await markSeriesInvitePending(seriesGroupId)
  } else {
    await markInvitePending(appointmentId)
  }

  const calendarUid = seriesGroupId
    ? await ensureSeriesCalendarUid(seriesGroupId, anchor?.id ?? appointmentId)
    : await ensureCalendarUid(appointmentId, appointment.calendarUid)
  const sequenceSource = anchor ?? appointment
  const sequence = resolveNextSequence(
    method,
    sequenceSource.calendarInviteStatus,
    sequenceSource.calendarSequence,
  )
  const scheduledAt = options.scheduledAt ?? appointment.scheduledAt

  const eventInput = {
    uid: calendarUid,
    sequence,
    summary: buildInviteSummary(appointment.patient.fullName, Boolean(recurrence)),
    description: buildInviteDescription(appointment, appointment.patient.fullName, recurrence),
    location: buildLocationLabel(appointment.location, appointment.gabinete),
    scheduledAt,
    durationMinutes: appointment.durationMinutes,
    organizer: {
      name: appointment.therapist.name,
      email: appointment.therapist.email,
    },
    recurrence: recurrence ?? undefined,
    recurrenceId: options.recurrenceId,
    exdates: options.exdates,
  }

  try {
    await deliverInviteEmail(appointment, method, recipients, eventInput, Boolean(recurrence))

    if (method === 'CANCEL') {
      if (seriesGroupId) {
        await markSeriesInviteCancelled(seriesGroupId)
      } else {
        await markInviteCancelled(appointmentId)
      }
    } else if (seriesGroupId) {
      await markSeriesInviteSuccess(seriesGroupId, sequence)
    } else {
      await markInviteSuccess(appointmentId, sequence)
    }
  } catch (error) {
    if (seriesGroupId) {
      await markSeriesInviteFailed(seriesGroupId, error)
    } else {
      await markInviteFailed(appointmentId, error)
    }
    throw error
  }
}

export async function getAppointmentInviteSettings(therapistId: string) {
  const context = await getInviteContext(therapistId)
  return {
    allowed: context?.allowed ?? false,
    configured: context?.mailConfigured ?? false,
    enabled: context?.enabled ?? false,
    inviteRecipients: context?.recipients ?? 'email',
    copyToTherapist: context?.copyToTherapist ?? true,
  }
}

export async function updateAppointmentInviteSettings(
  therapistId: string,
  data: {
    enabled?: boolean
    inviteRecipients?: InviteRecipients
    copyToTherapist?: boolean
  },
) {
  const therapist = await prisma.user.findFirst({
    where: { id: therapistId, role: 'therapist' },
    select: { appointmentInvitesAllowed: true },
  })
  if (!therapist?.appointmentInvitesAllowed) {
    throw new Error('APPOINTMENT_INVITES_NOT_ALLOWED')
  }

  const updated = await prisma.user.update({
    where: { id: therapistId },
    data: {
      appointmentInvitesEnabled: data.enabled,
      appointmentInviteRecipients: data.inviteRecipients,
      appointmentInviteCopyToTherapist: data.copyToTherapist,
    },
    select: {
      appointmentInvitesEnabled: true,
      appointmentInviteRecipients: true,
      appointmentInviteCopyToTherapist: true,
    },
  })

  return {
    enabled: updated.appointmentInvitesEnabled,
    inviteRecipients: updated.appointmentInviteRecipients as InviteRecipients,
    copyToTherapist: updated.appointmentInviteCopyToTherapist,
  }
}

async function dispatchCalendarInvites(appointmentIds: string[], method: IcsInviteMethod) {
  if (appointmentIds.length === 0) return

  const appointments = await prisma.appointment.findMany({
    where: { id: { in: appointmentIds } },
    select: { id: true, recurrenceGroupId: true },
  })

  const processedSeries = new Set<string>()
  for (const appointment of appointments) {
    try {
      if (appointment.recurrenceGroupId) {
        if (processedSeries.has(appointment.recurrenceGroupId)) continue
        processedSeries.add(appointment.recurrenceGroupId)
        await sendInviteForSeries(appointment.recurrenceGroupId, method)
      } else {
        await sendInviteForAppointment(appointment.id, method)
      }
    } catch {
      // Status persisted on the appointment row.
    }
  }
}

export function queueAppointmentCalendarInvites(
  appointmentIds: string[],
  method: IcsInviteMethod,
) {
  if (appointmentIds.length === 0) return
  void dispatchCalendarInvites(appointmentIds, method)
}

export async function sendSeriesOccurrenceException(
  appointmentId: string,
  previousScheduledAt: Date,
  updatedScheduledAt: Date,
) {
  await sendInviteForAppointment(appointmentId, 'REQUEST', {
    recurrenceId: previousScheduledAt,
    scheduledAt: updatedScheduledAt,
  })
}

export async function sendSeriesOccurrenceExdate(
  recurrenceGroupId: string,
  scheduledAt: Date,
) {
  await sendInviteForSeries(recurrenceGroupId, 'REQUEST', {
    exdates: [scheduledAt],
  })
}

type DeletionCancellationJob = {
  appointment: AppointmentInviteRecord
  method: IcsInviteMethod
  recipients: Array<{ name: string; email: string }>
  eventInput: Omit<IcsEventInput, 'attendees' | 'method' | 'delivery'>
  recurring: boolean
}

async function buildStandaloneCancellationJob(
  appointmentId: string,
): Promise<DeletionCancellationJob | null> {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: appointmentInviteSelect,
  })
  if (!appointment || appointment.recurrenceGroupId) return null

  const context = await getInviteContext(appointment.therapistId)
  if (!context?.allowed || !context.enabled || !context.mailConfigured) return null

  const recipients = resolveInviteRecipients(appointment, context)
  if (recipients.length === 0) return null

  const calendarUid = appointment.calendarUid ?? buildCalendarUid(appointment.id)
  const sequence = resolveNextSequence(
    'CANCEL',
    appointment.calendarInviteStatus,
    appointment.calendarSequence,
  )

  return {
    appointment,
    method: 'CANCEL',
    recipients,
    recurring: false,
    eventInput: {
      uid: calendarUid,
      sequence,
      summary: buildInviteSummary(appointment.patient.fullName),
      description: buildInviteDescription(appointment, appointment.patient.fullName),
      location: buildLocationLabel(appointment.location, appointment.gabinete),
      scheduledAt: appointment.scheduledAt,
      durationMinutes: appointment.durationMinutes,
      organizer: {
        name: appointment.therapist.name,
        email: appointment.therapist.email,
      },
    },
  }
}

async function buildSeriesCancellationJob(
  recurrenceGroupId: string,
  method: IcsInviteMethod,
  options: SeriesInviteOptions = {},
): Promise<DeletionCancellationJob | null> {
  const anchor = await getSeriesAnchor(recurrenceGroupId)
  if (!anchor) return null

  const context = await getInviteContext(anchor.therapistId)
  if (!context?.allowed || !context.enabled || !context.mailConfigured) return null

  const recipients = resolveInviteRecipients(anchor, context)
  if (recipients.length === 0) return null

  const recurrence = resolveSeriesRecurrence(anchor)
  if (!recurrence) {
    return buildStandaloneCancellationJob(anchor.id)
  }

  const calendarUid = anchor.calendarUid ?? buildCalendarUid(recurrenceGroupId)
  const sequence = resolveNextSequence(method, anchor.calendarInviteStatus, anchor.calendarSequence)
  const scheduledAt = options.scheduledAt ?? anchor.scheduledAt

  return {
    appointment: anchor,
    method,
    recipients,
    recurring: true,
    eventInput: {
      uid: calendarUid,
      sequence,
      summary: buildInviteSummary(anchor.patient.fullName, true),
      description: buildInviteDescription(anchor, anchor.patient.fullName, recurrence),
      location: buildLocationLabel(anchor.location, anchor.gabinete),
      scheduledAt,
      durationMinutes: anchor.durationMinutes,
      organizer: {
        name: anchor.therapist.name,
        email: anchor.therapist.email,
      },
      recurrence,
      recurrenceId: options.recurrenceId,
      exdates: options.exdates,
    },
  }
}

export async function prepareDeletionCancellationJobs(
  appointments: Array<{
    id: string
    recurrenceGroupId: string | null
    calendarInviteStatus: CalendarInviteStatus
    scheduledAt: Date
  }>,
  scope: AppointmentSeriesScope = 'single',
): Promise<DeletionCancellationJob[]> {
  const sentAppointments = appointments.filter(
    (appointment) => appointment.calendarInviteStatus === CalendarInviteStatus.sent,
  )
  if (sentAppointments.length === 0) return []

  const jobs: DeletionCancellationJob[] = []
  const processedSeries = new Set<string>()

  for (const appointment of sentAppointments) {
    if (appointment.recurrenceGroupId) {
      if (processedSeries.has(appointment.recurrenceGroupId)) continue

      if (scope === 'single') {
        const job = await buildSeriesCancellationJob(appointment.recurrenceGroupId, 'REQUEST', {
          exdates: [appointment.scheduledAt],
        })
        if (job) jobs.push(job)
      } else {
        processedSeries.add(appointment.recurrenceGroupId)
        const job = await buildSeriesCancellationJob(appointment.recurrenceGroupId, 'CANCEL')
        if (job) jobs.push(job)
      }
      continue
    }

    const job = await buildStandaloneCancellationJob(appointment.id)
    if (job) jobs.push(job)
  }

  return jobs
}

export function queueDeletionCancellationInvites(jobs: DeletionCancellationJob[]) {
  if (jobs.length === 0) return

  void (async () => {
    for (const job of jobs) {
      try {
        await deliverInviteEmail(
          job.appointment,
          job.method,
          job.recipients,
          job.eventInput,
          job.recurring,
        )
      } catch {
        // Best effort after the appointment has been deleted.
      }
    }
  })()
}

export async function sendCancellationInvitesBeforeDelete(
  appointments: Array<{
    id: string
    recurrenceGroupId: string | null
    calendarInviteStatus: CalendarInviteStatus
    scheduledAt: Date
  }>,
  scope: AppointmentSeriesScope = 'single',
) {
  const jobs = await prepareDeletionCancellationJobs(appointments, scope)
  queueDeletionCancellationInvites(jobs)
}

export async function retryAppointmentCalendarInvite(therapistId: string, appointmentId: string) {
  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, therapistId },
    select: { calendarInviteStatus: true, recurrenceGroupId: true },
  })
  if (!appointment) {
    throw new Error('APPOINTMENT_NOT_FOUND')
  }

  const method = appointment.calendarInviteStatus === CalendarInviteStatus.cancelled ? 'CANCEL' : 'REQUEST'
  if (appointment.recurrenceGroupId) {
    await sendInviteForSeries(appointment.recurrenceGroupId, method)
  } else {
    await sendInviteForAppointment(appointmentId, method)
  }

  const updated = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: {
      calendarInviteStatus: true,
      calendarInviteError: true,
      calendarInvitedAt: true,
    },
  })

  if (updated?.calendarInviteStatus === CalendarInviteStatus.failed) {
    throw new Error(updated.calendarInviteError ?? 'INVITE_FAILED')
  }

  return updated
}

export function formatCalendarInviteStatusForAppointment<
  T extends {
    calendarInviteStatus: CalendarInviteStatus
    calendarInviteError: string | null
    calendarInvitedAt: Date | null
  },
>(appointment: T) {
  return {
    calendarInviteStatus: appointment.calendarInviteStatus,
    calendarInviteError: appointment.calendarInviteError,
    calendarInvitedAt: appointment.calendarInvitedAt?.toISOString() ?? null,
  }
}

export async function assignCalendarUidIfMissing(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: { calendarUid: true, recurrenceGroupId: true },
  })
  if (!appointment) return

  if (appointment.recurrenceGroupId) {
    const anchor = await getSeriesAnchor(appointment.recurrenceGroupId)
    if (anchor && !anchor.calendarUid) {
      await ensureSeriesCalendarUid(appointment.recurrenceGroupId, anchor.id)
    }
    return
  }

  if (!appointment.calendarUid) {
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { calendarUid: buildCalendarUid(appointmentId) },
    })
  }
}
