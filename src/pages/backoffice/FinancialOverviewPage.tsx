import { Link, Navigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { therapistApi, type FinancialOverview, type FinancialSettings, type FinancialSummary, type FinancialYearCharts } from '../../lib/api'
import { MONTH_LABELS, shiftMonth } from '../../lib/appointments'
import { useAuth } from '../../hooks/useAuth'
import layout from '../../components/backoffice/BackofficeLayout.module.css'
import styles from './FinancialOverviewPage.module.css'

function formatEuro(value: number) {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value)
}

function formatPercent(value: number) {
  return `${Math.round(value * 1000) / 10}%`
}

function SummaryCard({
  label,
  value,
  to,
  accent,
}: {
  label: string
  value: string
  to?: string
  accent?: 'primary' | 'warn'
}) {
  const content = (
    <>
      <span className={styles.summaryLabel}>{label}</span>
      <span className={styles.summaryValue}>{value}</span>
    </>
  )

  if (to) {
    return (
      <Link
        to={to}
        className={`${styles.summaryCard} ${styles.summaryCardLink} ${accent ? styles[`summaryCard${accent.charAt(0).toUpperCase()}${accent.slice(1)}`] : ''}`}
      >
        {content}
      </Link>
    )
  }

  return (
    <div className={`${styles.summaryCard} ${accent ? styles[`summaryCard${accent.charAt(0).toUpperCase()}${accent.slice(1)}`] : ''}`}>
      {content}
    </div>
  )
}

