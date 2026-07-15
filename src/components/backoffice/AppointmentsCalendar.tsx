import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ApiError,
  therapistApi,
  type AppointmentSummary,
  type LocationSummary,
  type PatientSummary,
} from '../../lib/api'
import {
  DURATION_OPTIONS,
  WEEKDAY_LABELS,
  formatAppointmentRange,
  formatDayLabel,
  formatMonthTitle,
  getCalendarCells,
  groupAppointmentsByDate,
  isToday,
  shiftMonth,
} from '../../lib/appointments'
import { exportAppointmentsPdf } from '../../lib/exportAppointmentsPdf'
import { Button } from '../ui/Button'
import styles from './AppointmentsCalendar.module.css'
import layout from './BackofficeLayout.module.css'

type Props = {
  token: string
  therapistName: string
}

type FormState = {
  patientId: string
  locationId: string
  time: string
  durationMinutes: number
  notes: string
}

const EMPTY_FORM: FormState = {
  patientId: '',
  locationId: '',
  time: '09:00',
  durationMinutes: 60,
  notes: '',
}

function initialForm(preferredLocationId = ''): FormState {
  return {
    ...EMPTY_FORM,
    locationId: preferredLocationId,
  }
}

function patientsForLocation(patients: PatientSummary[], locationId: string, selectedPatientId = '') {
  if (!locationId) return []
  const filtered = patients.filter((patient) => patient.location?.id === locationId)
  if (selectedPatientId && !filtered.some((patient) => patient.id === selectedPatientId)) {
    const selected = patients.find((patient) => patient.id === selectedPatientId)
    if (selected) return [selected, ...filtered]
  }
  return filtered
}

