import { useEffect, useState } from 'react'
import { BackofficeLayout, RequireAdmin } from '../../components/backoffice/BackofficeLayout'
import { AdminPasswordReset } from '../../components/backoffice/AdminPasswordReset'
import { adminApi, ApiError } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import layoutStyles from '../../components/backoffice/BackofficeLayout.module.css'
import styles from './AdminTherapistsPage.module.css'

type TherapistRow = {
  id: string
  email: string
  name: string
  active: boolean
  financialOverviewEnabled: boolean
  piccaEnabled: boolean
  questionnairesEnabled: boolean
  assessmentResultsEnabled: boolean
  appointmentInvitesAllowed: boolean
  createdAt: string
}

type TherapistLocationRow = {
  id: string
  name: string
  active: boolean
  assigned: boolean
}

type PermissionKey =
  | 'financialOverviewEnabled'
  | 'piccaEnabled'
  | 'questionnairesEnabled'
  | 'assessmentResultsEnabled'
  | 'appointmentInvitesAllowed'

const PERMISSION_OPTIONS: Array<{ key: PermissionKey; label: string }> = [
  { key: 'financialOverviewEnabled', label: 'Finanças' },
  { key: 'piccaEnabled', label: 'PICCA' },
  { key: 'questionnairesEnabled', label: 'Questionários' },
  { key: 'assessmentResultsEnabled', label: 'Resultados' },
  { key: 'appointmentInvitesAllowed', label: 'Convites' },
]

