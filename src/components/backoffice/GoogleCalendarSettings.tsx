import { useCallback, useEffect, useState } from 'react'
import { ApiError, therapistApi, type GoogleCalendarStatus, type InviteRecipients } from '../../lib/api'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import styles from './GoogleCalendarSettings.module.css'
import layout from './BackofficeLayout.module.css'

type CalendarOption = {
  id: string
  summary: string
  primary: boolean
  backgroundColor: string | null
}

type Props = {
  token: string
}

function oauthErrorMessage(code: string | null) {
  switch (code) {
    case 'GOOGLE_MISSING_REFRESH_TOKEN':
      return 'O Google não devolveu autorização completa. Em myaccount.google.com/permissions, remova o acesso desta app e ligue novamente.'
    case 'GOOGLE_OAUTH_FAILED':
      return 'Falha ao validar o código Google. Verifique o redirect URI e tente novamente.'
    case 'GOOGLE_SYNC_NOT_ALLOWED':
      return 'A sincronização Google não está autorizada para o seu utilizador.'
    case 'INVALID_OAUTH_STATE':
      return 'A ligação expirou. Tente ligar novamente.'
    case 'connected':
      return 'Conta Google ligada com sucesso.'
    case 'error':
    case 'oauth_failed':
      return 'Não foi possível ligar a conta Google. Tente novamente.'
    default:
      return code
        ? `Não foi possível ligar a conta Google (${code}).`
        : null
  }
}

export function GoogleCalendarSettings({ token }: Props) {
  const [status, setStatus] = useState<GoogleCalendarStatus | null>(null)
  const [calendars, setCalendars] = useState<CalendarOption[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadStatus = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await therapistApi.getGoogleCalendarStatus(token)
      setStatus(data)
      if (data.connected) {
        const calendarData = await therapistApi.listGoogleCalendars(token)
        setCalendars(calendarData.calendars)
      } else {
        setCalendars([])
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar as definições Google')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    void loadStatus()
  }, [loadStatus])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const result = params.get('google_calendar')
    const messageCode = params.get('message')
    if (!result) return

    const message = oauthErrorMessage(messageCode ?? result)
    if (result === 'connected') {
      setSuccess(message ?? 'Conta Google ligada com sucesso.')
    } else if (message) {
      setError(message)
    }

    params.delete('google_calendar')
    params.delete('message')
    const next = params.toString()
    const nextUrl = `${window.location.pathname}${next ? `?${next}` : ''}`
    window.history.replaceState({}, '', nextUrl)
    void loadStatus()
  }, [loadStatus])

  if (!loading && status && !status.allowed && !status.connected) {
    return null
  }

  if (!loading && status && !status.allowed && status.connected) {
    return (
      <Card as="section" className={layout.sectionSpaced}>
        <h2>Google Calendar</h2>
        <p className={layout.muted}>
          A sua conta Google está ligada ({status.googleEmail}), mas a sincronização foi desativada
          pelo administrador. Contacte o administrador se precisar de voltar a usar esta funcionalidade.
        </p>
      </Card>
    )
  }

  async function handleConnect() {
    setConnecting(true)
    setError('')
    try {
      const { url } = await therapistApi.getGoogleCalendarConnectUrl(token)
      window.location.href = url
    } catch (err) {
      setConnecting(false)
      setError(err instanceof ApiError ? err.message : 'Não foi possível iniciar a ligação Google')
    }
  }

  async function handleDisconnect() {
    if (!window.confirm('Desligar a conta Google? As consultas deixam de sincronizar.')) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await therapistApi.disconnectGoogleCalendar(token)
      setSuccess('Conta Google desligada.')
      await loadStatus()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível desligar a conta Google')
    } finally {
      setSaving(false)
    }
  }

  async function updateSettings(patch: {
    syncEnabled?: boolean
    sendInvites?: boolean
    inviteRecipients?: InviteRecipients
    calendarId?: string
  }) {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const { settings } = await therapistApi.updateGoogleCalendarSettings(token, patch)
      setStatus((current) =>
        current
          ? {
              ...current,
              syncEnabled: settings.syncEnabled,
              sendInvites: settings.sendInvites,
              inviteRecipients: settings.inviteRecipients,
              calendarId: settings.calendarId,
              calendarName: settings.calendarName,
            }
          : current,
      )
      setSuccess('Definições guardadas.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível guardar as definições')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card as="section" className={layout.sectionSpaced}>
      <h2>Google Calendar</h2>
      <p className={layout.muted}>
        Sincronize consultas com um calendário Google (por exemplo, «Psicologia Daniela Santos»). Os
        convites podem ser enviados aos pacientes pelo Google.
      </p>

      {loading ? (
        <p className={layout.muted}>A carregar…</p>
      ) : !status?.configured ? (
        <p className={layout.muted}>Integração Google ainda não configurada no servidor.</p>
      ) : (
        <>
          {error && <p className={layout.error}>{error}</p>}
          {success && <p className={layout.successBox}>{success}</p>}

          {!status.connected ? (
            <div className={styles.actions}>
              <Button type="button" onClick={handleConnect} disabled={connecting}>
                {connecting ? 'A redirecionar…' : 'Ligar Google Calendar'}
              </Button>
              <p className={layout.muted}>
                Crie o calendário desejado no Google antes de ligar, se ainda não existir.
              </p>
            </div>
          ) : (
            <div className={styles.connectedPanel}>
              <p className={styles.connectedEmail}>
                Ligado como <strong>{status.googleEmail}</strong>
              </p>

              <div className={styles.field}>
                <label htmlFor="google-target-calendar">Calendário de destino</label>
                <select
                  id="google-target-calendar"
                  value={status.calendarId ?? ''}
                  disabled={saving || calendars.length === 0}
                  onChange={(event) => void updateSettings({ calendarId: event.target.value })}
                >
                  {calendars.map((calendar) => (
                    <option key={calendar.id} value={calendar.id}>
                      {calendar.summary}
                      {calendar.primary ? ' (principal)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={status.syncEnabled}
                  disabled={saving}
                  onChange={(event) => void updateSettings({ syncEnabled: event.target.checked })}
                />
                Sincronizar consultas automaticamente
              </label>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={status.sendInvites}
                  disabled={saving}
                  onChange={(event) => void updateSettings({ sendInvites: event.target.checked })}
                />
                Enviar convites por email via Google
              </label>

              <div className={styles.field}>
                <label htmlFor="google-invite-recipients">Convites para</label>
                <select
                  id="google-invite-recipients"
                  value={status.inviteRecipients}
                  disabled={saving}
                  onChange={(event) =>
                    void updateSettings({ inviteRecipients: event.target.value as InviteRecipients })
                  }
                >
                  <option value="email">Email principal</option>
                  <option value="email2">Email secundário</option>
                  <option value="both">Ambos os emails</option>
                </select>
              </div>

              <div className={styles.actions}>
                <Button type="button" variant="outline" onClick={handleDisconnect} disabled={saving}>
                  Desligar conta Google
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  )
}
