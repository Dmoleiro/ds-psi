import { Link, Navigate } from 'react-router-dom'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

export function BackofficeDashboardPage() {
  const { user } = useAuth()

  if (user?.role === 'coordinator') {
    return <Navigate to="/backoffice/attendance" replace />
  }

  if (user?.role === 'admin') {
    return <Navigate to="/backoffice/admin/therapists" replace />
  }

  return (
    <BackofficeLayout>
      <h1 className={styles.pageTitle}>Olá, {user?.name}</h1>
      <div className={styles.cardGrid}>
        <Card as="article">
          <h2>Pacientes</h2>
          <p className={styles.muted}>Crie perfis e gere links de formulários PICCA.</p>
          <Button href="/backoffice/patients" style={{ marginTop: 'var(--space-md)' }}>
            Ver pacientes
          </Button>
        </Card>
        <Card as="article">
          <h2>Presenças</h2>
          <p className={styles.muted}>Calendário mensal de consultas — por pagar, pagas e faltas.</p>
          <Button href="/backoffice/attendance" style={{ marginTop: 'var(--space-md)' }}>
            Abrir calendário
          </Button>
        </Card>
        <Card as="article">
          <h2>Formulários PICCA</h2>
          <p className={styles.muted}>
            Admissão, consentimento informado e historial clínico disponíveis para atribuição.
          </p>
          <Link to="/formularios-picca" className={styles.muted}>
            Ver página pública →
          </Link>
        </Card>
      </div>
    </BackofficeLayout>
  )
}
