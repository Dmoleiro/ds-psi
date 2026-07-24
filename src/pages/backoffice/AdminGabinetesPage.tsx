import { useEffect, useState } from 'react'
import { BackofficeLayout, RequireAdmin } from '../../components/backoffice/BackofficeLayout'
import { adminApi, ApiError, type LocationSummary } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

type GabineteRow = {
  id: string
  locationId: string
  locationName?: string
  name: string
  active: boolean
  sortOrder: number
  appointmentCount: number
}

export function AdminGabinetesPage() {
  const { token } = useAuth()
  const [gabinetes, setGabinetes] = useState<GabineteRow[]>([])
  const [locations, setLocations] = useState<LocationSummary[]>([])
  const [name, setName] = useState('')
  const [locationId, setLocationId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const [gabinetesData, locationsData] = await Promise.all([
        adminApi.listGabinetes(token),
        adminApi.listLocations(token),
      ])
      setGabinetes(gabinetesData.gabinetes)
      const activeLocations = locationsData.locations.filter((location) => location.active)
      setLocations(activeLocations)
      if (!locationId && activeLocations[0]) {
        setLocationId(activeLocations[0].id)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar gabinetes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [token])

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (!token || !locationId) return
    setError('')
    try {
      await adminApi.createGabinete(token, { name, locationId })
      setName('')
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível criar o gabinete')
    }
  }

  async function toggleActive(gabinete: GabineteRow) {
    if (!token) return
    await adminApi.updateGabinete(token, gabinete.id, { active: !gabinete.active })
    await load()
  }

  return (
    <RequireAdmin>
      <BackofficeLayout>
        <h1 className={styles.pageTitle}>Gabinetes</h1>
        <p className={styles.muted} style={{ marginTop: '-0.75rem', marginBottom: 'var(--space-lg)' }}>
          Salas de consulta por local. Terapeutas só podem marcar em gabinetes ativos do respetivo local.
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <Card as="section" className={styles.sectionSpaced}>
          <h2>Novo gabinete</h2>
          <form className={styles.form} onSubmit={handleCreate}>
            <div className={styles.field}>
              <label htmlFor="gabinete-location">Local</label>
              <select
                id="gabinete-location"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                required
              >
                {locations.length === 0 ? (
                  <option value="">Sem locais ativos</option>
                ) : (
                  locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="gabinete-name">Nome</label>
              <input
                id="gabinete-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Gabinete 3"
                required
              />
            </div>
            <Button type="submit" disabled={!locationId}>
              Criar gabinete
            </Button>
          </form>
        </Card>

        {loading ? (
          <p className={styles.muted}>A carregar…</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Local</th>
                <th>Consultas</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {gabinetes.map((gabinete) => (
                <tr key={gabinete.id}>
                  <td>{gabinete.name}</td>
                  <td>{gabinete.locationName ?? '—'}</td>
                  <td>{gabinete.appointmentCount}</td>
                  <td>{gabinete.active ? 'Ativo' : 'Inativo'}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.linkButton}
                      onClick={() => toggleActive(gabinete)}
                    >
                      {gabinete.active ? 'Desativar' : 'Ativar'}
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
