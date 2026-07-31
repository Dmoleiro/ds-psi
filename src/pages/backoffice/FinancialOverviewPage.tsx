import { Link, Navigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import {
  therapistApi,
  type FinancialOverview,
  type FinancialRow,
  type FinancialSettings,
  type FinancialSummary,
  type FinancialYearCharts,
} from '../../lib/api'
import { MONTH_LABELS, shiftMonth } from '../../lib/appointments'
import {
  formatFinancialPeriodRange,
  financialPeriodModeLabel,
  readFinancialPeriodMode,
  storeFinancialPeriodMode,
  type FinancialPeriodMode,
} from '../../lib/financialPeriod'
import {
  exportFinancialOverviewCsv,
  exportFinancialOverviewPdf,
} from '../../lib/exportFinancialOverview'
import { useAuth } from '../../hooks/useAuth'
import layout from '../../components/backoffice/BackofficeLayout.module.css'
import styles from './FinancialOverviewPage.module.css'

function formatEuro(value: number) {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value)
}

function formatPercent(value: number) {
  return `${Math.round(value * 1000) / 10}%`
}

function buildAppointmentFixLink(row: FinancialRow): { href: string; label: string } | null {
  if (row.missingAppointment) {
    const params = new URLSearchParams({
      date: row.date,
      patientId: row.patientId,
    })
    if (row.locationId) {
      params.set('locationId', row.locationId)
    }
    return {
      href: `/backoffice/appointments?${params.toString()}`,
      label: 'Sem consulta — criar',
    }
  }

  if (row.kind === 'forecast' && row.appointmentId) {
    return {
      href: `/backoffice/appointments?appointmentId=${encodeURIComponent(row.appointmentId)}`,
      label: 'Editar consulta',
    }
  }

  return null
}

