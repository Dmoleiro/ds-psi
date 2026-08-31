import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Card } from '../ui/Card'
import { AdminDashboardCharts } from './AdminDashboardCharts'
import { adminApi, type AdminDashboard } from '../../lib/api'
import styles from './AdminDashboard.module.css'

type AdminDashboardProps = {
  token: string
  adminName: string
}

function StatCard({
  label,
  value,
  hint,
  accent,
  to,
}: {
  label: string
  value: number | string
  hint?: string
  accent?: 'accent' | 'warn'
  to?: string
}) {
  const accentClass = accent ? styles[`statCard${accent.charAt(0).toUpperCase()}${accent.slice(1)}` as keyof typeof styles] : undefined

  const content = (
    <>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
      {hint && <span className={styles.statHint}>{hint}</span>}
    </>
  )

  if (to) {
    return (
      <Link
        to={to}
        className={`${styles.statCard} ${styles.statCardClickable} ${accentClass ?? ''}`.trim()}
      >
        {content}
      </Link>
    )
  }

  return <div className={`${styles.statCard} ${accentClass ?? ''}`.trim()}>{content}</div>
}

export function AdminDashboard({ token, adminName }: AdminDashboardProps) {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adminApi
      .getDashboard(token)
      .then(setDashboard)
      .catch(() => setError('Não foi possível carregar o dashboard.'))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return <p className={styles.loading}>A carregar indicadores…</p>
  }

  if (error || !dashboard) {
    return <p className={styles.error}>{error || 'Dashboard indisponível.'}</p>
  }

  const { stats, monitoring } = dashboard

  return (
    <div className={styles.dashboard}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>{dashboard.todayLabel}</p>
          <h1 className={styles.heroTitle}>
            {dashboard.greeting}, {adminName.split(' ')[0]}
          </h1>
          <p className={styles.heroSubtitle}>
            Visão geral da clínica — {stats.appointmentsToday} consulta
            {stats.appointmentsToday === 1 ? '' : 's'} hoje, {stats.activeTherapists} terapeuta
            {stats.activeTherapists === 1 ? '' : 's'} ativo
            {stats.activeTherapists === 1 ? '' : 's'}, {stats.totalPatients} pacientes no total.
          </p>
        </div>
      </header>

      <div className={styles.statGrid}>
        <StatCard
          label="Consultas hoje"
          value={stats.appointmentsToday}
          accent="accent"
          hint={`${stats.appointmentsThisWeek} esta semana`}
        />
        <StatCard
          label="Consultas (mês)"
          value={stats.appointmentsThisMonth}
          accent="accent"
        />
        <StatCard
          label="Terapeutas ativos"
          value={stats.activeTherapists}
          hint={`${stats.totalTherapists} no total`}
          to="/backoffice/admin/therapists"
        />
        <StatCard
          label="Pacientes"
          value={stats.totalPatients}
          hint={
            stats.newPatientsThisMonth > 0
              ? `+${stats.newPatientsThisMonth} este mês`
              : 'sem novos este mês'
          }
        />
        <StatCard
          label="Locais ativos"
          value={stats.activeLocations}
          hint={`${stats.totalLocations} no total`}
          to="/backoffice/admin/locations"
        />
        <StatCard
          label="Gabinetes ativos"
          value={stats.activeGabinetes}
          hint={`${stats.totalGabinetes} no total`}
          to="/backoffice/admin/gabinetes"
        />
        <StatCard
          label="Presenças (mês)"
          value={stats.attendanceThisMonth}
        />
        <StatCard
          label="Intake em aberto"
          value={stats.openIntakeSessions}
          accent={stats.openIntakeSessions > 0 ? 'warn' : undefined}
        />
        <StatCard
          label="Administrativos"
          value={stats.activeCoordinators}
          hint={`${stats.totalCoordinators} no total`}
          to="/backoffice/admin/coordinators"
        />
        <StatCard
          label="Workshops futuros"
          value={stats.upcomingWorkshops}
          to="/backoffice/workshops"
        />
        <StatCard
          label="PICCA ativo"
          value={stats.piccaEnabledTherapists}
          hint="terapeutas com acesso"
          to="/backoffice/admin/therapists"
        />
      </div>

      <AdminDashboardCharts charts={dashboard.charts} />

      <div className={styles.mainGrid}>
        <Card as="section" className={styles.monitoringCard}>
          <h2>Monitorização</h2>
          <div className={styles.monitoringSections}>
            <div className={styles.monitoringSection}>
              <h3>Consultas hoje por local</h3>
              {monitoring.todayByLocation.length === 0 ? (
                <p className={styles.monitoringEmpty}>Sem consultas marcadas para hoje.</p>
              ) : (
                <ul className={styles.monitoringList}>
                  {monitoring.todayByLocation.map((entry) => (
                    <li key={entry.locationId} className={styles.monitoringItem}>
                      <span>{entry.locationName}</span>
                      <span className={styles.monitoringCount}>{entry.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.monitoringSection}>
              <h3>Terapeutas sem consultas (7 dias)</h3>
              {monitoring.therapistsWithoutWeekAppointments.length === 0 ? (
                <p className={styles.monitoringEmpty}>
                  Todos os terapeutas ativos têm consultas agendadas.
                </p>
              ) : (
                <ul className={styles.monitoringList}>
                  {monitoring.therapistsWithoutWeekAppointments.map((therapist) => (
                    <li key={therapist.id} className={styles.monitoringItem}>
                      <span>{therapist.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>

        <Card as="section" className={styles.monitoringCard}>
          <h2>Gestão</h2>
          <nav className={styles.shortcuts}>
            <Link to="/backoffice/admin/therapists">Terapeutas</Link>
            <Link to="/backoffice/admin/coordinators">Administrativos</Link>
            <Link to="/backoffice/admin/locations">Locais</Link>
            <Link to="/backoffice/admin/gabinetes">Gabinetes</Link>
            <Link to="/backoffice/admin/announcements">Anúncios</Link>
            <Link to="/backoffice/workshops">Workshops</Link>
          </nav>
        </Card>
      </div>
    </div>
  )
}
