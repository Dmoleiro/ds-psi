import type { FastifyInstance } from 'fastify'
import { UserRole } from '@prisma/client'
import { createPiccaInteractiveSessionSchema } from '../lib/schemas.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { requirePiccaEnabled } from '../middleware/picca.js'
import {
  createPiccaInteractiveSession,
  getPiccaInteractiveEntriesForTherapist,
  listPiccaInteractiveForms,
  revokePiccaInteractiveSession,
  deletePiccaInteractiveSession,
  updatePiccaInteractiveEntryForTherapist,
} from '../services/piccaInteractiveSessions.js'

const piccaInteractiveTherapist = {
  preHandler: [requireAuth, requireRole(UserRole.therapist), requirePiccaEnabled],
}

export async function piccaInteractiveTherapistRoutes(app: FastifyInstance) {
  app.get('/api/therapist/picca-interactive/forms', piccaInteractiveTherapist, async () => {
    const forms = await listPiccaInteractiveForms()
    return {
      forms: forms.map((form) => ({
        id: form.id,
        kind: form.kind,
        title: form.title,
        description: form.description,
      })),
    }
  })

  app.post(
    '/api/therapist/patients/:patientId/picca-interactive-sessions',
    piccaInteractiveTherapist,
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string }
      const parsed = createPiccaInteractiveSessionSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
      }

      try {
        const result = await createPiccaInteractiveSession(
          request.user.sub,
          patientId,
          parsed.data.formIds,
        )
        return {
          sessionId: result.session.id,
          url: result.url,
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Utente não encontrado' })
        }
        if (error instanceof Error && error.message === 'INVALID_FORMS') {
          return reply.status(400).send({ error: 'Formulários inválidos' })
        }
        throw error
      }
    },
  )

  app.post(
    '/api/therapist/picca-interactive-sessions/:id/revoke',
    piccaInteractiveTherapist,
    async (request, reply) => {
      const { id } = request.params as { id: string }
      try {
        const session = await revokePiccaInteractiveSession(request.user.sub, id)
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

  app.delete(
    '/api/therapist/picca-interactive-sessions/:id',
    piccaInteractiveTherapist,
    async (request, reply) => {
      const { id } = request.params as { id: string }
      try {
        await deletePiccaInteractiveSession(request.user.sub, id)
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
    '/api/therapist/picca-interactive-sessions/:id/entries',
    piccaInteractiveTherapist,
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const session = await getPiccaInteractiveEntriesForTherapist(request.user.sub, id)
      if (!session) {
        return reply.status(404).send({ error: 'Sessão não encontrada' })
      }
      return { session }
    },
  )

  app.put(
    '/api/therapist/picca-interactive-sessions/:id/entries/:entryId',
    piccaInteractiveTherapist,
    async (request, reply) => {
      const { id, entryId } = request.params as { id: string; entryId: string }
      const body = request.body as { answers?: Record<string, unknown> }
      if (!body.answers || typeof body.answers !== 'object') {
        return reply.status(400).send({ error: 'Dados inválidos' })
      }

      try {
        const result = await updatePiccaInteractiveEntryForTherapist(
          request.user.sub,
          id,
          entryId,
          body.answers,
        )
        return result
      } catch (error) {
        if (error instanceof Error && error.message === 'ENTRY_NOT_FOUND') {
          return reply.status(404).send({ error: 'Registo não encontrado' })
        }
        throw error
      }
    },
  )
}
