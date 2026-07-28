import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ApiError,
  coordinatorApi,
  therapistApi,
  type AppointmentSummary,
  type LocationSummary,
  type PatientSummary,
} from '../../lib/api'
import {
  addMonthsToIsoDate,
  APPOINTMENT_SERIES_SCOPE_OPTIONS,
  DURATION_OPTIONS,
  findRoomConflict,
  RECURRENCE_CADENCE_OPTIONS,
  WEEKDAY_LABELS,
  formatAppointmentRange,
  formatDayLabel,
  formatMonthTitle,
  gabinetesForLocation,
  getCalendarCells,
  groupAppointmentsByDate,
  isToday,
  resolveGabineteForLocation,
  shiftMonth,
  type AppointmentSeriesScope,
  type GabineteSummary,
  type RecurrenceCadence,
  type RoomOccupancy,
} from '../../lib/appointments'
import { exportAppointmentsPdf } from '../../lib/exportAppointmentsPdf'
import { Button } from '../ui/Button'
import styles from './AppointmentsCalendar.module.css'
import layout from './BackofficeLayout.module.css'

type Props = {
  token: string
  therapistName: string
  readOnly?: boolean
  therapistId?: string
  prefill?: AppointmentPrefill | null
  onPrefillConsumed?: () => void
}

export type AppointmentPrefill =
  | { mode: 'create'; date: string; patientId: string; locationId?: string | null }
  | { mode: 'edit'; appointmentId: string }

type FormState = {
  patientId: string
  locationId: string
  gabineteId: string
  time: string
  durationMinutes: number
  sessionFee: number
  notes: string
  appointmentDate: string
  repeatEnabled: boolean
  repeatCadence: RecurrenceCadence
  repeatUntil: string
}

const EMPTY_FORM: FormState = {
  patientId: '',
  locationId: '',
  gabineteId: '',
  time: '09:00',
  durationMinutes: 60,
  sessionFee: 50,
  notes: '',
  appointmentDate: '',
  repeatEnabled: false,
  repeatCadence: 'weekly',
  repeatUntil: '',
}

function initialForm(
  preferredLocationId = '',
  preferredGabineteId = '',
  startDate = '',
  defaultSessionFee = 50,
): FormState {
  return {
    ...EMPTY_FORM,
    locationId: preferredLocationId,
    gabineteId: preferredGabineteId,
    sessionFee: defaultSessionFee,
    repeatUntil: startDate ? addMonthsToIsoDate(startDate, 2) : '',
  }
}

