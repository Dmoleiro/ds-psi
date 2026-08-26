import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createReadStream } from 'node:fs'
import { FormCategory, SessionKind, UserRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { hashPassword } from '../lib/password.js'
import { getQuestionnaireDefinitionForClient } from '../lib/questionnaires/schema.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { requireAssessmentResultsEnabled, requireQuestionnairesEnabled, getTherapistFeatureFlags } from '../middleware/therapistPermissions.js'
import {
  createPatientSession,
  deleteTherapistPatient,
  deleteTherapistSession,
  formatPatientSummary,
  formatTherapistPatient,
  getTherapistPatient,
  parseCreatePatientInput,
  parseCreateSessionInput,
  parseSetPatientActiveInput,
  parseUpdatePatientInput,
  setTherapistPatientActive,
  updateTherapistPatient,
} from '../services/sessions.js'
import { updateTherapistPatientFormDelivery } from '../services/patientFormDelivery.js'
import {
  listPatientAttendance,
  listTherapistAttendance,
  upsertPatientAttendance,
} from '../services/attendance.js'
import {
  createTherapistAppointment,
  deleteTherapistAppointment,
  listTherapistAppointments,
  MAX_RECURRING_APPOINTMENTS,
  RoomConflictError,
  listDayRoomOccupancy,
  listLocationDaySchedule,
  updateTherapistAppointment,
} from '../services/appointments.js'
import { listActiveGabinetesForTherapist } from '../services/gabinetes.js'
import { listTherapistLocations, assertTherapistHasLocation } from '../services/therapistLocations.js'
import { attendanceMatrixQuerySchema, attendanceMonthQuerySchema, attendanceUpsertSchema, appointmentBodySchema, appointmentDayQuerySchema, appointmentMonthQuerySchema, appointmentInviteSettingsSchema, createAppointmentBodySchema, deleteAppointmentQuerySchema, createLocationSchema, financialMonthQuerySchema, financialSettingsSchema, financialYearQuerySchema, gabineteListQuerySchema, locationDayScheduleQuerySchema, patientAppointmentNotesSchema, patientEvaluationsSchema, therapistNotepadSchema, therapistAppointmentsQuerySchema, therapistAttendanceMatrixQuerySchema, therapistGabinetesQuerySchema, therapistLocationsQuerySchema, shadowTherapistQuerySchema, updateAppointmentBodySchema, updateLocationSchema, updatePatientFormDeliverySchema, updateTherapistProfileSchema } from '../lib/schemas.js'
import { formatFormAnswers } from '../lib/formPresentation.js'
import { formatSmtpError, sendTestEmail } from '../lib/mail.js'
import { getTherapistDashboard } from '../services/dashboard.js'
import { requireFinancialOverview } from '../middleware/financial.js'
import {
  getTherapistFinancialCharts,
  getTherapistFinancialOverview,
} from '../services/financialOverview.js'
import { getOrCreateFinancialSettings, updateFinancialSettings } from '../services/financialSettings.js'
import { parseDocumentUpload } from '../lib/documentMultipart.js'
import {
  deleteTherapistPatientDocument,
  getDocumentAbsolutePath,
  getTherapistPatientDocument,
  listTherapistPatientDocuments,
  uploadTherapistPatientDocument,
} from '../services/patientDocuments.js'
import { getTherapistNotepad, updateTherapistNotepad } from '../services/therapistNotepad.js'
import { getPatientTimeline } from '../services/patientTimeline.js'
import { updateTherapistPatientEvaluations } from '../services/patientEvaluations.js'
import { updateTherapistPatientAppointmentNotes } from '../services/patientAppointmentNotes.js'
import { applyTherapistPatientFeatureAccess } from '../services/therapistPatientAccess.js'
import {
  getCoordinatorAssessmentPipeline,
  getTherapistAssessmentPipeline,
  updateAssessmentPipelineSchema,
  updateTherapistAssessmentPipeline,
} from '../services/assessmentPipeline.js'
import {
  getAppointmentInviteSettings,
  retryAppointmentCalendarInvite,
  updateAppointmentInviteSettings,
} from '../services/appointmentCalendarInvites.js'
import { requireWriteTherapist } from '../middleware/requireWriteTherapist.js'
import {
  assertTherapistCanAccessPatient,
  assertTherapistCanAccessSession,
  resolveListTherapistId,
} from '../services/therapistAccess.js'
import { listAssignedSupervisors } from '../services/therapistSupervisors.js'

async function resolvePatientTherapistId(
  request: FastifyRequest,
  reply: FastifyReply,
  patientId: string,
): Promise<string | null> {
  try {
    const access = await assertTherapistCanAccessPatient(request.user.sub, patientId)
    return access.therapistId
  } catch (error) {
    if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
      reply.status(404).send({ error: 'Paciente não encontrado' })
      return null
    }
    if (error instanceof Error && error.message === 'THERAPIST_ACCESS_DENIED') {
      reply.status(403).send({ error: 'Sem acesso a este paciente' })
      return null
    }
    throw error
  }
}

