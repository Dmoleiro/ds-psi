import type { FastifyInstance } from 'fastify'
import type { Multipart } from '@fastify/multipart'
import { UserRole } from '@prisma/client'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { workshopBodySchema, workshopPublicQuerySchema } from '../lib/workshopSchemas.js'
import { saveWorkshopImageBuffer } from '../lib/workshopUpload.js'
import {
  createWorkshop,
  deleteWorkshop,
  listAllWorkshops,
  listWorkshopsByStatus,
  updateWorkshop,
} from '../services/workshops.js'

type WorkshopFields = {
  title: string
  description: string
  location: string
  eventDate: string
}

type ParsedImage = {
  buffer: Buffer
  mimetype: string
}

async function parseWorkshopMultipart(parts: AsyncIterableIterator<Multipart>) {
  const fields: Partial<WorkshopFields> = {}
  let image: ParsedImage | null = null

  for await (const part of parts) {
    if (part.type === 'field') {
      fields[part.fieldname as keyof WorkshopFields] = String(part.value)
      continue
    }

    if (part.fieldname === 'image') {
      image = {
        buffer: await part.toBuffer(),
        mimetype: part.mimetype,
      }
    } else {
      await part.toBuffer()
    }
  }

  const parsed = workshopBodySchema.safeParse(fields)
  if (!parsed.success) {
    throw new Error('INVALID_FIELDS')
  }

  return { data: parsed.data, image }
}

export async function workshopRoutes(app: FastifyInstance) {
  const managerOnly = [requireAuth, requireRole(UserRole.admin, UserRole.therapist)]

  app.get('/api/workshops/public', async (request, reply) => {
    const parsed = workshopPublicQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
    }

    const workshops = await listWorkshopsByStatus(parsed.data.status)
    return { workshops }
  })

  app.get('/api/workshops', { preHandler: managerOnly }, async () => {
    const workshops = await listAllWorkshops()
    return { workshops }
  })

  app.post('/api/workshops', { preHandler: managerOnly }, async (request, reply) => {
    try {
      const { data, image } = await parseWorkshopMultipart(request.parts())
      if (!image) {
        return reply.status(400).send({ error: 'É necessário enviar uma imagem' })
      }

      const imagePath = await saveWorkshopImageBuffer(image.buffer, image.mimetype)
      const workshop = await createWorkshop({
        ...data,
        imagePath,
        createdById: request.user!.sub,
      })

      return reply.status(201).send({ workshop })
    } catch (error) {
      if (error instanceof Error && error.message === 'INVALID_FIELDS') {
        return reply.status(400).send({ error: 'Dados inválidos' })
      }
      if (error instanceof Error && error.message === 'INVALID_IMAGE_TYPE') {
        return reply.status(400).send({ error: 'Formato de imagem inválido' })
      }
      if (error instanceof Error && error.message === 'IMAGE_TOO_LARGE') {
        return reply.status(400).send({ error: 'A imagem é demasiado grande (máx. 5 MB)' })
      }
      throw error
    }
  })

  app.patch('/api/workshops/:id', { preHandler: managerOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const { data, image } = await parseWorkshopMultipart(request.parts())
      const imagePath = image
        ? await saveWorkshopImageBuffer(image.buffer, image.mimetype)
        : undefined
      const workshop = await updateWorkshop(id, { ...data, imagePath })
      return { workshop }
    } catch (error) {
      if (error instanceof Error && error.message === 'WORKSHOP_NOT_FOUND') {
        return reply.status(404).send({ error: 'Workshop não encontrado' })
      }
      if (error instanceof Error && error.message === 'INVALID_FIELDS') {
        return reply.status(400).send({ error: 'Dados inválidos' })
      }
      if (error instanceof Error && error.message === 'INVALID_IMAGE_TYPE') {
        return reply.status(400).send({ error: 'Formato de imagem inválido' })
      }
      if (error instanceof Error && error.message === 'IMAGE_TOO_LARGE') {
        return reply.status(400).send({ error: 'A imagem é demasiado grande (máx. 5 MB)' })
      }
      throw error
    }
  })

  app.delete('/api/workshops/:id', { preHandler: managerOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    try {
      await deleteWorkshop(id)
      return reply.status(204).send()
    } catch (error) {
      if (error instanceof Error && error.message === 'WORKSHOP_NOT_FOUND') {
        return reply.status(404).send({ error: 'Workshop não encontrado' })
      }
      throw error
    }
  })
}
