import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { AppointmentsCalendar } from '../../components/backoffice/AppointmentsCalendar'
import { useAuth } from '../../hooks/useAuth'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

export function AppointmentsPage() {
  const { token, user } = useAuth()

  if (!token || !user) return null

  return (
    <BackofficeLayout>
      <h1 className={styles.pageTitle}>Consultas</h1>
      <p className={styles.muted}>
        Agende consultas no calendário mensal. Clique num dia para adicionar ou gerir marcações.
      </p>
      <AppointmentsCalendar token={token} therapistName={user.name} />
    </BackofficeLayout>
  )
}
