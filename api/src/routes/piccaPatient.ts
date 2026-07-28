import type { FastifyInstance } from 'fastify'
import { FormStatus, PiccaSessionStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { canPatientAccessPiccaModule } from '../lib/piccaAccess.js'
import { consentSchema, piccaDraftSchema } from '../lib/schemas.js'
import { requirePiccaPatientToken } from '../middleware/piccaPatientToken.js'
import {
  assertPatientCanAccessModule,
  completePiccaPatientSession,
  getPatientModuleReadOnly,
  savePiccaPatientDraft,
  submitPiccaPatientModule,
} from '../services/piccaSessions.js'

export async function piccaPatientRoutes(app: FastifyInstance) {
  const withToken = { preHandler: [requirePiccaPatientToken] }

  app.get('/api/picca/patient/session/:token', withToken, async (request, reply) => {
    const ctx = request.piccaPatientSession!
    const session = await prisma.piccaSession.findUnique({
      where: { id: ctx.sessionId },
      include: {
        patient: { select: { fullName: true } },
        modules: {
          include: { module: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!session) {
      return reply.status(404).send({ error: 'Sessão não encontrada' })
    }

    if (session.status === PiccaSessionStatus.active) {
      await prisma.piccaSession.update({
        where: { id: session.id },
        data: { status: PiccaSessionStatus.in_progress },
      })
    }

    const modules = session.modules
    const patientModules = modules.filter((m) => !m.module.therapistOnly)
    const currentIndex = patientModules.findIndex((m) => m.status !== FormStatus.submitted)
    const sessionStatus =
      session.status === PiccaSessionStatus.active
        ? PiccaSessionStatus.in_progress
        : session.status
    const locked = getPatientModuleReadOnly(sessionStatus)
    const allSubmitted = patientModules.every((m) => m.status === FormStatus.submitted)

    return {
      session: {
        id: session.id,
        status: sessionStatus,
        consentAt: session.consentAt,
        patientFirstName: session.patient.fullName.split(' ')[0],
        totalModules: patientModules.length,
        completedModules: patientModules.filter((m) => m.status === FormStatus.submitted).length,
        currentModuleIndex: currentIndex === -1 ? patientModules.length : currentIndex,
        locked,
        canFinalize: allSubmitted && !locked,
        modules: patientModules.map((m, index) => ({
          moduleId: m.moduleId,
          title: m.module.title,
          description: m.module.description,
          volume: m.module.volume,
          moduleNumber: m.module.moduleNumber,
          status: m.status,
          accessible: canPatientAccessPiccaModule(patientModules, index),
          readOnly: locked,
        })),
      },
    }
  })

  app.post('/api/picca/patient/session/:token/consent', withToken, async (request, reply) => {
    const ctx = request.piccaPatientSession!
    const parsed = consentSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'É necessário aceitar o tratamento de dados' })
    }

    const session = await prisma.piccaSession.update({
      where: { id: ctx.sessionId },
      data: { consentAt: new Date() },
    })

    return { consentAt: session.consentAt }
  })

  app.get(
    '/api/picca/patient/session/:token/modules/:moduleId',
    withToken,
    async (request, reply) => {
      const ctx = request.piccaPatientSession!
      const { moduleId } = request.params as { moduleId: string }

      if (!ctx.consentAt) {
        return reply.status(403).send({ error: 'É necessário aceitar o consentimento primeiro' })
      }

      const session = await prisma.piccaSession.findUnique({
        where: { id: ctx.sessionId },
        include: {
          modules: {
            include: { module: true, draft: true, submission: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
      })
      if (!session) {
        return reply.status(404).send({ error: 'Sessão não encontrada' })
      }

      const patientModules = session.modules.filter((m) => !m.module.therapistOnly)
      const moduleIndex = patientModules.findIndex((m) => m.moduleId === moduleId)
      if (moduleIndex === -1) {
        return reply.status(404).send({ error: 'Módulo não encontrado' })
      }

      try {
        assertPatientCanAccessModule(patientModules, moduleIndex)
      } catch {
        return reply.status(403).send({ error: 'Complete os módulos anteriores primeiro' })
      }

      const mod = patientModules[moduleIndex]!
      const readOnly = getPatientModuleReadOnly(session.status)
      const answers =
        (mod.submission?.answersJson as Record<string, unknown> | undefined) ??
        (mod.draft?.answersJson as Record<string, unknown> | undefined) ??
        {}

      return {
        module: {
          moduleId: mod.moduleId,
          title: mod.module.title,
          description: mod.module.description,
          status: mod.status,
          readOnly,
          answers,
        },
      }
    },
  )

  app.put(
    '/api/picca/patient/session/:token/modules/:moduleId/draft',
    withToken,
    async (request, reply) => {
      const ctx = request.piccaPatientSession!
      const { moduleId } = request.params as { moduleId: string }
      const parsed = piccaDraftSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Dados inválidos' })
      }

      if (!ctx.consentAt) {
        return reply.status(403).send({ error: 'É necessário aceitar o consentimento primeiro' })
      }

      const session = await prisma.piccaSession.findUnique({
        where: { id: ctx.sessionId },
        include: {
          modules: { include: { module: true }, orderBy: { sortOrder: 'asc' } },
        },
      })
      if (!session) {
        return reply.status(404).send({ error: 'Sessão não encontrada' })
      }

      if (!session) {
        return reply.status(404).send({ error: 'Sessão não encontrada' })
      }

      if (getPatientModuleReadOnly(session.status)) {
        return reply.status(403).send({ error: 'Esta sessão já foi concluída e não pode ser alterada' })
      }

      const patientModules = session.modules.filter((m) => !m.module.therapistOnly)
      const moduleIndex = patientModules.findIndex((m) => m.moduleId === moduleId)
      if (moduleIndex === -1) {
        return reply.status(404).send({ error: 'Módulo não encontrado' })
      }

      try {
        assertPatientCanAccessModule(patientModules, moduleIndex)
      } catch {
        return reply.status(403).send({ error: 'Complete os módulos anteriores primeiro' })
      }

      const mod = patientModules[moduleIndex]!

      await savePiccaPatientDraft(mod.id, parsed.data.answers)

      return { ok: true }
    },
  )

  app.post(
    '/api/picca/patient/session/:token/modules/:moduleId/submit',
    withToken,
    async (request, reply) => {
      const ctx = request.piccaPatientSession!
      const { moduleId } = request.params as { moduleId: string }
      const parsed = piccaDraftSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Dados inválidos' })
      }

      if (!ctx.consentAt) {
        return reply.status(403).send({ error: 'É necessário aceitar o consentimento primeiro' })
      }

      const session = await prisma.piccaSession.findUnique({
        where: { id: ctx.sessionId },
        include: {
          modules: { include: { module: true }, orderBy: { sortOrder: 'asc' } },
        },
      })
      if (!session) {
        return reply.status(404).send({ error: 'Sessão não encontrada' })
      }

      if (getPatientModuleReadOnly(session.status)) {
        return reply.status(403).send({ error: 'Esta sessão já foi concluída e não pode ser alterada' })
      }

      const patientModules = session.modules.filter((m) => !m.module.therapistOnly)
      const moduleIndex = patientModules.findIndex((m) => m.moduleId === moduleId)
      if (moduleIndex === -1) {
        return reply.status(404).send({ error: 'Módulo não encontrado' })
      }

      try {
        assertPatientCanAccessModule(patientModules, moduleIndex)
      } catch {
        return reply.status(403).send({ error: 'Complete os módulos anteriores primeiro' })
      }

      const mod = patientModules[moduleIndex]!
      await submitPiccaPatientModule(mod.id, session.id, parsed.data.answers)

      const refreshed = await prisma.piccaSession.findUnique({
        where: { id: session.id },
        include: { modules: { include: { module: true }, orderBy: { sortOrder: 'asc' } } },
      })

      const refreshedPatientModules = refreshed!.modules.filter((m) => !m.module.therapistOnly)
      const allSubmitted = refreshedPatientModules.every((m) => m.status === FormStatus.submitted)

      return { ok: true, allSubmitted }
    },
  )

  app.post('/api/picca/patient/session/:token/complete', withToken, async (request, reply) => {
    const ctx = request.piccaPatientSession!

    if (!ctx.consentAt) {
      return reply.status(403).send({ error: 'É necessário aceitar o consentimento primeiro' })
    }

    try {
      const session = await completePiccaPatientSession(ctx.sessionId)
      return { status: session.status }
    } catch (error) {
      if (error instanceof Error && error.message === 'SESSION_NOT_FOUND') {
        return reply.status(404).send({ error: 'Sessão não encontrada' })
      }
      if (error instanceof Error && error.message === 'SESSION_ALREADY_COMPLETED') {
        return reply.status(400).send({ error: 'Esta sessão já foi concluída' })
      }
      if (error instanceof Error && error.message === 'MODULES_INCOMPLETE') {
        return reply.status(400).send({ error: 'Submeta todos os módulos antes de concluir' })
      }
      throw error
    }
  })
}
