import { describe, expect, it } from 'vitest'
import { buildCalendarUid, buildIcsEvent, buildRRuleLine, resolvePatientInviteEmails } from './icalendar.js'

describe('icalendar', () => {
  it('builds a REQUEST event with organizer and attendee', () => {
    const ics = buildIcsEvent({
      uid: buildCalendarUid('appt-1'),
      sequence: 0,
      method: 'REQUEST',
      summary: 'Consulta — Maria Silva',
      description: 'Notas internas',
      location: 'Clínica · Gabinete 1',
      scheduledAt: new Date(Date.UTC(2026, 7, 3, 10, 0, 0)),
      durationMinutes: 60,
      organizer: { name: 'Daniela Santos', email: 'daniela@example.com' },
      attendees: [{ name: 'Maria Silva', email: 'maria@example.com' }],
    })

    expect(ics).toContain('METHOD:REQUEST')
    expect(ics).toContain('UID:appt-1@danielasantos.work')
    expect(ics).toContain('ORGANIZER;CN=Daniela Santos:mailto:daniela@example.com')
    expect(ics).toContain('ATTENDEE')
    expect(ics).toContain('mailto:maria@example.com')
    expect(ics).toContain('DTSTART;TZID=Europe/Lisbon:20260803T100000')
    expect(ics).toContain('DTEND;TZID=Europe/Lisbon:20260803T110000')
  })

  it('builds a CANCEL event', () => {
    const ics = buildIcsEvent({
      uid: buildCalendarUid('appt-1'),
      sequence: 2,
      method: 'CANCEL',
      summary: 'Consulta — Maria Silva',
      scheduledAt: new Date(Date.UTC(2026, 7, 3, 10, 0, 0)),
      durationMinutes: 60,
      organizer: { name: 'Daniela Santos', email: 'daniela@example.com' },
      attendees: [{ name: 'Maria Silva', email: 'maria@example.com' }],
    })

    expect(ics).toContain('METHOD:CANCEL')
    expect(ics).toContain('SEQUENCE:2')
    expect(ics).toContain('STATUS:CANCELLED')
  })

  it('builds a recurring REQUEST event with RRULE', () => {
    const start = new Date(Date.UTC(2026, 7, 3, 10, 0, 0))
    const ics = buildIcsEvent({
      uid: buildCalendarUid('series-1'),
      sequence: 0,
      method: 'REQUEST',
      summary: 'Consulta — Maria Silva',
      scheduledAt: start,
      durationMinutes: 60,
      organizer: { name: 'Daniela Santos', email: 'daniela@example.com' },
      attendees: [{ name: 'Maria Silva', email: 'maria@example.com' }],
      recurrence: { cadence: 'weekly', until: '2026-08-21' },
    })

    expect(ics).toContain('RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=20260821T100000')
    expect(ics).toContain('UID:series-1@danielasantos.work')
  })

  it('builds biweekly RRULE', () => {
    const start = new Date(Date.UTC(2026, 7, 3, 10, 0, 0))
    expect(buildRRuleLine({ cadence: 'biweekly', until: '2026-08-21' }, start)).toBe(
      'RRULE:FREQ=WEEKLY;INTERVAL=2;UNTIL=20260821T100000',
    )
  })

  it('builds EXDATE lines for cancelled occurrences', () => {
    const ics = buildIcsEvent({
      uid: buildCalendarUid('series-1'),
      sequence: 1,
      method: 'REQUEST',
      summary: 'Consulta — Maria Silva',
      scheduledAt: new Date(Date.UTC(2026, 7, 3, 10, 0, 0)),
      durationMinutes: 60,
      organizer: { name: 'Daniela Santos', email: 'daniela@example.com' },
      attendees: [{ name: 'Maria Silva', email: 'maria@example.com' }],
      recurrence: { cadence: 'weekly', until: '2026-08-21' },
      exdates: [new Date(Date.UTC(2026, 7, 10, 10, 0, 0))],
    })

    expect(ics).toContain('EXDATE;TZID=Europe/Lisbon:20260810T100000')
  })

  it('builds an import copy for the organizer without attendees', () => {
    const ics = buildIcsEvent({
      uid: buildCalendarUid('appt-1'),
      sequence: 0,
      method: 'REQUEST',
      delivery: 'import',
      summary: 'Consulta — Maria Silva',
      scheduledAt: new Date(Date.UTC(2026, 7, 3, 10, 0, 0)),
      durationMinutes: 60,
      organizer: { name: 'Daniela Santos', email: 'daniela@example.com' },
      attendees: [],
    })

    expect(ics).toContain('METHOD:PUBLISH')
    expect(ics).not.toContain('ATTENDEE')
    expect(ics).toContain('ORGANIZER;CN=Daniela Santos:mailto:daniela@example.com')
  })

  it('resolves patient invite emails', () => {
    expect(
      resolvePatientInviteEmails(
        { email: 'a@example.com', email2: 'b@example.com' },
        'both',
      ),
    ).toEqual(['a@example.com', 'b@example.com'])
  })
})
