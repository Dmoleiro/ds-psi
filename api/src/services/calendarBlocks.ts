import { prisma } from '../lib/prisma.js'
import { parseDateOnly } from './attendance.js'
import {
  appointmentsOverlap,
  formatAppointmentDate,
  formatAppointmentTime,
  parseAppointmentMonth,
  parseScheduledAt,
} from './appointments.js'

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

export type CalendarBlockInput = {
  date: string
  startTime: string
  endTime: string
  title?: string | null
  notes?: string | null
}

export class BlockedTimeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BlockedTimeError'
  }
}

export function parseBlockRange(
  date: string,
  startTime: string,
  endTime: string,
): { startsAt: Date; endsAt: Date } | null {
  const day = parseDateOnly(date)
  if (!day) return null
  if (!TIME_PATTERN.test(startTime) || !TIME_PATTERN.test(endTime)) return null

  const startsAt = parseScheduledAt(date, startTime)
  const endsAt = parseScheduledAt(date, endTime)
  if (!startsAt || !endsAt || endsAt <= startsAt) return null
  return { startsAt, endsAt }
}

export function formatCalendarBlock(block: {
  id: string
  startsAt: Date
  endsAt: Date
  title: string | null
  notes: string | null
}) {
  const date = formatAppointmentDate(block.startsAt)
  const startTime = formatAppointmentTime(block.startsAt)
  const endTime = formatAppointmentTime(block.endsAt)
  return {
    id: block.id,
    date,
    startTime,
    endTime,
    title: block.title?.trim() ? block.title.trim() : null,
    notes: block.notes?.trim() ? block.notes.trim() : null,
    label: block.title?.trim() || 'Bloqueado',
  }
}

export async function listTherapistCalendarBlocks(therapistId: string, year: number, month: number) {
  const range = parseAppointmentMonth(year, month)
  if (!range) {
    throw new Error('INVALID_MONTH')
  }

  const blocks = await prisma.therapistCalendarBlock.findMany({
    where: {
      therapistId,
      startsAt: { lt: range.to },
      endsAt: { gt: range.from },
    },
    orderBy: { startsAt: 'asc' },
  })

  return blocks.map(formatCalendarBlock)
}

export async function createTherapistCalendarBlock(therapistId: string, input: CalendarBlockInput) {
  const range = parseBlockRange(input.date, input.startTime, input.endTime)
  if (!range) {
    throw new Error('INVALID_BLOCK_RANGE')
  }

  const block = await prisma.therapistCalendarBlock.create({
    data: {
      therapistId,
      startsAt: range.startsAt,
      endsAt: range.endsAt,
      title: input.title?.trim() ? input.title.trim() : null,
      notes: input.notes?.trim() ? input.notes.trim() : null,
    },
  })

  return formatCalendarBlock(block)
}

export async function updateTherapistCalendarBlock(
  therapistId: string,
  blockId: string,
  input: CalendarBlockInput,
) {
  const existing = await prisma.therapistCalendarBlock.findFirst({
    where: { id: blockId, therapistId },
  })
  if (!existing) {
    throw new Error('BLOCK_NOT_FOUND')
  }

  const range = parseBlockRange(input.date, input.startTime, input.endTime)
  if (!range) {
    throw new Error('INVALID_BLOCK_RANGE')
  }

  const block = await prisma.therapistCalendarBlock.update({
    where: { id: blockId },
    data: {
      startsAt: range.startsAt,
      endsAt: range.endsAt,
      title: input.title?.trim() ? input.title.trim() : null,
      notes: input.notes?.trim() ? input.notes.trim() : null,
    },
  })

  return formatCalendarBlock(block)
}

export async function deleteTherapistCalendarBlock(therapistId: string, blockId: string) {
  const existing = await prisma.therapistCalendarBlock.findFirst({
    where: { id: blockId, therapistId },
  })
  if (!existing) {
    throw new Error('BLOCK_NOT_FOUND')
  }

  await prisma.therapistCalendarBlock.delete({ where: { id: blockId } })
  return { deleted: true }
}

export async function findOverlappingCalendarBlock(
  therapistId: string,
  scheduledAt: Date,
  durationMinutes: number,
) {
  const endsAt = new Date(scheduledAt.getTime() + durationMinutes * 60_000)
  const block = await prisma.therapistCalendarBlock.findFirst({
    where: {
      therapistId,
      startsAt: { lt: endsAt },
      endsAt: { gt: scheduledAt },
    },
    orderBy: { startsAt: 'asc' },
  })

  return block ? formatCalendarBlock(block) : null
}

export async function assertAppointmentsNotBlocked(
  therapistId: string,
  slots: Array<{ scheduledAt: Date; durationMinutes: number }>,
  allowBlockedTime = false,
) {
  if (allowBlockedTime || slots.length === 0) return

  for (const slot of slots) {
    const overlap = await findOverlappingCalendarBlock(
      therapistId,
      slot.scheduledAt,
      slot.durationMinutes,
    )
    if (overlap) {
      throw new BlockedTimeError(
        `Horário bloqueado (${overlap.startTime}–${overlap.endTime}${overlap.title ? `: ${overlap.label}` : ''})`,
      )
    }
  }
}

export function blockOverlapsAppointment(
  block: { date: string; startTime: string; endTime: string },
  date: string,
  time: string,
  durationMinutes: number,
): boolean {
  if (block.date !== date) return false
  const scheduledAt = parseScheduledAt(date, time)
  const blockStart = parseScheduledAt(block.date, block.startTime)
  const blockEnd = parseScheduledAt(block.date, block.endTime)
  if (!scheduledAt || !blockStart || !blockEnd) return false
  const blockDuration = (blockEnd.getTime() - blockStart.getTime()) / 60_000
  return appointmentsOverlap(scheduledAt, durationMinutes, blockStart, blockDuration)
}
