import { z } from 'zod'

export const workshopBodySchema = z.object({
  title: z.string().min(2),
  description: z.string().min(1),
  location: z.string().min(2),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export const workshopPublicQuerySchema = z.object({
  status: z.enum(['upcoming', 'past']).default('upcoming'),
})
