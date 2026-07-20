import { Navigate } from 'react-router-dom'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { TherapistDashboard } from '../../components/backoffice/TherapistDashboard'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

export function BackofficeDashboardPage() {
  const { user, token } = useAuth()

  if (user?.role === 'admin') {
    return <Navigate to="/backoffice/admin/therapists" replace />
  }

  if (user?.role === 'coordinator') {
    return (
      <BackofficeLayout>
        <h1 className={styles.pageTitle}>Olá, {user.name}</h1>
        <div className={styles.cardGrid}>
          <Card as="article">
            <h2>Consultas</h2>
            <p className={styles.muted}>
              Consulte as marcações dos terapeutas por mês, local e paciente (apenas leitura).
            </p>
            <Button href="/backoffice/appointments" style={{ marginTop: 'var(--space-md)' }}>
              Ver consultas
            </Button>
          </Card>
          <Card as="article">
            <h2>Presenças</h2>
            <p className={styles.muted}>
              Consulte o registo mensal de presenças por terapeuta e local (apenas leitura).
            </p>
            <Button href="/backoffice/attendance" style={{ marginTop: 'var(--space-md)' }}>
              Ver presenças
            </Button>
          </Card>
        </div>
      </BackofficeLayout>
    )
  }

  if (!token || !user) {
    return (
      <BackofficeLayout>
        <p className={styles.muted}>A carregar…</p>
      </BackofficeLayout>
    )
  }

  return (
    <BackofficeLayout>
      <TherapistDashboard token={token} therapistName={user.name} />
    </BackofficeLayout>
  )
}
