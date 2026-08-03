import type { FastifyInstance } from 'fastify'
import { UserRole } from '@prisma/client'
import { requireAuth, requireRole } from '../middleware/auth.js'
import {
  assertTherapistCanUseGoogleCalendar,
  disconnectGoogleCalendar,
  exchangeOAuthCode,
  getGoogleCalendarFrontendRedirect,
  getGoogleCalendarStatus,
  getGoogleConnectUrl,
  listTherapistWritableCalendars,
  parseOAuthState,
  updateGoogleCalendarSettings,
} from '../services/googleCalendar.js'
import { isGoogleCalendarConfigured } from '../lib/googleConfig.js'
import { retryAppointmentGoogleSync } from '../services/googleCalendarSync.js'
import {
  googleCalendarSettingsSchema,
  updateTherapistGoogleCalendarSchema,
} from '../lib/schemas.js'
import { prisma } from '../lib/prisma.js'

export async function googleCalendarRoutes(app: FastifyInstance) {
  const therapistOnly = [requireAuth, requireRole(UserRole.therapist)]
  const adminOnly = [requireAuth, requireRole(UserRole.admin)]

  app.get('/api/therapist/google-calendar/status', { preHandler: therapistOnly }, async (request) => {
    return getGoogleCalendarStatus(request.user.sub)
  })

  app.get('/api/therapist/google-calendar/connect', { preHandler: therapistOnly }, async (request, reply) => {
    if (!isGoogleCalendarConfigured()) {
      return reply.status(503).send({ error: 'Integração Google Calendar não configurada no servidor' })
    }

    try {
      await assertTherapistCanUseGoogleCalendar(request.user.sub)
      const url = getGoogleConnectUrl(request.user.sub)
      return { url }
    } catch (error) {
      if (error instanceof Error && error.message === 'GOOGLE_SYNC_NOT_ALLOWED') {
        return reply.status(403).send({ error: 'Sincronização Google não autorizada para este terapeuta' })
      }
      throw error
    }
  })

  app.get('/api/therapist/google-calendar/callback', async (request, reply) => {
    const query = request.query as { code?: string; state?: string; error?: string }

    if (query.error) {
      return reply.redirect(getGoogleCalendarFrontendRedirect({ error: query.error }))
    }

    if (!query.code || !query.state) {
      return reply.redirect(getGoogleCalendarFrontendRedirect({ error: 'missing_code' }))
    }

    try {
      const therapistId = parseOAuthState(query.state)
      await exchangeOAuthCode(query.code, therapistId)
      return reply.redirect(getGoogleCalendarFrontendRedirect({}))
    } catch (error) {
      const code = error instanceof Error ? error.message : 'oauth_failed'
      return reply.redirect(getGoogleCalendarFrontendRedirect({ error: code }))
    }
  })

  app.delete('/api/therapist/google-calendar/disconnect', { preHandler: therapistOnly }, async (request) => {
    await disconnectGoogleCalendar(request.user.sub)
    return { ok: true }
  })

  app.get('/api/therapist/google-calendar/calendars', { preHandler: therapistOnly }, async (request, reply) => {
    try {
      const calendars = await listTherapistWritableCalendars(request.user.sub)
      return { calendars }
    } catch (error) {
      if (error instanceof Error && error.message === 'GOOGLE_NOT_CONNECTED') {
        return reply.status(400).send({ error: 'Conta Google não ligada' })
      }
      throw error
    }
  })

  app.patch('/api/therapist/google-calendar/settings', { preHandler: therapistOnly }, async (request, reply) => {
    const parsed = googleCalendarSettingsSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    try {
      const settings = await updateGoogleCalendarSettings(request.user.sub, parsed.data)
      return { settings }
    } catch (error) {
      if (error instanceof Error && error.message === 'GOOGLE_NOT_CONNECTED') {
        return reply.status(400).send({ error: 'Conta Google não ligada' })
      }
      if (error instanceof Error && error.message === 'GOOGLE_CALENDAR_NOT_FOUND') {
        return reply.status(400).send({ error: 'Calendário não encontrado na conta Google' })
      }
      throw error
    }
  })

  app.post(
    '/api/therapist/appointments/:id/google-sync/retry',
    { preHandler: therapistOnly },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      try {
        const result = await retryAppointmentGoogleSync(request.user.sub, id)
        return { ok: true, ...result }
      } catch (error) {
        if (error instanceof Error && error.message === 'APPOINTMENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Consulta não encontrada' })
        }
        if (error instanceof Error) {
          return reply.status(400).send({ error: error.message })
        }
        throw error
      }
    },
  )

  app.patch('/api/admin/therapists/:id/google-calendar', { preHandler: adminOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const parsed = updateTherapistGoogleCalendarSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    const therapist = await prisma.user.findFirst({
      where: { id, role: UserRole.therapist },
      select: { id: true },
    })
    if (!therapist) {
      return reply.status(404).send({ error: 'Terapeuta não encontrado' })
    }

    if (!parsed.data.googleCalendarSyncAllowed) {
      await disconnectGoogleCalendar(id)
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { googleCalendarSyncAllowed: parsed.data.googleCalendarSyncAllowed },
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
        financialOverviewEnabled: true,
        piccaEnabled: true,
        googleCalendarSyncAllowed: true,
        createdAt: true,
      },
    })

    return { therapist: updated }
  })
}
