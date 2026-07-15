import { useEffect, useState } from 'react'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { AppointmentsCalendar } from '../../components/backoffice/AppointmentsCalendar'
import { ApiError, coordinatorApi } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import attendanceStyles from './AttendancePage.module.css'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

type TherapistOption = { id: string; name: string; email: string }

export function AppointmentsPage() {
  const { user, token } = useAuth()
  const isCoordinator = user?.role === 'coordinator'
  const [therapists, setTherapists] = useState<TherapistOption[]>([])
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistOption | null>(null)
  const [loading, setLoading] = useState(isCoordinator)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token || !isCoordinator) return
    setLoading(true)
    setError('')
    coordinatorApi
      .listTherapists(token)
      .then((data) => setTherapists(data.therapists))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erro ao carregar terapeutas'))
      .finally(() => setLoading(false))
  }, [token, isCoordinator])

  if (!token || !user) return null

  return (
    <BackofficeLayout>
      <h1 className={styles.pageTitle}>Consultas</h1>

      {isCoordinator && !selectedTherapist ? (
        <>
          <p className={styles.muted} style={{ marginTop: '-0.75rem', marginBottom: 'var(--space-lg)' }}>
            Selecione o terapeuta para consultar as marcações (apenas leitura).
          </p>
          {error && <p className={styles.error}>{error}</p>}
          {loading ? (
            <p className={styles.muted}>A carregar…</p>
          ) : therapists.length === 0 ? (
            <p className={styles.muted}>Não existem terapeutas ativos.</p>
          ) : (
            <div className={attendanceStyles.locationGrid}>
              {therapists.map((therapist) => (
                <button
                  key={therapist.id}
                  type="button"
                  className={attendanceStyles.locationTile}
                  onClick={() => setSelectedTherapist(therapist)}
                >
                  <span className={attendanceStyles.locationName}>{therapist.name}</span>
                  <span className={attendanceStyles.locationAddress}>{therapist.email}</span>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {isCoordinator && selectedTherapist && (
            <p className={styles.muted} style={{ marginTop: '-0.75rem', marginBottom: 'var(--space-md)' }}>
              Terapeuta: <strong>{selectedTherapist.name}</strong>
              {' · '}
              <button type="button" className={styles.linkButton} onClick={() => setSelectedTherapist(null)}>
                Escolher outro terapeuta
              </button>
            </p>
          )}
          <p className={styles.muted} style={{ marginBottom: 'var(--space-lg)' }}>
            {isCoordinator
              ? 'Visualização das consultas agendadas. Pode filtrar por local e exportar o mês em PDF.'
              : 'Agende consultas no calendário mensal. Clique num dia para adicionar ou gerir marcações.'}
          </p>
          <AppointmentsCalendar
            token={token}
            therapistName={isCoordinator ? selectedTherapist!.name : user.name}
            readOnly={isCoordinator}
            therapistId={selectedTherapist?.id}
          />
        </>
      )}
    </BackofficeLayout>
  )
}
