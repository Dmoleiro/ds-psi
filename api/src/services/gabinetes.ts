import { prisma } from '../lib/prisma.js'
import { assertTherapistHasLocation, listTherapistLocations } from './therapistLocations.js'

export function formatGabinete(gabinete: {
  id: string
  locationId: string
  name: string
  active: boolean
  sortOrder: number
  location?: { id: string; name: string }
}) {
  return {
    id: gabinete.id,
    locationId: gabinete.locationId,
    locationName: gabinete.location?.name,
    name: gabinete.name,
    active: gabinete.active,
    sortOrder: gabinete.sortOrder,
  }
}

export async function listGabinetes() {
  const gabinetes = await prisma.gabinete.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      location: { select: { id: true, name: true } },
      _count: { select: { appointments: true } },
    },
  })

  return gabinetes.map(({ _count, location, ...gabinete }) => ({
    ...formatGabinete({ ...gabinete, location }),
    appointmentCount: _count.appointments,
  }))
}

export async function listActiveGabinetesForTherapist(therapistId: string, locationId?: string) {
  if (locationId) {
    await assertTherapistHasLocation(therapistId, locationId)
    return listActiveGabinetes(locationId)
  }

  const locations = await listTherapistLocations(therapistId)
  const locationIds = locations.map((location) => location.id)
  if (locationIds.length === 0) {
    return []
  }

  const gabinetes = await prisma.gabinete.findMany({
    where: {
      active: true,
      locationId: { in: locationIds },
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      location: { select: { id: true, name: true } },
    },
  })

  return gabinetes.map((gabinete) => formatGabinete(gabinete))
}

export async function listActiveGabinetes(locationId?: string) {
  const gabinetes = await prisma.gabinete.findMany({
    where: {
      active: true,
      ...(locationId ? { locationId } : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      location: { select: { id: true, name: true } },
    },
  })
  return gabinetes.map((gabinete) => formatGabinete(gabinete))
}

export async function getActiveGabineteOrThrow(gabineteId: string, locationId?: string) {
  const gabinete = await prisma.gabinete.findFirst({
    where: {
      id: gabineteId,
      active: true,
      ...(locationId ? { locationId } : {}),
    },
    select: { id: true, name: true, locationId: true },
  })
  if (!gabinete) {
    throw new Error('GABINETE_NOT_FOUND')
  }
  return gabinete
}

export async function createGabinete(data: { name: string; locationId: string; sortOrder?: number }) {
  const location = await prisma.location.findFirst({
    where: { id: data.locationId, active: true },
    select: { id: true },
  })
  if (!location) {
    throw new Error('LOCATION_NOT_FOUND')
  }

  const maxSort = await prisma.gabinete.aggregate({ _max: { sortOrder: true } })
  const sortOrder = data.sortOrder ?? (maxSort._max.sortOrder ?? 0) + 1
  const gabinete = await prisma.gabinete.create({
    data: {
      name: data.name.trim(),
      locationId: data.locationId,
      sortOrder,
    },
    include: {
      location: { select: { id: true, name: true } },
    },
  })
  return formatGabinete(gabinete)
}

export async function updateGabinete(
  id: string,
  data: { name?: string; locationId?: string; active?: boolean; sortOrder?: number },
) {
  const existing = await prisma.gabinete.findUnique({ where: { id } })
  if (!existing) {
    throw new Error('GABINETE_NOT_FOUND')
  }

  if (data.locationId !== undefined) {
    const location = await prisma.location.findFirst({
      where: { id: data.locationId, active: true },
      select: { id: true },
    })
    if (!location) {
      throw new Error('LOCATION_NOT_FOUND')
    }
  }

  const gabinete = await prisma.gabinete.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.locationId !== undefined ? { locationId: data.locationId } : {}),
      ...(data.active !== undefined ? { active: data.active } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
    },
    include: {
      location: { select: { id: true, name: true } },
    },
  })
  return formatGabinete(gabinete)
}
