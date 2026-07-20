import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { DashboardCharts } from './DashboardCharts'
import { therapistApi, type TherapistDashboard } from '../../lib/api'
import { formatSessionStatus, sessionStatusBadgeVariant } from '../../lib/intakeStatus'
import { formatAppointmentDayLabel } from '../../lib/dashboard'
import styles from './TherapistDashboard.module.css'

type TherapistDashboardProps = {
  token: string
  therapistName: string
}

function StatCard({
  label,
  value,
  hint,
  accent,
  to,
}: {
  label: string
  value: number
  hint?: string
  accent?: 'brain' | 'accent' | 'warn'
  to?: string
}) {
  const accentClass = accent
    ? styles[`statCard${accent.charAt(0).toUpperCase()}${accent.slice(1)}` as keyof typeof styles]
    : undefined

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

export function TherapistDashboard({ token, therapistName }: TherapistDashboardProps) {
  const [dashboard, setDashboard] = useState<TherapistDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    therapistApi
      .getDashboard(token)
      .then(setDashboard)
      .catch(() => setError('Não foi possível carregar o dashboard.'))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return <p className={styles.loading}>A preparar o seu dia…</p>
  }

  if (error || !dashboard) {
    return <p className={styles.error}>{error || 'Dashboard indisponível.'}</p>
  }

  const nextAppointment = dashboard.todayAppointments.find((appointment) => !appointment.isPast)
  const hasAttention =
    dashboard.pendingForms.length > 0 ||
    dashboard.stats.unpaidThisMonth > 0 ||
    dashboard.stats.todayAppointments > 0

  return (
    <div className={styles.dashboard}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>{dashboard.todayLabel}</p>
          <h1 className={styles.heroTitle}>
            {dashboard.greeting}, {therapistName.split(' ')[0]}
          </h1>
          {nextAppointment ? (
            <p className={styles.heroSubtitle}>
              Próxima consulta às <strong>{nextAppointment.time}</strong> — {nextAppointment.patientName}
            </p>
          ) : dashboard.todayAppointments.length > 0 ? (
            <p className={styles.heroSubtitle}>As consultas de hoje já terminaram. Bom trabalho.</p>
          ) : (
            <p className={styles.heroSubtitle}>Sem consultas marcadas para hoje.</p>
          )}
        </div>
        <div className={styles.heroActions}>
          <Button href="/backoffice/appointments">Nova consulta</Button>
          <Button href="/backoffice/patients/new" variant="outline" className={styles.heroSecondaryButton}>
            Novo paciente
          </Button>
        </div>
      </header>

      <div className={styles.statGrid}>
        <StatCard
          label="Consultas hoje"
          value={dashboard.stats.todayAppointments}
          accent="brain"
          to="/backoffice/appointments"
        />
        <StatCard
          label="Próximos 7 dias"
          value={dashboard.stats.weekAppointments}
          hint="inclui hoje"
          to="/backoffice/appointments"
        />
        <StatCard
          label="Formulários em aberto"
          value={dashboard.stats.openFormSessions}
          accent={dashboard.stats.openFormSessions > 0 ? 'warn' : undefined}
          to="/backoffice/patients"
        />
        <StatCard
          label="Por pagar (mês)"
          value={dashboard.stats.unpaidThisMonth}
          accent={dashboard.stats.unpaidThisMonth > 0 ? 'warn' : undefined}
          to="/backoffice/attendance"
        />
        <StatCard
          label="Pacientes"
          value={dashboard.stats.patients}
          to="/backoffice/patients"
        />
      </div>

      <DashboardCharts charts={dashboard.charts} />

      <div className={styles.mainGrid}>
        <section className={styles.scheduleSection}>
          <div className={styles.sectionHeader}>
            <h2>
              <Link to="/backoffice/appointments" className={styles.sectionTitleLink}>
                Agenda de hoje
              </Link>
            </h2>
            <Link to="/backoffice/appointments" className={styles.sectionLink}>
              Ver calendário →
            </Link>
          </div>

          {dashboard.todayAppointments.length === 0 ? (
            <Card className={styles.emptyCard}>
              <p className={styles.emptyTitle}>Dia livre na agenda</p>
              <p className={styles.emptyText}>
                Aproveite para atualizar presenças ou gerar links de formulários.
              </p>
            </Card>
          ) : (
            <ol className={styles.timeline}>
              {dashboard.todayAppointments.map((appointment) => (
                <li
                  key={appointment.id}
                  className={`${styles.timelineItem} ${appointment.isPast ? styles.timelineItemPast : ''} ${nextAppointment?.id === appointment.id ? styles.timelineItemNext : ''}`}
                >
                  <div className={styles.timelineTime}>
                    <span>{appointment.time}</span>
                    <span className={styles.timelineDuration}>{appointment.durationMinutes} min</span>
                  </div>
                  <Card className={styles.timelineCard}>
                    <div className={styles.timelineCardTop}>
                      <div>
                        <Link
                          to={`/backoffice/patients/${appointment.patientId}`}
                          className={styles.patientLink}
                        >
                          {appointment.patientName}
                        </Link>
                        <p className={styles.timelineMeta}>{appointment.locationName}</p>
                      </div>
                      {nextAppointment?.id === appointment.id && (
                        <Badge variant="accent">A seguir</Badge>
                      )}
                      {appointment.isPast && <Badge variant="muted">Concluída</Badge>}
                    </div>
                    {appointment.notes && <p className={styles.timelineNotes}>{appointment.notes}</p>}
                  </Card>
                </li>
              ))}
            </ol>
          )}

          {dashboard.upcomingAppointments.length > 0 && (
            <div className={styles.upcomingBlock}>
              <h3 className={styles.upcomingTitle}>
                <Link to="/backoffice/appointments" className={styles.sectionTitleLink}>
                  Próximos dias
                </Link>
              </h3>
              <ul className={styles.upcomingList}>
                {dashboard.upcomingAppointments.map((appointment) => (
                  <li key={appointment.id} className={styles.upcomingItem}>
                    <span className={styles.upcomingWhen}>
                      {formatAppointmentDayLabel(appointment.date)} · {appointment.time}
                    </span>
                    <Link
                      to={`/backoffice/patients/${appointment.patientId}`}
                      className={styles.patientLink}
                    >
                      {appointment.patientName}
                    </Link>
                    <span className={styles.upcomingLocation}>{appointment.locationName}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <aside className={styles.aside}>
          {hasAttention && (
            <Card as="section" className={styles.asideCard}>
              <h2>
                <Link to="/backoffice/patients" className={styles.sectionTitleLink}>
                  Precisa de atenção
                </Link>
              </h2>
              <ul className={styles.attentionList}>
                {dashboard.stats.unpaidThisMonth > 0 && (
                  <li>
                    <Link to="/backoffice/attendance" className={styles.attentionLink}>
                      <strong>{dashboard.stats.unpaidThisMonth}</strong> presença
                      {dashboard.stats.unpaidThisMonth === 1 ? '' : 's'} por pagar este mês
                    </Link>
                  </li>
                )}
                {dashboard.pendingForms.map((form) => (
                  <li key={form.sessionId}>
                    <Link to={`/backoffice/patients/${form.patientId}`} className={styles.attentionLink}>
                      {form.patientName}
                      <Badge variant={sessionStatusBadgeVariant(form.status)}>
                        {formatSessionStatus(form.status)}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card as="section" className={styles.asideCard}>
            <h2>Atalhos</h2>
            <nav className={styles.shortcuts}>
              <Link to="/backoffice/patients">Pacientes ({dashboard.stats.patients})</Link>
              <Link to="/backoffice/appointments">Consultas</Link>
              <Link to="/backoffice/attendance">Presenças</Link>
              <Link to="/backoffice/workshops">Workshops</Link>
              <Link to="/backoffice/profile">O meu perfil</Link>
            </nav>
          </Card>
        </aside>
      </div>
    </div>
  )
}