function resolveSessionFeeForPatient(
  patientId: string,
  patients: PatientSummary[],
  therapistDefault: number,
) {
  const patient = patients.find((entry) => entry.id === patientId)
  return patient?.sessionFee ?? therapistDefault
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

export function AppointmentsCalendar({
  token,
  therapistName,
  readOnly = false,
  therapistId,
  prefill = null,
  onPrefillConsumed,
}: Props) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1)
  const [appointments, setAppointments] = useState<AppointmentSummary[]>([])
  const [patients, setPatients] = useState<PatientSummary[]>([])
  const [locations, setLocations] = useState<LocationSummary[]>([])
  const [gabinetes, setGabinetes] = useState<GabineteSummary[]>([])
  const [locationFilter, setLocationFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingAppointment, setEditingAppointment] = useState<AppointmentSummary | null>(null)
  const [editScope, setEditScope] = useState<AppointmentSeriesScope>('single')
  const [pendingDelete, setPendingDelete] = useState<AppointmentSummary | null>(null)
  const [deleteScope, setDeleteScope] = useState<AppointmentSeriesScope>('single')
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [defaultSessionFee, setDefaultSessionFee] = useState(50)
  const [submitting, setSubmitting] = useState(false)
  const [dialogError, setDialogError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const [dayOccupancy, setDayOccupancy] = useState<RoomOccupancy[]>([])
  const consumedPrefillRef = useRef<string | null>(null)

  const prefillKey = prefill
    ? prefill.mode === 'edit'
      ? `edit:${prefill.appointmentId}`
      : `create:${prefill.date}:${prefill.patientId}`
    : null

  useEffect(() => {
    if (!editingId) return
    const frame = requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [editingId])

  useEffect(() => {
    if (!token || !selectedDate || readOnly) {
      setDayOccupancy([])
      return
    }
    therapistApi
      .getDayOccupancy(token, selectedDate)
      .then((data) => setDayOccupancy(data.appointments))
      .catch(() => setDayOccupancy([]))
  }, [token, selectedDate, readOnly])

  const gabinetesForSelectedLocation = useMemo(
    () => gabinetesForLocation(gabinetes, form.locationId),
    [gabinetes, form.locationId],
  )

  const roomConflict = useMemo(() => {
    if (!form.time || !form.gabineteId) return null
    const checkDate =
      editingId && editingAppointment?.recurrenceGroupId && editScope !== 'single'
        ? null
        : editingId
          ? form.appointmentDate
          : selectedDate
    if (!checkDate) return null
    const relevantOccupancy = dayOccupancy.filter((entry) => entry.date === checkDate)
    return findRoomConflict(
      relevantOccupancy,
      form.gabineteId,
      form.time,
      form.durationMinutes,
      editingId,
    )
  }, [
    dayOccupancy,
    editScope,
    editingAppointment,
    editingId,
    form.appointmentDate,
    form.durationMinutes,
    form.gabineteId,
    form.time,
    selectedDate,
  ])

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
      const data =
        readOnly && therapistId
          ? await coordinatorApi.listAppointments(
              token,
              therapistId,
              viewYear,
              viewMonth,
              locationFilter || undefined,
            )
          : await therapistApi.listAppointments(
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
  }, [token, viewYear, viewMonth, locationFilter, readOnly, therapistId])

  useEffect(() => {
    loadMonth()
  }, [loadMonth])

  useEffect(() => {
    if (!token || readOnly) return

    Promise.all([
      therapistApi.listPatients(token),
      therapistApi.getAppointmentDefaults(token),
      therapistApi.listLocations(token),
      therapistApi.listGabinetes(token),
    ])
      .then(([patientsData, defaultsData, locationsData, gabinetesData]) => {
        setPatients(patientsData.patients)
        setDefaultSessionFee(defaultsData.defaultSessionFee)
        setLocations(locationsData.locations)
        setGabinetes(gabinetesData.gabinetes)
      })
      .catch(() => {
        setPatients([])
        setLocations([])
        setGabinetes([])
      })
  }, [token, readOnly])

  useEffect(() => {
    if (!token || !readOnly || !therapistId) {
      if (readOnly) {
        setLocations([])
      }
      return
    }

    coordinatorApi
      .listLocations(token, therapistId)
      .then((data) => setLocations(data.locations))
      .catch(() => setLocations([]))
  }, [token, readOnly, therapistId])

  useEffect(() => {
    if (!prefill || !prefillKey || loading || readOnly) return
    if (consumedPrefillRef.current === prefillKey) return

    if (prefill.mode === 'edit') {
      const appointment = appointments.find((entry) => entry.id === prefill.appointmentId)
      if (!appointment) return

      const [year, month] = appointment.date.split('-').map(Number)
      setViewYear(year)
      setViewMonth(month)
      setEditingId(appointment.id)
      setEditingAppointment(appointment)
      setEditScope('single')
      setPendingDelete(null)
      setForm({
        patientId: appointment.patientId,
        locationId: appointment.locationId,
        gabineteId: appointment.gabineteId,
        time: appointment.time,
        durationMinutes: appointment.durationMinutes,
        sessionFee: appointment.sessionFee ?? defaultSessionFee,
        notes: appointment.notes ?? '',
        appointmentDate: appointment.date,
        repeatEnabled: false,
        repeatCadence: 'weekly',
        repeatUntil: '',
      })
      setSelectedDate(appointment.date)
      setDialogError('')
      consumedPrefillRef.current = prefillKey
      onPrefillConsumed?.()
      return
    }

    const patient = patients.find((entry) => entry.id === prefill.patientId)
    if (!patient && patients.length === 0) return

    const [year, month] = prefill.date.split('-').map(Number)
    const locationId =
      prefill.locationId ??
      patient?.location?.id ??
      (locationFilter || locations[0]?.id || '')
    const gabineteId = resolveGabineteForLocation(locationId, gabinetes)

    setViewYear(year)
    setViewMonth(month)
    setSelectedDate(prefill.date)
    setEditingId(null)
    setEditingAppointment(null)
    setForm({
      ...initialForm(locationId, gabineteId, prefill.date, defaultSessionFee),
      patientId: prefill.patientId,
      sessionFee: resolveSessionFeeForPatient(prefill.patientId, patients, defaultSessionFee),
    })
    setDialogError('')
    consumedPrefillRef.current = prefillKey
    onPrefillConsumed?.()
  }, [
    appointments,
    defaultSessionFee,
    gabinetes,
    loading,
    locationFilter,
    locations,
    onPrefillConsumed,
    patients,
    prefill,
    prefillKey,
    readOnly,
  ])

  useEffect(() => {
    consumedPrefillRef.current = null
  }, [prefillKey])

  function openDay(date: string) {
    setSelectedDate(date)
    setEditingId(null)
    const locationId = locationFilter || locations[0]?.id || ''
    const gabineteId = resolveGabineteForLocation(locationId, gabinetes)
    setForm(initialForm(locationId, gabineteId, date, defaultSessionFee))
    setDialogError('')
  }

  function closeDialog() {
    setSelectedDate(null)
    setEditingId(null)
    setEditingAppointment(null)
    setEditScope('single')
    setPendingDelete(null)
    setDeleteScope('single')
    const locationId = locationFilter || locations[0]?.id || ''
    const gabineteId = resolveGabineteForLocation(locationId, gabinetes)
    setForm(initialForm(locationId, gabineteId, '', defaultSessionFee))
    setDialogError('')
  }

  function startEdit(appointment: AppointmentSummary) {
    setEditingId(appointment.id)
    setEditingAppointment(appointment)
    setEditScope('single')
    setPendingDelete(null)
    setForm({
      patientId: appointment.patientId,
      locationId: appointment.locationId,
      gabineteId: appointment.gabineteId,
      time: appointment.time,
      durationMinutes: appointment.durationMinutes,
      sessionFee: appointment.sessionFee ?? 50,
      notes: appointment.notes ?? '',
      appointmentDate: appointment.date,
      repeatEnabled: false,
      repeatCadence: 'weekly',
      repeatUntil: '',
    })
    setDialogError('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingAppointment(null)
    setEditScope('single')
    setForm(initialForm(
      locationFilter || locations[0]?.id || '',
      resolveGabineteForLocation(locationFilter || locations[0]?.id || '', gabinetes),
      selectedDate ?? '',
      defaultSessionFee,
    ))
    setDialogError('')
  }

  function handleLocationChange(locationId: string) {
    setForm((current) => ({
      ...current,
      locationId,
      patientId: '',
      sessionFee: defaultSessionFee,
      gabineteId: resolveGabineteForLocation(locationId, gabinetes),
    }))
  }

  function handlePatientChange(patientId: string) {
    setForm((current) => ({
      ...current,
      patientId,
      sessionFee: editingId
        ? current.sessionFee
        : resolveSessionFeeForPatient(patientId, patients, defaultSessionFee),
    }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!token) {
      setDialogError('Sessão expirada. Inicie sessão novamente.')
      return
    }
    if (!selectedDate) {
      setDialogError('Selecione um dia no calendário.')
      return
    }
    if (!form.patientId || !form.locationId || !form.gabineteId) {
      setDialogError('Selecione o local, o gabinete e o paciente.')
      return
    }
    if (roomConflict) {
      setDialogError(
        `${roomConflict.gabineteName} já está ocupado neste horário (${roomConflict.therapistName}).`,
      )
      return
    }
    if (form.repeatEnabled && !form.repeatUntil) {
      setDialogError('Indique a data final da repetição.')
      return
    }
    if (form.repeatEnabled && form.repeatUntil < selectedDate) {
      setDialogError('A data final da repetição deve ser igual ou posterior à primeira consulta.')
      return
    }

    setSubmitting(true)
    setDialogError('')
    try {
      const body = {
        patientId: form.patientId,
        locationId: form.locationId,
        gabineteId: form.gabineteId,
        date:
          editingId && editingAppointment?.recurrenceGroupId && editScope !== 'single'
            ? editingAppointment.date
            : editingId
              ? form.appointmentDate
              : selectedDate,
        time: form.time,
        durationMinutes: form.durationMinutes,
        sessionFee: form.sessionFee,
        notes: form.notes.trim() ? form.notes.trim() : null,
      }

      if (editingId) {
        const result = await therapistApi.updateAppointment(token, editingId, {
          ...body,
          scope: editingAppointment?.recurrenceGroupId ? editScope : undefined,
        })
        await loadMonth()
        if (selectedDate) {
          const occupancy = await therapistApi.getDayOccupancy(token, selectedDate)
          setDayOccupancy(occupancy.appointments)
        }
        if (result.updatedCount > 1) {
          window.alert(`${result.updatedCount} consultas atualizadas com sucesso.`)
        }
        cancelEdit()
      } else {
        const result = await therapistApi.createAppointment(token, {
          ...body,
          recurrence: form.repeatEnabled
            ? { cadence: form.repeatCadence, until: form.repeatUntil }
            : undefined,
        })
        await loadMonth()
        if (result.createdCount > 1) {
          window.alert(`${result.createdCount} consultas criadas com sucesso.`)
        }
        closeDialog()
      }
    } catch (err) {
      setDialogError(err instanceof ApiError ? err.message : 'Não foi possível guardar a consulta')
    } finally {
      setSubmitting(false)
    }
  }

  function requestDelete(appointment: AppointmentSummary) {
    if (appointment.recurrenceGroupId) {
      setPendingDelete(appointment)
      setDeleteScope('single')
      setDialogError('')
      return
    }

    if (window.confirm('Eliminar esta consulta?')) {
      void confirmDelete(appointment.id, 'single')
    }
  }

  async function confirmDelete(appointmentId: string, scope: AppointmentSeriesScope) {
    setSubmitting(true)
    setDialogError('')
    try {
      const result = await therapistApi.deleteAppointment(token, appointmentId, scope)
      if (editingId === appointmentId) {
        cancelEdit()
      }
      setPendingDelete(null)
      setDeleteScope('single')
      await loadMonth()
      if (result.deletedCount > 1) {
        window.alert(`${result.deletedCount} consultas eliminadas com sucesso.`)
      }
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

      {readOnly && <p className={layout.muted}>Modo consulta — não pode alterar marcações.</p>}

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
                            <span className={styles.appointmentChipLocation}>
                              {appointment.gabineteName} · {appointment.locationName}
                            </span>
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
                      {appointment.gabineteName} · {appointment.locationName}
                    </p>
                    <h3 className={styles.existingTitle}>
                      {appointment.patientName}
                      {appointment.recurrenceGroupId && (
                        <span className={styles.seriesBadge}>Série</span>
                      )}
                    </h3>
                    {appointment.notes && <p className={layout.muted}>{appointment.notes}</p>}
                    {!readOnly && (
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
                          onClick={() => requestDelete(appointment)}
                          disabled={submitting}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}

            {pendingDelete && (
              <div className={styles.seriesActionBox}>
                <p className={layout.muted}>
                  Esta consulta faz parte de uma série repetida. O que pretende eliminar?
                </p>
                <div className={styles.scopeOptions}>
                  {APPOINTMENT_SERIES_SCOPE_OPTIONS.map((option) => (
                    <label key={option.value} className={styles.scopeOption}>
                      <input
                        type="radio"
                        name="delete-scope"
                        value={option.value}
                        checked={deleteScope === option.value}
                        onChange={() => setDeleteScope(option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                <div className={styles.formActions}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => confirmDelete(pendingDelete.id, deleteScope)}
                    disabled={submitting}
                  >
                    {submitting ? 'A eliminar…' : 'Confirmar eliminação'}
                  </Button>
                  <button
                    type="button"
                    className={styles.textButton}
                    onClick={() => setPendingDelete(null)}
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {readOnly ? (
              selectedDayAppointments.length === 0 && (
                <p className={layout.muted}>Sem consultas neste dia.</p>
              )
            ) : (
              <>
                <hr className={styles.divider} />

                <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
              <h3>{editingId ? 'Editar consulta' : 'Nova consulta'}</h3>
              {editingAppointment?.recurrenceGroupId && (
                <div className={styles.seriesActionBox}>
                  <p className={layout.muted}>Esta consulta faz parte de uma série repetida.</p>
                  <div className={styles.scopeOptions}>
                    {APPOINTMENT_SERIES_SCOPE_OPTIONS.map((option) => (
                      <label key={option.value} className={styles.scopeOption}>
                        <input
                          type="radio"
                          name="edit-scope"
                          value={option.value}
                          checked={editScope === option.value}
                          onChange={() => setEditScope(option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  {editScope !== 'single' && (
                    <p className={layout.muted}>
                      A data de cada consulta mantém-se. Altera paciente, local, hora, duração e notas.
                    </p>
                  )}
                </div>
              )}
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
                    <label htmlFor="appointment-gabinete">Gabinete</label>
                    <select
                      id="appointment-gabinete"
                      value={form.gabineteId}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          gabineteId: event.target.value,
                        }))
                      }
                      disabled={!form.locationId || gabinetesForSelectedLocation.length === 0}
                    >
                      {!form.locationId ? (
                        <option value="">Selecione um local primeiro</option>
                      ) : gabinetesForSelectedLocation.length === 0 ? (
                        <option value="">Sem gabinetes neste local</option>
                      ) : (
                        gabinetesForSelectedLocation.map((gabinete) => (
                          <option key={gabinete.id} value={gabinete.id}>
                            {gabinete.name}
                          </option>
                        ))
                      )}
                    </select>
                    {roomConflict && (
                      <p className={layout.error}>
                        Ocupado por {roomConflict.therapistName} ({roomConflict.patientName}) neste horário.
                      </p>
                    )}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="appointment-patient">Paciente</label>
                    <select
                      id="appointment-patient"
                      value={form.patientId}
                      onChange={(event) => handlePatientChange(event.target.value)}
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
                  {editingId && (!editingAppointment?.recurrenceGroupId || editScope === 'single') && (
                    <div className={styles.field}>
                      <label htmlFor="appointment-date">Data</label>
                      <input
                        id="appointment-date"
                        type="date"
                        value={form.appointmentDate}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, appointmentDate: event.target.value }))
                        }
                      />
                    </div>
                  )}
                  <div className={styles.field}>
                    <label htmlFor="appointment-time">Hora</label>
                    <input
                      id="appointment-time"
                      type="time"
                      value={form.time}
                      onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))}
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
                    <label htmlFor="appointment-session-fee">Valor da consulta (€)</label>
                    <input
                      id="appointment-session-fee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.sessionFee}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          sessionFee: Number(event.target.value),
                        }))
                      }
                    />
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
                  {!editingId && (
                    <div className={styles.recurrenceSection}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={form.repeatEnabled}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              repeatEnabled: event.target.checked,
                              repeatUntil:
                                event.target.checked && selectedDate
                                  ? current.repeatUntil || addMonthsToIsoDate(selectedDate, 2)
                                  : current.repeatUntil,
                            }))
                          }
                        />
                        Repetir consulta
                      </label>
                      {form.repeatEnabled && (
                        <div className={styles.recurrenceFields}>
                          <div className={styles.field}>
                            <label htmlFor="appointment-cadence">Cadência</label>
                            <select
                              id="appointment-cadence"
                              value={form.repeatCadence}
                              onChange={(event) =>
                                setForm((current) => ({
                                  ...current,
                                  repeatCadence: event.target.value as RecurrenceCadence,
                                }))
                              }
                            >
                              {RECURRENCE_CADENCE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className={styles.field}>
                            <label htmlFor="appointment-repeat-until">Repetir até</label>
                            <input
                              id="appointment-repeat-until"
                              type="date"
                              value={form.repeatUntil}
                              min={selectedDate ?? undefined}
                              onChange={(event) =>
                                setForm((current) => ({ ...current, repeatUntil: event.target.value }))
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className={styles.formActions}>
                    {dialogError && <p className={`${layout.error} ${styles.formError}`}>{dialogError}</p>}
                    <div className={styles.formActionsRow}>
                    <Button
                      type="submit"
                      disabled={
                        submitting ||
                        !form.patientId ||
                        !form.locationId ||
                        !form.gabineteId ||
                        Boolean(roomConflict) ||
                        (form.repeatEnabled && !form.repeatUntil)
                      }
                    >
                      {submitting
                        ? 'A guardar…'
                        : editingId
                          ? 'Guardar alterações'
                          : form.repeatEnabled
                            ? 'Adicionar consultas'
                            : 'Adicionar consulta'}
                    </Button>
                    {editingId && (
                      <Button type="button" variant="outline" onClick={cancelEdit} disabled={submitting}>
                        Cancelar edição
                      </Button>
                    )}
                    </div>
                  </div>
                </>
              )}
            </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
