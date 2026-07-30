import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'
import type { AdminDashboard } from '../../lib/api'
import chartStyles from './DashboardCharts.module.css'
import styles from './AdminDashboardCharts.module.css'

type AdminDashboardChartsProps = {
  charts: AdminDashboard['charts']
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
  to?: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <Card as="section" className={chartStyles.chartPanel}>
      <div className={chartStyles.chartHeader}>
        <div>
          {to ? (
            <Link to={to} className={chartStyles.chartTitleLink}>
              {title}
            </Link>
          ) : (
            <h3 className={styles.panelTitle}>{title}</h3>
          )}
          {subtitle && <p className={chartStyles.chartSubtitle}>{subtitle}</p>}
        </div>
        {to && (
          <Link to={to} className={chartStyles.chartAction}>
            Ver detalhes →
          </Link>
        )}
      </div>
      {children}
    </Card>
  )
}

function HorizontalBarChart({
  items,
  valueKey,
  labelKey,
  maxItems = 8,
}: {
  items: Array<Record<string, string | number | boolean>>
  valueKey: string
  labelKey: string
  maxItems?: number
}) {
  const visible = items.slice(0, maxItems)
  const maxCount = Math.max(1, ...visible.map((item) => Number(item[valueKey]) || 0))

  if (visible.length === 0) {
    return <p className={chartStyles.chartEmpty}>Sem dados para este período.</p>
  }

  return (
    <ul className={styles.rankChart} aria-label="Gráfico de barras horizontais">
      {visible.map((item) => {
        const count = Number(item[valueKey]) || 0
        const label = String(item[labelKey])
        const key = String(item.therapistId ?? item.locationId ?? label)
        return (
          <li key={key} className={styles.rankRow}>
            <span className={styles.rankLabel}>{label}</span>
            <div className={styles.rankBarTrack} aria-hidden="true">
              <div
                className={styles.rankBarFill}
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
            <span className={styles.rankCount}>{count}</span>
          </li>
        )
      })}
    </ul>
  )
}

export function AdminDashboardCharts({ charts }: AdminDashboardChartsProps) {
  const maxWeekCount = Math.max(1, ...charts.weekAppointments.map((entry) => entry.count))
  const maxAttendanceCount = Math.max(1, ...charts.monthAttendance.map((entry) => entry.count))

  return (
    <div className={chartStyles.chartGrid}>
      <ChartPanel
        title="Consultas — próximos 7 dias"
        subtitle="Volume diário em toda a clínica"
      >
        <div
          className={chartStyles.barChart}
          role="img"
          aria-label="Gráfico de consultas nos próximos sete dias"
        >
          {charts.weekAppointments.map((entry) => (
            <div key={entry.date} className={chartStyles.barColumn}>
              <span className={chartStyles.barValue}>{entry.count}</span>
              <div className={chartStyles.barTrack} aria-hidden="true">
                <div
                  className={`${chartStyles.barFill} ${entry.isToday ? chartStyles.barFillToday : ''}`}
                  style={{ height: `${(entry.count / maxWeekCount) * 100}%` }}
                />
              </div>
              <span
                className={`${chartStyles.barLabel} ${entry.isToday ? chartStyles.barLabelToday : ''}`}
              >
                {entry.label}
              </span>
            </div>
          ))}
        </div>
      </ChartPanel>

      <ChartPanel
        title="Presenças — este mês"
        subtitle={
          charts.monthAttendanceTotal > 0
            ? `${charts.monthAttendanceTotal} registo${charts.monthAttendanceTotal === 1 ? '' : 's'} no total`
            : 'Ainda sem registos este mês'
        }
      >
        {charts.monthAttendanceTotal === 0 ? (
          <p className={chartStyles.chartEmpty}>Sem presenças registadas este mês.</p>
        ) : (
          <ul className={chartStyles.statusChart} aria-label="Distribuição de presenças do mês">
            {charts.monthAttendance.map((entry) => (
              <li key={entry.status} className={chartStyles.statusRow}>
                <span className={chartStyles.statusLabel}>{entry.label}</span>
                <div className={chartStyles.statusBarTrack} aria-hidden="true">
                  <div
                    className={chartStyles.statusBarFill}
                    style={{
                      width: `${(entry.count / maxAttendanceCount) * 100}%`,
                      background: ATTENDANCE_COLORS[entry.status] ?? 'var(--color-primary)',
                    }}
                  />
                </div>
                <span className={chartStyles.statusCount}>{entry.count}</span>
              </li>
            ))}
          </ul>
        )}
      </ChartPanel>

      <ChartPanel
        title="Consultas por local"
        to="/backoffice/admin/locations"
        subtitle="Distribuição do mês atual"
      >
        <HorizontalBarChart
          items={charts.monthByLocation}
          valueKey="count"
          labelKey="locationName"
        />
      </ChartPanel>

      <ChartPanel
        title="Consultas por terapeuta"
        to="/backoffice/admin/therapists"
        subtitle="Top terapeutas no mês atual"
      >
        <HorizontalBarChart
          items={charts.monthByTherapist.map((entry) => ({
            ...entry,
            therapistName: entry.active ? entry.therapistName : `${entry.therapistName} (inativo)`,
          }))}
          valueKey="count"
          labelKey="therapistName"
        />
      </ChartPanel>
    </div>
  )
}
