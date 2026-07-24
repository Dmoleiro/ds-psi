import type { FastifyInstance } from 'fastify'
import { UserRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { hashPassword } from '../lib/password.js'
import { createTherapistSchema, updateTherapistSchema, createLocationSchema, updateLocationSchema, createGabineteSchema, updateGabineteSchema, createCoordinatorSchema, updateCoordinatorSchema, financialSettingsSchema, setTherapistLocationsSchema } from '../lib/schemas.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { getOrCreateFinancialSettings, updateFinancialSettings } from '../services/financialSettings.js'
import { createGabinete, listGabinetes, updateGabinete } from '../services/gabinetes.js'
import { listTherapistLocationsForAdmin, setTherapistLocations } from '../services/therapistLocations.js'

export async function adminRoutes(app: FastifyInstance) {
  const adminOnly = [requireAuth, requireRole(UserRole.admin)]

  app.get('/api/admin/therapists', { preHandler: adminOnly }, async () => {
    const therapists = await prisma.user.findMany({
      where: { role: UserRole.therapist },
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
        financialOverviewEnabled: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    })
    return { therapists }
  })

  app.post('/api/admin/therapists', { preHandler: adminOnly }, async (request, reply) => {
    const parsed = createTherapistSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
    if (existing) {
      return reply.status(409).send({ error: 'Email já registado' })
    }

    const passwordHash = await hashPassword(parsed.data.password)
    const therapist = await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        role: UserRole.therapist,
        passwordHash,
      },
      select: { id: true, email: true, name: true, active: true, financialOverviewEnabled: true, createdAt: true },
    })

    return reply.status(201).send({ therapist })
  })

  app.patch('/api/admin/therapists/:id', { preHandler: adminOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const parsed = updateTherapistSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    const therapist = await prisma.user.findFirst({
      where: { id, role: UserRole.therapist },
    })
    if (!therapist) {
      return reply.status(404).send({ error: 'Terapeuta não encontrado' })
    }

    const data: {
      name?: string
      active?: boolean
      financialOverviewEnabled?: boolean
      passwordHash?: string
    } = {}
    if (parsed.data.name !== undefined) data.name = parsed.data.name
    if (parsed.data.active !== undefined) data.active = parsed.data.active
    if (parsed.data.financialOverviewEnabled !== undefined) {
      data.financialOverviewEnabled = parsed.data.financialOverviewEnabled
    }
    if (parsed.data.password) data.passwordHash = await hashPassword(parsed.data.password)

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, active: true, financialOverviewEnabled: true, createdAt: true },
    })

    return { therapist: updated }
  })

  app.get('/api/admin/therapists/:id/locations', { preHandler: adminOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const data = await listTherapistLocationsForAdmin(id)
      return data
    } catch (error) {
      if (error instanceof Error && error.message === 'THERAPIST_NOT_FOUND') {
        return reply.status(404).send({ error: 'Terapeuta não encontrado' })
      }
      throw error
    }
  })

  app.put('/api/admin/therapists/:id/locations', { preHandler: adminOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const parsed = setTherapistLocationsSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    try {
      const data = await setTherapistLocations(id, parsed.data.locationIds)
      return data
    } catch (error) {
      if (error instanceof Error && error.message === 'THERAPIST_NOT_FOUND') {
        return reply.status(404).send({ error: 'Terapeuta não encontrado' })
      }
      if (error instanceof Error && error.message === 'INVALID_LOCATION') {
        return reply.status(400).send({ error: 'Local inválido' })
      }
      throw error
    }
  })

  app.get('/api/admin/therapists/:id/financial-settings', { preHandler: adminOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const therapist = await prisma.user.findFirst({
      where: { id, role: UserRole.therapist },
      select: { id: true },
    })
    if (!therapist) {
      return reply.status(404).send({ error: 'Terapeuta não encontrado' })
    }

    const settings = await getOrCreateFinancialSettings(id)
    return { settings }
  })

  app.put('/api/admin/therapists/:id/financial-settings', { preHandler: adminOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const parsed = financialSettingsSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    const therapist = await prisma.user.findFirst({
      where: { id, role: UserRole.therapist },
      select: { id: true },
    })
    if (!therapist) {
      return reply.status(404).send({ error: 'Terapeuta não encontrado' })
    }

    const settings = await updateFinancialSettings(id, parsed.data)
    return { settings }
  })

  app.get('/api/admin/coordinators', { preHandler: adminOnly }, async () => {
    const coordinators = await prisma.user.findMany({
      where: { role: UserRole.coordinator },
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
        financialOverviewEnabled: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    })
    return { coordinators }
  })

  app.post('/api/admin/coordinators', { preHandler: adminOnly }, async (request, reply) => {
    const parsed = createCoordinatorSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
    if (existing) {
      return reply.status(409).send({ error: 'Email já registado' })
    }

    const passwordHash = await hashPassword(parsed.data.password)
    const coordinator = await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        role: UserRole.coordinator,
        passwordHash,
      },
      select: { id: true, email: true, name: true, active: true, financialOverviewEnabled: true, createdAt: true },
    })

    return reply.status(201).send({ coordinator })
  })

  app.patch('/api/admin/coordinators/:id', { preHandler: adminOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const parsed = updateCoordinatorSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    const coordinator = await prisma.user.findFirst({
      where: { id, role: UserRole.coordinator },
    })
    if (!coordinator) {
      return reply.status(404).send({ error: 'Utilizador administrativo não encontrado' })
    }

    const data: { name?: string; active?: boolean; passwordHash?: string } = {}
    if (parsed.data.name !== undefined) data.name = parsed.data.name
    if (parsed.data.active !== undefined) data.active = parsed.data.active
    if (parsed.data.password) data.passwordHash = await hashPassword(parsed.data.password)

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, active: true, financialOverviewEnabled: true, createdAt: true },
    })

    return { coordinator: updated }
  })

  app.delete('/api/admin/coordinators/:id', { preHandler: adminOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }

    const coordinator = await prisma.user.findFirst({
      where: { id, role: UserRole.coordinator },
    })
    if (!coordinator) {
      return reply.status(404).send({ error: 'Utilizador administrativo não encontrado' })
    }

    await prisma.user.delete({ where: { id } })
    return reply.status(204).send()
  })

  app.get('/api/admin/locations', { preHandler: adminOnly }, async () => {
    const locations = await prisma.location.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { patients: true } } },
    })
    return {
      locations: locations.map(({ _count, ...location }) => ({
        ...location,
        patientCount: _count.patients,
      })),
    }
  })

  app.post('/api/admin/locations', { preHandler: adminOnly }, async (request, reply) => {
    const parsed = createLocationSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    const location = await prisma.location.create({
      data: {
        name: parsed.data.name,
        address: parsed.data.address || null,
      },
    })
    return reply.status(201).send({ location })
  })

  app.patch('/api/admin/locations/:id', { preHandler: adminOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const parsed = updateLocationSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    const existing = await prisma.location.findUnique({ where: { id } })
    if (!existing) {
      return reply.status(404).send({ error: 'Local não encontrado' })
    }

    const location = await prisma.location.update({
      where: { id },
      data: {
        name: parsed.data.name,
        address: parsed.data.address,
        active: parsed.data.active,
      },
    })
    return { location }
  })

  app.get('/api/admin/gabinetes', { preHandler: adminOnly }, async () => {
    const gabinetes = await listGabinetes()
    return { gabinetes }
  })

  app.post('/api/admin/gabinetes', { preHandler: adminOnly }, async (request, reply) => {
    const parsed = createGabineteSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    try {
      const gabinete = await createGabinete(parsed.data)
      return reply.status(201).send({ gabinete })
    } catch (error) {
      if (error instanceof Error && error.message === 'LOCATION_NOT_FOUND') {
        return reply.status(404).send({ error: 'Local não encontrado' })
      }
      throw error
    }
  })

  app.patch('/api/admin/gabinetes/:id', { preHandler: adminOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const parsed = updateGabineteSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    try {
      const gabinete = await updateGabinete(id, parsed.data)
      return { gabinete }
    } catch (error) {
      if (error instanceof Error && error.message === 'GABINETE_NOT_FOUND') {
        return reply.status(404).send({ error: 'Gabinete não encontrado' })
      }
      if (error instanceof Error && error.message === 'LOCATION_NOT_FOUND') {
        return reply.status(404).send({ error: 'Local não encontrado' })
      }
      throw error
    }
  })
}
