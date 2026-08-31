import { z } from 'zod'

export const announcementBodySchema = z.object({
  title: z.string().max(120).optional().or(z.literal('')),
  visibleUntil: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})
