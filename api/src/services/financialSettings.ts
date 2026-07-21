import { prisma } from '../lib/prisma.js'

export type FinancialRates = {
  socialSecurityRate: number
  irsRate: number
  savingsRate: number
  defaultSessionFee: number
}

export function decimalToNumber(value: { toString(): string } | number | null | undefined): number {
  if (value === null || value === undefined) return 0
  return Number(value)
}

export function formatFinancialSettings(record: {
  socialSecurityRate: { toString(): string }
  irsRate: { toString(): string }
  savingsRate: { toString(): string }
  defaultSessionFee: { toString(): string }
}): FinancialRates {
  return {
    socialSecurityRate: decimalToNumber(record.socialSecurityRate),
    irsRate: decimalToNumber(record.irsRate),
    savingsRate: decimalToNumber(record.savingsRate),
    defaultSessionFee: decimalToNumber(record.defaultSessionFee),
  }
}

export async function getOrCreateFinancialSettings(therapistId: string) {
  const existing = await prisma.therapistFinancialSettings.findUnique({
    where: { therapistId },
  })
  if (existing) {
    return formatFinancialSettings(existing)
  }

  const created = await prisma.therapistFinancialSettings.create({
    data: { therapistId },
  })
  return formatFinancialSettings(created)
}

export async function updateFinancialSettings(
  therapistId: string,
  data: Partial<FinancialRates>,
) {
  await prisma.therapistFinancialSettings.upsert({
    where: { therapistId },
    create: {
      therapistId,
      ...(data.socialSecurityRate !== undefined
        ? { socialSecurityRate: data.socialSecurityRate }
        : {}),
      ...(data.irsRate !== undefined ? { irsRate: data.irsRate } : {}),
      ...(data.savingsRate !== undefined ? { savingsRate: data.savingsRate } : {}),
      ...(data.defaultSessionFee !== undefined
        ? { defaultSessionFee: data.defaultSessionFee }
        : {}),
    },
    update: {
      ...(data.socialSecurityRate !== undefined
        ? { socialSecurityRate: data.socialSecurityRate }
        : {}),
      ...(data.irsRate !== undefined ? { irsRate: data.irsRate } : {}),
      ...(data.savingsRate !== undefined ? { savingsRate: data.savingsRate } : {}),
      ...(data.defaultSessionFee !== undefined
        ? { defaultSessionFee: data.defaultSessionFee }
        : {}),
    },
  })

  return getOrCreateFinancialSettings(therapistId)
}

export async function resolveSessionFee(
  therapistId: string,
  options?: { sessionFee?: number; patientId?: string },
) {
  if (options?.sessionFee !== undefined) return options.sessionFee

  if (options?.patientId) {
    const patient = await prisma.patient.findFirst({
      where: { id: options.patientId, therapistId },
      select: { sessionFee: true },
    })
    if (patient?.sessionFee != null) {
      return decimalToNumber(patient.sessionFee)
    }
  }

  const settings = await getOrCreateFinancialSettings(therapistId)
  return settings.defaultSessionFee
}
