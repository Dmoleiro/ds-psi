import type { FastifyReply, FastifyRequest } from 'fastify'
import { UserRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'

export async function requireWriteTherapist(request: FastifyRequest, reply: FastifyReply) {
  const user = await prisma.user.findUnique({
    where: { id: request.user.sub },
    select: { role: true, readOnly: true },
  })

  if (user?.role === UserRole.therapist && user.readOnly) {
    return reply.status(403).send({ error: 'Conta somente leitura — não pode alterar dados' })
  }
}
