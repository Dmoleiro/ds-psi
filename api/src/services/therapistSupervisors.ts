import { UserRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'

export async function listAssignedSupervisors(internId: string) {
  const rows = await prisma.therapistSupervisor.findMany({
    where: {
      internId,
      supervisor: { role: UserRole.therapist, active: true, readOnly: false },
    },
    include: {
      supervisor: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { supervisor: { name: 'asc' } },
  })

  return rows.map((row) => row.supervisor)
}

export async function assertInternHasSupervisor(internId: string, supervisorId: string) {
  if (internId === supervisorId) {
    return
  }

  const assignment = await prisma.therapistSupervisor.findFirst({
    where: {
      internId,
      supervisorId,
      supervisor: { role: UserRole.therapist, active: true, readOnly: false },
    },
    select: { supervisorId: true },
  })

  if (!assignment) {
    throw new Error('THERAPIST_ACCESS_DENIED')
  }
}

export async function listTherapistSupervisorsForAdmin(internId: string) {
  const intern = await prisma.user.findFirst({
    where: { id: internId, role: UserRole.therapist },
    select: { id: true, readOnly: true },
  })
  if (!intern) {
    throw new Error('THERAPIST_NOT_FOUND')
  }

  const [therapists, assigned] = await Promise.all([
    prisma.user.findMany({
      where: { role: UserRole.therapist, readOnly: false },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, email: true, active: true },
    }),
    prisma.therapistSupervisor.findMany({
      where: { internId },
      select: { supervisorId: true },
    }),
  ])

  const assignedIds = new Set(assigned.map((row) => row.supervisorId))

  return {
    therapists: therapists.map((therapist) => ({
      ...therapist,
      assigned: assignedIds.has(therapist.id),
    })),
  }
}

export async function setTherapistSupervisors(internId: string, supervisorIds: string[]) {
  const intern = await prisma.user.findFirst({
    where: { id: internId, role: UserRole.therapist },
    select: { id: true },
  })
  if (!intern) {
    throw new Error('THERAPIST_NOT_FOUND')
  }

  const uniqueIds = [...new Set(supervisorIds)]
  if (uniqueIds.length > 0) {
    const supervisors = await prisma.user.findMany({
      where: {
        id: { in: uniqueIds },
        role: UserRole.therapist,
        readOnly: false,
      },
      select: { id: true },
    })
    if (supervisors.length !== uniqueIds.length) {
      throw new Error('INVALID_SUPERVISOR')
    }
  }

  await prisma.$transaction([
    prisma.therapistSupervisor.deleteMany({ where: { internId } }),
    ...(uniqueIds.length > 0
      ? [
          prisma.therapistSupervisor.createMany({
            data: uniqueIds.map((supervisorId) => ({ internId, supervisorId })),
          }),
        ]
      : []),
  ])

  return listTherapistSupervisorsForAdmin(internId)
}
