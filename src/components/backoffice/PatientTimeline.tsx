import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ApiError, coordinatorApi, therapistApi, type PatientTimeline, type PatientTimelineEvent } from '../../lib/api'
import { STATUS_LABELS } from '../../lib/attendance'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import styles from './PatientTimeline.module.css'

type Props = {
  token: string
  patientId: string
  readOnly: boolean
  onOpenIntakeTab?: () => void
}

function formatTimelineWhen(iso: string, dateOnly = false): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso

  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Lisbon' }).format(new Date())
  const eventDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Lisbon' }).format(date)

  const label = new Intl.DateTimeFormat('pt-PT', {
    timeZone: 'Europe/Lisbon',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  }).format(date)

  if (dateOnly) {
    if (eventDay === today) return 'Hoje'
    return label
  }

  const time = new Intl.DateTimeFormat('pt-PT', {
    timeZone: 'Europe/Lisbon',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)

  if (eventDay === today) return `Hoje · ${time}`
  return `${label} · ${time}`
}

function eventBadgeVariant(event: PatientTimelineEvent): 'default' | 'muted' | 'accent' {
  if (event.kind === 'appointment_upcoming') return 'accent'
  if (event.kind === 'form_submitted') return 'accent'
  if (event.attendanceStatus === 'absent') return 'muted'
  if (event.attendanceStatus === 'present_unpaid') return 'accent'
  return 'default'
}

function TimelineEventRow({
  event,
  onOpenIntakeTab,
}: {
  event: PatientTimelineEvent
  onOpenIntakeTab?: () => void
}) {
  const when = formatTimelineWhen(event.occurredAt, event.kind === 'attendance')

  let action: ReactNode = null
  if (event.appointmentId) {
    action = (
      <Link
        to={`/backoffice/appointments?appointmentId=${encodeURIComponent(event.appointmentId)}`}
        className={styles.eventLink}
      >
        Ver consulta
      </Link>
    )
  } else if (event.kind === 'attendance') {
    action = (
      <Link to="/backoffice/attendance" className={styles.eventLink}>
        Ver presenças
      </Link>
    )
  } else if (event.sessionId && onOpenIntakeTab) {
    action = (
      <button type="button" className={styles.eventLinkButton} onClick={onOpenIntakeTab}>
        Ver formulários
      </button>
    )
  }

  const badgeLabel =
    event.attendanceStatus != null
      ? STATUS_LABELS[event.attendanceStatus]
      : event.kind === 'form_submitted'
        ? 'Formulário'
        : event.kind === 'appointment_upcoming'
          ? 'Próxima'
          : 'Consulta'

  return (
    <li className={styles.event}>
      <div className={styles.eventMarker} aria-hidden />
      <div className={styles.eventBody}>
        <div className={styles.eventHeader}>
          <span className={styles.eventWhen}>{when}</span>
          <Badge variant={eventBadgeVariant(event)}>{badgeLabel}</Badge>
        </div>
        <p className={styles.eventTitle}>{event.title}</p>
        {event.detail && <p className={styles.eventDetail}>{event.detail}</p>}
        {action}
      </div>
    </li>
  )
}

export function PatientTimelinePanel({ token, patientId, readOnly, onOpenIntakeTab }: Props) {
  const [timeline, setTimeline] = useState<PatientTimeline | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    const request = readOnly
      ? coordinatorApi.getPatientTimeline(token, patientId)
      : therapistApi.getPatientTimeline(token, patientId)

    request
      .then((data) => setTimeline(data))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Não foi possível carregar o histórico'))
      .finally(() => setLoading(false))
  }, [token, patientId, readOnly])

  if (loading) {
    return (
      <Card as="section" className={styles.card}>
        <h2 className={styles.title}>Histórico recente</h2>
        <p className={styles.muted}>A carregar…</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card as="section" className={styles.card}>
        <h2 className={styles.title}>Histórico recente</h2>
        <p className={styles.error}>{error}</p>
      </Card>
    )
  }

  if (!timeline) return null

  const hasContent = timeline.nextAppointment || timeline.events.length > 0

  return (
    <Card as="section" className={styles.card}>
      <h2 className={styles.title}>Histórico recente</h2>
      <p className={styles.subtitle}>Consultas, presenças e formulários deste utente</p>

      {!hasContent ? (
        <p className={styles.muted}>Ainda não há consultas, presenças ou formulários registados.</p>
      ) : (
        <>
          {timeline.nextAppointment && (
            <div className={styles.nextAppointment}>
              <p className={styles.nextLabel}>Próxima consulta</p>
              <p className={styles.nextDetail}>{timeline.nextAppointment.detail}</p>
              {timeline.nextAppointment.appointmentId && (
                <Link
                  to={`/backoffice/appointments?appointmentId=${encodeURIComponent(timeline.nextAppointment.appointmentId)}`}
                  className={styles.nextLink}
                >
                  Abrir na agenda
                </Link>
              )}
            </div>
          )}

          {timeline.events.length > 0 && (
            <ol className={styles.list}>
              {timeline.events.map((event) => (
                <TimelineEventRow key={event.id} event={event} onOpenIntakeTab={onOpenIntakeTab} />
              ))}
            </ol>
          )}
        </>
      )}
    </Card>
  )
}
