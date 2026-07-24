import { prisma } from '../lib/prisma.js'

export async function listTherapistLocations(therapistId: string) {
  const rows = await prisma.therapistLocation.findMany({
    where: {
      therapistId,
      location: { active: true },
    },
    include: {
      location: {
        select: { id: true, name: true, address: true },
      },
    },
    orderBy: { location: { name: 'asc' } },
  })

  return rows.map((row) => row.location)
}

export async function assertTherapistHasLocation(therapistId: string, locationId: string) {
  const link = await prisma.therapistLocation.findFirst({
    where: { therapistId, locationId },
    include: {
      location: { select: { active: true } },
    },
  })

  if (!link || !link.location.active) {
    throw new Error('LOCATION_ACCESS_DENIED')
  }
}

export async function listTherapistLocationsForAdmin(therapistId: string) {
  const therapist = await prisma.user.findFirst({
    where: { id: therapistId, role: 'therapist' },
    select: { id: true },
  })
  if (!therapist) {
    throw new Error('THERAPIST_NOT_FOUND')
  }

  const [locations, assigned] = await Promise.all([
    prisma.location.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, active: true },
    }),
    prisma.therapistLocation.findMany({
      where: { therapistId },
      select: { locationId: true },
    }),
  ])

  const assignedIds = new Set(assigned.map((row) => row.locationId))

  return {
    locations: locations.map((location) => ({
      ...location,
      assigned: assignedIds.has(location.id),
    })),
  }
}

export async function setTherapistLocations(therapistId: string, locationIds: string[]) {
  const therapist = await prisma.user.findFirst({
    where: { id: therapistId, role: 'therapist' },
    select: { id: true },
  })
  if (!therapist) {
    throw new Error('THERAPIST_NOT_FOUND')
  }

  const uniqueIds = [...new Set(locationIds)]
  if (uniqueIds.length > 0) {
    const locations = await prisma.location.findMany({
      where: { id: { in: uniqueIds } },
      select: { id: true },
    })
    if (locations.length !== uniqueIds.length) {
      throw new Error('INVALID_LOCATION')
    }
  }

  await prisma.$transaction([
    prisma.therapistLocation.deleteMany({ where: { therapistId } }),
    ...(uniqueIds.length > 0
      ? [
          prisma.therapistLocation.createMany({
            data: uniqueIds.map((locationId) => ({ therapistId, locationId })),
          }),
        ]
      : []),
  ])

  return listTherapistLocationsForAdmin(therapistId)
}
