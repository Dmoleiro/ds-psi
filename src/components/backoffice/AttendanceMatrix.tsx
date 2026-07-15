import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError, coordinatorApi, therapistApi, type AttendanceStatus, type LocationSummary } from '../../lib/api'
import {
  getMonthDays,
  RECEIPT_TOGGLE_STATUSES,
  SCHEDULED_APPOINTMENT_LABEL,
  STATUS_CYCLE,
  STATUS_LABELS,
  toIsoDate,
} from '../../lib/attendance'
import type { useEditLock } from '../../hooks/useEditLock'
import styles from './AttendanceMatrix.module.css'

type PatientRow = { id: string; fullName: string }

type MatrixRecord = {
  patientId: string
  date: string
  status: AttendanceStatus
}

type ScheduledAppointment = {
  patientId: string
  date: string
}

type EditLock = ReturnType<typeof useEditLock>

type Props = {
  token: string
  location: LocationSummary
  editLock?: EditLock
  mode?: 'therapist' | 'coordinator'
  therapistId?: string
}

export function AttendanceMatrix({
  token,
  location,
  editLock,
  mode = 'therapist',
  therapistId,
}: Props) {
  const isCoordinator = mode === 'coordinator'
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1)
  const [patients, setPatients] = useState<PatientRow[]>([])
  const [records, setRecords] = useState<MatrixRecord[]>([])
  const [scheduledAppointments, setScheduledAppointments] = useState<ScheduledAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [error, setError] = useState('')
  const unlocked = editLock?.unlocked ?? false
  const toggle = editLock?.toggle ?? (() => {})
  const lock = editLock?.lock

  const days = useMemo(() => getMonthDays(viewYear, viewMonth), [viewYear, viewMonth])

  const statusMap = useMemo(() => {
    const map = new Map<string, AttendanceStatus>()
    for (const record of records) {
      map.set(`${record.patientId}:${record.date}`, record.status)
    }
    return map
  }, [records])

  const scheduledMap = useMemo(() => {
    const set = new Set<string>()
    for (const appointment of scheduledAppointments) {
      set.add(`${appointment.patientId}:${appointment.date}`)
    }
    return set
  }, [scheduledAppointments])

  const loadMonth = useCallback(async () => {
    if (isCoordinator && !therapistId) return

    setLoading(true)
    setError('')
    try {
      const data = isCoordinator
        ? await coordinatorApi.listAttendanceMatrix(token, therapistId!, viewYear, viewMonth, location.id)
        : await therapistApi.listAttendanceMatrix(token, viewYear, viewMonth, location.id)
      setPatients(data.patients)
      setRecords(data.records)
      setScheduledAppointments(data.scheduledAppointments ?? [])
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar presenças')
    } finally {
      setLoading(false)
    }
  }, [token, viewYear, viewMonth, location.id, isCoordinator, therapistId])

  useEffect(() => {
    lock?.()
    void loadMonth()
  }, [loadMonth, lock])

  function shiftMonth(delta: number) {
    lock?.()
    const date = new Date(viewYear, viewMonth - 1 + delta, 1)
    setViewYear(date.getFullYear())
    setViewMonth(date.getMonth() + 1)
  }

  async function handleTherapistCellClick(patientId: string, isoDate: string) {
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
        return [...without, { patientId, date: isoDate, status: record.status as AttendanceStatus }]
      })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível guardar')
    } finally {
      setSavingKey(null)
    }
  }

  async function handleCoordinatorCellClick(patientId: string, isoDate: string) {
    if (!unlocked || !therapistId) return

    const key = `${patientId}:${isoDate}`
    const current = statusMap.get(key)
    if (!current || !RECEIPT_TOGGLE_STATUSES.includes(current)) return

    setSavingKey(key)
    setError('')
    try {
      const { record } = await coordinatorApi.toggleReceiptStatus(token, {
        therapistId,
        patientId,
        date: isoDate,
      })
      setRecords((prev) => {
        const without = prev.filter((r) => !(r.patientId === patientId && r.date === isoDate))
        return [...without, { patientId, date: isoDate, status: record.status }]
      })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível guardar')
    } finally {
      setSavingKey(null)
    }
  }

  function handleCellClick(patientId: string, isoDate: string) {
    if (isCoordinator) {
      void handleCoordinatorCellClick(patientId, isoDate)
    } else {
      void handleTherapistCellClick(patientId, isoDate)
    }
  }

  function canEditCell(status: AttendanceStatus | undefined) {
    if (!unlocked) return false
    if (isCoordinator) {
      return status !== undefined && RECEIPT_TOGGLE_STATUSES.includes(status)
    }
    return true
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
        {isCoordinator
          ? unlocked
            ? 'Clique em células «presente pago» para marcar recibo passado, ou em «recibo passado» para reverter.'
            : 'Modo consulta — desbloqueie o cadeado para atualizar recibos.'
          : unlocked
            ? 'Clique numa célula para alternar: por pagar → pago → recibo passado → falta → limpar.'
            : 'Modo consulta — desbloqueie o cadeado para marcar presenças.'}
      </p>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.swatch} ${styles.scheduled}`} aria-hidden />
          {SCHEDULED_APPOINTMENT_LABEL}
        </span>
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
          Nenhum paciente neste local.
          {!isCoordinator && (
            <>
              {' '}
              <Link to="/backoffice/patients/new">Criar paciente</Link>
            </>
          )}
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
                    {isCoordinator ? (
                      patient.fullName
                    ) : (
                      <Link to={`/backoffice/patients/${patient.id}`} className={styles.patientLink}>
                        {patient.fullName}
                      </Link>
                    )}
                  </th>
                  {days.map(({ date }) => {
                    const key = `${patient.id}:${date}`
                    const status = statusMap.get(key)
                    const hasScheduledAppointment = !status && scheduledMap.has(key)
                    const editable = canEditCell(status)
                    const CellTag = editable ? 'button' : 'span'
                    const cellLabel = status
                      ? STATUS_LABELS[status]
                      : hasScheduledAppointment
                        ? SCHEDULED_APPOINTMENT_LABEL
                        : 'sem registo'
                    return (
                      <td key={key} className={date === todayIso ? styles.todayCol : undefined}>
                        <CellTag
                          {...(editable
                            ? {
                                type: 'button' as const,
                                onClick: () => handleCellClick(patient.id, date),
                                disabled: savingKey === key,
                              }
                            : {})}
                          className={`${styles.cell} ${status ? styles[status] : hasScheduledAppointment ? styles.scheduled : ''} ${isCoordinator && unlocked && status && !RECEIPT_TOGGLE_STATUSES.includes(status) ? styles.cellLocked : ''}`}
                          title={`${patient.fullName} — ${cellLabel}`}
                          aria-label={`${patient.fullName}, ${date}, ${cellLabel}`}
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
