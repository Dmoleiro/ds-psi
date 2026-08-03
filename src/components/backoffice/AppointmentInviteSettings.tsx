import { useCallback, useEffect, useState } from 'react'
import { ApiError, therapistApi, type AppointmentInviteSettings, type InviteRecipients } from '../../lib/api'
import { Card } from '../ui/Card'
import styles from './AppointmentInviteSettings.module.css'
import layout from './BackofficeLayout.module.css'

export function AppointmentInviteSettings({ token }: { token: string }) {
  const [settings, setSettings] = useState<AppointmentInviteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadSettings = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await therapistApi.getAppointmentInviteSettings(token)
      setSettings(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar as definições')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    void loadSettings()
  }, [loadSettings])

  if (!loading && settings && !settings.allowed) {
    return null
  }

  async function updateSettings(patch: {
    enabled?: boolean
    inviteRecipients?: InviteRecipients
    copyToTherapist?: boolean
  }) {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const { settings: updated } = await therapistApi.updateAppointmentInviteSettings(token, patch)
      setSettings((current) =>
        current
          ? {
              ...current,
              enabled: updated.enabled,
              inviteRecipients: updated.inviteRecipients,
              copyToTherapist: updated.copyToTherapist,
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
      <h2>Convites de calendário (email)</h2>
      <p className={layout.muted}>
        Envia um ficheiro de calendário (.ics) por email ao paciente e, opcionalmente, uma cópia para
        si. O terapeuta aparece como organizador do evento. O paciente adiciona a consulta ao calendário
        manualmente.
      </p>

      {loading ? (
        <p className={layout.muted}>A carregar…</p>
      ) : !settings?.configured ? (
        <p className={layout.muted}>
          O envio de emails ainda não está configurado no servidor (SMTP).
        </p>
      ) : (
        <>
          {error && <p className={layout.error}>{error}</p>}
          {success && <p className={layout.successBox}>{success}</p>}

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={settings?.enabled ?? false}
              disabled={saving}
              onChange={(event) => void updateSettings({ enabled: event.target.checked })}
            />
            Enviar convites de calendário automaticamente
          </label>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={settings?.copyToTherapist ?? true}
              disabled={saving || !settings?.enabled}
              onChange={(event) => void updateSettings({ copyToTherapist: event.target.checked })}
            />
            Enviar cópia para o meu email
          </label>

          <div className={styles.field}>
            <label htmlFor="invite-recipients">Convites para o paciente</label>
            <select
              id="invite-recipients"
              value={settings?.inviteRecipients ?? 'email'}
              disabled={saving || !settings?.enabled}
              onChange={(event) =>
                void updateSettings({ inviteRecipients: event.target.value as InviteRecipients })
              }
            >
              <option value="email">Email principal</option>
              <option value="email2">Email secundário</option>
              <option value="both">Ambos os emails</option>
            </select>
          </div>
        </>
      )}
    </Card>
  )
}
