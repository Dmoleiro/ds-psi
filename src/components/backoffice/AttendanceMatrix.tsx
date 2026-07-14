import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError, therapistApi, type AttendanceStatus, type LocationSummary } from '../../lib/api'
import { getMonthDays, STATUS_CYCLE, STATUS_LABELS, toIsoDate } from '../../lib/attendance'
import type { useEditLock } from '../../hooks/useEditLock'
import styles from './AttendanceMatrix.module.css'

type PatientRow = { id: string; fullName: string }

type MatrixRecord = {
  patientId: string
  date: string
  status: AttendanceStatus
}

type EditLock = ReturnType<typeof useEditLock>

type Props = {
  token: string
  location: LocationSummary
  editLock: EditLock
}

export function AttendanceMatrix({ token, location, editLock }: Props) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1)
  const [patients, setPatients] = useState<PatientRow[]>([])
  const [records, setRecords] = useState<MatrixRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [error, setError] = useState('')
  const { unlocked, toggle, lock } = editLock

  const days = useMemo(() => getMonthDays(viewYear, viewMonth), [viewYear, viewMonth])

  const statusMap = useMemo(() => {
    const map = new Map<string, AttendanceStatus>()
    for (const record of records) {
      map.set(`${record.patientId}:${record.date}`, record.status)
    }
    return map
  }, [records])

  const loadMonth = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await therapistApi.listAttendanceMatrix(token, viewYear, viewMonth, location.id)
      setPatients(data.patients)
      setRecords(data.records)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar presenças')
    } finally {
      setLoading(false)
    }
  }, [token, viewYear, viewMonth, location.id])

  useEffect(() => {
    lock()
    loadMonth()
  }, [loadMonth, lock])

  function shiftMonth(delta: number) {
    lock()
    const date = new Date(viewYear, viewMonth - 1 + delta, 1)
    setViewYear(date.getFullYear())
    setViewMonth(date.getMonth() + 1)
  }

  async function handleCellClick(patientId: string, isoDate: string) {
    if (!unlocked) return

    const key = `${patientId}:${isoDate}`
    const current = statusMap.get(key) ?? null
    const currentIndex = STATUS_CYCLE.indexOf(current)
    const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length]

    setSavingKey(key)
    setError('')
    try {
      const { record } = await therapistApi.upsertAttendance(token, patientId, {
        date: isoDate,
        status: nextStatus,
      })
      setRecords((prev) => {
        const without = prev.filter((r) => !(r.patientId === patientId && r.date === isoDate))
        if (record.status === null) return without
        return [
          ...without,
          { patientId, date: isoDate, status: record.status as AttendanceStatus },
        ]
      })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível guardar')
    } finally {
      setSavingKey(null)
    }
  }

  const monthLabel = new Date(viewYear, viewMonth - 1, 1).toLocaleDateString('pt-PT', {
    month: 'long',
    year: 'numeric',
  })

  const todayIso = toIsoDate(today.getFullYear(), today.getMonth() + 1, today.getDate())

  return (
    <section className={styles.matrix}>
      <div className={styles.toolbar}>
        <button type="button" className={styles.navButton} onClick={() => shiftMonth(-1)} aria-label="Mês anterior">
          ←
        </button>
        <div className={styles.titleBlock}>
          <h2 className={styles.monthTitle}>{monthLabel}</h2>
          <p className={styles.locationLabel}>{location.name}</p>
        </div>
        <button type="button" className={styles.navButton} onClick={() => shiftMonth(1)} aria-label="Mês seguinte">
          →
        </button>
      </div>

      <div className={styles.editBar}>
        <button
          type="button"
          className={`${styles.lockButton} ${unlocked ? styles.lockButtonOpen : ''}`}
          onClick={toggle}
          aria-pressed={unlocked}
          title={unlocked ? 'Bloquear edição' : 'Desbloquear para editar'}
        >
          <span className={styles.lockIcon} aria-hidden>
            {unlocked ? '🔓' : '🔒'}
          </span>
          {unlocked ? 'Edição ativa' : 'Só consulta — clique para editar'}
        </button>
        {unlocked && (
          <p className={styles.idleHint}>Bloqueia automaticamente após 1 minuto sem atividade.</p>
        )}
      </div>

      <p className={styles.hint}>
        {unlocked
          ? 'Clique numa célula para alternar: por pagar → pago → falta → limpar.'
          : 'Modo consulta — desbloqueie o cadeado para marcar presenças.'}
      </p>

      <div className={styles.legend}>
        {(Object.keys(STATUS_LABELS) as AttendanceStatus[]).map((status) => (
          <span key={status} className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles[status]}`} aria-hidden />
            {STATUS_LABELS[status]}
          </span>
        ))}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <p className={styles.loading}>A carregar…</p>
      ) : patients.length === 0 ? (
        <p className={styles.loading}>
          Nenhum paciente neste local.{' '}
          <Link to="/backoffice/patients/new">Criar paciente</Link>
        </p>
      ) : (
        <div className={`${styles.scrollWrap} ${!unlocked ? styles.readOnly : ''}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.stickyCol}>Paciente</th>
                {days.map(({ day, date, weekday }) => (
                  <th
                    key={date}
                    className={`${styles.dayHead} ${date === todayIso ? styles.todayCol : ''}`}
                    title={new Date(viewYear, viewMonth - 1, day).toLocaleDateString('pt-PT', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  >
                    <span className={styles.dayNum}>{day}</span>
                    <span className={styles.dayWeek}>{weekday}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <th className={styles.stickyCol} scope="row">
                    <Link to={`/backoffice/patients/${patient.id}`} className={styles.patientLink}>
                      {patient.fullName}
                    </Link>
                  </th>
                  {days.map(({ date }) => {
                    const key = `${patient.id}:${date}`
                    const status = statusMap.get(key)
                    const CellTag = unlocked ? 'button' : 'span'
                    return (
                      <td key={key} className={date === todayIso ? styles.todayCol : undefined}>
                        <CellTag
                          {...(unlocked
                            ? {
                                type: 'button' as const,
                                onClick: () => handleCellClick(patient.id, date),
                                disabled: savingKey === key,
                              }
                            : {})}
                          className={`${styles.cell} ${status ? styles[status] : ''}`}
                          title={
                            status
                              ? `${patient.fullName} — ${STATUS_LABELS[status]}`
                              : `${patient.fullName} — sem registo`
                          }
                          aria-label={
                            status
                              ? `${patient.fullName}, ${date}, ${STATUS_LABELS[status]}`
                              : `${patient.fullName}, ${date}, sem registo`
                          }
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
