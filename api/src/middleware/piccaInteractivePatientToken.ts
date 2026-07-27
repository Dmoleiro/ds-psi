import type { FastifyRequest, FastifyReply } from 'fastify'
import { PiccaSessionStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { hashPatientToken } from '../lib/tokens.js'

export type PiccaInteractivePatientSessionContext = {
  sessionId: string
  patientId: string
  therapistId: string
  status: PiccaSessionStatus
  consentAt: Date | null
}

declare module 'fastify' {
  interface FastifyRequest {
    piccaInteractivePatientSession?: PiccaInteractivePatientSessionContext
    piccaInteractivePatientToken?: string
  }
}

function extractToken(request: FastifyRequest): string | null {
  const header = request.headers['x-patient-token']
  if (typeof header === 'string' && header.length > 0) return header
  const params = request.params as { token?: string }
  if (params.token) return params.token
  return null
}

export async function requirePiccaInteractivePatientToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const rawToken = extractToken(request)
  if (!rawToken) {
    return reply.status(401).send({ error: 'Token em falta' })
  }

  const tokenHash = hashPatientToken(rawToken)
  const session = await prisma.piccaInteractiveSession.findUnique({
    where: { tokenHash },
    include: { patient: true },
  })

  if (!session) {
    return reply.status(404).send({ error: 'Link inválido' })
  }

  if (session.status === PiccaSessionStatus.revoked) {
    return reply.status(410).send({ error: 'Este link foi revogado' })
  }

  request.piccaInteractivePatientToken = rawToken
  request.piccaInteractivePatientSession = {
    sessionId: session.id,
    patientId: session.patientId,
    therapistId: session.therapistId,
    status: session.status,
    consentAt: session.consentAt,
  }
}