export function AppointmentsCalendar({ token, therapistName }: Props) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1)
  const [appointments, setAppointments] = useState<AppointmentSummary[]>([])
  const [patients, setPatients] = useState<PatientSummary[]>([])
  const [locations, setLocations] = useState<LocationSummary[]>([])
  const [locationFilter, setLocationFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [dialogError, setDialogError] = useState('')

  const cells = useMemo(() => getCalendarCells(viewYear, viewMonth), [viewYear, viewMonth])
  const weeks = useMemo(() => {
    const rows: ReturnType<typeof getCalendarCells>[] = []
    for (let index = 0; index < cells.length; index += 7) {
      rows.push(cells.slice(index, index + 7))
    }
    return rows
  }, [cells])
  const appointmentsByDate = useMemo(() => groupAppointmentsByDate(appointments), [appointments])
  const selectedDayAppointments = selectedDate ? (appointmentsByDate.get(selectedDate) ?? []) : []
  const selectedLocationName =
    locations.find((location) => location.id === locationFilter)?.name ?? 'Todos os locais'
  const patientsInSelectedLocation = useMemo(
    () => patientsForLocation(patients, form.locationId, form.patientId),
    [patients, form.locationId, form.patientId],
  )

  const loadMonth = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await therapistApi.listAppointments(
        token,
        viewYear,
        viewMonth,
        locationFilter || undefined,
      )
      setAppointments(data.appointments)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao carregar consultas')
    } finally {
      setLoading(false)
    }
  }, [token, viewYear, viewMonth, locationFilter])

  useEffect(() => {
    loadMonth()
  }, [loadMonth])

  useEffect(() => {
    Promise.all([therapistApi.listPatients(token), therapistApi.listLocations(token)])
      .then(([patientsData, locationsData]) => {
        setPatients(patientsData.patients)
        setLocations(locationsData.locations)
      })
      .catch(() => {
        setPatients([])
        setLocations([])
      })
  }, [token])

  function openDay(date: string) {
    setSelectedDate(date)
    setEditingId(null)
    setForm(initialForm(locationFilter))
    setDialogError('')
  }

  function closeDialog() {
    setSelectedDate(null)
    setEditingId(null)
    setForm(initialForm(locationFilter))
    setDialogError('')
  }

  function startEdit(appointment: AppointmentSummary) {
    setEditingId(appointment.id)
    setForm({
      patientId: appointment.patientId,
      locationId: appointment.locationId,
      time: appointment.time,
      durationMinutes: appointment.durationMinutes,
      notes: appointment.notes ?? '',
    })
    setDialogError('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(initialForm(locationFilter))
    setDialogError('')
  }

  function handleLocationChange(locationId: string) {
    setForm((current) => ({
      ...current,
      locationId,
      patientId: '',
    }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!selectedDate || !form.patientId || !form.locationId) return

    setSubmitting(true)
    setDialogError('')
    try {
      const body = {
        patientId: form.patientId,
        locationId: form.locationId,
        date: selectedDate,
        time: form.time,
        durationMinutes: form.durationMinutes,
        notes: form.notes.trim() ? form.notes.trim() : null,
      }

      if (editingId) {
        await therapistApi.updateAppointment(token, editingId, body)
        await loadMonth()
        setEditingId(null)
        setForm(initialForm(locationFilter))
      } else {
        await therapistApi.createAppointment(token, body)
        await loadMonth()
        closeDialog()
      }
    } catch (err) {
      setDialogError(err instanceof ApiError ? err.message : 'Não foi possível guardar a consulta')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(appointmentId: string) {
    if (!window.confirm('Eliminar esta consulta?')) return
    setSubmitting(true)
    setDialogError('')
    try {
      await therapistApi.deleteAppointment(token, appointmentId)
      if (editingId === appointmentId) {
        cancelEdit()
      }
      await loadMonth()
    } catch (err) {
      setDialogError(err instanceof ApiError ? err.message : 'Não foi possível eliminar a consulta')
    } finally {
      setSubmitting(false)
    }
  }

  function handleExportPdf() {
    try {
      exportAppointmentsPdf(viewYear, viewMonth, therapistName, appointments, selectedLocationName)
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Não foi possível exportar o PDF')
    }
  }

  function changeMonth(delta: number) {
    const next = shiftMonth(viewYear, viewMonth, delta)
    setViewYear(next.year)
    setViewMonth(next.month)
  }

  return (
    <div className={styles.appointmentsPage}>
      <div className={styles.toolbar}>
        <div className={styles.monthNav}>
          <button type="button" className={styles.navButton} onClick={() => changeMonth(-1)} aria-label="Mês anterior">
            ←
          </button>
          <h2 className={styles.monthTitle}>{formatMonthTitle(viewYear, viewMonth)}</h2>
          <button type="button" className={styles.navButton} onClick={() => changeMonth(1)} aria-label="Mês seguinte">
            →
          </button>
        </div>
        <div className={styles.toolbarActions}>
          <label className={layout.muted}>
            Local
            <select
              className={styles.locationFilter}
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
              style={{ display: 'block', marginTop: '0.25rem' }}
            >
              <option value="">Todos os locais</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>
          <Button type="button" variant="outline" onClick={handleExportPdf}>
            Imprimir / guardar PDF
          </Button>
        </div>
      </div>

      {error && <p className={layout.error}>{error}</p>}
      {loading ? (
        <p className={layout.muted}>A carregar…</p>
      ) : (
        <div className={styles.calendar}>
          <div className={styles.weekdays}>
            {WEEKDAY_LABELS.map((label) => (
              <div key={label} className={styles.weekday}>
                {label}
              </div>
            ))}
          </div>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className={styles.week}>
              {week.map((cell, cellIndex) => {
                if (!cell.inMonth || !cell.date) {
                  return <div key={cellIndex} className={`${styles.dayCell} ${styles.dayCellOutside}`} />
                }

                const dayAppointments = appointmentsByDate.get(cell.date) ?? []
                const visible = dayAppointments.slice(0, 3)
                const hiddenCount = dayAppointments.length - visible.length

                return (
                  <div key={cell.date} className={styles.dayCell}>
                    <button type="button" className={styles.dayButton} onClick={() => openDay(cell.date!)}>
                      <span
                        className={`${styles.dayNumber} ${isToday(cell.date) ? styles.dayNumberToday : ''}`}
                      >
                        {cell.day}
                      </span>
                      <span className={styles.appointmentList}>
                        {visible.map((appointment) => (
                          <span key={appointment.id} className={styles.appointmentChip}>
                            <span>
                              {appointment.time} {appointment.patientName}
                            </span>
                            <span className={styles.appointmentChipLocation}>{appointment.locationName}</span>
                          </span>
                        ))}
                        {hiddenCount > 0 && (
                          <span className={styles.moreLabel}>+{hiddenCount} mais</span>
                        )}
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {selectedDate && (
        <div className={styles.overlay} role="presentation" onClick={closeDialog}>
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.dialogHeader}>
              <h2 id="appointment-dialog-title">{formatDayLabel(selectedDate)}</h2>
              <button type="button" className={styles.closeButton} onClick={closeDialog} aria-label="Fechar">
                ×
              </button>
            </div>

            {selectedDayAppointments.length > 0 && (
              <div className={styles.existingList}>
                {selectedDayAppointments.map((appointment) => (
                  <article
                    key={appointment.id}
                    className={`${styles.existingItem} ${editingId === appointment.id ? styles.existingItemActive : ''}`}
                  >
                    <p className={styles.existingMeta}>
                      {formatAppointmentRange(appointment.time, appointment.durationMinutes)} ·{' '}
                      {appointment.locationName}
                    </p>
                    <h3 className={styles.existingTitle}>{appointment.patientName}</h3>
                    {appointment.notes && <p className={layout.muted}>{appointment.notes}</p>}
                    <div className={styles.existingActions}>
                      <button
                        type="button"
                        className={styles.textButton}
                        onClick={() => startEdit(appointment)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className={`${styles.textButton} ${styles.textButtonDanger}`}
                        onClick={() => handleDelete(appointment.id)}
                        disabled={submitting}
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <hr className={styles.divider} />

            <form className={styles.form} onSubmit={handleSubmit}>
              <h3>{editingId ? 'Editar consulta' : 'Nova consulta'}</h3>
              {dialogError && <p className={layout.error}>{dialogError}</p>}
              {patients.length === 0 ? (
                <p className={layout.muted}>Crie um paciente antes de agendar consultas.</p>
              ) : (
                <>
                  <div className={styles.field}>
                    <label htmlFor="appointment-location">Local</label>
                    <select
                      id="appointment-location"
                      value={form.locationId}
                      onChange={(event) => handleLocationChange(event.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Selecionar local
                      </option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="appointment-patient">Paciente</label>
                    <select
                      id="appointment-patient"
                      value={form.patientId}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, patientId: event.target.value }))
                      }
                      required
                      disabled={!form.locationId}
                    >
                      <option value="" disabled>
                        {form.locationId ? 'Selecionar paciente' : 'Selecione um local primeiro'}
                      </option>
                      {patientsInSelectedLocation.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.fullName}
                        </option>
                      ))}
                    </select>
                    {form.locationId && patientsInSelectedLocation.length === 0 && (
                      <p className={layout.muted}>Não existem pacientes neste local.</p>
                    )}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="appointment-time">Hora</label>
                    <input
                      id="appointment-time"
                      type="time"
                      value={form.time}
                      onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="appointment-duration">Duração</label>
                    <select
                      id="appointment-duration"
                      value={form.durationMinutes}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          durationMinutes: Number(event.target.value),
                        }))
                      }
                    >
                      {DURATION_OPTIONS.map((minutes) => (
                        <option key={minutes} value={minutes}>
                          {minutes} minutos
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="appointment-notes">Notas (opcional)</label>
                    <textarea
                      id="appointment-notes"
                      value={form.notes}
                      onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                      placeholder="Observações internas"
                    />
                  </div>
                  <div className={styles.formActions}>
                    <Button type="submit" disabled={submitting || !form.patientId || !form.locationId}>
                      {submitting ? 'A guardar…' : editingId ? 'Guardar alterações' : 'Adicionar consulta'}
                    </Button>
                    {editingId && (
                      <Button type="button" variant="outline" onClick={cancelEdit} disabled={submitting}>
                        Cancelar edição
                      </Button>
                    )}
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
