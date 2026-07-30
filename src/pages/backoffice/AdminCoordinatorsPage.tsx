import { useEffect, useState } from 'react'
import { BackofficeLayout, RequireAdmin } from '../../components/backoffice/BackofficeLayout'
import { AdminPasswordReset } from '../../components/backoffice/AdminPasswordReset'
import { adminApi, ApiError } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

type CoordinatorRow = {
  id: string
  email: string
  name: string
  active: boolean
  createdAt: string
}

type CoordinatorTherapistRow = {
  id: string
  name: string
  email: string
  active: boolean
  assigned: boolean
}

function CoordinatorTherapistsPanel({
  coordinator,
  token,
  onClose,
}: {
  coordinator: CoordinatorRow
  token: string
  onClose: () => void
}) {
  const [therapists, setTherapists] = useState<CoordinatorTherapistRow[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    adminApi
      .getCoordinatorTherapists(token, coordinator.id)
      .then((data) => {
        setTherapists(data.therapists)
        setSelectedIds(data.therapists.filter((therapist) => therapist.assigned).map((therapist) => therapist.id))
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar terapeutas')
      })
      .finally(() => setLoading(false))
  }, [token, coordinator.id])

  function toggleTherapist(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    )
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const data = await adminApi.setCoordinatorTherapists(token, coordinator.id, selectedIds)
      setTherapists(data.therapists)
      setSelectedIds(data.therapists.filter((therapist) => therapist.assigned).map((therapist) => therapist.id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível guardar os terapeutas')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card as="section" className={styles.sectionSpaced}>
      <h2>Terapeutas — {coordinator.name}</h2>
      <p className={styles.muted}>
        Selecione os terapeutas a que este utilizador administrativo pode aceder (consultas, presenças e
        pacientes).
      </p>
      {error && <p className={styles.error}>{error}</p>}
      {loading ? (
        <p className={styles.muted}>A carregar…</p>
      ) : therapists.length === 0 ? (
        <p className={styles.muted}>Crie terapeutas antes de atribuir acessos.</p>
      ) : (
        <div className={styles.form}>
          {therapists.map((therapist) => (
            <label key={therapist.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={selectedIds.includes(therapist.id)}
                onChange={() => toggleTherapist(therapist.id)}
                disabled={!therapist.active}
              />
              {therapist.name}
              {!therapist.active ? ' (inativo)' : ''}
            </label>
          ))}
        </div>
      )}
      <div className={styles.rowActions} style={{ marginTop: 'var(--space-md)' }}>
        <Button type="button" onClick={handleSave} disabled={saving || loading}>
          {saving ? 'A guardar…' : 'Guardar terapeutas'}
        </Button>
        <button type="button" className={styles.linkButton} onClick={onClose}>
          Fechar
        </button>
      </div>
    </Card>
  )
}

export function AdminCoordinatorsPage() {
  const { token } = useAuth()
  const [coordinators, setCoordinators] = useState<CoordinatorRow[]>([])
  const [managingCoordinator, setManagingCoordinator] = useState<CoordinatorRow | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const data = await adminApi.listCoordinators(token)
      setCoordinators(data.coordinators)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar utilizadores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [token])

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (!token) return
    setError('')
    try {
      await adminApi.createCoordinator(token, { name, email, password })
      setName('')
      setEmail('')
      setPassword('')
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível criar o utilizador')
    }
  }

  async function handleDelete(coordinator: CoordinatorRow) {
    if (!token) return
    const confirmed = window.confirm(
      `Eliminar o utilizador administrativo «${coordinator.name}»? Esta ação não pode ser revertida.`,
    )
    if (!confirmed) return

    setError('')
    try {
      await adminApi.deleteCoordinator(token, coordinator.id)
      if (managingCoordinator?.id === coordinator.id) {
        setManagingCoordinator(null)
      }
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível eliminar o utilizador')
    }
  }

  return (
    <RequireAdmin>
      <BackofficeLayout>
        <h1 className={styles.pageTitle}>Utilizadores administrativos</h1>
        <p className={styles.muted} style={{ marginTop: '-0.75rem', marginBottom: 'var(--space-lg)' }}>
          Acesso de leitura a consultas, presenças e pacientes dos terapeutas atribuídos. Pode alterar o
          estado de recibos nas presenças.
        </p>

        <Card as="section" className={styles.sectionSpaced}>
          <h2>Novo utilizador</h2>
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
            <Button type="submit">Criar utilizador</Button>
          </form>
        </Card>

        {managingCoordinator && token && (
          <CoordinatorTherapistsPanel
            coordinator={managingCoordinator}
            token={token}
            onClose={() => setManagingCoordinator(null)}
          />
        )}

        {loading ? (
          <p className={styles.muted}>A carregar…</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {coordinators.map((coordinator) => (
                <tr key={coordinator.id}>
                  <td>{coordinator.name}</td>
                  <td>{coordinator.email}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        className={styles.linkButton}
                        onClick={() => setManagingCoordinator(coordinator)}
                      >
                        Terapeutas
                      </button>
                      <AdminPasswordReset
                        onSubmit={async (password) => {
                          if (!token) return
                          await adminApi.updateCoordinator(token, coordinator.id, { password })
                        }}
                      />
                      <button
                        type="button"
                        className={styles.linkButton}
                        onClick={() => handleDelete(coordinator)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </BackofficeLayout>
    </RequireAdmin>
  )
}
