import { useEffect, useState } from 'react'
import { BackofficeLayout, RequireAdmin } from '../../components/backoffice/BackofficeLayout'
import { adminApi, ApiError } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

type LocationRow = {
  id: string
  name: string
  address?: string | null
  active: boolean
  patientCount: number
}

export function AdminLocationsPage() {
  const { token } = useAuth()
  const [locations, setLocations] = useState<LocationRow[]>([])
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')

  const [loading, setLoading] = useState(true)

  async function load() {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const data = await adminApi.listLocations(token)
      setLocations(data.locations)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar locais')
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
      await adminApi.createLocation(token, { name, address: address || undefined })
      setName('')
      setAddress('')
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível criar o local')
    }
  }

  async function toggleActive(location: LocationRow) {
    if (!token) return
    await adminApi.updateLocation(token, location.id, { active: !location.active })
    await load()
  }

  return (
    <RequireAdmin>
      <BackofficeLayout>
        <h1 className={styles.pageTitle}>Locais</h1>
        <p className={styles.muted} style={{ marginTop: '-0.75rem', marginBottom: 'var(--space-lg)' }}>
          Consultórios ou espaços onde os terapeutas atendem pacientes.
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <Card as="section" className={styles.sectionSpaced}>
          <h2>Novo local</h2>
          <form className={styles.form} onSubmit={handleCreate}>
            <div className={styles.field}>
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label htmlFor="address">Morada (opcional)</label>
              <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <Button type="submit">Criar local</Button>
          </form>
        </Card>

        {loading ? (
          <p className={styles.muted}>A carregar…</p>
        ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Morada</th>
              <th>Pacientes</th>
              <th>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.id}>
                <td>{location.name}</td>
                <td>{location.address ?? '—'}</td>
                <td>{location.patientCount}</td>
                <td>{location.active ? 'Ativo' : 'Inativo'}</td>
                <td>
                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={() => toggleActive(location)}
                  >
                    {location.active ? 'Desativar' : 'Ativar'}
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
