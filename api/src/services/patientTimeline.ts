import type { AttendanceStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { formatAppointmentDate, formatAppointmentTime } from './appointments.js'

const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present_unpaid: 'Presente por pagar',
  present_paid: 'Presente pago',
  receipt_issued: 'Recibo passado',
  absent: 'Falta',
}

export type PatientTimelineEventKind =
  | 'appointment_upcoming'
  | 'appointment_past'
  | 'attendance'
  | 'form_submitted'

export type PatientTimelineEvent = {
  id: string
  kind: PatientTimelineEventKind
  occurredAt: string
  title: string
  detail: string | null
  appointmentId: string | null
  attendanceStatus: AttendanceStatus | null
  sessionId: string | null
}

export type PatientTimeline = {
  nextAppointment: PatientTimelineEvent | null
  events: PatientTimelineEvent[]
}

const EVENT_LIMIT = 12

export async function getPatientTimeline(patientId: string, therapistId: string): Promise<PatientTimeline> {
  const patient = await prisma.patient.findFirst({
    where: { id: patientId, therapistId },
    select: { id: true },
  })
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND')
  }

  const now = new Date()

  const [appointments, attendanceRecords, formSubmissions] = await Promise.all([
    prisma.appointment.findMany({
      where: { patientId, therapistId },
      orderBy: { scheduledAt: 'desc' },
      take: 24,
      include: { location: { select: { name: true } } },
    }),
    prisma.attendanceRecord.findMany({
      where: { patientId, therapistId },
      orderBy: { sessionDate: 'desc' },
      take: EVENT_LIMIT,
    }),
    prisma.formSubmission.findMany({
      where: {
        sessionForm: {
          session: { patientId, therapistId },
        },
      },
      orderBy: { submittedAt: 'desc' },
      take: EVENT_LIMIT,
      include: {
        sessionForm: {
          include: {
            definition: { select: { title: true } },
            session: { select: { id: true } },
          },
        },
      },
    }),
  ])

  const appointmentEvents: PatientTimelineEvent[] = appointments.map((appointment) => {
    const isUpcoming = appointment.scheduledAt >= now
    const dateLabel = formatAppointmentDate(appointment.scheduledAt)
    const timeLabel = formatAppointmentTime(appointment.scheduledAt)
    return {
      id: `appointment-${appointment.id}`,
      kind: isUpcoming ? 'appointment_upcoming' : 'appointment_past',
      occurredAt: appointment.scheduledAt.toISOString(),
      title: isUpcoming ? 'Próxima consulta' : 'Consulta',
      detail: `${dateLabel} · ${timeLabel} · ${appointment.location.name}`,
      appointmentId: appointment.id,
      attendanceStatus: null,
      sessionId: null,
    }
  })

  const upcomingAppointments = appointmentEvents
    .filter((event) => event.kind === 'appointment_upcoming')
    .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt))

  const nextAppointment = upcomingAppointments[0] ?? null

  const attendanceEvents: PatientTimelineEvent[] = attendanceRecords.map((record) => ({
    id: `attendance-${record.patientId}-${record.sessionDate.toISOString()}`,
    kind: 'attendance',
    occurredAt: record.sessionDate.toISOString(),
    title: 'Presença',
    detail: ATTENDANCE_STATUS_LABELS[record.status],
    appointmentId: null,
    attendanceStatus: record.status,
    sessionId: null,
  }))

  const formEvents: PatientTimelineEvent[] = formSubmissions.map((submission) => ({
    id: `form-${submission.sessionFormId}`,
    kind: 'form_submitted',
    occurredAt: submission.submittedAt.toISOString(),
    title: 'Formulário submetido',
    detail: submission.sessionForm.definition.title,
    appointmentId: null,
    attendanceStatus: null,
    sessionId: submission.sessionForm.session.id,
  }))

  const events = [...appointmentEvents, ...attendanceEvents, ...formEvents]
    .filter((event) => event.kind !== 'appointment_upcoming')
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, EVENT_LIMIT)

  return { nextAppointment, events }
}
