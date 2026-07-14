import { useEffect, useState } from 'react'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { AttendanceMatrix } from '../../components/backoffice/AttendanceMatrix'
import { ApiError, therapistApi, type LocationSummary } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { useEditLock } from '../../hooks/useEditLock'
import styles from './AttendancePage.module.css'
import layout from '../../components/backoffice/BackofficeLayout.module.css'

export function AttendancePage() {
  const { token } = useAuth()
  const [locations, setLocations] = useState<LocationSummary[]>([])
  const [selectedLocation, setSelectedLocation] = useState<LocationSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const editLock = useEditLock()

  useEffect(() => {
    if (!token) return
    setLoading(true)
    therapistApi
      .listLocations(token)
      .then((data) => setLocations(data.locations))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erro ao carregar locais'))
      .finally(() => setLoading(false))
  }, [token])

  function selectLocation(location: LocationSummary) {
    editLock.lock()
    setSelectedLocation(location)
  }

  function changeLocation() {
    editLock.lock()
    setSelectedLocation(null)
  }

  return (
    <BackofficeLayout>
      <h1 className={layout.pageTitle}>Presenças</h1>

      {!selectedLocation ? (
        <>
          <p className={layout.muted} style={{ marginTop: '-0.75rem', marginBottom: 'var(--space-lg)' }}>
            Selecione o local para ver e editar as presenças do mês.
          </p>
          {error && <p className={layout.error}>{error}</p>}
          {loading ? (
            <p className={layout.muted}>A carregar…</p>
          ) : locations.length === 0 ? (
            <p className={layout.muted}>Ainda não existem locais ativos. Peça ao administrador para criar locais.</p>
          ) : (
            <div className={styles.locationGrid}>
              {locations.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  className={styles.locationTile}
                  onClick={() => selectLocation(location)}
                >
                  <span className={styles.locationName}>{location.name}</span>
                  {location.address && <span className={styles.locationAddress}>{location.address}</span>}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <p className={layout.muted} style={{ marginTop: '-0.75rem', marginBottom: 'var(--space-md)' }}>
            <button type="button" className={layout.linkButton} onClick={changeLocation}>
              ← Escolher outro local
            </button>
          </p>
          {token && (
            <AttendanceMatrix
              token={token}
              location={selectedLocation}
              editLock={editLock}
            />
          )}
        </>
      )}
    </BackofficeLayout>
  )
}
