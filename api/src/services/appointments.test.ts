import { describe, expect, it } from 'vitest'
import { buildSeriesWhere, generateRecurrenceDates } from './appointments.js'

describe('generateRecurrenceDates', () => {
  it('returns only the start date when end date matches', () => {
    expect(generateRecurrenceDates('2026-07-17', '2026-07-17', 'weekly')).toEqual(['2026-07-17'])
  })

  it('generates weekly dates until the end date', () => {
    expect(generateRecurrenceDates('2026-07-01', '2026-07-22', 'weekly')).toEqual([
      '2026-07-01',
      '2026-07-08',
      '2026-07-15',
      '2026-07-22',
    ])
  })

  it('generates bi-weekly dates', () => {
    expect(generateRecurrenceDates('2026-07-01', '2026-07-29', 'biweekly')).toEqual([
      '2026-07-01',
      '2026-07-15',
      '2026-07-29',
    ])
  })

  it('generates monthly dates', () => {
    expect(generateRecurrenceDates('2026-01-15', '2026-03-15', 'monthly')).toEqual([
      '2026-01-15',
      '2026-02-15',
      '2026-03-15',
    ])
  })

  it('returns empty when end date is before start date', () => {
    expect(generateRecurrenceDates('2026-07-20', '2026-07-10', 'weekly')).toEqual([])
  })
})

describe('buildSeriesWhere', () => {
  const therapistId = 'therapist-1'
  const groupId = 'group-1'
  const anchor = new Date('2026-07-15T09:00:00.000Z')

  it('filters an entire series', () => {
    expect(buildSeriesWhere(therapistId, groupId, anchor, 'series')).toEqual({
      therapistId,
      recurrenceGroupId: groupId,
    })
  })

  it('filters this and following appointments', () => {
    expect(buildSeriesWhere(therapistId, groupId, anchor, 'following')).toEqual({
      therapistId,
      recurrenceGroupId: groupId,
      scheduledAt: { gte: anchor },
    })
  })
})
