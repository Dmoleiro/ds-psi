import { UserRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'

export async function listAssignedCoordinatorTherapists(coordinatorId: string) {
  const rows = await prisma.coordinatorTherapist.findMany({
    where: {
      coordinatorId,
      therapist: { role: UserRole.therapist, active: true },
    },
    include: {
      therapist: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { therapist: { name: 'asc' } },
  })

  return rows.map((row) => row.therapist)
}

export async function assertCoordinatorHasTherapist(coordinatorId: string, therapistId: string) {
  const assignment = await prisma.coordinatorTherapist.findFirst({
    where: {
      coordinatorId,
      therapistId,
      therapist: { role: UserRole.therapist, active: true },
    },
    select: { therapistId: true },
  })

  if (!assignment) {
    throw new Error('THERAPIST_ACCESS_DENIED')
  }
}

export async function listCoordinatorTherapistsForAdmin(coordinatorId: string) {
  const coordinator = await prisma.user.findFirst({
    where: { id: coordinatorId, role: UserRole.coordinator },
    select: { id: true },
  })
  if (!coordinator) {
    throw new Error('COORDINATOR_NOT_FOUND')
  }

  const [therapists, assigned] = await Promise.all([
    prisma.user.findMany({
      where: { role: UserRole.therapist },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, email: true, active: true },
    }),
    prisma.coordinatorTherapist.findMany({
      where: { coordinatorId },
      select: { therapistId: true },
    }),
  ])

  const assignedIds = new Set(assigned.map((row) => row.therapistId))

  return {
    therapists: therapists.map((therapist) => ({
      ...therapist,
      assigned: assignedIds.has(therapist.id),
    })),
  }
}

export async function setCoordinatorTherapists(coordinatorId: string, therapistIds: string[]) {
  const coordinator = await prisma.user.findFirst({
    where: { id: coordinatorId, role: UserRole.coordinator },
    select: { id: true },
  })
  if (!coordinator) {
    throw new Error('COORDINATOR_NOT_FOUND')
  }

  const uniqueIds = [...new Set(therapistIds)]
  if (uniqueIds.length > 0) {
    const therapists = await prisma.user.findMany({
      where: { id: { in: uniqueIds }, role: UserRole.therapist },
      select: { id: true },
    })
    if (therapists.length !== uniqueIds.length) {
      throw new Error('INVALID_THERAPIST')
    }
  }

  await prisma.$transaction([
    prisma.coordinatorTherapist.deleteMany({ where: { coordinatorId } }),
    ...(uniqueIds.length > 0
      ? [
          prisma.coordinatorTherapist.createMany({
            data: uniqueIds.map((therapistId) => ({ coordinatorId, therapistId })),
          }),
        ]
      : []),
  ])

  return listCoordinatorTherapistsForAdmin(coordinatorId)
}
