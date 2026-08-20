import type { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma.js'

export type TherapistFeatureFlags = {
  questionnairesEnabled: boolean
  assessmentResultsEnabled: boolean
}

export async function getTherapistFeatureFlags(therapistId: string): Promise<TherapistFeatureFlags> {
  const user = await prisma.user.findUnique({
    where: { id: therapistId },
    select: { questionnairesEnabled: true, assessmentResultsEnabled: true },
  })

  return {
    questionnairesEnabled: user?.questionnairesEnabled ?? false,
    assessmentResultsEnabled: user?.assessmentResultsEnabled ?? false,
  }
}

async function requireTherapistFlag(
  request: FastifyRequest,
  reply: FastifyReply,
  field: keyof TherapistFeatureFlags,
  errorMessage: string,
) {
  const user = await prisma.user.findUnique({
    where: { id: request.user.sub },
    select: { questionnairesEnabled: true, assessmentResultsEnabled: true },
  })

  if (!user?.[field]) {
    return reply.status(403).send({ error: errorMessage })
  }
}

export async function requireQuestionnairesEnabled(request: FastifyRequest, reply: FastifyReply) {
  return requireTherapistFlag(
    request,
    reply,
    'questionnairesEnabled',
    'Acesso a questionários não autorizado',
  )
}

export async function requireAssessmentResultsEnabled(request: FastifyRequest, reply: FastifyReply) {
  return requireTherapistFlag(
    request,
    reply,
    'assessmentResultsEnabled',
    'Acesso a resultados da avaliação não autorizado',
  )
}
