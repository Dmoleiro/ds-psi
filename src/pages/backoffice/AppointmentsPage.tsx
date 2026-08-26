import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import {
  AppointmentsCalendar,
  type AppointmentPrefill,
} from '../../components/backoffice/AppointmentsCalendar'
import { ApiError, coordinatorApi, therapistApi } from '../../lib/api'
import { isIsoDateString } from '../../lib/dashboard'
import { useAuth } from '../../hooks/useAuth'
import {
  isShadowTherapistViewer,
  isStaffReadOnlyViewer,
  needsTherapistPicker,
  usesCoordinatorApi,
} from '../../lib/staffViewer'
import attendanceStyles from './AttendancePage.module.css'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

type TherapistOption = { id: string; name: string; email: string }

export function AppointmentsPage() {
  const { user, token } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const isCoordinator = usesCoordinatorApi(user)
  const isShadowViewer = isShadowTherapistViewer(user)
  const readOnly = isStaffReadOnlyViewer(user)
  const showTherapistPicker = needsTherapistPicker(user)
  const [therapists, setTherapists] = useState<TherapistOption[]>([])
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistOption | null>(null)
  const [loading, setLoading] = useState(showTherapistPicker)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token || !showTherapistPicker) return
    setLoading(true)
    setError('')
    const request = isCoordinator
      ? coordinatorApi.listTherapists(token)
      : therapistApi.listShadowTherapists(token)

    request
      .then((data) => setTherapists(data.therapists))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erro ao carregar terapeutas'))
      .finally(() => setLoading(false))
  }, [token, showTherapistPicker, isCoordinator])

  const appointmentPrefill = useMemo((): AppointmentPrefill | null => {
    const appointmentId = searchParams.get('appointmentId')
    if (appointmentId) {
      return { mode: 'edit', appointmentId }
    }

    const date = searchParams.get('date')
    const patientId = searchParams.get('patientId')
    if (date && patientId) {
      const locationId = searchParams.get('locationId')
      return {
        mode: 'create',
        date,
        patientId,
        locationId: locationId || null,
      }
    }

    if (date && isIsoDateString(date)) {
      return { mode: 'day', date }
    }

    return null
  }, [searchParams])

  function clearAppointmentPrefill() {
    if (!searchParams.get('appointmentId') && !searchParams.get('patientId') && !searchParams.get('date')) {
      return
    }
    const next = new URLSearchParams(searchParams)
    next.delete('appointmentId')
    next.delete('patientId')
    next.delete('date')
    next.delete('locationId')
    setSearchParams(next, { replace: true })
  }

  if (!token || !user) return null

  return (
    <BackofficeLayout>
      <h1 className={styles.pageTitle}>Consultas</h1>

      {showTherapistPicker && !selectedTherapist ? (
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
          {readOnly && selectedTherapist && (
            <p className={styles.muted} style={{ marginTop: '-0.75rem', marginBottom: 'var(--space-md)' }}>
              Terapeuta: <strong>{selectedTherapist.name}</strong>
              {' · '}
              <button type="button" className={styles.linkButton} onClick={() => setSelectedTherapist(null)}>
                Escolher outro terapeuta
              </button>
            </p>
          )}
          <p className={styles.muted} style={{ marginBottom: 'var(--space-lg)' }}>
            {readOnly
              ? 'Visualização das consultas agendadas. Pode filtrar por local e exportar o mês em PDF.'
              : 'Agende consultas no calendário mensal. Clique num dia para adicionar ou gerir marcações.'}
          </p>
          <AppointmentsCalendar
            token={token}
            therapistName={readOnly ? selectedTherapist!.name : user.name}
            readOnly={readOnly}
            shadowTherapistApi={isShadowViewer}
            therapistId={selectedTherapist?.id}
            prefill={appointmentPrefill}
            onPrefillConsumed={clearAppointmentPrefill}
          />
        </>
      )}
    </BackofficeLayout>
  )
}
