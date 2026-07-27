import { useEffect, useMemo, useRef, useState } from 'react'
import { Card } from '../ui/Card'
import { therapistApi, type LocationDaySchedule, type LocationSummary } from '../../lib/api'
import {
  formatAppointmentRange,
  formatDayLabel,
  formatMonthTitle,
  getCalendarCells,
  LOCATION_DAY_GRID_END_MINUTES,
  LOCATION_DAY_GRID_START_MINUTES,
  LOCATION_DAY_PIXELS_PER_MINUTE,
  parseTimeToMinutes,
  shiftMonth,
  therapistScheduleColor,
  WEEKDAY_LABELS,
} from '../../lib/appointments'
import { getTodayInLisbon } from '../../lib/workshopDates'
import styles from './LocationDayCalendar.module.css'

type Props = {
  token: string
}

const HOUR_LABELS = Array.from(
  { length: (LOCATION_DAY_GRID_END_MINUTES - LOCATION_DAY_GRID_START_MINUTES) / 60 + 1 },
  (_, index) => {
    const minutes = LOCATION_DAY_GRID_START_MINUTES + index * 60
    const hours = Math.floor(minutes / 60)
    return `${String(hours).padStart(2, '0')}:00`
  },
)

const GRID_HEIGHT =
  (LOCATION_DAY_GRID_END_MINUTES - LOCATION_DAY_GRID_START_MINUTES) * LOCATION_DAY_PIXELS_PER_MINUTE

function appointmentBlockStyle(time: string, durationMinutes: number) {
  const startMinutes = parseTimeToMinutes(time)
  const clampedStart = Math.max(startMinutes, LOCATION_DAY_GRID_START_MINUTES)
  const clampedEnd = Math.min(startMinutes + durationMinutes, LOCATION_DAY_GRID_END_MINUTES)
  const visibleDuration = Math.max(clampedEnd - clampedStart, 0)

  return {
    top: (clampedStart - LOCATION_DAY_GRID_START_MINUTES) * LOCATION_DAY_PIXELS_PER_MINUTE,
    height: Math.max(visibleDuration * LOCATION_DAY_PIXELS_PER_MINUTE, 28),
  }
}

