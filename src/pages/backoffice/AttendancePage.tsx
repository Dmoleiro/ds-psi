import { useEffect, useState } from 'react'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { AttendanceMatrix } from '../../components/backoffice/AttendanceMatrix'
import { ApiError, coordinatorApi, therapistApi, type LocationSummary } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { useEditLock } from '../../hooks/useEditLock'
import styles from './AttendancePage.module.css'
import layout from '../../components/backoffice/BackofficeLayout.module.css'

type TherapistOption = { id: string; name: string; email: string }

export function AttendancePage() {
  const { user, token } = useAuth()
  const isCoordinator = user?.role === 'coordinator'
  const [therapists, setTherapists] = useState<TherapistOption[]>([])
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistOption | null>(null)
  const [locations, setLocations] = useState<LocationSummary[]>([])
  const [selectedLocation, setSelectedLocation] = useState<LocationSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const editLock = useEditLock()

  useEffect(() => {
    if (!token) return
    setLoading(true)
    setError('')

    const request = isCoordinator
      ? coordinatorApi.listTherapists(token).then((data) => {
          setTherapists(data.therapists)
        })
      : therapistApi.listLocations(token).then((data) => {
          setLocations(data.locations)
        })

    request
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar dados'),
      )
      .finally(() => setLoading(false))
  }, [token, isCoordinator])

  useEffect(() => {
    if (!token || !isCoordinator || !selectedTherapist) return
    setLoading(true)
    setError('')
    coordinatorApi
      .listLocations(token)
      .then((data) => setLocations(data.locations))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erro ao carregar locais'))
      .finally(() => setLoading(false))
  }, [token, isCoordinator, selectedTherapist])

  function selectTherapist(therapist: TherapistOption) {
    setSelectedTherapist(therapist)
    setSelectedLocation(null)
  }

  function selectLocation(location: LocationSummary) {
    editLock.lock()
    setSelectedLocation(location)
  }

  function changeTherapist() {
    setSelectedTherapist(null)
    setSelectedLocation(null)
    setLocations([])
  }

  function changeLocation() {
    editLock.lock()
    setSelectedLocation(null)
  }

  return (
    <BackofficeLayout>
      <h1 className={layout.pageTitle}>Presenças</h1>

      {isCoordinator && !selectedTherapist ? (
        <>
          <p className={layout.muted} style={{ marginTop: '-0.75rem', marginBottom: 'var(--space-lg)' }}>
            Selecione o terapeuta para consultar as presenças (apenas leitura).
          </p>
          {error && <p className={layout.error}>{error}</p>}
          {loading ? (
            <p className={layout.muted}>A carregar…</p>
          ) : therapists.length === 0 ? (
            <p className={layout.muted}>Não existem terapeutas ativos.</p>
          ) : (
            <div className={styles.locationGrid}>
              {therapists.map((therapist) => (
                <button
                  key={therapist.id}
                  type="button"
                  className={styles.locationTile}
                  onClick={() => selectTherapist(therapist)}
                >
                  <span className={styles.locationName}>{therapist.name}</span>
                  <span className={styles.locationAddress}>{therapist.email}</span>
                </button>
              ))}
            </div>
          )}
        </>
      ) : !selectedLocation ? (
        <>
          <p className={layout.muted} style={{ marginTop: '-0.75rem', marginBottom: 'var(--space-lg)' }}>
            {isCoordinator
              ? 'Selecione o local para ver as presenças do mês.'
              : 'Selecione o local para ver e editar as presenças do mês.'}
          </p>
          {isCoordinator && selectedTherapist && (
            <p className={layout.muted} style={{ marginBottom: 'var(--space-md)' }}>
              Terapeuta: <strong>{selectedTherapist.name}</strong>
              {' · '}
              <button type="button" className={layout.linkButton} onClick={changeTherapist}>
                Escolher outro terapeuta
              </button>
            </p>
          )}
          {error && <p className={layout.error}>{error}</p>}
          {loading ? (
            <p className={layout.muted}>A carregar…</p>
          ) : locations.length === 0 ? (
            <p className={layout.muted}>Ainda não existem locais ativos.</p>
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
            {isCoordinator && selectedTherapist && (
              <>
                Terapeuta: <strong>{selectedTherapist.name}</strong>
                {' · '}
                <button type="button" className={layout.linkButton} onClick={changeTherapist}>
                  Escolher outro terapeuta
                </button>
                {' · '}
              </>
            )}
            <button type="button" className={layout.linkButton} onClick={changeLocation}>
              ← Escolher outro local
            </button>
          </p>
          {token && (
            <AttendanceMatrix
              token={token}
              location={selectedLocation}
              editLock={editLock}
              mode={isCoordinator ? 'coordinator' : 'therapist'}
              therapistId={selectedTherapist?.id}
            />
          )}
        </>
      )}
    </BackofficeLayout>
  )
}
