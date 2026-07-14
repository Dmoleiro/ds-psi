import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { therapistApi, type PatientSummary } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

export function PatientsListPage() {
  const { token } = useAuth()
  const [patients, setPatients] = useState<PatientSummary[]>([])
  const [loading, setLoading] = useState(true)

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

      {loading ? (
        <p className={styles.muted}>A carregar…</p>
      ) : patients.length === 0 ? (
        <Card>
          <p>Ainda não existem pacientes. Crie o primeiro perfil para gerar um link de formulários.</p>
        </Card>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Local</th>
              <th>Contacto</th>
              <th>Última sessão</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => {
              const latest = patient.intakeSessions?.[0]
              return (
                <tr key={patient.id}>
                  <td>{patient.fullName}</td>
                  <td>{patient.location?.name ?? '—'}</td>
                  <td>{patient.email ?? patient.phone ?? '—'}</td>
                  <td>{latest ? `${latest.status} · ${new Date(latest.createdAt).toLocaleDateString('pt-PT')}` : '—'}</td>
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
