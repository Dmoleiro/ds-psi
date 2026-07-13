import { useCallback, useEffect, useMemo, useState } from 'react'
import { ApiError, therapistApi, type AttendanceRecord, type AttendanceStatus } from '../../lib/api'
import styles from './AttendanceCalendar.module.css'

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

const STATUS_CYCLE: Array<AttendanceStatus | null> = [
  null,
  'present_unpaid',
  'present_paid',
  'absent',
]

const STATUS_LABELS: Record<AttendanceStatus, string> = {
  present_unpaid: 'Presente por pagar',
  present_paid: 'Presente pago',
  absent: 'Falta',
}

type Props = {
  patientId: string
  token: string
}

function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function buildMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1)
  const daysInMonth = new Date(year, month, 0).getDate()
  const startOffset = (firstDay.getDay() + 6) % 7
  const cells: Array<{ day: number | null; date: string | null }> = []

  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: null, date: null })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, date: toIsoDate(year, month, day) })
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, date: null })
  }
  return cells
}

export function AttendanceCalendar({ patientId, token }: Props) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1)
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [savingDate, setSavingDate] = useState<string | null>(null)
  const [error, setError] = useState('')

  const recordsByDate = useMemo(() => {
    const map = new Map<string, AttendanceStatus>()
    for (const record of records) {
      map.set(record.date, record.status)
    }
    return map
  }, [records])

  const loadMonth = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await therapistApi.listAttendance(token, patientId, viewYear, viewMonth)
      setRecords(data.records)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar presenças')
    } finally {
      setLoading(false)
    }
  }, [token, patientId, viewYear, viewMonth])

  useEffect(() => {
    loadMonth()
  }, [loadMonth])

  function shiftMonth(delta: number) {
    const date = new Date(viewYear, viewMonth - 1 + delta, 1)
    setViewYear(date.getFullYear())
    setViewMonth(date.getMonth() + 1)
  }

  async function handleDayClick(isoDate: string) {
    const current = recordsByDate.get(isoDate) ?? null
    const currentIndex = STATUS_CYCLE.indexOf(current)
    const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length]

    setSavingDate(isoDate)
    setError('')
    try {
      const { record } = await therapistApi.upsertAttendance(token, patientId, {
        date: isoDate,
        status: nextStatus,
      })
      setRecords((prev) => {
        const without = prev.filter((r) => r.date !== isoDate)
        if (record.status === null) return without
        return [...without, record as AttendanceRecord].sort((a, b) => a.date.localeCompare(b.date))
      })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível guardar')
    } finally {
      setSavingDate(null)
    }
  }

  const monthLabel = new Date(viewYear, viewMonth - 1, 1).toLocaleDateString('pt-PT', {
    month: 'long',
    year: 'numeric',
  })

  const cells = buildMonthGrid(viewYear, viewMonth)

  return (
    <section className={styles.calendar}>
      <div className={styles.toolbar}>
        <button type="button" className={styles.navButton} onClick={() => shiftMonth(-1)} aria-label="Mês anterior">
          ←
        </button>
        <h3 className={styles.monthTitle}>{monthLabel}</h3>
        <button type="button" className={styles.navButton} onClick={() => shiftMonth(1)} aria-label="Mês seguinte">
          →
        </button>
      </div>

      <p className={styles.hint}>Clique num dia para alternar: por pagar → pago → falta → limpar.</p>

      <div className={styles.legend}>
        {(Object.keys(STATUS_LABELS) as AttendanceStatus[]).map((status) => (
          <span key={status} className={styles.legendItem}>
            <span className={`${styles.dot} ${styles[status]}`} aria-hidden />
            {STATUS_LABELS[status]}
          </span>
        ))}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={`${styles.grid} ${loading ? styles.loading : ''}`} aria-busy={loading}>
        {WEEKDAYS.map((day) => (
          <div key={day} className={styles.weekday}>
            {day}
          </div>
        ))}
        {cells.map((cell, index) => {
          if (!cell.date || cell.day === null) {
            return <div key={`empty-${index}`} className={styles.emptyCell} />
          }

          const status = recordsByDate.get(cell.date)
          const isToday =
            cell.date ===
            toIsoDate(today.getFullYear(), today.getMonth() + 1, today.getDate())

          return (
            <button
              key={cell.date}
              type="button"
              className={`${styles.dayCell} ${status ? styles[status] : ''} ${isToday ? styles.today : ''}`}
              onClick={() => handleDayClick(cell.date!)}
              disabled={savingDate === cell.date}
              title={status ? STATUS_LABELS[status] : 'Sem registo'}
            >
              <span className={styles.dayNumber}>{cell.day}</span>
              {status && <span className={styles.dayStatus}>{STATUS_LABELS[status]}</span>}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export { STATUS_LABELS }