function SummaryCard({
  label,
  value,
  to,
  hash,
  accent,
}: {
  label: string
  value: string
  to?: string
  hash?: string
  accent?: 'primary' | 'warn'
}) {
  const content = (
    <>
      <span className={styles.summaryLabel}>{label}</span>
      <span className={styles.summaryValue}>{value}</span>
    </>
  )

  const accentClass = accent
    ? styles[`summaryCard${accent.charAt(0).toUpperCase()}${accent.slice(1)}`]
    : undefined

  if (hash) {
    return (
      <a
        href={hash}
        className={`${styles.summaryCard} ${styles.summaryCardLink} ${accentClass ?? ''}`.trim()}
        onClick={(event) => {
          event.preventDefault()
          document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      >
        {content}
      </a>
    )
  }

  if (to) {
    return (
      <Link
        to={to}
        className={`${styles.summaryCard} ${styles.summaryCardLink} ${accentClass ?? ''}`.trim()}
      >
        {content}
      </Link>
    )
  }

  return (
    <div className={`${styles.summaryCard} ${accentClass ?? ''}`.trim()}>
      {content}
    </div>
  )
}

function FinancialTable({
  sectionId,
  title,
  rows,
  totals,
  emptyMessage,
}: {
  sectionId: string
  title: string
  rows: FinancialOverview['realizedRows']
  totals: FinancialSummary
  emptyMessage: string
}) {
  return (
    <Card as="section" id={sectionId} className={styles.tableCard}>
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
              {rows.map((row) => {
                const appointmentFix = buildAppointmentFixLink(row)
                return (
                  <tr key={`${row.kind}-${row.id}`}>
                    <td>{new Date(`${row.date}T12:00:00`).toLocaleDateString('pt-PT')}</td>
                    <td>
                      <Link to={`/backoffice/patients/${row.patientId}`} className={styles.patientLink}>
                        {row.patientName}
                      </Link>
                      {appointmentFix && (
                        <Link to={appointmentFix.href} className={styles.warningBadge}>
                          {appointmentFix.label}
                        </Link>
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
                )
              })}
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
  const [periodMode, setPeriodMode] = useState<FinancialPeriodMode>(() => readFinancialPeriodMode())
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
      therapistApi.getFinancialOverview(token, viewYear, viewMonth, periodMode),
      therapistApi.getFinancialCharts(token, viewYear, periodMode),
      therapistApi.getFinancialSettings(token),
    ])
      .then(([overviewData, chartsData, settingsData]) => {
        setOverview(overviewData)
        setCharts(chartsData)
        setSettingsDraft(settingsData.settings)
      })
      .catch(() => setError('Não foi possível carregar as finanças.'))
      .finally(() => setLoading(false))
  }, [token, user?.financialOverviewEnabled, viewYear, viewMonth, periodMode])

  function handlePeriodChange(mode: FinancialPeriodMode) {
    setPeriodMode(mode)
    storeFinancialPeriodMode(mode)
  }

  const maxChartGross = useMemo(() => {
    if (!charts) return 1
    return Math.max(
      1,
      ...charts.months.flatMap((month) => [month.realizedGross, month.forecastGross]),
    )
  }, [charts])

  if (!user) return null

  const therapistName = user.name

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
      const overviewData = await therapistApi.getFinancialOverview(token, viewYear, viewMonth, periodMode)
      const chartsData = await therapistApi.getFinancialCharts(token, viewYear, periodMode)
      setOverview(overviewData)
      setCharts(chartsData)
    } catch {
      setSettingsMessage('Não foi possível guardar os parâmetros.')
    } finally {
      setSavingSettings(false)
    }
  }

  function handleExportPdf() {
    if (!overview) return
    try {
      exportFinancialOverviewPdf(overview, therapistName)
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Não foi possível exportar o PDF')
    }
  }

  function handleExportCsv() {
    if (!overview) return
    try {
      exportFinancialOverviewCsv(overview)
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Não foi possível exportar o CSV')
    }
  }

  const hasExportableRows =
    overview &&
    (overview.realizedRows.length > 0 ||
      overview.unpaidRows.length > 0 ||
      overview.forecastRows.length > 0)

  return (
    <BackofficeLayout>
      <div className={styles.periodToggle} role="group" aria-label="Tipo de mês">
        <button
          type="button"
          className={`${styles.periodOption} ${periodMode === 'calendar' ? styles.periodOptionActive : ''}`}
          onClick={() => handlePeriodChange('calendar')}
          aria-pressed={periodMode === 'calendar'}
        >
          Mês civil
          <span className={styles.periodHint}>1.º – último dia do mês</span>
        </button>
        <button
          type="button"
          className={`${styles.periodOption} ${periodMode === 'fiscal' ? styles.periodOptionActive : ''}`}
          onClick={() => handlePeriodChange('fiscal')}
          aria-pressed={periodMode === 'fiscal'}
        >
          Mês financeiro
          <span className={styles.periodHint}>21 do mês anterior – 20</span>
        </button>
      </div>

      <div className={styles.header}>
        <div>
          <h1 className={layout.pageTitle}>Finanças</h1>
          <p className={layout.muted}>
            Planeamento de IRS, Segurança Social e poupança com base nas presenças pagas, por pagar e
            consultas futuras.
          </p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.monthNav}>
            <button type="button" className={styles.navButton} onClick={() => changeMonth(-1)} aria-label="Mês anterior">
              ←
            </button>
            <div className={styles.monthTitleBlock}>
              <strong>
                {MONTH_LABELS[viewMonth - 1]} {viewYear}
              </strong>
              <span className={styles.monthRange}>
                {formatFinancialPeriodRange(viewYear, viewMonth, periodMode)}
              </span>
            </div>
            <button type="button" className={styles.navButton} onClick={() => changeMonth(1)} aria-label="Mês seguinte">
              →
            </button>
          </div>
          {!loading && overview && (
            <div className={styles.exportActions}>
              <Button type="button" variant="outline" onClick={handleExportPdf} disabled={!hasExportableRows}>
                Imprimir / PDF
              </Button>
              <Button type="button" variant="outline" onClick={handleExportCsv} disabled={!hasExportableRows}>
                Exportar CSV
              </Button>
            </div>
          )}
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
              hash="#financas-realizado"
            />
            <SummaryCard
              label="Por receber"
              value={formatEuro(overview.summary.unpaid.gross)}
              hash="#financas-por-receber"
              accent="warn"
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
              hash="#financas-previsto"
            />
          </div>

          <Card as="section" className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h2>
                Realizado vs previsto — {viewYear}
                <span className={styles.chartPeriodHint}> ({financialPeriodModeLabel(periodMode).toLowerCase()})</span>
              </h2>
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
            sectionId="financas-realizado"
            title="Realizado — presenças pagas"
            rows={overview.realizedRows}
            totals={overview.summary.realized}
            emptyMessage="Ainda não existem presenças pagas neste mês."
          />

          <FinancialTable
            sectionId="financas-por-receber"
            title="Por receber — presenças por pagar"
            rows={overview.unpaidRows}
            totals={overview.summary.unpaid}
            emptyMessage="Ainda não existem presenças por pagar neste mês."
          />

          <FinancialTable
            sectionId="financas-previsto"
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
