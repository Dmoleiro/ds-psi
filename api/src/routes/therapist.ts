import type { FastifyInstance } from 'fastify'
import { UserRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { hashPassword } from '../lib/password.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import {
  createPatientSession,
  deleteTherapistPatient,
  formatTherapistPatient,
  getTherapistPatient,
  parseCreatePatientInput,
  parseCreateSessionInput,
  parseUpdatePatientInput,
  updateTherapistPatient,
} from '../services/sessions.js'
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
  updateTherapistAppointment,
} from '../services/appointments.js'
import { attendanceMatrixQuerySchema, attendanceMonthQuerySchema, attendanceUpsertSchema, appointmentBodySchema, appointmentMonthQuerySchema, createAppointmentBodySchema, deleteAppointmentQuerySchema, createLocationSchema, updateAppointmentBodySchema, updateLocationSchema, updateTherapistProfileSchema } from '../lib/schemas.js'
import { formatFormAnswers } from '../lib/formPresentation.js'
import { formatSmtpError, sendTestEmail } from '../lib/mail.js'
import { getTherapistDashboard } from '../services/dashboard.js'

export async function therapistRoutes(app: FastifyInstance) {
  const therapistOnly = [requireAuth, requireRole(UserRole.therapist)]

  app.get('/api/therapist/dashboard', { preHandler: therapistOnly }, async (request) => {
    return getTherapistDashboard(request.user.sub)
  })

  app.get('/api/therapist/profile', { preHandler: therapistOnly }, async (request) => {
    const profile = await prisma.user.findUniqueOrThrow({
      where: { id: request.user.sub },
      select: { id: true, email: true, name: true, phone: true, role: true },
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
      select: { id: true, email: true, name: true, phone: true, role: true },
    })

    const token = await reply.jwtSign({
      sub: profile.id,
      email: profile.email,
      role: profile.role,
      name: profile.name,
    })

    return { profile, token, user: profile }
  })

  app.post('/api/therapist/profile/test-email', { preHandler: therapistOnly }, async (request, reply) => {
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

  app.get('/api/therapist/patients', { preHandler: therapistOnly }, async (request) => {
    const patients = await prisma.patient.findMany({
      where: { therapistId: request.user.sub },
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
    return { patients }
  })

  app.get('/api/therapist/locations', { preHandler: therapistOnly }, async () => {
    const locations = await prisma.location.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, address: true },
    })
    return { locations }
  })

  app.get('/api/therapist/forms', { preHandler: therapistOnly }, async () => {
    const forms = await prisma.formDefinition.findMany({
      where: { active: true },
      select: { id: true, title: true, description: true },
      orderBy: { title: 'asc' },
    })
    return { forms }
  })

  app.get('/api/therapist/attendance', { preHandler: therapistOnly }, async (request, reply) => {
    const parsed = attendanceMatrixQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
    }

    try {
      const data = await listTherapistAttendance(
        request.user.sub,
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
      throw error
    }
  })

  app.post('/api/therapist/patients', { preHandler: therapistOnly }, async (request, reply) => {
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
      },
    })

    return reply.status(201).send({ patient })
  })

  app.get('/api/therapist/patients/:id', { preHandler: therapistOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const patient = await getTherapistPatient(request.user.sub, id)
    if (!patient) {
      return reply.status(404).send({ error: 'Paciente não encontrado' })
    }
    return { patient: formatTherapistPatient(patient) }
  })

  app.patch('/api/therapist/patients/:id', { preHandler: therapistOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const parsed = parseUpdatePatientInput(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    try {
      const patient = await updateTherapistPatient(request.user.sub, id, parsed.data)
      return { patient }
    } catch (error) {
      if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
        return reply.status(404).send({ error: 'Paciente não encontrado' })
      }
      if (error instanceof Error && error.message === 'INVALID_LOCATION') {
        return reply.status(400).send({ error: 'Local inválido' })
      }
      throw error
    }
  })

  app.delete('/api/therapist/patients/:id', { preHandler: therapistOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    try {
      await deleteTherapistPatient(request.user.sub, id)
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

      try {
        const records = await listPatientAttendance(
          request.user.sub,
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
    { preHandler: therapistOnly },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = attendanceUpsertSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
      }

      try {
        const record = await upsertPatientAttendance(
          request.user.sub,
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
    { preHandler: therapistOnly },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = parseCreateSessionInput(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
      }

      const patient = await prisma.patient.findFirst({
        where: { id, therapistId: request.user.sub },
      })
      if (!patient) {
        return reply.status(404).send({ error: 'Paciente não encontrado' })
      }

      try {
        const expiresAt = parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined
        const result = await createPatientSession(
          request.user.sub,
          id,
          parsed.data.formIds,
          expiresAt,
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
    const session = await prisma.intakeSession.findFirst({
      where: { id, therapistId: request.user.sub },
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
    { preHandler: therapistOnly },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const session = await prisma.intakeSession.findFirst({
        where: { id, therapistId: request.user.sub },
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

  app.get(
    '/api/therapist/sessions/:id/submissions',
    { preHandler: therapistOnly },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const session = await prisma.intakeSession.findFirst({
        where: { id, therapistId: request.user.sub },
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

  app.get('/api/therapist/appointments', { preHandler: therapistOnly }, async (request, reply) => {
    const parsed = appointmentMonthQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
    }

    try {
      const appointments = await listTherapistAppointments(
        request.user.sub,
        parsed.data.year,
        parsed.data.month,
        parsed.data.locationId,
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
      throw error
    }
  })

  app.post('/api/therapist/appointments', { preHandler: therapistOnly }, async (request, reply) => {
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
      throw error
    }
  })

  app.patch(
    '/api/therapist/appointments/:id',
    { preHandler: therapistOnly },
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
        if (error instanceof Error && error.message === 'INVALID_SCHEDULE') {
          return reply.status(400).send({ error: 'Data ou hora inválida' })
        }
        if (error instanceof Error && error.message === 'LOCATION_NOT_FOUND') {
          return reply.status(404).send({ error: 'Local não encontrado' })
        }
        throw error
      }
    },
  )

  app.delete(
    '/api/therapist/appointments/:id',
    { preHandler: therapistOnly },
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
}
