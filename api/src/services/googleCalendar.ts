import { GoogleSyncStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { decryptSecret, encryptSecret } from '../lib/tokenEncryption.js'
import {
  APPOINTMENT_TIMEZONE,
  getGoogleOAuthConfig,
  GOOGLE_CALENDAR_SCOPES,
  GOOGLE_OAUTH_STATE_TTL_MS,
} from '../lib/googleConfig.js'
import { config } from '../lib/schemas.js'
import { formatAppointmentDate, formatAppointmentTime } from './appointments.js'

type GoogleTokenResponse = {
  access_token: string
  expires_in: number
  refresh_token?: string
  scope?: string
  token_type: string
}

type GoogleUserInfo = {
  email: string
}

type GoogleCalendarListItem = {
  id: string
  summary: string
  accessRole: string
  primary?: boolean
  backgroundColor?: string
}

type GoogleCalendarEvent = {
  id: string
}

export type InviteRecipients = 'email' | 'email2' | 'both'

export type GoogleCalendarStatus = {
  allowed: boolean
  configured: boolean
  connected: boolean
  googleEmail: string | null
  calendarId: string | null
  calendarName: string | null
  syncEnabled: boolean
  sendInvites: boolean
  inviteRecipients: InviteRecipients
  connectionError: string | null
}

function oauthConfigOrThrow() {
  const oauth = getGoogleOAuthConfig()
  if (!oauth) {
    throw new Error('GOOGLE_NOT_CONFIGURED')
  }
  return oauth
}

async function googleFetch<T>(
  url: string,
  accessToken: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`GOOGLE_API_${response.status}:${body.slice(0, 300)}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function buildOAuthState(therapistId: string): string {
  const payload = Buffer.from(
    JSON.stringify({ therapistId, expiresAt: Date.now() + GOOGLE_OAUTH_STATE_TTL_MS }),
  ).toString('base64url')
  return payload
}

export function parseOAuthState(state: string): string {
  let parsed: { therapistId?: string; expiresAt?: number }
  try {
    parsed = JSON.parse(Buffer.from(state, 'base64url').toString('utf8')) as {
      therapistId?: string
      expiresAt?: number
    }
  } catch {
    throw new Error('INVALID_OAUTH_STATE')
  }

  if (!parsed.therapistId || !parsed.expiresAt || parsed.expiresAt < Date.now()) {
    throw new Error('INVALID_OAUTH_STATE')
  }

  return parsed.therapistId
}

export async function assertTherapistCanUseGoogleCalendar(therapistId: string) {
  const therapist = await prisma.user.findFirst({
    where: { id: therapistId, role: 'therapist', active: true },
    select: { googleCalendarSyncAllowed: true },
  })
  if (!therapist?.googleCalendarSyncAllowed) {
    throw new Error('GOOGLE_SYNC_NOT_ALLOWED')
  }
}

export function getGoogleConnectUrl(therapistId: string): string {
  const oauth = oauthConfigOrThrow()
  const params = new URLSearchParams({
    client_id: oauth.clientId,
    redirect_uri: oauth.redirectUri,
    response_type: 'code',
    scope: GOOGLE_CALENDAR_SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent select_account',
    state: buildOAuthState(therapistId),
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export async function exchangeOAuthCode(code: string, therapistId: string) {
  await assertTherapistCanUseGoogleCalendar(therapistId)
  const oauth = oauthConfigOrThrow()

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: oauth.clientId,
      client_secret: oauth.clientSecret,
      redirect_uri: oauth.redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenResponse.ok) {
    throw new Error('GOOGLE_OAUTH_FAILED')
  }

  const tokens = (await tokenResponse.json()) as GoogleTokenResponse

  const existing = await prisma.googleCalendarConnection.findUnique({
    where: { therapistId },
    select: { refreshToken: true },
  })

  const refreshToken = tokens.refresh_token
    ? tokens.refresh_token
    : existing
      ? decryptSecret(existing.refreshToken)
      : null

  if (!refreshToken) {
    throw new Error('GOOGLE_MISSING_REFRESH_TOKEN')
  }

  let googleEmail = 'unknown'
  try {
    const profile = await googleFetch<GoogleUserInfo>(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      tokens.access_token,
    )
    googleEmail = profile.email
  } catch {
    const therapist = await prisma.user.findUnique({
      where: { id: therapistId },
      select: { email: true },
    })
    googleEmail = therapist?.email ?? 'unknown'
  }

  let calendarId = 'primary'
  let calendarName = 'Principal'
  try {
    const calendars = await listWritableCalendars(tokens.access_token)
    const selected = calendars.find((calendar) => calendar.primary) ?? calendars[0]
    if (selected) {
      calendarId = selected.id
      calendarName = selected.summary
    }
  } catch {
    // Fall back to the account primary calendar.
  }

  const tokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000)

  await prisma.googleCalendarConnection.upsert({
    where: { therapistId },
    create: {
      therapistId,
      googleEmail,
      calendarId,
      calendarName,
      accessToken: encryptSecret(tokens.access_token),
      refreshToken: encryptSecret(refreshToken),
      tokenExpiresAt,
      scopes: tokens.scope ?? GOOGLE_CALENDAR_SCOPES.join(' '),
    },
    update: {
      googleEmail,
      calendarId,
      calendarName,
      accessToken: encryptSecret(tokens.access_token),
      refreshToken: encryptSecret(refreshToken),
      tokenExpiresAt,
      scopes: tokens.scope ?? GOOGLE_CALENDAR_SCOPES.join(' '),
    },
  })
}

export async function disconnectGoogleCalendar(therapistId: string) {
  await prisma.googleCalendarConnection.deleteMany({ where: { therapistId } })
}

export async function getGoogleCalendarStatus(therapistId: string): Promise<GoogleCalendarStatus> {
  const therapist = await prisma.user.findFirst({
    where: { id: therapistId, role: 'therapist' },
    select: {
      googleCalendarSyncAllowed: true,
      googleCalendarConnection: true,
    },
  })

  const connection = therapist?.googleCalendarConnection

  return {
    allowed: therapist?.googleCalendarSyncAllowed ?? false,
    configured: getGoogleOAuthConfig() !== null,
    connected: Boolean(connection),
    googleEmail: connection?.googleEmail ?? null,
    calendarId: connection?.calendarId ?? null,
    calendarName: connection?.calendarName ?? null,
    syncEnabled: connection?.syncEnabled ?? true,
    sendInvites: connection?.sendInvites ?? true,
    inviteRecipients: (connection?.inviteRecipients as InviteRecipients | undefined) ?? 'email',
    connectionError: null,
  }
}

export async function updateGoogleCalendarSettings(
  therapistId: string,
  data: {
    syncEnabled?: boolean
    sendInvites?: boolean
    inviteRecipients?: InviteRecipients
    calendarId?: string
  },
) {
  const connection = await prisma.googleCalendarConnection.findUnique({ where: { therapistId } })
  if (!connection) {
    throw new Error('GOOGLE_NOT_CONNECTED')
  }

  let calendarName = connection.calendarName
  if (data.calendarId && data.calendarId !== connection.calendarId) {
    const calendars = await listTherapistWritableCalendars(therapistId)
    const selected = calendars.find((calendar) => calendar.id === data.calendarId)
    if (!selected) {
      throw new Error('GOOGLE_CALENDAR_NOT_FOUND')
    }
    calendarName = selected.summary
  }

  const updated = await prisma.googleCalendarConnection.update({
    where: { therapistId },
    data: {
      syncEnabled: data.syncEnabled,
      sendInvites: data.sendInvites,
      inviteRecipients: data.inviteRecipients,
      calendarId: data.calendarId,
      calendarName,
    },
  })

  return {
    syncEnabled: updated.syncEnabled,
    sendInvites: updated.sendInvites,
    inviteRecipients: updated.inviteRecipients as InviteRecipients,
    calendarId: updated.calendarId,
    calendarName: updated.calendarName,
  }
}

async function refreshAccessToken(connection: {
  id: string
  refreshToken: string
}) {
  const oauth = oauthConfigOrThrow()
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: oauth.clientId,
      client_secret: oauth.clientSecret,
      refresh_token: decryptSecret(connection.refreshToken),
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    throw new Error('GOOGLE_TOKEN_REVOKED')
  }

  const tokens = (await response.json()) as GoogleTokenResponse
  const tokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000)

  await prisma.googleCalendarConnection.update({
    where: { id: connection.id },
    data: {
      accessToken: encryptSecret(tokens.access_token),
      tokenExpiresAt,
    },
  })

  return tokens.access_token
}

export async function getValidAccessToken(therapistId: string): Promise<string> {
  const connection = await prisma.googleCalendarConnection.findUnique({ where: { therapistId } })
  if (!connection) {
    throw new Error('GOOGLE_NOT_CONNECTED')
  }

  if (connection.tokenExpiresAt.getTime() > Date.now() + 60_000) {
    return decryptSecret(connection.accessToken)
  }

  return refreshAccessToken(connection)
}

export async function listWritableCalendars(accessToken: string) {
  const data = await googleFetch<{ items?: GoogleCalendarListItem[] }>(
    'https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=writer',
    accessToken,
  )

  return (data.items ?? [])
    .filter((item) => item.accessRole === 'owner' || item.accessRole === 'writer')
    .map((item) => ({
      id: item.id,
      summary: item.summary,
      primary: Boolean(item.primary),
      backgroundColor: item.backgroundColor ?? null,
    }))
    .sort((a, b) => a.summary.localeCompare(b.summary, 'pt'))
}

export async function listTherapistWritableCalendars(therapistId: string) {
  const accessToken = await getValidAccessToken(therapistId)
  return listWritableCalendars(accessToken)
}

function buildAttendees(
  patient: { email: string | null; email2: string | null },
  inviteRecipients: InviteRecipients,
) {
  const emails = new Set<string>()
  if (inviteRecipients === 'email' || inviteRecipients === 'both') {
    if (patient.email?.trim()) emails.add(patient.email.trim())
  }
  if (inviteRecipients === 'email2' || inviteRecipients === 'both') {
    if (patient.email2?.trim()) emails.add(patient.email2.trim())
  }
  return [...emails].map((email) => ({ email }))
}

function addMinutesToTime(date: string, time: string, minutesToAdd: number) {
  const [hours, minutes] = time.split(':').map(Number)
  const total = hours * 60 + minutes + minutesToAdd
  const endHours = Math.floor(total / 60) % 24
  const endMinutes = total % 60
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`
}

export function buildGoogleEventPayload(appointment: {
  scheduledAt: Date
  durationMinutes: number
  notes: string | null
  patient: { fullName: string; email: string | null; email2: string | null }
  location: { name: string; address: string | null }
  gabinete: { name: string }
  inviteRecipients: InviteRecipients
}) {
  const date = formatAppointmentDate(appointment.scheduledAt)
  const time = formatAppointmentTime(appointment.scheduledAt)
  const endTime = addMinutesToTime(date, time, appointment.durationMinutes)
  const locationParts = [appointment.location.name, appointment.gabinete.name]
  if (appointment.location.address?.trim()) {
    locationParts.push(appointment.location.address.trim())
  }

  return {
    summary: `Consulta — ${appointment.patient.fullName}`,
    location: locationParts.join(' · '),
    description: appointment.notes?.trim() || undefined,
    start: {
      dateTime: `${date}T${time}:00`,
      timeZone: APPOINTMENT_TIMEZONE,
    },
    end: {
      dateTime: `${date}T${endTime}:00`,
      timeZone: APPOINTMENT_TIMEZONE,
    },
    attendees: buildAttendees(appointment.patient, appointment.inviteRecipients),
  }
}

export async function insertGoogleEvent(
  therapistId: string,
  calendarId: string,
  payload: ReturnType<typeof buildGoogleEventPayload>,
  sendInvites: boolean,
) {
  const accessToken = await getValidAccessToken(therapistId)
  const params = new URLSearchParams({ sendUpdates: sendInvites ? 'all' : 'none' })
  return googleFetch<GoogleCalendarEvent>(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
    accessToken,
    { method: 'POST', body: JSON.stringify(payload) },
  )
}

export async function updateGoogleEvent(
  therapistId: string,
  calendarId: string,
  eventId: string,
  payload: ReturnType<typeof buildGoogleEventPayload>,
  sendInvites: boolean,
) {
  const accessToken = await getValidAccessToken(therapistId)
  const params = new URLSearchParams({ sendUpdates: sendInvites ? 'all' : 'none' })
  return googleFetch<GoogleCalendarEvent>(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?${params}`,
    accessToken,
    { method: 'PATCH', body: JSON.stringify(payload) },
  )
}

export async function deleteGoogleEvent(
  therapistId: string,
  calendarId: string,
  eventId: string,
  sendInvites: boolean,
) {
  const accessToken = await getValidAccessToken(therapistId)
  const params = new URLSearchParams({ sendUpdates: sendInvites ? 'all' : 'none' })
  await googleFetch<void>(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?${params}`,
    accessToken,
    { method: 'DELETE' },
  )
}

export function sanitizeGoogleSyncError(error: unknown): string {
  if (!(error instanceof Error)) return 'Erro desconhecido'
  if (error.message === 'GOOGLE_TOKEN_REVOKED') {
    return 'Ligação ao Google expirou. Volte a ligar a conta nas definições.'
  }
  if (error.message.startsWith('GOOGLE_API_')) {
    return 'O Google Calendar recusou o pedido. Tente novamente.'
  }
  return error.message.slice(0, 240)
}

export async function markAppointmentSyncPending(appointmentId: string) {
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      googleSyncStatus: GoogleSyncStatus.pending,
      googleSyncError: null,
    },
  })
}

export async function markAppointmentSyncSuccess(
  appointmentId: string,
  calendarId: string,
  eventId: string,
) {
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      googleCalendarId: calendarId,
      googleEventId: eventId,
      googleSyncStatus: GoogleSyncStatus.synced,
      googleSyncedAt: new Date(),
      googleSyncError: null,
    },
  })
}

export async function markAppointmentSyncFailed(appointmentId: string, error: unknown) {
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      googleSyncStatus: GoogleSyncStatus.failed,
      googleSyncError: sanitizeGoogleSyncError(error),
    },
  })
}

export function getGoogleCalendarFrontendRedirect(query: Record<string, string | undefined>) {
  const base = `${config.frontendUrl}/backoffice/profile`
  if (query.error) {
    return `${base}?google_calendar=error&message=${encodeURIComponent(query.error)}`
  }
  return `${base}?google_calendar=connected`
}
