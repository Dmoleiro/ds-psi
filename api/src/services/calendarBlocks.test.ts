import { describe, expect, it } from 'vitest'
import {
  blockOverlapsAppointment,
  formatCalendarBlock,
  parseBlockRange,
} from './calendarBlocks.js'

describe('calendarBlocks', () => {
  it('parses a valid block range on the same day', () => {
    const range = parseBlockRange('2026-09-09', '09:00', '12:00')
    expect(range).not.toBeNull()
    expect(range?.startsAt.toISOString()).toBe('2026-09-09T09:00:00.000Z')
    expect(range?.endsAt.toISOString()).toBe('2026-09-09T12:00:00.000Z')
  })

  it('rejects invalid block ranges', () => {
    expect(parseBlockRange('2026-09-09', '12:00', '09:00')).toBeNull()
    expect(parseBlockRange('invalid', '09:00', '12:00')).toBeNull()
  })

  it('detects overlap between blocks and appointments', () => {
    const block = formatCalendarBlock({
      id: 'block-1',
      startsAt: new Date('2026-09-09T09:00:00.000Z'),
      endsAt: new Date('2026-09-09T12:00:00.000Z'),
      title: 'Foco',
      notes: null,
    })

    expect(blockOverlapsAppointment(block, '2026-09-09', '10:00', 60)).toBe(true)
    expect(blockOverlapsAppointment(block, '2026-09-09', '08:00', 60)).toBe(false)
    expect(blockOverlapsAppointment(block, '2026-09-10', '10:00', 60)).toBe(false)
  })
})