export function LocationDayCalendar({ token }: Props) {
  const [locations, setLocations] = useState<LocationSummary[]>([])
  const [locationId, setLocationId] = useState('')
  const [date, setDate] = useState(getTodayInLisbon)
  const [schedule, setSchedule] = useState<LocationDaySchedule | null>(null)
  const [monthAppointmentDates, setMonthAppointmentDates] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerYear, setPickerYear] = useState(() => Number(getTodayInLisbon().slice(0, 4)))
  const [pickerMonth, setPickerMonth] = useState(() => Number(getTodayInLisbon().slice(5, 7)))
  const pickerRef = useRef<HTMLDivElement>(null)

  const todayIso = getTodayInLisbon()

  useEffect(() => {
    setPickerYear(Number(date.slice(0, 4)))
    setPickerMonth(Number(date.slice(5, 7)))
  }, [date])

  useEffect(() => {
    if (!pickerOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setPickerOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setPickerOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [pickerOpen])

  useEffect(() => {
    therapistApi
      .listLocations(token)
      .then((data) => {
        setLocations(data.locations)
        if (data.locations.length > 0) {
          setLocationId((current) => current || data.locations[0].id)
        }
      })
      .catch(() => setError('Não foi possível carregar os locais.'))
  }, [token])

  useEffect(() => {
    if (!locationId) {
      setSchedule(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    therapistApi
      .getLocationDaySchedule(token, date, locationId)
      .then(setSchedule)
      .catch(() => setError('Não foi possível carregar a agenda do local.'))
      .finally(() => setLoading(false))
  }, [token, date, locationId])

  useEffect(() => {
    if (!locationId || !pickerOpen) return

    therapistApi
      .listAppointments(token, pickerYear, pickerMonth, locationId)
      .then((data) => {
        setMonthAppointmentDates(new Set(data.appointments.map((appointment) => appointment.date)))
      })
      .catch(() => setMonthAppointmentDates(new Set()))
  }, [token, locationId, pickerYear, pickerMonth, pickerOpen])

  const pickerWeeks = useMemo(() => {
    const cells = getCalendarCells(pickerYear, pickerMonth)
    const weeks: ReturnType<typeof getCalendarCells>[] = []
    for (let index = 0; index < cells.length; index += 7) {
      weeks.push(cells.slice(index, index + 7))
    }
    return weeks
  }, [pickerYear, pickerMonth])

  function changePickerMonth(delta: number) {
    const next = shiftMonth(pickerYear, pickerMonth, delta)
    setPickerYear(next.year)
    setPickerMonth(next.month)
  }

  function selectDate(nextDate: string) {
    setDate(nextDate)
    setPickerOpen(false)
  }

  const therapistLegend = useMemo(() => {
    if (!schedule) return []
    const map = new Map<string, string>()
    for (const appointment of schedule.appointments) {
      map.set(appointment.therapistId, appointment.therapistName)
    }
    return [...map.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-PT'))
  }, [schedule])

  const appointmentsByGabinete = useMemo(() => {
    const map = new Map<string, LocationDaySchedule['appointments']>()
    if (!schedule) return map
    for (const gabinete of schedule.gabinetes) {
      map.set(gabinete.id, [])
    }
    for (const appointment of schedule.appointments) {
      const list = map.get(appointment.gabineteId) ?? []
      list.push(appointment)
      map.set(appointment.gabineteId, list)
    }
    return map
  }, [schedule])

  if (locations.length === 0 && !loading && !error) {
    return null
  }

  return (
    <Card as="section" className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Agenda do local</h2>
          <p className={styles.subtitle}>
            Consultas de todos os terapeutas, por gabinete e horário.
          </p>
        </div>
        <div className={styles.controls}>
          <label className={`${styles.field} ${styles.fieldLocation}`}>
            <span className={styles.fieldLabel}>Local</span>
            <select
              className={styles.controlInput}
              value={locationId}
              onChange={(event) => setLocationId(event.target.value)}
            >
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>
          <div className={`${styles.field} ${styles.fieldDate}`}>
            <span className={styles.fieldLabel}>Dia</span>
            <div className={styles.datePicker} ref={pickerRef}>
              <button
                type="button"
                className={`${styles.controlInput} ${styles.dateTrigger} ${pickerOpen ? styles.dateTriggerOpen : ''}`}
                onClick={() => setPickerOpen((open) => !open)}
                aria-expanded={pickerOpen}
                aria-haspopup="dialog"
                aria-label={`Dia selecionado: ${formatDayLabel(date)}`}
              >
                <span className={styles.dateTriggerLabel}>{formatDayLabel(date)}</span>
                <span className={styles.dateTriggerIcon} aria-hidden>
                  ▾
                </span>
              </button>
            {pickerOpen && (
              <div className={styles.datePopover} role="dialog" aria-label="Selecionar dia">
                <div className={styles.pickerHeader}>
                  <button
                    type="button"
                    className={styles.pickerNavButton}
                    onClick={() => changePickerMonth(-1)}
                    aria-label="Mês anterior"
                  >
                    ‹
                  </button>
                  <span className={styles.pickerMonth}>{formatMonthTitle(pickerYear, pickerMonth)}</span>
                  <button
                    type="button"
                    className={styles.pickerNavButton}
                    onClick={() => changePickerMonth(1)}
                    aria-label="Mês seguinte"
                  >
                    ›
                  </button>
                </div>
                {date !== todayIso && (
                  <button
                    type="button"
                    className={styles.todayButton}
                    onClick={() => selectDate(todayIso)}
                  >
                    Ir para hoje
                  </button>
                )}
                <div className={styles.pickerWeekdays}>
                  {WEEKDAY_LABELS.map((label) => (
                    <span key={label} className={styles.pickerWeekday}>
                      {label}
                    </span>
                  ))}
                </div>
                <div className={styles.pickerGrid}>
                  {pickerWeeks.map((week, weekIndex) =>
                    week.map((cell, cellIndex) => {
                      if (!cell.inMonth || !cell.date) {
                        return (
                          <span
                            key={`${weekIndex}-${cellIndex}`}
                            className={`${styles.pickerDay} ${styles.pickerDayOutside}`}
                            aria-hidden
                          />
                        )
                      }

                      const isSelected = cell.date === date
                      const isToday = cell.date === todayIso
                      const hasAppointments = monthAppointmentDates.has(cell.date)

                      return (
                        <button
                          key={cell.date}
                          type="button"
                          className={`${styles.pickerDay} ${isSelected ? styles.pickerDaySelected : ''} ${isToday ? styles.pickerDayToday : ''}`}
                          onClick={() => selectDate(cell.date!)}
                          aria-label={formatDayLabel(cell.date)}
                          aria-pressed={isSelected}
                        >
                          <span className={styles.pickerDayNumber}>{cell.day}</span>
                          {hasAppointments && <span className={styles.pickerDayDot} aria-hidden />}
                        </button>
                      )
                    }),
                  )}
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <Card className={styles.loadingCard}>
          <p>A carregar agenda…</p>
        </Card>
      ) : schedule ? (
        <>
          {therapistLegend.length > 0 && (
            <ul className={styles.legend} aria-label="Terapeutas">
              {therapistLegend.map((therapist) => {
                const color = therapistScheduleColor(therapist.id)
                return (
                  <li key={therapist.id} className={styles.legendItem}>
                    <span
                      className={styles.legendSwatch}
                      style={{ background: color.bg, borderColor: color.border }}
                    />
                    {therapist.name}
                  </li>
                )
              })}
            </ul>
          )}

          {schedule.gabinetes.length === 0 ? (
            <Card className={styles.emptyCard}>
              <p>Este local ainda não tem gabinetes configurados.</p>
            </Card>
          ) : (
            <div className={styles.gridScroll}>
              <div
                className={styles.grid}
                style={{
                  gridTemplateColumns: `4.75rem repeat(${schedule.gabinetes.length}, minmax(9rem, 1fr))`,
                }}
              >
                <div className={styles.corner} />
                {schedule.gabinetes.map((gabinete) => (
                  <div key={gabinete.id} className={styles.gabineteHeader}>
                    {gabinete.name}
                  </div>
                ))}

                <div className={styles.timeColumn} style={{ height: GRID_HEIGHT }}>
                  {HOUR_LABELS.map((label, index) => (
                    <span
                      key={label}
                      className={styles.timeLabel}
                      style={{
                        top: index * 60 * LOCATION_DAY_PIXELS_PER_MINUTE,
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {schedule.gabinetes.map((gabinete) => {
                  const appointments = appointmentsByGabinete.get(gabinete.id) ?? []
                  return (
                    <div
                      key={gabinete.id}
                      className={styles.gabineteColumn}
                      style={{ height: GRID_HEIGHT }}
                    >
                      {appointments.map((appointment) => {
                        const color = therapistScheduleColor(appointment.therapistId)
                        const blockStyle = appointmentBlockStyle(
                          appointment.time,
                          appointment.durationMinutes,
                        )
                        return (
                          <article
                            key={appointment.id}
                            className={styles.appointment}
                            style={{
                              ...blockStyle,
                              background: color.bg,
                              borderColor: color.border,
                              color: color.text,
                            }}
                            title={`${appointment.patientName} — ${appointment.therapistName}`}
                          >
                            <span className={styles.appointmentTime}>
                              {formatAppointmentRange(appointment.time, appointment.durationMinutes)}
                            </span>
                            <strong className={styles.appointmentPatient}>{appointment.patientName}</strong>
                            <span className={styles.appointmentTherapist}>{appointment.therapistName}</span>
                          </article>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {schedule.appointments.length === 0 && schedule.gabinetes.length > 0 && (
            <p className={styles.emptyDay}>Sem consultas marcadas neste dia.</p>
          )}
        </>
      ) : null}
    </Card>
  )
}
