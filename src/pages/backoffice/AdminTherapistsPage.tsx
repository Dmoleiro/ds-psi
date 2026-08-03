import { useEffect, useState } from 'react'
import { BackofficeLayout, RequireAdmin } from '../../components/backoffice/BackofficeLayout'
import { AdminPasswordReset } from '../../components/backoffice/AdminPasswordReset'
import { adminApi, ApiError } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

type TherapistRow = {
  id: string
  email: string
  name: string
  active: boolean
  financialOverviewEnabled: boolean
  piccaEnabled: boolean
  appointmentInvitesAllowed: boolean
  createdAt: string
}

type TherapistLocationRow = {
  id: string
  name: string
  active: boolean
  assigned: boolean
}

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
    <Card as="section" className={styles.sectionSpaced}>
      <h2>Locais — {therapist.name}</h2>
      <p className={styles.muted}>
        Selecione os locais onde este terapeuta pode trabalhar, criar pacientes e marcar consultas.
      </p>
      {error && <p className={styles.error}>{error}</p>}
      {loading ? (
        <p className={styles.muted}>A carregar…</p>
      ) : locations.length === 0 ? (
        <p className={styles.muted}>Crie locais antes de atribuir acessos.</p>
      ) : (
        <div className={styles.form}>
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
      <div className={styles.rowActions} style={{ marginTop: 'var(--space-md)' }}>
        <Button type="button" onClick={handleSave} disabled={saving || loading}>
          {saving ? 'A guardar…' : 'Guardar locais'}
        </Button>
        <button type="button" className={styles.linkButton} onClick={onClose}>
          Fechar
        </button>
      </div>
    </Card>
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

  async function load() {
    if (!token) return
    const data = await adminApi.listTherapists(token)
    setTherapists(
      data.therapists.map((therapist) => ({
        ...therapist,
        financialOverviewEnabled: therapist.financialOverviewEnabled ?? false,
        piccaEnabled: therapist.piccaEnabled ?? false,
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

  async function toggleFinancialAccess(therapist: TherapistRow) {
    if (!token) return
    await adminApi.updateTherapist(token, therapist.id, {
      financialOverviewEnabled: !therapist.financialOverviewEnabled,
    })
    await load()
  }

  async function togglePiccaAccess(therapist: TherapistRow) {
    if (!token) return
    await adminApi.updateTherapist(token, therapist.id, {
      piccaEnabled: !therapist.piccaEnabled,
    })
    await load()
  }

  async function toggleAppointmentInvites(therapist: TherapistRow) {
    if (!token) return
    await adminApi.updateTherapist(token, therapist.id, {
      appointmentInvitesAllowed: !therapist.appointmentInvitesAllowed,
    })
    await load()
  }

  async function toggleActive(therapist: TherapistRow) {
    if (!token) return
    await adminApi.updateTherapist(token, therapist.id, { active: !therapist.active })
    await load()
  }

  return (
    <RequireAdmin>
      <BackofficeLayout>
        <h1 className={styles.pageTitle}>Terapeutas</h1>

        <Card as="section" className={styles.sectionSpaced}>
          <h2>Novo terapeuta</h2>
          <form className={styles.form} onSubmit={handleCreate}>
            <div className={styles.field}>
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className={styles.field}>
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
            {error && <p className={styles.error}>{error}</p>}
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

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Finanças</th>
              <th>PICCA</th>
              <th>Convites</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {therapists.map((therapist) => (
              <tr key={therapist.id}>
                <td>{therapist.name}</td>
                <td>{therapist.email}</td>
                <td>{therapist.active ? 'Ativo' : 'Inativo'}</td>
                <td>{therapist.financialOverviewEnabled ? 'Ativo' : '—'}</td>
                <td>{therapist.piccaEnabled ? 'Ativo' : '—'}</td>
                <td>{therapist.appointmentInvitesAllowed ? 'Ativo' : '—'}</td>
                <td>
                  <div className={styles.rowActions}>
                    <button
                      type="button"
                      className={styles.linkButton}
                      onClick={() => setManagingLocationsFor(therapist)}
                    >
                      Gerir locais
                    </button>
                    <button
                      type="button"
                      className={styles.linkButton}
                      onClick={() => toggleFinancialAccess(therapist)}
                    >
                      {therapist.financialOverviewEnabled ? 'Revogar finanças' : 'Dar acesso finanças'}
                    </button>
                    <button
                      type="button"
                      className={styles.linkButton}
                      onClick={() => togglePiccaAccess(therapist)}
                    >
                      {therapist.piccaEnabled ? 'Revogar PICCA' : 'Dar acesso PICCA'}
                    </button>
                    <button
                      type="button"
                      className={styles.linkButton}
                      onClick={() => toggleAppointmentInvites(therapist)}
                    >
                      {therapist.appointmentInvitesAllowed ? 'Revogar convites' : 'Permitir convites'}
                    </button>
                    <button
                      type="button"
                      className={styles.linkButton}
                      onClick={() => toggleActive(therapist)}
                    >
                      {therapist.active ? 'Desativar' : 'Ativar'}
                    </button>
                    <AdminPasswordReset
                      onSubmit={async (password) => {
                        if (!token) return
                        await adminApi.updateTherapist(token, therapist.id, { password })
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </BackofficeLayout>
    </RequireAdmin>
  )
}
