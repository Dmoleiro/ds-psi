import type { FastifyInstance } from 'fastify'
import { UserRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { listTherapistAttendance } from '../services/attendance.js'
import { coordinatorAttendanceQuerySchema } from '../lib/schemas.js'

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
}