async function resolveScopedTherapistId(
  request: FastifyRequest,
  reply: FastifyReply,
  therapistId?: string,
): Promise<string | null> {
  try {
    return await resolveListTherapistId(request.user.sub, therapistId)
  } catch (error) {
    if (error instanceof Error && error.message === 'THERAPIST_ACCESS_DENIED') {
      reply.status(403).send({ error: 'Sem acesso a este terapeuta' })
      return null
    }
    if (error instanceof Error && error.message === 'THERAPIST_ID_REQUIRED') {
      reply.status(400).send({ error: 'Terapeuta obrigatório' })
      return null
    }
    throw error
  }
}

export async function therapistRoutes(app: FastifyInstance) {
  const therapistOnly = [requireAuth, requireRole(UserRole.therapist)]
  const therapistWriteOnly = [...therapistOnly, requireWriteTherapist]
  const therapistFinancialOnly = [...therapistOnly, requireFinancialOverview]

  app.get('/api/therapist/dashboard', { preHandler: therapistOnly }, async (request) => {
    return getTherapistDashboard(request.user.sub)
  })

  app.get('/api/therapist/notepad', { preHandler: therapistOnly }, async (request, reply) => {
    try {
      return await getTherapistNotepad(request.user.sub)
    } catch (error) {
      if (error instanceof Error && error.message === 'THERAPIST_NOT_FOUND') {
        return reply.status(404).send({ error: 'Terapeuta não encontrado' })
      }
      throw error
    }
  })

  app.put('/api/therapist/notepad', { preHandler: therapistWriteOnly }, async (request, reply) => {
    const parsed = therapistNotepadSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    try {
      return await updateTherapistNotepad(request.user.sub, parsed.data.content)
    } catch (error) {
      if (error instanceof Error && error.message === 'THERAPIST_NOT_FOUND') {
        return reply.status(404).send({ error: 'Terapeuta não encontrado' })
      }
      throw error
    }
  })

  app.get('/api/therapist/appointment-invites/settings', { preHandler: therapistOnly }, async (request) => {
    return getAppointmentInviteSettings(request.user.sub)
  })

  app.patch('/api/therapist/appointment-invites/settings', { preHandler: therapistWriteOnly }, async (request, reply) => {
    const parsed = appointmentInviteSettingsSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    try {
      const settings = await updateAppointmentInviteSettings(request.user.sub, parsed.data)
      return { settings }
    } catch (error) {
      if (error instanceof Error && error.message === 'APPOINTMENT_INVITES_NOT_ALLOWED') {
        return reply.status(403).send({ error: 'Convites de calendário não autorizados para este terapeuta' })
      }
      throw error
    }
  })

  app.post(
    '/api/therapist/appointments/:id/calendar-invite/retry',
    { preHandler: therapistWriteOnly },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      try {
        const result = await retryAppointmentCalendarInvite(request.user.sub, id)
        return { ok: true, ...result }
      } catch (error) {
        if (error instanceof Error && error.message === 'APPOINTMENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Consulta não encontrada' })
        }
        if (error instanceof Error) {
          return reply.status(400).send({ error: error.message })
        }
        throw error
      }
    },
  )

  app.get('/api/therapist/profile', { preHandler: therapistOnly }, async (request) => {
    const profile = await prisma.user.findUniqueOrThrow({
      where: { id: request.user.sub },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        financialOverviewEnabled: true,
        piccaEnabled: true,
        questionnairesEnabled: true,
        assessmentResultsEnabled: true,
        appointmentInvitesAllowed: true,
      },
    })
    return { profile }
  })

  app.patch('/api/therapist/profile', { preHandler: therapistOnly }, async (request, reply) => {
    const parsed = updateTherapistProfileSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    const existing = await prisma.user.findUnique({ where: { id: request.user.sub } })
    if (!existing || existing.role !== UserRole.therapist) {
      return reply.status(404).send({ error: 'Perfil não encontrado' })
    }

    if (parsed.data.email !== existing.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email: parsed.data.email } })
      if (emailTaken) {
        return reply.status(409).send({ error: 'Email já registado' })
      }
    }

    const data: { name: string; email: string; phone: string | null; passwordHash?: string } = {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone?.trim() ? parsed.data.phone.trim() : null,
    }
    if (parsed.data.password) {
      data.passwordHash = await hashPassword(parsed.data.password)
    }

    const profile = await prisma.user.update({
      where: { id: existing.id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        financialOverviewEnabled: true,
        piccaEnabled: true,
        questionnairesEnabled: true,
        assessmentResultsEnabled: true,
        appointmentInvitesAllowed: true,
      },
    })

    const token = await reply.jwtSign({
      sub: profile.id,
      email: profile.email,
      role: profile.role,
      name: profile.name,
    })

    return { profile, token, user: profile }
  })

  app.post('/api/therapist/profile/test-email', { preHandler: therapistWriteOnly }, async (request, reply) => {
    const profile = await prisma.user.findUnique({
      where: { id: request.user.sub },
      select: { email: true, name: true, role: true },
    })
    if (!profile || profile.role !== UserRole.therapist) {
      return reply.status(404).send({ error: 'Perfil não encontrado' })
    }

    try {
      await sendTestEmail(profile.email, profile.name)
      return { ok: true, sentTo: profile.email }
    } catch (err) {
      if (err instanceof Error && err.message === 'SMTP_NOT_CONFIGURED') {
        return reply.status(503).send({
          error: 'Envio de email não configurado no servidor. Contacte o administrador.',
        })
      }
      request.log.error({ err }, 'Failed to send test email')
      return reply.status(502).send({
        error: formatSmtpError(err),
      })
    }
  })

  app.get('/api/therapist/shadow-therapists', { preHandler: therapistOnly }, async (request) => {
    const therapists = await listAssignedSupervisors(request.user.sub)
    return { therapists }
  })

  app.get('/api/therapist/patients', { preHandler: therapistOnly }, async (request, reply) => {
    const parsed = shadowTherapistQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
    }

    const therapistId = await resolveScopedTherapistId(request, reply, parsed.data.therapistId)
    if (!therapistId) return

    const patients = await prisma.patient.findMany({
      where: { therapistId },
      orderBy: { fullName: 'asc' },
      include: {
        location: { select: { id: true, name: true } },
        intakeSessions: {
          select: { id: true, status: true, createdAt: true, completedAt: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })
    return { patients: patients.map(formatPatientSummary) }
  })

  app.get('/api/therapist/locations', { preHandler: therapistOnly }, async (request, reply) => {
    const parsed = therapistLocationsQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
    }

    const therapistId = await resolveScopedTherapistId(request, reply, parsed.data.therapistId)
    if (!therapistId) return

    const locations = await listTherapistLocations(therapistId)
    return { locations }
  })

  app.get('/api/therapist/forms', { preHandler: therapistOnly }, async (request, reply) => {
    const category = (request.query as { category?: string }).category
    if (category === 'questionnaire') {
      const denied = await requireQuestionnairesEnabled(request, reply)
      if (denied) return denied
    }
    const where =
      category === 'questionnaire'
        ? { active: true, category: FormCategory.questionnaire }
        : category === 'intake'
          ? { active: true, category: FormCategory.intake }
          : { active: true }

    const forms = await prisma.formDefinition.findMany({
      where,
      select: { id: true, title: true, description: true, category: true },
      orderBy: { title: 'asc' },
    })
    return { forms }
  })

  app.get('/api/therapist/forms/:formId/preview', { preHandler: therapistOnly }, async (request, reply) => {
    const { formId } = request.params as { formId: string }
    const form = await prisma.formDefinition.findFirst({
      where: { id: formId, active: true },
      select: { id: true, title: true, description: true, category: true },
    })
    if (!form) {
      return reply.status(404).send({ error: 'Formulário não encontrado' })
    }

    if (form.category === FormCategory.questionnaire) {
      const denied = await requireQuestionnairesEnabled(request, reply)
      if (denied) return denied
    }

    const definition =
      form.category === FormCategory.questionnaire
        ? getQuestionnaireDefinitionForClient(formId)
        : undefined

    return {
      form: {
        ...form,
        ...(definition ? { definition } : {}),
      },
    }
  })

  app.get('/api/therapist/attendance', { preHandler: therapistOnly }, async (request, reply) => {
    const parsed = therapistAttendanceMatrixQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
    }

    const therapistId = await resolveScopedTherapistId(request, reply, parsed.data.therapistId)
    if (!therapistId) return

    try {
      const data = await listTherapistAttendance(
        therapistId,
        parsed.data.year,
        parsed.data.month,
        parsed.data.locationId,
      )
      return data
    } catch (error) {
      if (error instanceof Error && error.message === 'INVALID_MONTH') {
        return reply.status(400).send({ error: 'Mês inválido' })
      }
      if (error instanceof Error && error.message === 'LOCATION_NOT_FOUND') {
        return reply.status(404).send({ error: 'Local não encontrado' })
      }
      if (error instanceof Error && error.message === 'LOCATION_ACCESS_DENIED') {
        return reply.status(403).send({ error: 'Sem acesso a este local' })
      }
      throw error
    }
  })

  app.post('/api/therapist/patients', { preHandler: therapistWriteOnly }, async (request, reply) => {
    const parsed = parseCreatePatientInput(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    const location = await prisma.location.findFirst({
      where: { id: parsed.data.locationId, active: true },
    })
    if (!location) {
      return reply.status(400).send({ error: 'Local inválido' })
    }

    try {
      await assertTherapistHasLocation(request.user.sub, parsed.data.locationId)
    } catch (error) {
      if (error instanceof Error && error.message === 'LOCATION_ACCESS_DENIED') {
        return reply.status(403).send({ error: 'Sem acesso a este local' })
      }
      throw error
    }

    const patient = await prisma.patient.create({
      data: {
        therapistId: request.user.sub,
        locationId: parsed.data.locationId,
        fullName: parsed.data.fullName,
        email: parsed.data.email || null,
        email2: parsed.data.email2 || null,
        phone: parsed.data.phone || null,
        phone2: parsed.data.phone2 || null,
        birthDate: parsed.data.birthDate ? new Date(parsed.data.birthDate) : null,
        internalNotes: parsed.data.internalNotes || null,
        ...(parsed.data.sessionFee !== undefined ? { sessionFee: parsed.data.sessionFee } : {}),
      },
    })

    return reply.status(201).send({ patient: formatPatientSummary(patient) })
  })

  app.get('/api/therapist/patients/:id', { preHandler: therapistOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const therapistId = await resolvePatientTherapistId(request, reply, id)
    if (!therapistId) return

    const patient = await getTherapistPatient(therapistId, id)
    if (!patient) {
      return reply.status(404).send({ error: 'Paciente não encontrado' })
    }
    const flags = await getTherapistFeatureFlags(therapistId)
    const formatted = formatTherapistPatient(patient)
    return { patient: applyTherapistPatientFeatureAccess(formatted, flags) }
  })

  app.get('/api/therapist/patients/:id/timeline', { preHandler: therapistOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const therapistId = await resolvePatientTherapistId(request, reply, id)
    if (!therapistId) return

    try {
      return await getPatientTimeline(id, therapistId)
    } catch (error) {
      if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
        return reply.status(404).send({ error: 'Paciente não encontrado' })
      }
      throw error
    }
  })

  app.put('/api/therapist/patients/:id/evaluations', { preHandler: [...therapistWriteOnly, requireAssessmentResultsEnabled] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const parsed = patientEvaluationsSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    const therapistId = await resolvePatientTherapistId(request, reply, id)
    if (!therapistId) return

    try {
      return await updateTherapistPatientEvaluations(therapistId, id, parsed.data)
    } catch (error) {
      if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
        return reply.status(404).send({ error: 'Paciente não encontrado' })
      }
      throw error
    }
  })

  app.patch(
    '/api/therapist/patients/:id/form-delivery',
    { preHandler: therapistWriteOnly },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = updatePatientFormDeliverySchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
      }

      const therapistId = await resolvePatientTherapistId(request, reply, id)
      if (!therapistId) return

      try {
        const deliveredFormIds = await updateTherapistPatientFormDelivery(
          therapistId,
          id,
          parsed.data.formId,
          parsed.data.delivered,
        )
        return { deliveredFormIds }
      } catch (error) {
        if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Paciente não encontrado' })
        }
        if (error instanceof Error && error.message === 'FORM_NOT_FOUND') {
          return reply.status(400).send({ error: 'Formulário não encontrado' })
        }
        throw error
      }
    },
  )

  app.put(
    '/api/therapist/patients/:id/appointment-notes',
    { preHandler: therapistWriteOnly },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = patientAppointmentNotesSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
      }

      const therapistId = await resolvePatientTherapistId(request, reply, id)
      if (!therapistId) return

      try {
        return await updateTherapistPatientAppointmentNotes(
          therapistId,
          id,
          parsed.data.appointmentNotes,
        )
      } catch (error) {
        if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Paciente não encontrado' })
        }
        throw error
      }
    },
  )

  app.get('/api/therapist/patients/:id/assessment-pipeline', { preHandler: therapistOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const therapistId = await resolvePatientTherapistId(request, reply, id)
    if (!therapistId) return

    try {
      const pipeline = await getTherapistAssessmentPipeline(therapistId, id)
      return { pipeline }
    } catch (error) {
      if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
        return reply.status(404).send({ error: 'Paciente não encontrado' })
      }
      throw error
    }
  })

  app.patch('/api/therapist/patients/:id/assessment-pipeline', { preHandler: therapistWriteOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const parsed = updateAssessmentPipelineSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    const therapistId = await resolvePatientTherapistId(request, reply, id)
    if (!therapistId) return

    try {
      const pipeline = await updateTherapistAssessmentPipeline(therapistId, id, parsed.data)
      return { pipeline }
    } catch (error) {
      if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
        return reply.status(404).send({ error: 'Paciente não encontrado' })
      }
      if (error instanceof Error && error.message === 'PIPELINE_ALREADY_COMPLETE') {
        return reply.status(400).send({ error: 'O caso de avaliação já está concluído' })
      }
      if (error instanceof Error && error.message === 'PIPELINE_BLOCKERS_PRESENT') {
        return reply.status(400).send({ error: 'Resolva os bloqueios da etapa atual antes de avançar' })
      }
      if (error instanceof Error && error.message === 'INVALID_PIPELINE_STAGE') {
        return reply.status(400).send({ error: 'Etapa inválida para este caso' })
      }
      if (error instanceof Error && error.message === 'INVALID_PIPELINE_STAGE_OVERRIDE') {
        return reply.status(400).send({ error: 'Etapa inválida para conclusão manual' })
      }
      throw error
    }
  })

  app.patch('/api/therapist/patients/:id', { preHandler: therapistWriteOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const parsed = parseUpdatePatientInput(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    const therapistId = await resolvePatientTherapistId(request, reply, id)
    if (!therapistId) return

    try {
      const patient = await updateTherapistPatient(therapistId, id, parsed.data)
      return { patient }
    } catch (error) {
      if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
        return reply.status(404).send({ error: 'Paciente não encontrado' })
      }
      if (error instanceof Error && error.message === 'INVALID_LOCATION') {
        return reply.status(400).send({ error: 'Local inválido' })
      }
      if (error instanceof Error && error.message === 'LOCATION_ACCESS_DENIED') {
        return reply.status(403).send({ error: 'Sem acesso a este local' })
      }
      throw error
    }
  })

  app.patch('/api/therapist/patients/:id/active', { preHandler: therapistWriteOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const parsed = parseSetPatientActiveInput(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    const therapistId = await resolvePatientTherapistId(request, reply, id)
    if (!therapistId) return

    try {
      const patient = await setTherapistPatientActive(therapistId, id, parsed.data.active)
      return { patient }
    } catch (error) {
      if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
        return reply.status(404).send({ error: 'Paciente não encontrado' })
      }
      throw error
    }
  })

  app.delete('/api/therapist/patients/:id', { preHandler: therapistWriteOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const therapistId = await resolvePatientTherapistId(request, reply, id)
    if (!therapistId) return

    try {
      await deleteTherapistPatient(therapistId, id)
      return reply.status(204).send()
    } catch (error) {
      if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
        return reply.status(404).send({ error: 'Paciente não encontrado' })
      }
      throw error
    }
  })

  app.get(
    '/api/therapist/patients/:id/attendance',
    { preHandler: therapistOnly },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = attendanceMonthQuerySchema.safeParse(request.query)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
      }

      const therapistId = await resolvePatientTherapistId(request, reply, id)
      if (!therapistId) return

      try {
        const records = await listPatientAttendance(
          therapistId,
          id,
          parsed.data.year,
          parsed.data.month,
        )
        return { records }
      } catch (error) {
        if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Paciente não encontrado' })
        }
        throw error
      }
    },
  )

  app.put(
    '/api/therapist/patients/:id/attendance',
    { preHandler: therapistWriteOnly },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = attendanceUpsertSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
      }

      const therapistId = await resolvePatientTherapistId(request, reply, id)
      if (!therapistId) return

      try {
        const record = await upsertPatientAttendance(
          therapistId,
          id,
          parsed.data.date,
          parsed.data.status,
          parsed.data.notes,
        )
        return { record }
      } catch (error) {
        if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Paciente não encontrado' })
        }
        if (error instanceof Error && error.message === 'INVALID_DATE') {
          return reply.status(400).send({ error: 'Data inválida' })
        }
        throw error
      }
    },
  )

  app.post(
    '/api/therapist/patients/:id/sessions',
    { preHandler: therapistWriteOnly },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = parseCreateSessionInput(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
      }

      if (parsed.data.sessionKind === 'questionnaire') {
        const denied = await requireQuestionnairesEnabled(request, reply)
        if (denied) return denied
      }

      const therapistId = await resolvePatientTherapistId(request, reply, id)
      if (!therapistId) return

      try {
        const expiresAt = parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined
        const result = await createPatientSession(
          therapistId,
          id,
          parsed.data.formIds,
          expiresAt,
          parsed.data.sessionKind === 'questionnaire' ? SessionKind.questionnaire : SessionKind.intake,
        )
        return reply.status(201).send({
          session: {
            id: result.session.id,
            status: result.session.status,
            createdAt: result.session.createdAt,
            forms: result.session.forms.map((f) => ({
              id: f.id,
              formId: f.formId,
              title: f.definition.title,
              status: f.status,
            })),
          },
          url: result.url,
        })
      } catch (error) {
        if (error instanceof Error && error.message === 'INVALID_FORMS') {
          return reply.status(400).send({ error: 'Formulários inválidos' })
        }
        throw error
      }
    },
  )

  app.get('/api/therapist/sessions/:id', { preHandler: therapistOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    let therapistId: string
    try {
      const access = await assertTherapistCanAccessSession(request.user.sub, id)
      therapistId = access.therapistId
    } catch (error) {
      if (error instanceof Error && error.message === 'SESSION_NOT_FOUND') {
        return reply.status(404).send({ error: 'Sessão não encontrada' })
      }
      if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
        return reply.status(404).send({ error: 'Sessão não encontrada' })
      }
      if (error instanceof Error && error.message === 'THERAPIST_ACCESS_DENIED') {
        return reply.status(403).send({ error: 'Sem acesso a esta sessão' })
      }
      throw error
    }

    const session = await prisma.intakeSession.findFirst({
      where: { id, therapistId },
      include: {
        patient: true,
        forms: {
          include: { definition: true, draft: true, submission: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })
    if (!session) {
      return reply.status(404).send({ error: 'Sessão não encontrada' })
    }
    return { session }
  })

  app.post(
    '/api/therapist/sessions/:id/revoke',
    { preHandler: therapistWriteOnly },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      let therapistId: string
      try {
        const access = await assertTherapistCanAccessSession(request.user.sub, id)
        therapistId = access.therapistId
      } catch (error) {
        if (error instanceof Error && error.message === 'SESSION_NOT_FOUND') {
          return reply.status(404).send({ error: 'Sessão não encontrada' })
        }
        if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Sessão não encontrada' })
        }
        if (error instanceof Error && error.message === 'THERAPIST_ACCESS_DENIED') {
          return reply.status(403).send({ error: 'Sem acesso a esta sessão' })
        }
        throw error
      }

      const session = await prisma.intakeSession.findFirst({
        where: { id, therapistId },
      })
      if (!session) {
        return reply.status(404).send({ error: 'Sessão não encontrada' })
      }
      if (session.status === 'completed') {
        return reply.status(400).send({ error: 'Sessão já concluída' })
      }

      const updated = await prisma.intakeSession.update({
        where: { id },
        data: { status: 'revoked', patientToken: null },
      })
      return { session: updated }
    },
  )

  app.delete(
    '/api/therapist/sessions/:id',
    { preHandler: therapistWriteOnly },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      let therapistId: string
      try {
        const access = await assertTherapistCanAccessSession(request.user.sub, id)
        therapistId = access.therapistId
      } catch (error) {
        if (error instanceof Error && error.message === 'SESSION_NOT_FOUND') {
          return reply.status(404).send({ error: 'Sessão não encontrada' })
        }
        if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Sessão não encontrada' })
        }
        if (error instanceof Error && error.message === 'THERAPIST_ACCESS_DENIED') {
          return reply.status(403).send({ error: 'Sem acesso a esta sessão' })
        }
        throw error
      }

      try {
        await deleteTherapistSession(therapistId, id)
        return reply.status(204).send()
      } catch (error) {
        if (error instanceof Error && error.message === 'SESSION_NOT_FOUND') {
          return reply.status(404).send({ error: 'Sessão não encontrada' })
        }
        throw error
      }
    },
  )

  app.get(
    '/api/therapist/sessions/:id/submissions',
    { preHandler: therapistOnly },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      let therapistId: string
      try {
        const access = await assertTherapistCanAccessSession(request.user.sub, id)
        therapistId = access.therapistId
      } catch (error) {
        if (error instanceof Error && error.message === 'SESSION_NOT_FOUND') {
          return reply.status(404).send({ error: 'Sessão não encontrada' })
        }
        if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Sessão não encontrada' })
        }
        if (error instanceof Error && error.message === 'THERAPIST_ACCESS_DENIED') {
          return reply.status(403).send({ error: 'Sem acesso a esta sessão' })
        }
        throw error
      }

      const session = await prisma.intakeSession.findFirst({
        where: { id, therapistId },
        include: {
          patient: {
            select: {
              id: true,
              fullName: true,
              location: { select: { name: true } },
            },
          },
          forms: {
            include: {
              definition: true,
              submission: true,
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
      })
      if (!session) {
        return reply.status(404).send({ error: 'Sessão não encontrada' })
      }

      return {
        session: {
          id: session.id,
          status: session.status,
          patient: session.patient,
          location: session.patient.location,
          submissions: session.forms
            .filter((f) => f.submission)
            .map((f) => ({
              formId: f.formId,
              title: f.definition.title,
              submittedAt: f.submission!.submittedAt,
              fields: formatFormAnswers(f.formId, f.submission!.answersJson as Record<string, unknown>),
            })),
        },
      }
    },
  )

  app.get('/api/therapist/appointments/defaults', { preHandler: therapistOnly }, async (request) => {
    const settings = await getOrCreateFinancialSettings(request.user.sub)
    return { defaultSessionFee: settings.defaultSessionFee }
  })

  app.get(
    '/api/therapist/appointments/occupancy',
    { preHandler: therapistOnly },
    async (request, reply) => {
      const parsed = appointmentDayQuerySchema.safeParse(request.query)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
      }

      try {
        const appointments = await listDayRoomOccupancy(parsed.data.date)
        return { appointments }
      } catch (error) {
        if (error instanceof Error && error.message === 'INVALID_DATE') {
          return reply.status(400).send({ error: 'Data inválida' })
        }
        throw error
      }
    },
  )

  app.get(
    '/api/therapist/appointments/location-day',
    { preHandler: therapistOnly },
    async (request, reply) => {
      const parsed = locationDayScheduleQuerySchema.safeParse(request.query)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
      }

      try {
        const schedule = await listLocationDaySchedule(
          request.user.sub,
          parsed.data.locationId,
          parsed.data.date,
        )
        return schedule
      } catch (error) {
        if (error instanceof Error && error.message === 'INVALID_DATE') {
          return reply.status(400).send({ error: 'Data inválida' })
        }
        if (error instanceof Error && error.message === 'LOCATION_NOT_FOUND') {
          return reply.status(404).send({ error: 'Local não encontrado' })
        }
        if (error instanceof Error && error.message === 'LOCATION_ACCESS_DENIED') {
          return reply.status(403).send({ error: 'Sem acesso a este local' })
        }
        throw error
      }
    },
  )

  app.get('/api/therapist/appointments', { preHandler: therapistOnly }, async (request, reply) => {
    const parsed = therapistAppointmentsQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
    }

    const therapistId = await resolveScopedTherapistId(request, reply, parsed.data.therapistId)
    if (!therapistId) return

    try {
      const appointments = await listTherapistAppointments(
        therapistId,
        parsed.data.year,
        parsed.data.month,
        parsed.data.locationId,
        { includeCalendarInvite: true },
      )
      return {
        year: parsed.data.year,
        month: parsed.data.month,
        appointments,
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'INVALID_MONTH') {
        return reply.status(400).send({ error: 'Mês inválido' })
      }
      if (error instanceof Error && error.message === 'LOCATION_NOT_FOUND') {
        return reply.status(404).send({ error: 'Local não encontrado' })
      }
      if (error instanceof Error && error.message === 'LOCATION_ACCESS_DENIED') {
        return reply.status(403).send({ error: 'Sem acesso a este local' })
      }
      throw error
    }
  })

  app.post('/api/therapist/appointments', { preHandler: therapistWriteOnly }, async (request, reply) => {
    const parsed = createAppointmentBodySchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    try {
      const result = await createTherapistAppointment(request.user.sub, parsed.data)
      return reply.status(201).send(result)
    } catch (error) {
      if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
        return reply.status(404).send({ error: 'Paciente não encontrado' })
      }
      if (error instanceof Error && error.message === 'PATIENT_INACTIVE') {
        return reply.status(400).send({ error: 'Paciente inactivo — reactive o paciente para marcar consultas' })
      }
      if (error instanceof Error && error.message === 'INVALID_SCHEDULE') {
        return reply.status(400).send({ error: 'Data ou hora inválida' })
      }
      if (error instanceof Error && error.message === 'INVALID_RECURRENCE') {
        return reply.status(400).send({ error: 'Recorrência inválida' })
      }
      if (error instanceof Error && error.message === 'TOO_MANY_APPOINTMENTS') {
        return reply.status(400).send({
          error: `Só é possível criar até ${MAX_RECURRING_APPOINTMENTS} consultas de uma vez`,
        })
      }
      if (error instanceof Error && error.message === 'LOCATION_NOT_FOUND') {
        return reply.status(404).send({ error: 'Local não encontrado' })
      }
      if (error instanceof Error && error.message === 'LOCATION_ACCESS_DENIED') {
        return reply.status(403).send({ error: 'Sem acesso a este local' })
      }
      if (error instanceof Error && error.message === 'GABINETE_NOT_FOUND') {
        return reply.status(404).send({ error: 'Gabinete não encontrado ou inativo' })
      }
      if (error instanceof RoomConflictError) {
        return reply.status(409).send({ error: error.message })
      }
      throw error
    }
  })

  app.get('/api/therapist/gabinetes', { preHandler: therapistOnly }, async (request, reply) => {
    const parsed = therapistGabinetesQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
    }

    const therapistId = await resolveScopedTherapistId(request, reply, parsed.data.therapistId)
    if (!therapistId) return

    try {
      const gabinetes = await listActiveGabinetesForTherapist(
        therapistId,
        parsed.data.locationId,
      )
      return { gabinetes }
    } catch (error) {
      if (error instanceof Error && error.message === 'LOCATION_ACCESS_DENIED') {
        return reply.status(403).send({ error: 'Sem acesso a este local' })
      }
      throw error
    }
  })

  app.patch(
    '/api/therapist/appointments/:id',
    { preHandler: therapistWriteOnly },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = updateAppointmentBodySchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
      }

      try {
        const result = await updateTherapistAppointment(request.user.sub, id, parsed.data)
        return result
      } catch (error) {
        if (error instanceof Error && error.message === 'APPOINTMENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Consulta não encontrada' })
        }
        if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Paciente não encontrado' })
        }
        if (error instanceof Error && error.message === 'PATIENT_INACTIVE') {
          return reply.status(400).send({ error: 'Paciente inactivo — reactive o paciente para marcar consultas' })
        }
        if (error instanceof Error && error.message === 'INVALID_SCHEDULE') {
          return reply.status(400).send({ error: 'Data ou hora inválida' })
        }
        if (error instanceof Error && error.message === 'LOCATION_NOT_FOUND') {
          return reply.status(404).send({ error: 'Local não encontrado' })
        }
        if (error instanceof Error && error.message === 'LOCATION_ACCESS_DENIED') {
          return reply.status(403).send({ error: 'Sem acesso a este local' })
        }
        if (error instanceof RoomConflictError) {
          return reply.status(409).send({ error: error.message })
        }
        if (error instanceof Error && error.message === 'GABINETE_NOT_FOUND') {
          return reply.status(404).send({ error: 'Gabinete não encontrado ou inativo' })
        }
        throw error
      }
    },
  )

  app.delete(
    '/api/therapist/appointments/:id',
    { preHandler: therapistWriteOnly },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = deleteAppointmentQuerySchema.safeParse(request.query)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
      }

      try {
        const result = await deleteTherapistAppointment(request.user.sub, id, parsed.data.scope)
        return result
      } catch (error) {
        if (error instanceof Error && error.message === 'APPOINTMENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Consulta não encontrada' })
        }
        throw error
      }
    },
  )

  app.get('/api/therapist/financial/settings', { preHandler: therapistFinancialOnly }, async (request) => {
    const settings = await getOrCreateFinancialSettings(request.user.sub)
    return { settings }
  })

  app.put('/api/therapist/financial/settings', { preHandler: [...therapistFinancialOnly, requireWriteTherapist] }, async (request, reply) => {
    const parsed = financialSettingsSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    const settings = await updateFinancialSettings(request.user.sub, parsed.data)
    return { settings }
  })

  app.get('/api/therapist/financial/overview', { preHandler: therapistFinancialOnly }, async (request, reply) => {
    const parsed = financialMonthQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
    }

    try {
      return await getTherapistFinancialOverview(
        request.user.sub,
        parsed.data.year ?? new Date().getFullYear(),
        parsed.data.month ?? new Date().getMonth() + 1,
        parsed.data.period,
        parsed.data.period === 'custom' && parsed.data.from && parsed.data.to
          ? { from: parsed.data.from, to: parsed.data.to }
          : undefined,
      )
    } catch (error) {
      if (error instanceof Error && error.message === 'INVALID_MONTH') {
        return reply.status(400).send({ error: 'Mês inválido' })
      }
      throw error
    }
  })

  app.get('/api/therapist/financial/charts', { preHandler: therapistFinancialOnly }, async (request, reply) => {
    const parsed = financialYearQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
    }

    return getTherapistFinancialCharts(request.user.sub, parsed.data.year, parsed.data.period)
  })

  app.get(
    '/api/therapist/patients/:patientId/documents',
    { preHandler: therapistOnly },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string }
      const therapistId = await resolvePatientTherapistId(request, reply, patientId)
      if (!therapistId) return

      try {
        const documents = await listTherapistPatientDocuments(therapistId, patientId)
        return { documents }
      } catch (error) {
        if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Paciente não encontrado' })
        }
        throw error
      }
    },
  )

  app.post(
    '/api/therapist/patients/:patientId/documents',
    { preHandler: therapistWriteOnly },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string }
      const therapistId = await resolvePatientTherapistId(request, reply, patientId)
      if (!therapistId) return

      try {
        const file = await parseDocumentUpload(request.parts())
        const document = await uploadTherapistPatientDocument(therapistId, patientId, file)
        return reply.status(201).send({ document })
      } catch (error) {
        if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Paciente não encontrado' })
        }
        if (error instanceof Error && error.message === 'FILE_REQUIRED') {
          return reply.status(400).send({ error: 'É necessário enviar um ficheiro' })
        }
        if (error instanceof Error && error.message === 'INVALID_DOCUMENT_TYPE') {
          return reply.status(400).send({ error: 'Apenas ficheiros PDF ou imagens são permitidos' })
        }
        if (error instanceof Error && error.message === 'DOCUMENT_TOO_LARGE') {
          return reply.status(400).send({ error: 'O ficheiro excede o tamanho máximo de 10 MB' })
        }
        throw error
      }
    },
  )

  app.get(
    '/api/therapist/patients/:patientId/documents/:documentId/content',
    { preHandler: therapistOnly },
    async (request, reply) => {
      const { patientId, documentId } = request.params as {
        patientId: string
        documentId: string
      }
      const disposition =
        (request.query as { disposition?: string }).disposition === 'attachment'
          ? 'attachment'
          : 'inline'

      const therapistId = await resolvePatientTherapistId(request, reply, patientId)
      if (!therapistId) return

      try {
        const document = await getTherapistPatientDocument(
          therapistId,
          patientId,
          documentId,
        )
        const absolutePath = getDocumentAbsolutePath(document)
        return reply
          .header('Content-Type', document.mimeType)
          .header(
            'Content-Disposition',
            `${disposition}; filename="${encodeURIComponent(document.originalName)}"`,
          )
          .send(createReadStream(absolutePath))
      } catch (error) {
        if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Paciente não encontrado' })
        }
        if (error instanceof Error && error.message === 'DOCUMENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Documento não encontrado' })
        }
        throw error
      }
    },
  )

  app.delete(
    '/api/therapist/patients/:patientId/documents/:documentId',
    { preHandler: therapistWriteOnly },
    async (request, reply) => {
      const { patientId, documentId } = request.params as {
        patientId: string
        documentId: string
      }
      const therapistId = await resolvePatientTherapistId(request, reply, patientId)
      if (!therapistId) return

      try {
        await deleteTherapistPatientDocument(therapistId, patientId, documentId)
        return reply.status(204).send()
      } catch (error) {
        if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Paciente não encontrado' })
        }
        if (error instanceof Error && error.message === 'DOCUMENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Documento não encontrado' })
        }
        throw error
      }
    },
  )
}
