import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { verifyPassword } from '../lib/password.js'
import { loginSchema } from '../lib/schemas.js'
import { requireAuth } from '../middleware/auth.js'

export async function authRoutes(app: FastifyInstance) {
  app.post('/api/auth/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
    if (!user || !user.active) {
      return reply.status(401).send({ error: 'Credenciais inválidas' })
    }

    const valid = await verifyPassword(parsed.data.password, user.passwordHash)
    if (!valid) {
      return reply.status(401).send({ error: 'Credenciais inválidas' })
    }

    const token = await reply.jwtSign({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  })

  app.get('/api/auth/me', { preHandler: [requireAuth] }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user.sub },
      select: { id: true, email: true, name: true, phone: true, role: true, active: true },
    })
    if (!user || !user.active) {
      return reply.status(401).send({ error: 'Não autorizado' })
    }
    return { user }
  })
}
