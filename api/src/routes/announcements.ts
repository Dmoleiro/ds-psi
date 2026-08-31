import type { FastifyInstance } from 'fastify'
import type { Multipart } from '@fastify/multipart'
import { UserRole } from '@prisma/client'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { announcementBodySchema } from '../lib/announcementSchemas.js'
import { saveAnnouncementImageBuffer } from '../lib/announcementUpload.js'
import {
  createAnnouncement,
  deleteAnnouncement,
  listActiveAnnouncements,
  listAllAnnouncements,
  updateAnnouncement,
} from '../services/announcements.js'

type AnnouncementFields = {
  title?: string
  visibleUntil: string
}

type ParsedImage = {
  buffer: Buffer
  mimetype: string
}

async function parseAnnouncementMultipart(parts: AsyncIterableIterator<Multipart>) {
  const fields: Partial<AnnouncementFields> = {}
  let image: ParsedImage | null = null

  for await (const part of parts) {
    if (part.type === 'field') {
      fields[part.fieldname as keyof AnnouncementFields] = String(part.value)
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

  const parsed = announcementBodySchema.safeParse(fields)
  if (!parsed.success) {
    throw new Error('INVALID_FIELDS')
  }

  return { data: parsed.data, image }
}

export async function announcementRoutes(app: FastifyInstance) {
  const adminOnly = [requireAuth, requireRole(UserRole.admin)]

  app.get('/api/announcements/public', async () => {
    const announcements = await listActiveAnnouncements()
    return { announcements }
  })

  app.get('/api/admin/announcements', { preHandler: adminOnly }, async () => {
    const announcements = await listAllAnnouncements()
    return { announcements }
  })

  app.post('/api/admin/announcements', { preHandler: adminOnly }, async (request, reply) => {
    try {
      const { data, image } = await parseAnnouncementMultipart(request.parts())
      if (!image) {
        return reply.status(400).send({ error: 'É necessário enviar uma imagem' })
      }

      const imagePath = await saveAnnouncementImageBuffer(image.buffer, image.mimetype)
      const announcement = await createAnnouncement({
        title: data.title,
        visibleUntil: data.visibleUntil,
        imagePath,
        createdById: request.user!.sub,
      })

      return reply.status(201).send({ announcement })
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

  app.patch('/api/admin/announcements/:id', { preHandler: adminOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const { data, image } = await parseAnnouncementMultipart(request.parts())
      const imagePath = image
        ? await saveAnnouncementImageBuffer(image.buffer, image.mimetype)
        : undefined
      const announcement = await updateAnnouncement(id, {
        title: data.title,
        visibleUntil: data.visibleUntil,
        imagePath,
      })
      return { announcement }
    } catch (error) {
      if (error instanceof Error && error.message === 'ANNOUNCEMENT_NOT_FOUND') {
        return reply.status(404).send({ error: 'Anúncio não encontrado' })
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

  app.delete('/api/admin/announcements/:id', { preHandler: adminOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    try {
      await deleteAnnouncement(id)
      return reply.status(204).send()
    } catch (error) {
      if (error instanceof Error && error.message === 'ANNOUNCEMENT_NOT_FOUND') {
        return reply.status(404).send({ error: 'Anúncio não encontrado' })
      }
      throw error
    }
  })
}
