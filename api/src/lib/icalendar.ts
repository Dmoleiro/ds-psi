import { formatDateOnly, parseDateOnly } from '../services/attendance.js'

export const ICALENDAR_DOMAIN = 'danielasantos.work'
export const ICALENDAR_TIMEZONE = 'Europe/Lisbon'

export type IcsInviteMethod = 'REQUEST' | 'CANCEL'
export type IcsEmailMethod = IcsInviteMethod | 'PUBLISH'
export type IcsDeliveryMode = 'invite' | 'import'

export type IcsRecurrenceCadence = 'weekly' | 'biweekly' | 'monthly'

export type IcsRecurrence = {
  cadence: IcsRecurrenceCadence
  until: string
}

export type IcsAttendee = {
  name: string
  email: string
}

export type IcsEventInput = {
  uid: string
  sequence: number
  method: IcsInviteMethod
  summary: string
  description?: string | null
  location?: string | null
  scheduledAt: Date
  durationMinutes: number
  organizer: IcsAttendee
  attendees: IcsAttendee[]
  delivery?: IcsDeliveryMode
  recurrence?: IcsRecurrence
  recurrenceId?: Date
  exdates?: Date[]
}

function formatAppointmentDate(scheduledAt: Date): string {
  return formatDateOnly(scheduledAt)
}

function formatAppointmentTime(scheduledAt: Date): string {
  const hours = String(scheduledAt.getUTCHours()).padStart(2, '0')
  const minutes = String(scheduledAt.getUTCMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

function parseScheduledAt(date: string, time: string): Date | null {
  const day = parseDateOnly(date)
  if (!day) return null
  const match = /^(\d{1,2}):(\d{2})$/.exec(time)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  return new Date(
    Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hours, minutes, 0),
  )
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

function foldLine(line: string): string {
  const chunks: string[] = []
  let remaining = line
  chunks.push(remaining.slice(0, 75))
  remaining = remaining.slice(75)
  while (remaining.length > 0) {
    chunks.push(` ${remaining.slice(0, 74)}`)
    remaining = remaining.slice(74)
  }
  return chunks.join('\r\n')
}

function formatIcsDateTime(scheduledAt: Date): string {
  const date = formatAppointmentDate(scheduledAt).replace(/-/g, '')
  const time = formatAppointmentTime(scheduledAt).replace(/:/g, '')
  return `${date}T${time}00`
}

function addMinutesToLocalTime(scheduledAt: Date, durationMinutes: number): string {
  const date = formatAppointmentDate(scheduledAt)
  const time = formatAppointmentTime(scheduledAt)
  const [hours, minutes] = time.split(':').map(Number)
  const total = hours * 60 + minutes + durationMinutes
  const endHours = Math.floor(total / 60) % 24
  const endMinutes = total % 60
  const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`
  return `${date.replace(/-/g, '')}T${endTime.replace(/:/g, '')}00`
}

function formatAttendee(attendee: IcsAttendee): string {
  return foldLine(
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${escapeIcsText(attendee.name)}:mailto:${attendee.email}`,
  )
}

export function buildCalendarUid(id: string): string {
  return `${id}@${ICALENDAR_DOMAIN}`
}

export function buildRRuleLine(recurrence: IcsRecurrence, startScheduledAt: Date): string {
  const untilAt = parseScheduledAt(recurrence.until, formatAppointmentTime(startScheduledAt))
  if (!untilAt) {
    throw new Error('INVALID_RECURRENCE_UNTIL')
  }
  const until = formatIcsDateTime(untilAt)

  if (recurrence.cadence === 'monthly') {
    return `RRULE:FREQ=MONTHLY;UNTIL=${until}`
  }

  const interval = recurrence.cadence === 'biweekly' ? 2 : 1
  return `RRULE:FREQ=WEEKLY;INTERVAL=${interval};UNTIL=${until}`
}

function formatExdate(scheduledAt: Date): string {
  return `EXDATE;TZID=${ICALENDAR_TIMEZONE}:${formatIcsDateTime(scheduledAt)}`
}

export function buildIcsEvent(input: IcsEventInput): string {
  const delivery = input.delivery ?? 'invite'
  const calendarMethod: IcsEmailMethod =
    delivery === 'import' && input.method === 'REQUEST' ? 'PUBLISH' : input.method
  const attendees = delivery === 'import' ? [] : input.attendees

  const dtStamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')
  const dtStart = formatIcsDateTime(input.scheduledAt)
  const dtEnd = addMinutesToLocalTime(input.scheduledAt, input.durationMinutes)
  const status = input.method === 'CANCEL' ? 'STATUS:CANCELLED' : 'STATUS:CONFIRMED'

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Daniela Santos Psicologia//Consultas//PT',
    'CALSCALE:GREGORIAN',
    `METHOD:${calendarMethod}`,
    'BEGIN:VEVENT',
    `UID:${input.uid}`,
    `SEQUENCE:${input.sequence}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=${ICALENDAR_TIMEZONE}:${dtStart}`,
    `DTEND;TZID=${ICALENDAR_TIMEZONE}:${dtEnd}`,
    foldLine(`SUMMARY:${escapeIcsText(input.summary)}`),
    foldLine(
      `ORGANIZER;CN=${escapeIcsText(input.organizer.name)}:mailto:${input.organizer.email}`,
    ),
    ...attendees.map(formatAttendee),
    status,
  ]

  if (input.recurrenceId) {
    lines.splice(
      10,
      0,
      `RECURRENCE-ID;TZID=${ICALENDAR_TIMEZONE}:${formatIcsDateTime(input.recurrenceId)}`,
    )
  } else if (input.recurrence) {
    lines.push(buildRRuleLine(input.recurrence, input.scheduledAt))
  }

  if (input.exdates?.length) {
    for (const exdate of input.exdates) {
      lines.push(formatExdate(exdate))
    }
  }

  if (input.location?.trim()) {
    lines.push(foldLine(`LOCATION:${escapeIcsText(input.location.trim())}`))
  }
  if (input.description?.trim()) {
    lines.push(foldLine(`DESCRIPTION:${escapeIcsText(input.description.trim())}`))
  }

  lines.push('END:VEVENT', 'END:VCALENDAR')
  return `${lines.join('\r\n')}\r\n`
}

export function resolvePatientInviteEmails(
  patient: { email: string | null; email2: string | null },
  recipients: 'email' | 'email2' | 'both',
): string[] {
  const emails = new Set<string>()
  if (recipients === 'email' || recipients === 'both') {
    if (patient.email?.trim()) emails.add(patient.email.trim())
  }
  if (recipients === 'email2' || recipients === 'both') {
    if (patient.email2?.trim()) emails.add(patient.email2.trim())
  }
  return [...emails]
}

export function resolveIcsEmailMethod(
  inviteMethod: IcsInviteMethod,
  delivery: IcsDeliveryMode = 'invite',
): IcsEmailMethod {
  return delivery === 'import' && inviteMethod === 'REQUEST' ? 'PUBLISH' : inviteMethod
}

export function resolveIcsDeliveryForRecipient(
  inviteMethod: IcsInviteMethod,
  recipientEmail: string,
  organizerEmail: string,
): IcsDeliveryMode {
  if (inviteMethod !== 'REQUEST') return 'invite'
  return recipientEmail.toLowerCase() === organizerEmail.toLowerCase() ? 'import' : 'invite'
}
