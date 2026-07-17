import type { Workshop } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { formatWorkshopDate, isWorkshopUpcoming } from '../lib/workshopDates.js'
import { deleteWorkshopImage } from '../lib/workshopUpload.js'

export type WorkshopView = {
  id: string
  title: string
  description: string
  location: string
  eventDate: string
  imagePath: string
  createdAt: string
  updatedAt: string
}

export function formatWorkshop(workshop: Workshop): WorkshopView {
  return {
    id: workshop.id,
    title: workshop.title,
    description: workshop.description,
    location: workshop.location,
    eventDate: formatWorkshopDate(workshop.eventDate),
    imagePath: workshop.imagePath,
    createdAt: workshop.createdAt.toISOString(),
    updatedAt: workshop.updatedAt.toISOString(),
  }
}

export async function listWorkshopsByStatus(status: 'upcoming' | 'past') {
  const workshops = await prisma.workshop.findMany({
    orderBy: { eventDate: status === 'upcoming' ? 'asc' : 'desc' },
  })

  return workshops
    .filter((workshop) =>
      status === 'upcoming' ? isWorkshopUpcoming(workshop.eventDate) : !isWorkshopUpcoming(workshop.eventDate),
    )
    .map(formatWorkshop)
}

export async function listAllWorkshops() {
  const workshops = await prisma.workshop.findMany({
    orderBy: { eventDate: 'desc' },
  })
  return workshops.map((workshop) => ({
    ...formatWorkshop(workshop),
    status: isWorkshopUpcoming(workshop.eventDate) ? 'upcoming' : 'past',
  }))
}

export async function createWorkshop(data: {
  title: string
  description: string
  location: string
  eventDate: string
  imagePath: string
  createdById: string
}) {
  const workshop = await prisma.workshop.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      eventDate: new Date(`${data.eventDate}T12:00:00.000Z`),
      imagePath: data.imagePath,
      createdById: data.createdById,
    },
  })
  return formatWorkshop(workshop)
}

export async function updateWorkshop(
  id: string,
  data: {
    title: string
    description: string
    location: string
    eventDate: string
    imagePath?: string
  },
) {
  const existing = await prisma.workshop.findUnique({ where: { id } })
  if (!existing) {
    throw new Error('WORKSHOP_NOT_FOUND')
  }

  if (data.imagePath && data.imagePath !== existing.imagePath) {
    await deleteWorkshopImage(existing.imagePath)
  }

  const workshop = await prisma.workshop.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      eventDate: new Date(`${data.eventDate}T12:00:00.000Z`),
      ...(data.imagePath ? { imagePath: data.imagePath } : {}),
    },
  })

  return formatWorkshop(workshop)
}

export async function deleteWorkshop(id: string) {
  const existing = await prisma.workshop.findUnique({ where: { id } })
  if (!existing) {
    throw new Error('WORKSHOP_NOT_FOUND')
  }

  await deleteWorkshopImage(existing.imagePath)
  await prisma.workshop.delete({ where: { id } })
}
