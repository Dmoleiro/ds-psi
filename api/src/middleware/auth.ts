import type { FastifyReply, FastifyRequest } from 'fastify'
import type { UserRole } from '@prisma/client'

export type JwtUser = {
  sub: string
  email: string
  role: UserRole
  name: string
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtUser
    user: JwtUser
  }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ error: 'Não autorizado' })
  }
}

export function requireRole(...roles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user
    if (!user || !roles.includes(user.role)) {
      return reply.status(403).send({ error: 'Acesso negado' })
    }
  }
}
