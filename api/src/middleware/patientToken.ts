import type { FastifyRequest, FastifyReply } from 'fastify'
import { SessionStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { hashPatientToken } from '../lib/tokens.js'

export type PatientSessionContext = {
  sessionId: string
  patientId: string
  therapistId: string
  status: SessionStatus
  consentAt: Date | null
}

declare module 'fastify' {
  interface FastifyRequest {
    patientSession?: PatientSessionContext
    patientToken?: string
  }
}

function extractToken(request: FastifyRequest): string | null {
  const header = request.headers['x-patient-token']
  if (typeof header === 'string' && header.length > 0) return header
  const params = request.params as { token?: string }
  if (params.token) return params.token
  return null
}

export async function requirePatientToken(request: FastifyRequest, reply: FastifyReply) {
  const rawToken = extractToken(request)
  if (!rawToken) {
    return reply.status(401).send({ error: 'Token em falta' })
  }

  const tokenHash = hashPatientToken(rawToken)
  const session = await prisma.intakeSession.findUnique({
    where: { tokenHash },
    include: { patient: true },
  })

  if (!session) {
    return reply.status(404).send({ error: 'Link inválido' })
  }

  if (session.status === SessionStatus.revoked) {
    return reply.status(410).send({ error: 'Este link foi revogado' })
  }

  if (session.status === SessionStatus.completed) {
    return reply.status(410).send({ error: 'Formulários já submetidos' })
  }

  if (session.expiresAt && session.expiresAt < new Date()) {
    return reply.status(410).send({ error: 'Este link expirou' })
  }

  request.patientToken = rawToken
  request.patientSession = {
    sessionId: session.id,
    patientId: session.patientId,
    therapistId: session.therapistId,
    status: session.status,
    consentAt: session.consentAt,
  }
}
