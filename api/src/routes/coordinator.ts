import type { FastifyInstance } from 'fastify'
import { UserRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { listTherapistAttendance, toggleCoordinatorReceiptStatus } from '../services/attendance.js'
import { listTherapistAppointments } from '../services/appointments.js'
import { coordinatorAppointmentsQuerySchema, coordinatorAttendanceQuerySchema, coordinatorReceiptToggleSchema } from '../lib/schemas.js'

export async function coordinatorRoutes(app: FastifyInstance) {
  const coordinatorOnly = [requireAuth, requireRole(UserRole.coordinator)]

  app.get('/api/coordinator/therapists', { preHandler: coordinatorOnly }, async () => {
    const therapists = await prisma.user.findMany({
      where: { role: UserRole.therapist, active: true },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    })
    return { therapists }
  })

  app.get('/api/coordinator/locations', { preHandler: coordinatorOnly }, async () => {
    const locations = await prisma.location.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, address: true },
    })
    return { locations }
  })

  app.get('/api/coordinator/attendance', { preHandler: coordinatorOnly }, async (request, reply) => {
    const parsed = coordinatorAttendanceQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
    }

    const therapist = await prisma.user.findFirst({
      where: { id: parsed.data.therapistId, role: UserRole.therapist, active: true },
      select: { id: true },
    })
    if (!therapist) {
      return reply.status(404).send({ error: 'Terapeuta não encontrado' })
    }

    try {
      const data = await listTherapistAttendance(
        therapist.id,
        parsed.data.year,
        parsed.data.month,
        parsed.data.locationId,
      )
      return data
    } catch (err) {
      if (err instanceof Error && err.message === 'LOCATION_NOT_FOUND') {
        return reply.status(404).send({ error: 'Local não encontrado' })
      }
      if (err instanceof Error && err.message === 'INVALID_MONTH') {
        return reply.status(400).send({ error: 'Mês inválido' })
      }
      throw err
    }
  })

  app.get('/api/coordinator/appointments', { preHandler: coordinatorOnly }, async (request, reply) => {
    const parsed = coordinatorAppointmentsQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
    }

    const therapist = await prisma.user.findFirst({
      where: { id: parsed.data.therapistId, role: UserRole.therapist, active: true },
      select: { id: true },
    })
    if (!therapist) {
      return reply.status(404).send({ error: 'Terapeuta não encontrado' })
    }

    try {
      const appointments = await listTherapistAppointments(
        therapist.id,
        parsed.data.year,
        parsed.data.month,
        parsed.data.locationId,
      )
      return {
        year: parsed.data.year,
        month: parsed.data.month,
        appointments,
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'LOCATION_NOT_FOUND') {
        return reply.status(404).send({ error: 'Local não encontrado' })
      }
      if (err instanceof Error && err.message === 'INVALID_MONTH') {
        return reply.status(400).send({ error: 'Mês inválido' })
      }
      throw err
    }
  })

  app.put('/api/coordinator/attendance/receipt', { preHandler: coordinatorOnly }, async (request, reply) => {
    const parsed = coordinatorReceiptToggleSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    const therapist = await prisma.user.findFirst({
      where: { id: parsed.data.therapistId, role: UserRole.therapist, active: true },
      select: { id: true },
    })
    if (!therapist) {
      return reply.status(404).send({ error: 'Terapeuta não encontrado' })
    }

    try {
      const record = await toggleCoordinatorReceiptStatus(
        therapist.id,
        parsed.data.patientId,
        parsed.data.date,
      )
      return { record }
    } catch (err) {
      if (err instanceof Error && err.message === 'PATIENT_NOT_FOUND') {
        return reply.status(404).send({ error: 'Paciente não encontrado' })
      }
      if (err instanceof Error && err.message === 'INVALID_DATE') {
        return reply.status(400).send({ error: 'Data inválida' })
      }
      if (err instanceof Error && err.message === 'RECORD_NOT_FOUND') {
        return reply.status(404).send({ error: 'Registo de presença não encontrado' })
      }
      if (err instanceof Error && err.message === 'NOT_RECEIPT_EDITABLE') {
        return reply.status(400).send({
          error: 'Só pode alterar células marcadas como presente pago ou recibo passado',
        })
      }
      throw err
    }
  })
}
