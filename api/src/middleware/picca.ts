import type { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma.js'

export async function requirePiccaEnabled(request: FastifyRequest, reply: FastifyReply) {
  const user = await prisma.user.findUnique({
    where: { id: request.user.sub },
    select: { piccaEnabled: true },
  })

  if (!user?.piccaEnabled) {
    return reply.status(403).send({ error: 'Acesso PICCA não autorizado' })
  }
}
