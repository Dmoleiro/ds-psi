import { UserRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { decimalToNumber } from './financialSettings.js'

export type InternWorkLogInput = {
  workDate: string
  hours: number
  notes?: string | null
}

function formatWorkLog(log: {
  id: string
  internId: string
  workDate: string
  hours: { toString(): string }
  notes: string | null
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: log.id,
    internId: log.internId,
    workDate: log.workDate,
    hours: decimalToNumber(log.hours),
    notes: log.notes,
    createdAt: log.createdAt,
    updatedAt: log.updatedAt,
  }
}

export async function assertActiveIntern(internId: string) {
  const intern = await prisma.user.findFirst({
    where: { id: internId, role: UserRole.therapist, active: true, isIntern: true },
    select: { id: true },
  })
  if (!intern) {
    throw new Error('NOT_AN_INTERN')
  }
}

export async function assertSupervisorOfIntern(supervisorId: string, internId: string) {
  const assignment = await prisma.therapistSupervisor.findFirst({
    where: {
      supervisorId,
      internId,
      intern: { isIntern: true, active: true, role: UserRole.therapist },
    },
    select: { id: true },
  })
  if (!assignment) {
    throw new Error('INTERN_ACCESS_DENIED')
  }
}

export async function listInternWorkLogs(internId: string, year: number, month: number) {
  await assertActiveIntern(internId)

  const monthKey = `${year}-${String(month).padStart(2, '0')}`
  const logs = await prisma.internWorkLog.findMany({
    where: {
      internId,
      workDate: { startsWith: monthKey },
    },
    orderBy: [{ workDate: 'desc' }, { createdAt: 'desc' }],
  })

  const totalHours = logs.reduce((sum, log) => sum + decimalToNumber(log.hours), 0)

  return {
    year,
    month,
    totalHours,
    logs: logs.map(formatWorkLog),
  }
}

export async function createInternWorkLog(internId: string, input: InternWorkLogInput) {
  await assertActiveIntern(internId)

  const log = await prisma.internWorkLog.create({
    data: {
      internId,
      workDate: input.workDate,
      hours: input.hours,
      notes: input.notes?.trim() ? input.notes.trim() : null,
    },
  })

  return formatWorkLog(log)
}

export async function updateInternWorkLog(
  internId: string,
  logId: string,
  input: InternWorkLogInput,
) {
  await assertActiveIntern(internId)

  const existing = await prisma.internWorkLog.findFirst({
    where: { id: logId, internId },
  })
  if (!existing) {
    throw new Error('LOG_NOT_FOUND')
  }

  const log = await prisma.internWorkLog.update({
    where: { id: logId },
    data: {
      workDate: input.workDate,
      hours: input.hours,
      notes: input.notes?.trim() ? input.notes.trim() : null,
    },
  })

  return formatWorkLog(log)
}

export async function deleteInternWorkLog(internId: string, logId: string) {
  await assertActiveIntern(internId)

  const existing = await prisma.internWorkLog.findFirst({
    where: { id: logId, internId },
  })
  if (!existing) {
    throw new Error('LOG_NOT_FOUND')
  }

  await prisma.internWorkLog.delete({ where: { id: logId } })
  return { deleted: true }
}

export async function listSupervisedInterns(supervisorId: string) {
  const rows = await prisma.therapistSupervisor.findMany({
    where: {
      supervisorId,
      intern: { isIntern: true, active: true, role: UserRole.therapist },
    },
    include: {
      intern: { select: { id: true, name: true, email: true } },
    },
    orderBy: { intern: { name: 'asc' } },
  })

  return rows.map((row) => row.intern)
}

export async function listSupervisedInternWorkLogs(
  supervisorId: string,
  internId: string,
  year: number,
  month: number,
) {
  await assertSupervisorOfIntern(supervisorId, internId)
  const data = await listInternWorkLogs(internId, year, month)
  const intern = await prisma.user.findUnique({
    where: { id: internId },
    select: { id: true, name: true, email: true },
  })

  return {
    intern,
    ...data,
  }
}

export async function summarizeSupervisedInternHours(supervisorId: string, year: number, month: number) {
  const interns = await listSupervisedInterns(supervisorId)
  const monthKey = `${year}-${String(month).padStart(2, '0')}`

  const summaries = await Promise.all(
    interns.map(async (intern) => {
      const logs = await prisma.internWorkLog.findMany({
        where: {
          internId: intern.id,
          workDate: { startsWith: monthKey },
        },
        select: { hours: true },
      })
      const totalHours = logs.reduce((sum, log) => sum + decimalToNumber(log.hours), 0)
      return {
        intern,
        entryCount: logs.length,
        totalHours,
      }
    }),
  )

  const grandTotal = summaries.reduce((sum, entry) => sum + entry.totalHours, 0)

  return {
    year,
    month,
    grandTotal,
    interns: summaries,
  }
}

export async function countSupervisedInterns(supervisorId: string) {
  return prisma.therapistSupervisor.count({
    where: {
      supervisorId,
      intern: { isIntern: true, active: true, role: UserRole.therapist },
    },
  })
}
