import type { FastifyInstance } from 'fastify'
import { UserRole } from '@prisma/client'
import { createPiccaSessionSchema } from '../lib/schemas.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { requirePiccaEnabled } from '../middleware/picca.js'
import {
  createPiccaSession,
  getPiccaSubmissionsForTherapist,
  listPiccaModules,
  revokePiccaSession,
  updatePiccaModuleAnswers,
} from '../services/piccaSessions.js'

const piccaTherapist = { preHandler: [requireAuth, requireRole(UserRole.therapist), requirePiccaEnabled] }

export async function piccaTherapistRoutes(app: FastifyInstance) {
  app.get('/api/therapist/picca/modules', piccaTherapist, async () => {
    const modules = await listPiccaModules()
    return {
      modules: modules.map((m) => ({
        id: m.id,
        volume: m.volume,
        moduleNumber: m.moduleNumber,
        title: m.title,
        description: m.description,
      })),
    }
  })

  app.post(
    '/api/therapist/patients/:patientId/picca-sessions',
    piccaTherapist,
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string }
      const parsed = createPiccaSessionSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
      }

      try {
        const result = await createPiccaSession(
          request.user.sub,
          patientId,
          parsed.data.moduleIds,
        )
        return {
          sessionId: result.session.id,
          url: result.url,
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Utente não encontrado' })
        }
        if (error instanceof Error && error.message === 'INVALID_MODULES') {
          return reply.status(400).send({ error: 'Módulos inválidos' })
        }
        throw error
      }
    },
  )

  app.post(
    '/api/therapist/picca-sessions/:id/revoke',
    piccaTherapist,
    async (request, reply) => {
      const { id } = request.params as { id: string }
      try {
        const session = await revokePiccaSession(request.user.sub, id)
        return { session }
      } catch (error) {
        if (error instanceof Error && error.message === 'SESSION_NOT_FOUND') {
          return reply.status(404).send({ error: 'Sessão não encontrada' })
        }
        if (error instanceof Error && error.message === 'SESSION_ALREADY_REVOKED') {
          return reply.status(400).send({ error: 'Sessão já revogada' })
        }
        throw error
      }
    },
  )

  app.get(
    '/api/therapist/picca-sessions/:id/submissions',
    piccaTherapist,
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const session = await getPiccaSubmissionsForTherapist(request.user.sub, id)
      if (!session) {
        return reply.status(404).send({ error: 'Sessão não encontrada' })
      }
      return { session }
    },
  )

  app.put(
    '/api/therapist/picca-sessions/:id/modules/:moduleId',
    piccaTherapist,
    async (request, reply) => {
      const { id, moduleId } = request.params as { id: string; moduleId: string }
      const body = request.body as { answers?: Record<string, unknown> }
      if (!body.answers || typeof body.answers !== 'object') {
        return reply.status(400).send({ error: 'Dados inválidos' })
      }

      try {
        const result = await updatePiccaModuleAnswers(
          request.user.sub,
          id,
          moduleId,
          body.answers,
        )
        return result
      } catch (error) {
        if (error instanceof Error && error.message === 'MODULE_NOT_FOUND') {
          return reply.status(404).send({ error: 'Módulo não encontrado' })
        }
        throw error
      }
    },
  )
}
