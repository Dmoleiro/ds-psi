import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'
import { ApiError, therapistApi, type InternWorkLog } from '../../lib/api'
import { formatMonthTitle, shiftMonth } from '../../lib/appointments'
import layout from '../../components/backoffice/BackofficeLayout.module.css'
import styles from './InternWorkHoursPage.module.css'

type FormState = {
  workDate: string
  hours: string
  notes: string
}

const EMPTY_FORM: FormState = {
  workDate: '',
  hours: '',
  notes: '',
}

function formatHours(value: number) {
  return new Intl.NumberFormat('pt-PT', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export function InternWorkHoursPage() {
  const { token, user, loading: authLoading } = useAuth()
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1)
  const [totalHours, setTotalHours] = useState(0)
  const [logs, setLogs] = useState<InternWorkLog[]>([])
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadMonth = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const data = await therapistApi.listInternWorkLogs(token, viewYear, viewMonth)
      setLogs(data.logs)
      setTotalHours(data.totalHours)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar as horas')
    } finally {
      setLoading(false)
    }
  }, [token, viewYear, viewMonth])

  useEffect(() => {
    void loadMonth()
  }, [loadMonth])

  if (authLoading) return null

  if (!user?.isIntern) {
    return <Navigate to="/backoffice" replace />
  }

  function changeMonth(delta: number) {
    const next = shiftMonth(viewYear, viewMonth, delta)
    setViewYear(next.year)
    setViewMonth(next.month)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  function startEdit(log: InternWorkLog) {
    setEditingId(log.id)
    setForm({
      workDate: log.workDate,
      hours: String(log.hours),
      notes: log.notes ?? '',
    })
    setError('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError('')
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!token) return

    const hours = Number(form.hours)
    if (!form.workDate || !Number.isFinite(hours) || hours <= 0) {
      setError('Indique a data e as horas trabalhadas.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const body = {
        workDate: form.workDate,
        hours,
        notes: form.notes.trim() ? form.notes.trim() : null,
      }
      if (editingId) {
        await therapistApi.updateInternWorkLog(token, editingId, body)
      } else {
        await therapistApi.createInternWorkLog(token, body)
      }
      cancelEdit()
      await loadMonth()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível guardar o registo')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(logId: string) {
    if (!token || !window.confirm('Eliminar este registo de horas?')) return

    setSubmitting(true)
    setError('')
    try {
      await therapistApi.deleteInternWorkLog(token, logId)
      if (editingId === logId) cancelEdit()
      await loadMonth()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível eliminar o registo')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <BackofficeLayout>
      <div className={styles.pageHeader}>
        <h1 className={layout.pageTitle}>Horas de estágio</h1>
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

      <div className={styles.summaryCard}>
        <span className={styles.summaryLabel}>Total do mês</span>
        <span className={styles.summaryValue}>{formatHours(totalHours)} h</span>
      </div>

      <Card as="section" className={layout.sectionSpaced}>
        <h2>{editingId ? 'Editar registo' : 'Novo registo'}</h2>
        <p className={layout.muted}>
          Registe as horas trabalhadas em cada dia. Pode corrigir ou eliminar registos em caso de erro.
        </p>
        {error && <p className={layout.error}>{error}</p>}
        <form className={layout.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={layout.field}>
              <label htmlFor="intern-work-date">Data</label>
              <input
                id="intern-work-date"
                type="date"
                value={form.workDate}
                onChange={(event) => setForm((current) => ({ ...current, workDate: event.target.value }))}
                required
              />
            </div>
            <div className={layout.field}>
              <label htmlFor="intern-work-hours">Horas</label>
              <input
                id="intern-work-hours"
                type="number"
                min="0.25"
                max="24"
                step="0.25"
                value={form.hours}
                onChange={(event) => setForm((current) => ({ ...current, hours: event.target.value }))}
                required
              />
            </div>
            <div className={layout.field}>
              <label htmlFor="intern-work-notes">Notas (opcional)</label>
              <input
                id="intern-work-notes"
                type="text"
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Ex.: consultas, supervisão, formação"
              />
            </div>
          </div>
          <div className={layout.rowActions}>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'A guardar…' : editingId ? 'Guardar alterações' : 'Adicionar registo'}
            </Button>
            {editingId && (
              <button type="button" className={layout.linkButton} onClick={cancelEdit} disabled={submitting}>
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </Card>

      <Card as="section">
        <h2>Registos do mês</h2>
        {loading ? (
          <p className={layout.muted}>A carregar…</p>
        ) : logs.length === 0 ? (
          <p className={layout.muted}>Ainda não existem horas registadas neste mês.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Horas</th>
                  <th>Notas</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{new Date(`${log.workDate}T12:00:00`).toLocaleDateString('pt-PT')}</td>
                    <td>{formatHours(log.hours)} h</td>
                    <td>{log.notes || '—'}</td>
                    <td>
                      <div className={layout.rowActions}>
                        <button type="button" className={layout.linkButton} onClick={() => startEdit(log)}>
                          Editar
                        </button>
                        <button
                          type="button"
                          className={layout.dangerLinkButton}
                          onClick={() => void handleDelete(log.id)}
                          disabled={submitting}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </BackofficeLayout>
  )
}
