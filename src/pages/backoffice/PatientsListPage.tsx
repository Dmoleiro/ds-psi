import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { ApiError, coordinatorApi, therapistApi, type LocationSummary, type PatientSummary } from '../../lib/api'
import { formatSessionStatus, sessionStatusBadgeVariant } from '../../lib/intakeStatus'
import { formatPatientSessionFee } from '../../lib/dashboard'
import { matchesPatientSearch } from '../../lib/patientSearch'
import { exportPatientsListPdf, type PatientListExportColumnId } from '../../lib/exportPatientsListPdf'
import { PatientsListExportDialog } from '../../components/backoffice/PatientsListExportDialog'
import { useAuth } from '../../hooks/useAuth'
import {
  isStaffReadOnlyViewer,
  usesCoordinatorApi,
} from '../../lib/staffViewer'
import attendanceStyles from './AttendancePage.module.css'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

type TherapistOption = { id: string; name: string; email: string }

function formatPatientContact(patient: PatientSummary): string {
  const contact = [patient.email, patient.email2, patient.phone, patient.phone2].filter(Boolean)
  return contact.length > 0 ? contact.join(' · ') : '—'
}

function isPatientActive(patient: PatientSummary): boolean {
  return patient.active !== false
}

export function PatientsListPage() {
  const { token, user } = useAuth()
  const readOnly = isStaffReadOnlyViewer(user)
  const useCoordinatorApi = usesCoordinatorApi(user)
  const [therapists, setTherapists] = useState<TherapistOption[]>([])
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistOption | null>(null)
  const [patients, setPatients] = useState<PatientSummary[]>([])
  const [locations, setLocations] = useState<LocationSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [showInactive, setShowInactive] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)

  const filteredPatients = useMemo(() => {
    const normalizedSearch = search.trim()
    const matches = patients.filter((patient) => {
      if (!matchesPatientSearch(patient, normalizedSearch)) return false
      if (locationFilter && patient.location?.id !== locationFilter) return false
      if (showInactive) {
        if (isPatientActive(patient)) return false
      } else if (!isPatientActive(patient)) {
        return false
      }
      return true
    })
    return matches.sort((a, b) => a.fullName.localeCompare(b.fullName, 'pt-PT'))
  }, [patients, search, locationFilter, showInactive])

  const selectedLocationName = useMemo(
    () => locations.find((location) => location.id === locationFilter)?.name ?? null,
    [locations, locationFilter],
  )

  const therapistName = readOnly ? selectedTherapist?.name : user?.name

  const hasOnlyInactivePatients =
    patients.length > 0 && patients.every((patient) => !isPatientActive(patient))

  function handleExportPdf(columnIds: PatientListExportColumnId[]) {
    try {
      exportPatientsListPdf(
        filteredPatients,
        {
          therapistName,
          search,
          locationName: selectedLocationName,
        },
        columnIds,
      )
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Não foi possível exportar o PDF')
    }
  }

  useEffect(() => {
    if (!token) return
    if (!readOnly) {
      setLoading(true)
      Promise.all([therapistApi.listPatients(token), therapistApi.listLocations(token)])
        .then(([patientsData, locationsData]) => {
          setPatients(patientsData.patients)
          setLocations(locationsData.locations)
        })
        .finally(() => setLoading(false))
      return
    }

    setLoading(true)
    setError('')
    const request = useCoordinatorApi
      ? coordinatorApi.listTherapists(token)
      : therapistApi.listShadowTherapists(token)

    request
      .then((data) => setTherapists(data.therapists))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erro ao carregar terapeutas'))
      .finally(() => setLoading(false))
  }, [token, readOnly, useCoordinatorApi])

  useEffect(() => {
    if (!token || !readOnly || !selectedTherapist) return
    setLoading(true)
    setError('')
    setSearch('')
    setLocationFilter('')
    setShowInactive(false)
    Promise.all([
      useCoordinatorApi
        ? coordinatorApi.listPatients(token, selectedTherapist.id)
        : therapistApi.listPatients(token, { therapistId: selectedTherapist.id }),
      useCoordinatorApi
        ? coordinatorApi.listLocations(token, selectedTherapist.id)
        : therapistApi.listLocations(token, selectedTherapist.id),
    ])
      .then(([patientsData, locationsData]) => {
        setPatients(patientsData.patients)
        setLocations(locationsData.locations)
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erro ao carregar pacientes'))
      .finally(() => setLoading(false))
  }, [token, readOnly, selectedTherapist, useCoordinatorApi])

  return (
    <BackofficeLayout>
      <h1 className={styles.pageTitle}>Pacientes</h1>

      {readOnly && !selectedTherapist ? (
        <>
          <p className={styles.muted} style={{ marginTop: '-0.75rem', marginBottom: 'var(--space-lg)' }}>
            Selecione o terapeuta para consultar os pacientes (apenas leitura).
          </p>
          {error && <p className={styles.error}>{error}</p>}
          {loading ? (
            <p className={styles.muted}>A carregar…</p>
          ) : therapists.length === 0 ? (
            <p className={styles.muted}>Não tem terapeutas atribuídos. Contacte o administrador.</p>
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
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => {
                  setSelectedTherapist(null)
                  setPatients([])
                  setLocations([])
                }}
              >
                Escolher outro terapeuta
              </button>
            </p>
          )}

          <div className={styles.actions} style={{ justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
            <p className={styles.muted} style={{ margin: 0 }}>
              {readOnly ? 'Consulta de dados dos pacientes (apenas leitura).' : null}
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              {!loading && patients.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setExportDialogOpen(true)}
                  disabled={filteredPatients.length === 0}
                >
                  Exportar PDF
                </Button>
              )}
              {!readOnly && <Button href="/backoffice/patients/new">Novo paciente</Button>}
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          {!loading && patients.length > 0 && (
            <div className={styles.filterBar}>
              <div className={styles.searchBar}>
                <label htmlFor="patient-search">Pesquisar</label>
                <input
                  id="patient-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Nome, email ou telefone…"
                  autoComplete="off"
                />
              </div>
              <div className={styles.filterField}>
                <label htmlFor="patient-location-filter">Local</label>
                <select
                  id="patient-location-filter"
                  value={locationFilter}
                  onChange={(event) => setLocationFilter(event.target.value)}
                >
                  <option value="">Todos os locais</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.filterField}>
                <label>Estado</label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInactive((current) => !current)}
                >
                  {showInactive ? 'Ver activos' : 'Ver inactivos'}
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <p className={styles.muted}>A carregar…</p>
          ) : filteredPatients.length === 0 ? (
            <Card>
              <p>
                {search.trim() || locationFilter || showInactive
                  ? 'Nenhum paciente corresponde aos filtros.'
                  : hasOnlyInactivePatients
                    ? 'Todos os pacientes estão inactivos. Use «Ver inactivos» para os consultar.'
                    : readOnly
                      ? 'Este terapeuta ainda não tem pacientes registados.'
                      : 'Ainda não existem pacientes. Crie o primeiro perfil para gerar um link de formulários.'}
              </p>
            </Card>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Local</th>
                  <th>Consulta</th>
                  <th>Contacto</th>
                  <th>Últimos formulários</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => {
                  const latest = patient.intakeSessions?.[0]
                  return (
                    <tr key={patient.id}>
                      <td>
                        {patient.fullName}
                        {!isPatientActive(patient) ? (
                          <>
                            {' '}
                            <Badge variant="muted">Inactivo</Badge>
                          </>
                        ) : null}
                      </td>
                      <td>{patient.location?.name ?? '—'}</td>
                      <td>{formatPatientSessionFee(patient.sessionFee)}</td>
                      <td>{formatPatientContact(patient)}</td>
                      <td>
                        {latest ? (
                          <>
                            <Badge variant={sessionStatusBadgeVariant(latest.status)}>
                              {formatSessionStatus(latest.status)}
                            </Badge>
                            {' · '}
                            {new Date(latest.createdAt).toLocaleDateString('pt-PT')}
                          </>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>
                        <Link to={`/backoffice/patients/${patient.id}`}>Ver ficha</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </>
      )}
      <PatientsListExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        onExport={handleExportPdf}
      />
    </BackofficeLayout>
  )
}
