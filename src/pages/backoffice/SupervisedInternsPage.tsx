import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'
import { ApiError, therapistApi } from '../../lib/api'
import { formatMonthTitle, shiftMonth } from '../../lib/appointments'
import layout from '../../components/backoffice/BackofficeLayout.module.css'
import styles from './InternWorkHoursPage.module.css'

function formatHours(value: number) {
  return new Intl.NumberFormat('pt-PT', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export function SupervisedInternsPage() {
  const { token, user, loading: authLoading } = useAuth()
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1)
  const [selectedInternId, setSelectedInternId] = useState('')
  const [summary, setSummary] = useState<Awaited<
    ReturnType<typeof therapistApi.getSupervisedInternHoursSummary>
  > | null>(null)
  const [detail, setDetail] = useState<Awaited<
    ReturnType<typeof therapistApi.getSupervisedInternWorkLogs>
  > | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadSummary = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const data = await therapistApi.getSupervisedInternHoursSummary(token, viewYear, viewMonth)
      setSummary(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os estagiários')
    } finally {
      setLoading(false)
    }
  }, [token, viewYear, viewMonth])

  useEffect(() => {
    if (!summary) return
    if (
      !selectedInternId ||
      !summary.interns.some((entry) => entry.intern.id === selectedInternId)
    ) {
      setSelectedInternId(summary.interns[0]?.intern.id ?? '')
    }
  }, [summary, selectedInternId])

  const loadDetail = useCallback(async () => {
    if (!token || !selectedInternId) {
      setDetail(null)
      return
    }
    try {
      const data = await therapistApi.getSupervisedInternWorkLogs(
        token,
        selectedInternId,
        viewYear,
        viewMonth,
      )
      setDetail(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar o detalhe')
    }
  }, [token, selectedInternId, viewYear, viewMonth])

  useEffect(() => {
    void loadSummary()
  }, [loadSummary])

  useEffect(() => {
    void loadDetail()
  }, [loadDetail])

  if (authLoading) return null

  if (!user?.hasSupervisedInterns) {
    return <Navigate to="/backoffice" replace />
  }

  function changeMonth(delta: number) {
    const next = shiftMonth(viewYear, viewMonth, delta)
    setViewYear(next.year)
    setViewMonth(next.month)
  }

  return (
    <BackofficeLayout>
      <div className={styles.pageHeader}>
        <h1 className={layout.pageTitle}>Estagiários</h1>
        <div className={styles.monthNav}>
          <button type="button" className={styles.navButton} onClick={() => changeMonth(-1)} aria-label="Mês anterior">
            ←
          </button>
          <h2 className={styles.monthTitle}>{formatMonthTitle(viewYear, viewMonth)}</h2>
          <button type="button" className={styles.navButton} onClick={() => changeMonth(1)} aria-label="Mês seguinte">
            →
          </button>
        </div>
      </div>

      {error && <p className={layout.error}>{error}</p>}

      <div className={styles.summaryCard}>
        <span className={styles.summaryLabel}>Total de todos os estagiários</span>
        <span className={styles.summaryValue}>{formatHours(summary?.grandTotal ?? 0)} h</span>
      </div>

      {loading ? (
        <p className={layout.muted}>A carregar…</p>
      ) : summary && summary.interns.length === 0 ? (
        <Card>
          <p className={layout.muted}>Não tem estagiários atribuídos neste momento.</p>
        </Card>
      ) : (
        <>
          <div className={styles.internCards}>
            {summary?.interns.map((entry) => (
              <button
                key={entry.intern.id}
                type="button"
                className={`${styles.internCard} ${
                  selectedInternId === entry.intern.id ? styles.internCardActive : ''
                }`}
                onClick={() => setSelectedInternId(entry.intern.id)}
              >
                <span className={styles.internCardName}>{entry.intern.name}</span>
                <span className={styles.internCardMeta}>
                  {formatHours(entry.totalHours)} h · {entry.entryCount} registo
                  {entry.entryCount === 1 ? '' : 's'}
                </span>
              </button>
            ))}
          </div>

          {detail && (
            <Card as="section">
              <h2>{detail.intern?.name ?? 'Estagiário'}</h2>
              <p className={layout.muted}>
                Total do mês: {formatHours(detail.totalHours)} h ({detail.logs.length} registo
                {detail.logs.length === 1 ? '' : 's'})
              </p>
              {detail.logs.length === 0 ? (
                <p className={layout.muted}>Sem horas registadas neste mês.</p>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Horas</th>
                        <th>Notas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.logs.map((log) => (
                        <tr key={log.id}>
                          <td>{new Date(`${log.workDate}T12:00:00`).toLocaleDateString('pt-PT')}</td>
                          <td>{formatHours(log.hours)} h</td>
                          <td>{log.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
        </>
      )}
    </BackofficeLayout>
  )
}
