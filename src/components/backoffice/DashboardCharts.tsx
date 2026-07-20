import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'
import type { TherapistDashboard } from '../../lib/api'
import styles from './DashboardCharts.module.css'

type DashboardChartsProps = {
  charts: TherapistDashboard['charts']
}

const ATTENDANCE_COLORS: Record<string, string> = {
  present_unpaid: 'var(--color-accent)',
  present_paid: 'var(--color-brain)',
  receipt_issued: 'var(--color-primary)',
  absent: '#b8aea4',
}

function ChartPanel({
  title,
  to,
  subtitle,
  children,
}: {
  title: string
  to: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <Card as="section" className={styles.chartPanel}>
      <div className={styles.chartHeader}>
        <div>
          <Link to={to} className={styles.chartTitleLink}>
            {title}
          </Link>
          {subtitle && <p className={styles.chartSubtitle}>{subtitle}</p>}
        </div>
        <Link to={to} className={styles.chartAction}>
          Ver detalhes →
        </Link>
      </div>
      {children}
    </Card>
  )
}

export function DashboardCharts({ charts }: DashboardChartsProps) {
  const maxWeekCount = Math.max(1, ...charts.weekAppointments.map((entry) => entry.count))
  const maxAttendanceCount = Math.max(1, ...charts.monthAttendance.map((entry) => entry.count))

  return (
    <div className={styles.chartGrid}>
      <ChartPanel
        title="Consultas — próximos 7 dias"
        to="/backoffice/appointments"
        subtitle="Volume diário de marcações"
      >
        <div
          className={styles.barChart}
          role="img"
          aria-label="Gráfico de consultas nos próximos sete dias"
        >
          {charts.weekAppointments.map((entry) => (
            <div key={entry.date} className={styles.barColumn}>
              <span className={styles.barValue}>{entry.count}</span>
              <div className={styles.barTrack} aria-hidden="true">
                <div
                  className={`${styles.barFill} ${entry.isToday ? styles.barFillToday : ''}`}
                  style={{ height: `${(entry.count / maxWeekCount) * 100}%` }}
                />
              </div>
              <span className={`${styles.barLabel} ${entry.isToday ? styles.barLabelToday : ''}`}>
                {entry.label}
              </span>
            </div>
          ))}
        </div>
      </ChartPanel>

      <ChartPanel
        title="Presenças — este mês"
        to="/backoffice/attendance"
        subtitle={
          charts.monthAttendanceTotal > 0
            ? `${charts.monthAttendanceTotal} registo${charts.monthAttendanceTotal === 1 ? '' : 's'} no total`
            : 'Ainda sem registos este mês'
        }
      >
        {charts.monthAttendanceTotal === 0 ? (
          <p className={styles.chartEmpty}>Comece a marcar presenças no calendário mensal.</p>
        ) : (
          <ul className={styles.statusChart} aria-label="Distribuição de presenças do mês">
            {charts.monthAttendance.map((entry) => (
              <li key={entry.status} className={styles.statusRow}>
                <span className={styles.statusLabel}>{entry.label}</span>
                <div className={styles.statusBarTrack} aria-hidden="true">
                  <div
                    className={styles.statusBarFill}
                    style={{
                      width: `${(entry.count / maxAttendanceCount) * 100}%`,
                      background: ATTENDANCE_COLORS[entry.status] ?? 'var(--color-primary)',
                    }}
                  />
                </div>
                <span className={styles.statusCount}>{entry.count}</span>
              </li>
            ))}
          </ul>
        )}
      </ChartPanel>
    </div>
  )
}