function TherapistLocationsPanel({
  therapist,
  token,
  onClose,
}: {
  therapist: TherapistRow
  token: string
  onClose: () => void
}) {
  const [locations, setLocations] = useState<TherapistLocationRow[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    adminApi
      .getTherapistLocations(token, therapist.id)
      .then((data) => {
        setLocations(data.locations)
        setSelectedIds(data.locations.filter((location) => location.assigned).map((location) => location.id))
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar locais')
      })
      .finally(() => setLoading(false))
  }, [token, therapist.id])

  function toggleLocation(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    )
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const data = await adminApi.setTherapistLocations(token, therapist.id, selectedIds)
      setLocations(data.locations)
      setSelectedIds(data.locations.filter((location) => location.assigned).map((location) => location.id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível guardar os locais')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card as="section" className={layoutStyles.sectionSpaced}>
      <h2>Locais — {therapist.name}</h2>
      <p className={layoutStyles.muted}>
        Selecione os locais onde este terapeuta pode trabalhar, criar pacientes e marcar consultas.
      </p>
      {error && <p className={layoutStyles.error}>{error}</p>}
      {loading ? (
        <p className={layoutStyles.muted}>A carregar…</p>
      ) : locations.length === 0 ? (
        <p className={layoutStyles.muted}>Crie locais antes de atribuir acessos.</p>
      ) : (
        <div className={layoutStyles.form}>
          {locations.map((location) => (
            <label key={location.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={selectedIds.includes(location.id)}
                onChange={() => toggleLocation(location.id)}
                disabled={!location.active}
              />
              {location.name}
              {!location.active ? ' (inativo)' : ''}
            </label>
          ))}
        </div>
      )}
      <div className={layoutStyles.rowActions} style={{ marginTop: 'var(--space-md)' }}>
        <Button type="button" onClick={handleSave} disabled={saving || loading}>
          {saving ? 'A guardar…' : 'Guardar locais'}
        </Button>
        <button type="button" className={layoutStyles.linkButton} onClick={onClose}>
          Fechar
        </button>
      </div>
    </Card>
  )
}

function PermissionToggle({
  label,
  enabled,
  disabled,
  onToggle,
}: {
  label: string
  enabled: boolean
  disabled?: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      className={`${styles.permissionToggle} ${enabled ? styles.permissionToggleOn : ''}`}
      aria-pressed={enabled}
      disabled={disabled}
      onClick={onToggle}
    >
      {label}
    </button>
  )
}

export function AdminTherapistsPage() {
  const { token } = useAuth()
  const [therapists, setTherapists] = useState<TherapistRow[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [managingLocationsFor, setManagingLocationsFor] = useState<TherapistRow | null>(null)
  const [updatingKey, setUpdatingKey] = useState<string | null>(null)

  async function load() {
    if (!token) return
    const data = await adminApi.listTherapists(token)
    setTherapists(
      data.therapists.map((therapist) => ({
        ...therapist,
        financialOverviewEnabled: therapist.financialOverviewEnabled ?? false,
        piccaEnabled: therapist.piccaEnabled ?? false,
        questionnairesEnabled: therapist.questionnairesEnabled ?? false,
        assessmentResultsEnabled: therapist.assessmentResultsEnabled ?? false,
        appointmentInvitesAllowed: therapist.appointmentInvitesAllowed ?? false,
      })),
    )
  }

  useEffect(() => {
    load()
  }, [token])

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (!token) return
    setError('')
    try {
      await adminApi.createTherapist(token, { name, email, password })
      setName('')
      setEmail('')
      setPassword('')
      await load()
    } catch {
      setError('Não foi possível criar o terapeuta')
    }
  }

  async function updateTherapistField(
    therapist: TherapistRow,
    field: PermissionKey | 'active',
    value: boolean,
  ) {
    if (!token) return
    setUpdatingKey(`${therapist.id}:${field}`)
    try {
      await adminApi.updateTherapist(token, therapist.id, { [field]: value })
      await load()
    } finally {
      setUpdatingKey(null)
    }
  }

  function isUpdating(therapistId: string, field: string) {
    return updatingKey === `${therapistId}:${field}`
  }

  return (
    <RequireAdmin>
      <BackofficeLayout>
        <h1 className={layoutStyles.pageTitle}>Terapeutas</h1>

        <Card as="section" className={layoutStyles.sectionSpaced}>
          <h2>Novo terapeuta</h2>
          <form className={layoutStyles.form} onSubmit={handleCreate}>
            <div className={layoutStyles.field}>
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className={layoutStyles.field}>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className={layoutStyles.field}>
              <label htmlFor="password">Palavra-passe temporária</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            {error && <p className={layoutStyles.error}>{error}</p>}
            <Button type="submit">Criar terapeuta</Button>
          </form>
        </Card>

        {managingLocationsFor && token && (
          <TherapistLocationsPanel
            therapist={managingLocationsFor}
            token={token}
            onClose={() => setManagingLocationsFor(null)}
          />
        )}

        <div className={styles.tableWrap}>
          <table className={styles.therapistsTable}>
            <thead>
              <tr>
                <th>Terapeuta</th>
                <th>Estado</th>
                <th>Permissões</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {therapists.map((therapist) => (
                <tr key={therapist.id}>
                  <td className={styles.therapistIdentity}>
                    <span className={styles.therapistName}>{therapist.name}</span>
                    <span className={styles.therapistEmail}>{therapist.email}</span>
                  </td>
                  <td>
                    <span className={therapist.active ? styles.statusActive : styles.statusInactive}>
                      {therapist.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.permissionGroup}>
                      {PERMISSION_OPTIONS.map((permission) => (
                        <PermissionToggle
                          key={permission.key}
                          label={permission.label}
                          enabled={therapist[permission.key]}
                          disabled={isUpdating(therapist.id, permission.key)}
                          onToggle={() =>
                            updateTherapistField(therapist, permission.key, !therapist[permission.key])
                          }
                        />
                      ))}
                    </div>
                  </td>
                  <td className={styles.actionsCell}>
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        className={layoutStyles.linkButton}
                        onClick={() => setManagingLocationsFor(therapist)}
                      >
                        Gerir locais
                      </button>
                      <AdminPasswordReset
                        onSubmit={async (nextPassword) => {
                          if (!token) return
                          await adminApi.updateTherapist(token, therapist.id, { password: nextPassword })
                        }}
                      />
                      <button
                        type="button"
                        className={therapist.active ? layoutStyles.dangerLinkButton : layoutStyles.linkButton}
                        disabled={isUpdating(therapist.id, 'active')}
                        onClick={() => updateTherapistField(therapist, 'active', !therapist.active)}
                      >
                        {therapist.active ? 'Desativar conta' : 'Ativar conta'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BackofficeLayout>
    </RequireAdmin>
  )
}
