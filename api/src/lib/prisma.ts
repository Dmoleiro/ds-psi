import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Only cache in production. In dev, tsx watch keeps the process alive; caching here
// leaves a stale client after `prisma generate` until the process is restarted.
if (process.env.NODE_ENV === 'production') {
  globalForPrisma.prisma = prisma
}
