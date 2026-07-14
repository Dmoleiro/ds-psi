import { useEffect, useState } from 'react'
import { BackofficeLayout, RequireAdmin } from '../../components/backoffice/BackofficeLayout'
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

export function AdminCoordinatorsPage() {
  const { token } = useAuth()
  const [coordinators, setCoordinators] = useState<CoordinatorRow[]>([])
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
          Acesso só de leitura às presenças de cada terapeuta — sem permissão para alterar dados.
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
                    <button
                      type="button"
                      className={styles.linkButton}
                      onClick={() => handleDelete(coordinator)}
                    >
                      Eliminar
                    </button>
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
