import { describe, expect, it } from 'vitest'
import { formatWorkshopDate, isWorkshopUpcoming } from './workshopDates.js'

describe('workshopDates', () => {
  it('treats today as upcoming', () => {
    const today = formatWorkshopDate(new Date())
    expect(isWorkshopUpcoming(new Date(`${today}T12:00:00.000Z`))).toBe(true)
  })

  it('treats yesterday as past', () => {
    const yesterday = new Date()
    yesterday.setUTCDate(yesterday.getUTCDate() - 1)
    expect(isWorkshopUpcoming(yesterday)).toBe(false)
  })
})
