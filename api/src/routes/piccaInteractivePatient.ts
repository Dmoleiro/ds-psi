import type { FastifyInstance } from 'fastify'
import { PiccaSessionStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { getWeekStartMonday } from '../lib/piccaInteractiveWeek.js'
import { consentSchema, piccaDraftSchema } from '../lib/schemas.js'
import { requirePiccaInteractivePatientToken } from '../middleware/piccaInteractivePatientToken.js'
import {
  getPiccaInteractivePatientForm,
  listPiccaInteractivePatientWeekEntries,
  savePiccaInteractivePatientEntry,
} from '../services/piccaInteractiveSessions.js'

function todayIsoLisbon(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Lisbon' }).format(new Date())
}

export async function piccaInteractivePatientRoutes(app: FastifyInstance) {
  const withToken = { preHandler: [requirePiccaInteractivePatientToken] }

  app.get('/api/picca-interactive/patient/session/:token', withToken, async (request, reply) => {
    const ctx = request.piccaInteractivePatientSession!
    const session = await prisma.piccaInteractiveSession.findUnique({
      where: { id: ctx.sessionId },
      include: {
        patient: { select: { fullName: true } },
        forms: { include: { form: true }, orderBy: { sortOrder: 'asc' } },
      },
    })

    if (!session) {
      return reply.status(404).send({ error: 'Sessão não encontrada' })
    }

    if (session.status === PiccaSessionStatus.active) {
      await prisma.piccaInteractiveSession.update({
        where: { id: session.id },
        data: { status: PiccaSessionStatus.in_progress },
      })
    }

    const today = todayIsoLisbon()
    const currentWeekStart = getWeekStartMonday(today)

    return {
      session: {
        id: session.id,
        status:
          session.status === PiccaSessionStatus.active
            ? PiccaSessionStatus.in_progress
            : session.status,
        consentAt: session.consentAt,
        patientFirstName: session.patient.fullName.split(' ')[0],
        currentWeekStart,
        today,
        forms: session.forms.map((entry) => ({
          formId: entry.formId,
          title: entry.form.title,
          description: entry.form.description,
          kind: entry.form.kind,
        })),
      },
    }
  })

  app.post(
    '/api/picca-interactive/patient/session/:token/consent',
    withToken,
    async (request, reply) => {
      const ctx = request.piccaInteractivePatientSession!
      const parsed = consentSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'É necessário aceitar o tratamento de dados' })
      }

      const session = await prisma.piccaInteractiveSession.update({
        where: { id: ctx.sessionId },
        data: { consentAt: new Date() },
      })

      return { consentAt: session.consentAt }
    },
  )

  app.get(
    '/api/picca-interactive/patient/session/:token/forms/:formId',
    withToken,
    async (request, reply) => {
      const ctx = request.piccaInteractivePatientSession!
      const { formId } = request.params as { formId: string }
      const query = request.query as { periodKey?: string }

      if (!ctx.consentAt) {
        return reply.status(403).send({ error: 'É necessário aceitar o consentimento primeiro' })
      }

      try {
        const form = await getPiccaInteractivePatientForm(
          ctx.sessionId,
          formId,
          query.periodKey,
        )
        return { form }
      } catch (error) {
        if (error instanceof Error && error.message === 'FORM_NOT_FOUND') {
          return reply.status(404).send({ error: 'Formulário não encontrado' })
        }
        throw error
      }
    },
  )

  app.get(
    '/api/picca-interactive/patient/session/:token/forms/:formId/week',
    withToken,
    async (request, reply) => {
      const ctx = request.piccaInteractivePatientSession!
      const { formId } = request.params as { formId: string }
      const query = request.query as { weekStart?: string }

      if (!ctx.consentAt) {
        return reply.status(403).send({ error: 'É necessário aceitar o consentimento primeiro' })
      }

      const weekStart = query.weekStart ?? getWeekStartMonday(todayIsoLisbon())

      try {
        const entries = await listPiccaInteractivePatientWeekEntries(
          ctx.sessionId,
          formId,
          weekStart,
        )
        return { weekStart, entries }
      } catch (error) {
        if (error instanceof Error && error.message === 'FORM_NOT_FOUND') {
          return reply.status(404).send({ error: 'Formulário não encontrado' })
        }
        if (error instanceof Error && error.message === 'INVALID_FORM_KIND') {
          return reply.status(400).send({ error: 'Formulário inválido' })
        }
        throw error
      }
    },
  )

  app.put(
    '/api/picca-interactive/patient/session/:token/forms/:formId/entries/:periodKey',
    withToken,
    async (request, reply) => {
      const ctx = request.piccaInteractivePatientSession!
      const { formId, periodKey } = request.params as { formId: string; periodKey: string }
      const parsed = piccaDraftSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Dados inválidos' })
      }

      if (!ctx.consentAt) {
        return reply.status(403).send({ error: 'É necessário aceitar o consentimento primeiro' })
      }

      try {
        const entry = await savePiccaInteractivePatientEntry(
          ctx.sessionId,
          formId,
          periodKey,
          parsed.data.answers,
        )
        return entry
      } catch (error) {
        if (error instanceof Error && error.message === 'FORM_NOT_FOUND') {
          return reply.status(404).send({ error: 'Formulário não encontrado' })
        }
        if (error instanceof Error && error.message === 'ENTRY_NOT_EDITABLE') {
          return reply.status(403).send({ error: 'Este registo já não pode ser alterado' })
        }
        throw error
      }
    },
  )
}
