import type { Announcement } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { getTodayInLisbon } from '../lib/workshopDates.js'
import { deleteAnnouncementImage } from '../lib/announcementUpload.js'

export type AnnouncementView = {
  id: string
  title: string | null
  imagePath: string
  visibleUntil: string
  createdAt: string
  updatedAt: string
}

export type AnnouncementAdminView = AnnouncementView & {
  active: boolean
}

function formatAnnouncementDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function formatAnnouncement(announcement: Announcement): AnnouncementView {
  return {
    id: announcement.id,
    title: announcement.title,
    imagePath: announcement.imagePath,
    visibleUntil: formatAnnouncementDate(announcement.visibleUntil),
    createdAt: announcement.createdAt.toISOString(),
    updatedAt: announcement.updatedAt.toISOString(),
  }
}

function isAnnouncementActive(visibleUntil: string): boolean {
  return visibleUntil >= getTodayInLisbon()
}

export async function listActiveAnnouncements() {
  const today = getTodayInLisbon()
  const announcements = await prisma.announcement.findMany({
    where: {
      visibleUntil: { gte: new Date(`${today}T12:00:00.000Z`) },
    },
    orderBy: { createdAt: 'asc' },
  })

  return announcements.map(formatAnnouncement)
}

export async function listAllAnnouncements() {
  const today = getTodayInLisbon()
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return announcements.map((announcement) => {
    const formatted = formatAnnouncement(announcement)
    return {
      ...formatted,
      active: isAnnouncementActive(formatted.visibleUntil),
    }
  })
}

export async function createAnnouncement(data: {
  title?: string | null
  imagePath: string
  visibleUntil: string
  createdById: string
}) {
  const announcement = await prisma.announcement.create({
    data: {
      title: data.title?.trim() ? data.title.trim() : null,
      imagePath: data.imagePath,
      visibleUntil: new Date(`${data.visibleUntil}T12:00:00.000Z`),
      createdById: data.createdById,
    },
  })
  return formatAnnouncement(announcement)
}

export async function updateAnnouncement(
  id: string,
  data: {
    title?: string | null
    visibleUntil: string
    imagePath?: string
  },
) {
  const existing = await prisma.announcement.findUnique({ where: { id } })
  if (!existing) {
    throw new Error('ANNOUNCEMENT_NOT_FOUND')
  }

  if (data.imagePath && data.imagePath !== existing.imagePath) {
    await deleteAnnouncementImage(existing.imagePath)
  }

  const announcement = await prisma.announcement.update({
    where: { id },
    data: {
      title: data.title?.trim() ? data.title.trim() : null,
      visibleUntil: new Date(`${data.visibleUntil}T12:00:00.000Z`),
      ...(data.imagePath ? { imagePath: data.imagePath } : {}),
    },
  })

  return formatAnnouncement(announcement)
}

export async function deleteAnnouncement(id: string) {
  const existing = await prisma.announcement.findUnique({ where: { id } })
  if (!existing) {
    throw new Error('ANNOUNCEMENT_NOT_FOUND')
  }

  await deleteAnnouncementImage(existing.imagePath)
  await prisma.announcement.delete({ where: { id } })
}
