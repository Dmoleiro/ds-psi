import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { therapistApi, type PatientSummary } from '../../lib/api'
import { formatSessionStatus, sessionStatusBadgeVariant } from '../../lib/intakeStatus'
import { useAuth } from '../../hooks/useAuth'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

function formatPatientContact(patient: PatientSummary): string {
  const emails = [patient.email, patient.email2].filter(Boolean)
  if (emails.length > 0) return emails.join(' · ')
  return patient.phone ?? '—'
}

function matchesPatientSearch(patient: PatientSummary, query: string): boolean {
  const normalized = query.trim().toLocaleLowerCase('pt-PT')
  if (!normalized) return true

  const haystack = [patient.fullName, patient.email, patient.email2]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase('pt-PT')

  return haystack.includes(normalized)
}

export function PatientsListPage() {
  const { token } = useAuth()
  const [patients, setPatients] = useState<PatientSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const filteredPatients = useMemo(
    () => patients.filter((patient) => matchesPatientSearch(patient, search)),
    [patients, search],
  )

  useEffect(() => {
    if (!token) return
    therapistApi
      .listPatients(token)
      .then((data) => setPatients(data.patients))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <BackofficeLayout>
      <div className={styles.actions} style={{ justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
        <h1 className={styles.pageTitle} style={{ margin: 0 }}>
          Pacientes
        </h1>
        <Button href="/backoffice/patients/new">Novo paciente</Button>
      </div>

      {!loading && patients.length > 0 && (
        <div className={styles.searchBar}>
          <label htmlFor="patient-search">Pesquisar</label>
          <input
            id="patient-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nome ou email…"
            autoComplete="off"
          />
        </div>
      )}

      {loading ? (
        <p className={styles.muted}>A carregar…</p>
      ) : filteredPatients.length === 0 ? (
        <Card>
          <p>
            {search.trim()
              ? 'Nenhum paciente corresponde à pesquisa.'
              : 'Ainda não existem pacientes. Crie o primeiro perfil para gerar um link de formulários.'}
          </p>
        </Card>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Local</th>
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
                  <td>{patient.fullName}</td>
                  <td>{patient.location?.name ?? '—'}</td>
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
                    <Link to={`/backoffice/patients/${patient.id}`}>Abrir</Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </BackofficeLayout>
  )
}
