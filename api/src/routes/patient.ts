import type { FastifyInstance } from 'fastify'
import { createReadStream } from 'node:fs'
import { FormStatus, SessionStatus, type Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { consentSchema, draftSchema, getFormSchema } from '../lib/schemas.js'
import { isDocumentUploadForm } from '../lib/formIds.js'
import { requirePatientToken } from '../middleware/patientToken.js'
import { completeSessionIfReady } from '../services/sessions.js'
import { notifyTherapistOfFormSubmission } from '../services/formNotifications.js'
import { formatFormAnswers } from '../lib/formPresentation.js'
import { parseDocumentUpload } from '../lib/documentMultipart.js'
import {
  getDocumentAbsolutePath,
  getPatientSessionDocument,
  listPatientSessionDocuments,
  uploadPatientSessionDocument,
} from '../services/patientDocuments.js'

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

    if (isDocumentUploadForm(formId)) {
      return {
        form: {
          formId: sessionForm.formId,
          title: sessionForm.definition.title,
          status: sessionForm.status,
          answers: null,
          readOnly: false,
        },
      }
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

    if (isDocumentUploadForm(formId)) {
      return reply.status(400).send({ error: 'Este formulário não utiliza rascunhos' })
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

      if (isDocumentUploadForm(formId)) {
        return reply.status(400).send({ error: 'Este formulário não pode ser submetido' })
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

      notifyTherapistOfFormSubmission(
        ctx.sessionId,
        formId,
        parsed.data as Record<string, unknown>,
      ).catch((err) => {
        request.log.error({ err }, 'Failed to send therapist notification email')
      })

      const session = await prisma.intakeSession.findUnique({ where: { id: ctx.sessionId } })

      return {
        submitted: true,
        sessionStatus: session?.status,
        allComplete: session?.status === SessionStatus.completed,
      }
    },
  )

  app.get('/api/patient/session/:token/documents', withToken, async (request, reply) => {
    const ctx = request.patientSession!
    if (!ctx.consentAt) {
      return reply.status(403).send({ error: 'É necessário aceitar o consentimento primeiro' })
    }

    const documents = await listPatientSessionDocuments(ctx.patientId, ctx.sessionId)
    return { documents }
  })

  app.post('/api/patient/session/:token/documents', withToken, async (request, reply) => {
    const ctx = request.patientSession!
    if (!ctx.consentAt) {
      return reply.status(403).send({ error: 'É necessário aceitar o consentimento primeiro' })
    }

    try {
      const file = await parseDocumentUpload(request.parts())
      const document = await uploadPatientSessionDocument(
        ctx.patientId,
        ctx.therapistId,
        ctx.sessionId,
        file,
      )
      return reply.status(201).send({ document })
    } catch (error) {
      if (error instanceof Error && error.message === 'FILE_REQUIRED') {
        return reply.status(400).send({ error: 'É necessário enviar um ficheiro PDF' })
      }
      if (error instanceof Error && error.message === 'INVALID_DOCUMENT_TYPE') {
        return reply.status(400).send({ error: 'Apenas ficheiros PDF são permitidos' })
      }
      if (error instanceof Error && error.message === 'DOCUMENT_TOO_LARGE') {
        return reply.status(400).send({ error: 'O ficheiro excede o tamanho máximo de 10 MB' })
      }
      throw error
    }
  })

  app.get(
    '/api/patient/session/:token/documents/:documentId/content',
    withToken,
    async (request, reply) => {
      const ctx = request.patientSession!
      const { documentId } = request.params as { documentId: string }

      if (!ctx.consentAt) {
        return reply.status(403).send({ error: 'É necessário aceitar o consentimento primeiro' })
      }

      try {
        const document = await getPatientSessionDocument(
          ctx.patientId,
          ctx.sessionId,
          documentId,
        )
        const absolutePath = getDocumentAbsolutePath(document)
        return reply
          .header('Content-Type', document.mimeType)
          .header(
            'Content-Disposition',
            `inline; filename="${encodeURIComponent(document.originalName)}"`,
          )
          .send(createReadStream(absolutePath))
      } catch (error) {
        if (error instanceof Error && error.message === 'DOCUMENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Documento não encontrado' })
        }
        throw error
      }
    },
  )
}
