import type { FastifyInstance } from 'fastify'
import { UserRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import {
  createPatientSession,
  deleteTherapistPatient,
  getTherapistPatient,
  parseCreatePatientInput,
  parseCreateSessionInput,
} from '../services/sessions.js'
import {
  listPatientAttendance,
  listTherapistAttendance,
  upsertPatientAttendance,
} from '../services/attendance.js'
import { attendanceMatrixQuerySchema, attendanceMonthQuerySchema, attendanceUpsertSchema, createLocationSchema, updateLocationSchema } from '../lib/schemas.js'

export async function therapistRoutes(app: FastifyInstance) {
  const therapistOnly = [requireAuth, requireRole(UserRole.therapist)]

  app.get('/api/therapist/patients', { preHandler: therapistOnly }, async (request) => {
    const patients = await prisma.patient.findMany({
      where: { therapistId: request.user.sub },
      orderBy: { createdAt: 'desc' },
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
        phone: parsed.data.phone || null,
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
    return { patient }
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
        data: { status: 'revoked' },
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
          patient: { select: { id: true, fullName: true } },
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
          submissions: session.forms
            .filter((f) => f.submission)
            .map((f) => ({
              formId: f.formId,
              title: f.definition.title,
              submittedAt: f.submission!.submittedAt,
              answers: f.submission!.answersJson,
            })),
        },
      }
    },
  )
}
