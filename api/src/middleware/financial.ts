import type { FastifyReply, FastifyRequest } from 'fastify'
import { UserRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'

export async function requireFinancialOverview(request: FastifyRequest, reply: FastifyReply) {
  const user = await prisma.user.findFirst({
    where: { id: request.user.sub, role: UserRole.therapist, active: true },
    select: { financialOverviewEnabled: true },
  })

  if (!user?.financialOverviewEnabled) {
    return reply.status(403).send({ error: 'Acesso negado à área de finanças' })
  }
}
