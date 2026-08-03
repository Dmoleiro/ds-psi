import { config } from './schemas.js'

export const GOOGLE_CALENDAR_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
] as const

export const GOOGLE_OAUTH_STATE_TTL_MS = 10 * 60 * 1000
export const APPOINTMENT_TIMEZONE = 'Europe/Lisbon'

export function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ??
    `http://localhost:${config.port}/api/therapist/google-calendar/callback`

  if (!clientId || !clientSecret) {
    return null
  }

  return { clientId, clientSecret, redirectUri }
}

export function isGoogleCalendarConfigured() {
  return getGoogleOAuthConfig() !== null
}
