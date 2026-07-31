import { UserRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'

export async function getTherapistNotepad(therapistId: string) {
  const therapist = await prisma.user.findFirst({
    where: { id: therapistId, role: UserRole.therapist },
    select: { notepad: true, updatedAt: true },
  })

  if (!therapist) {
    throw new Error('THERAPIST_NOT_FOUND')
  }

  return {
    content: therapist.notepad ?? '',
    updatedAt: therapist.updatedAt.toISOString(),
  }
}

export async function updateTherapistNotepad(therapistId: string, content: string) {
  const therapist = await prisma.user.findFirst({
    where: { id: therapistId, role: UserRole.therapist },
    select: { id: true },
  })

  if (!therapist) {
    throw new Error('THERAPIST_NOT_FOUND')
  }

  const updated = await prisma.user.update({
    where: { id: therapistId },
    data: { notepad: content },
    select: { notepad: true, updatedAt: true },
  })

  return {
    content: updated.notepad ?? '',
    updatedAt: updated.updatedAt.toISOString(),
  }
}