function FinancialTable({
  title,
  rows,
  totals,
  emptyMessage,
}: {
  title: string
  rows: FinancialOverview['realizedRows']
  totals: FinancialSummary
  emptyMessage: string
}) {
  return (
    <Card as="section" className={styles.tableCard}>
      <h2 className={styles.tableTitle}>{title}</h2>
      {rows.length === 0 ? (
        <p className={layout.muted}>{emptyMessage}</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={layout.table}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Paciente</th>
                <th>Local</th>
                <th>Bruto</th>
                <th>SS</th>
                <th>IRS</th>
                <th>Poupança</th>
                <th>Reservas</th>
                <th>Disponível</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.kind}-${row.id}`}>
                  <td>{new Date(`${row.date}T12:00:00`).toLocaleDateString('pt-PT')}</td>
                  <td>
                    <Link to={`/backoffice/patients/${row.patientId}`} className={styles.patientLink}>
                      {row.patientName}
                    </Link>
                    {row.missingAppointment && (
                      <span className={styles.warningBadge}>Sem consulta</span>
                    )}
                  </td>
                  <td>{row.locationName}</td>
                  <td>{formatEuro(row.gross)}</td>
                  <td>{formatEuro(row.socialSecurity)}</td>
                  <td>{formatEuro(row.irs)}</td>
                  <td>{formatEuro(row.savings)}</td>
                  <td>{formatEuro(row.totalReserves)}</td>
                  <td>{formatEuro(row.available)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={styles.totalsRow}>
                <td colSpan={3}>Total</td>
                <td>{formatEuro(totals.gross)}</td>
                <td>{formatEuro(totals.socialSecurity)}</td>
                <td>{formatEuro(totals.irs)}</td>
                <td>{formatEuro(totals.savings)}</td>
                <td>{formatEuro(totals.totalReserves)}</td>
                <td>{formatEuro(totals.available)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </Card>
  )
}

export function FinancialOverviewPage() {
  const { token, user } = useAuth()
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1)
  const [overview, setOverview] = useState<FinancialOverview | null>(null)
  const [charts, setCharts] = useState<FinancialYearCharts | null>(null)
  const [settingsDraft, setSettingsDraft] = useState<FinancialSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingSettings, setSavingSettings] = useState(false)
  const [error, setError] = useState('')
  const [settingsMessage, setSettingsMessage] = useState('')

  useEffect(() => {
    if (!token || !user?.financialOverviewEnabled) return

    setLoading(true)
    setError('')
    Promise.all([
      therapistApi.getFinancialOverview(token, viewYear, viewMonth),
      therapistApi.getFinancialCharts(token, viewYear),
      therapistApi.getFinancialSettings(token),
    ])
      .then(([overviewData, chartsData, settingsData]) => {
        setOverview(overviewData)
        setCharts(chartsData)
        setSettingsDraft(settingsData.settings)
      })
      .catch(() => setError('Não foi possível carregar as finanças.'))
      .finally(() => setLoading(false))
  }, [token, user?.financialOverviewEnabled, viewYear, viewMonth])

  const maxChartGross = useMemo(() => {
    if (!charts) return 1
    return Math.max(
      1,
      ...charts.months.flatMap((month) => [month.realizedGross, month.forecastGross]),
    )
  }, [charts])

  if (!user) return null

  if (!user.financialOverviewEnabled) {
    return <Navigate to="/backoffice" replace />
  }

  function changeMonth(delta: number) {
    const next = shiftMonth(viewYear, viewMonth, delta)
    setViewYear(next.year)
    setViewMonth(next.month)
  }

  async function handleSaveSettings(event: React.FormEvent) {
    event.preventDefault()
    if (!token || !settingsDraft) return
    setSavingSettings(true)
    setSettingsMessage('')
    try {
      const result = await therapistApi.updateFinancialSettings(token, settingsDraft)
      setSettingsDraft(result.settings)
      setSettingsMessage('Parâmetros guardados.')
      const overviewData = await therapistApi.getFinancialOverview(token, viewYear, viewMonth)
      const chartsData = await therapistApi.getFinancialCharts(token, viewYear)
      setOverview(overviewData)
      setCharts(chartsData)
    } catch {
      setSettingsMessage('Não foi possível guardar os parâmetros.')
    } finally {
      setSavingSettings(false)
    }
  }

  return (
    <BackofficeLayout>
      <div className={styles.header}>
        <div>
          <h1 className={layout.pageTitle}>Finanças</h1>
          <p className={layout.muted}>
            Planeamento de IRS, Segurança Social e poupança com base nas presenças pagas e consultas
            futuras.
          </p>
        </div>
        <div className={styles.monthNav}>
          <button type="button" className={styles.navButton} onClick={() => changeMonth(-1)} aria-label="Mês anterior">
            ←
          </button>
          <strong>
            {MONTH_LABELS[viewMonth - 1]} {viewYear}
          </strong>
          <button type="button" className={styles.navButton} onClick={() => changeMonth(1)} aria-label="Mês seguinte">
            →
          </button>
        </div>
      </div>

      {loading ? (
        <p className={layout.muted}>A carregar…</p>
      ) : error ? (
        <p className={layout.error}>{error}</p>
      ) : overview && charts && settingsDraft ? (
        <>
          <div className={styles.summaryGrid}>
            <SummaryCard
              label="Realizado bruto"
              value={formatEuro(overview.summary.realized.gross)}
              to="/backoffice/attendance"
            />
            <SummaryCard
              label="Total reservas"
              value={formatEuro(overview.summary.realized.totalReserves)}
            />
            <SummaryCard
              label="Disponível real"
              value={formatEuro(overview.summary.realized.available)}
              accent="primary"
            />
            <SummaryCard
              label="Previsto (mês)"
              value={formatEuro(overview.summary.forecast.gross)}
              to="/backoffice/appointments"
              accent="warn"
            />
          </div>

          <Card as="section" className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h2>Realizado vs previsto — {viewYear}</h2>
              <Link to="/backoffice/appointments" className={styles.sectionLink}>
                Ver consultas →
              </Link>
            </div>
            <div className={styles.yearChart} role="img" aria-label="Gráfico anual de rendimento">
              {charts.months.map((month) => (
                <div key={month.month} className={styles.yearColumn}>
                  <div className={styles.yearBars}>
                    <div
                      className={styles.yearBarRealized}
                      style={{ height: `${(month.realizedGross / maxChartGross) * 100}%` }}
                      title={`Realizado: ${formatEuro(month.realizedGross)}`}
                    />
                    <div
                      className={styles.yearBarForecast}
                      style={{ height: `${(month.forecastGross / maxChartGross) * 100}%` }}
                      title={`Previsto: ${formatEuro(month.forecastGross)}`}
                    />
                  </div>
                  <span className={styles.yearLabel}>{MONTH_LABELS[month.month - 1].slice(0, 3)}</span>
                </div>
              ))}
            </div>
            <div className={styles.legend}>
              <span>
                <i className={styles.legendRealized} /> Realizado
              </span>
              <span>
                <i className={styles.legendForecast} /> Previsto
              </span>
            </div>
          </Card>

          <Card as="section" className={styles.settingsCard}>
            <h2>Parâmetros</h2>
            <form className={`${layout.form} ${styles.settingsForm}`} onSubmit={handleSaveSettings}>
              <div className={styles.settingsGrid}>
                <div className={`${layout.field} ${styles.settingsField}`}>
                  <label htmlFor="socialSecurityRate">Reserva Segurança Social</label>
                  <input
                    id="socialSecurityRate"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settingsDraft.socialSecurityRate}
                    onChange={(event) =>
                      setSettingsDraft((current) =>
                        current
                          ? { ...current, socialSecurityRate: Number(event.target.value) }
                          : current,
                      )
                    }
                  />
                  <span className={styles.settingsHint}>{formatPercent(settingsDraft.socialSecurityRate)}</span>
                </div>
                <div className={`${layout.field} ${styles.settingsField}`}>
                  <label htmlFor="irsRate">Reserva IRS</label>
                  <input
                    id="irsRate"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settingsDraft.irsRate}
                    onChange={(event) =>
                      setSettingsDraft((current) =>
                        current ? { ...current, irsRate: Number(event.target.value) } : current,
                      )
                    }
                  />
                  <span className={styles.settingsHint}>{formatPercent(settingsDraft.irsRate)}</span>
                </div>
                <div className={`${layout.field} ${styles.settingsField}`}>
                  <label htmlFor="savingsRate">Objetivo de poupança</label>
                  <input
                    id="savingsRate"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settingsDraft.savingsRate}
                    onChange={(event) =>
                      setSettingsDraft((current) =>
                        current ? { ...current, savingsRate: Number(event.target.value) } : current,
                      )
                    }
                  />
                  <span className={styles.settingsHint}>{formatPercent(settingsDraft.savingsRate)}</span>
                </div>
                <div className={`${layout.field} ${styles.settingsField}`}>
                  <label htmlFor="defaultSessionFee">Valor predefinido da consulta (€)</label>
                  <input
                    id="defaultSessionFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={settingsDraft.defaultSessionFee}
                    onChange={(event) =>
                      setSettingsDraft((current) =>
                        current
                          ? { ...current, defaultSessionFee: Number(event.target.value) }
                          : current,
                      )
                    }
                  />
                  <span className={styles.settingsHint} aria-hidden="true" />
                </div>
              </div>
              {settingsMessage && <p className={layout.muted}>{settingsMessage}</p>}
              <Button type="submit" disabled={savingSettings}>
                {savingSettings ? 'A guardar…' : 'Guardar parâmetros'}
              </Button>
            </form>
            <p className={styles.disclaimer}>
              Ferramenta de planeamento; não substitui aconselhamento fiscal ou contabilístico.
            </p>
          </Card>

          <FinancialTable
            title="Realizado — presenças pagas"
            rows={overview.realizedRows}
            totals={overview.summary.realized}
            emptyMessage="Ainda não existem presenças pagas neste mês."
          />

          <FinancialTable
            title="Previsto — consultas futuras"
            rows={overview.forecastRows}
            totals={overview.summary.forecast}
            emptyMessage="Não existem consultas futuras neste mês."
          />
        </>
      ) : null}
    </BackofficeLayout>
  )
}
