import type { FastifyInstance } from 'fastify'
import { FormStatus, SessionStatus, type Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { consentSchema, draftSchema, getFormSchema } from '../lib/schemas.js'
import { requirePatientToken } from '../middleware/patientToken.js'
import { completeSessionIfReady } from '../services/sessions.js'

export async function patientRoutes(app: FastifyInstance) {
  const withToken = { preHandler: [requirePatientToken] }

  app.get('/api/patient/session/:token', withToken, async (request, reply) => {
    const ctx = request.patientSession!
    const session = await prisma.intakeSession.findUnique({
      where: { id: ctx.sessionId },
      include: {
        patient: { select: { fullName: true } },
        forms: {
          include: { definition: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!session) {
      return reply.status(404).send({ error: 'Sessão não encontrada' })
    }

    if (session.status === SessionStatus.active) {
      await prisma.intakeSession.update({
        where: { id: session.id },
        data: { status: SessionStatus.in_progress },
      })
    }

    return {
      session: {
        id: session.id,
        status: session.status === SessionStatus.active ? SessionStatus.in_progress : session.status,
        consentAt: session.consentAt,
        patientFirstName: session.patient.fullName.split(' ')[0],
        forms: session.forms.map((f) => ({
          formId: f.formId,
          title: f.definition.title,
          description: f.definition.description,
          status: f.status,
        })),
      },
    }
  })

  app.post('/api/patient/session/:token/consent', withToken, async (request, reply) => {
    const ctx = request.patientSession!
    const parsed = consentSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'É necessário aceitar o tratamento de dados' })
    }

    const session = await prisma.intakeSession.update({
      where: { id: ctx.sessionId },
      data: { consentAt: new Date() },
    })

    return { consentAt: session.consentAt }
  })

  app.get('/api/patient/session/:token/forms/:formId', withToken, async (request, reply) => {
    const ctx = request.patientSession!
    const { formId } = request.params as { formId: string }

    if (!ctx.consentAt) {
      return reply.status(403).send({ error: 'É necessário aceitar o consentimento primeiro' })
    }

    const sessionForm = await prisma.sessionForm.findFirst({
      where: { sessionId: ctx.sessionId, formId },
      include: { draft: true, submission: true, definition: true },
    })

    if (!sessionForm) {
      return reply.status(404).send({ error: 'Formulário não encontrado' })
    }

    if (sessionForm.status === FormStatus.submitted) {
      return {
        form: {
          formId: sessionForm.formId,
          title: sessionForm.definition.title,
          status: sessionForm.status,
          answers: sessionForm.submission?.answersJson ?? null,
          readOnly: true,
        },
      }
    }

    return {
      form: {
        formId: sessionForm.formId,
        title: sessionForm.definition.title,
        status: sessionForm.status,
        answers: sessionForm.draft?.answersJson ?? null,
        readOnly: false,
      },
    }
  })

  app.put('/api/patient/session/:token/forms/:formId/draft', withToken, async (request, reply) => {
    const ctx = request.patientSession!
    const { formId } = request.params as { formId: string }

    if (!ctx.consentAt) {
      return reply.status(403).send({ error: 'É necessário aceitar o consentimento primeiro' })
    }

    const parsed = draftSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos' })
    }

    const sessionForm = await prisma.sessionForm.findFirst({
      where: { sessionId: ctx.sessionId, formId },
    })
    if (!sessionForm) {
      return reply.status(404).send({ error: 'Formulário não encontrado' })
    }
    if (sessionForm.status === FormStatus.submitted) {
      return reply.status(400).send({ error: 'Formulário já submetido' })
    }

    await prisma.formDraft.upsert({
      where: { sessionFormId: sessionForm.id },
      create: {
        sessionFormId: sessionForm.id,
        answersJson: parsed.data.answers as Prisma.InputJsonValue,
      },
      update: {
        answersJson: parsed.data.answers as Prisma.InputJsonValue,
      },
    })

    if (sessionForm.status === FormStatus.not_started) {
      await prisma.sessionForm.update({
        where: { id: sessionForm.id },
        data: { status: FormStatus.in_progress },
      })
    }

    return { saved: true }
  })

  app.post(
    '/api/patient/session/:token/forms/:formId/submit',
    withToken,
    async (request, reply) => {
      const ctx = request.patientSession!
      const { formId } = request.params as { formId: string }

      if (!ctx.consentAt) {
        return reply.status(403).send({ error: 'É necessário aceitar o consentimento primeiro' })
      }

      const schema = getFormSchema(formId)
      if (!schema) {
        return reply.status(404).send({ error: 'Formulário não encontrado' })
      }

      const parsed = schema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Dados inválidos',
          details: parsed.error.flatten(),
        })
      }

      const sessionForm = await prisma.sessionForm.findFirst({
        where: { sessionId: ctx.sessionId, formId },
      })
      if (!sessionForm) {
        return reply.status(404).send({ error: 'Formulário não encontrado' })
      }
      if (sessionForm.status === FormStatus.submitted) {
        return reply.status(400).send({ error: 'Formulário já submetido' })
      }

      const ip = request.ip

      await prisma.$transaction(async (tx) => {
        await tx.formSubmission.create({
          data: {
            sessionFormId: sessionForm.id,
            answersJson: parsed.data as Prisma.InputJsonValue,
            ip,
          },
        })
        await tx.formDraft.deleteMany({ where: { sessionFormId: sessionForm.id } })
        await tx.sessionForm.update({
          where: { id: sessionForm.id },
          data: { status: FormStatus.submitted },
        })
      })

      await completeSessionIfReady(ctx.sessionId)

      const session = await prisma.intakeSession.findUnique({ where: { id: ctx.sessionId } })

      return {
        submitted: true,
        sessionStatus: session?.status,
        allComplete: session?.status === SessionStatus.completed,
      }
    },
  )
}
