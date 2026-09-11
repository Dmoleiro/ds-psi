import { describe, expect, it } from 'vitest'

function monthTotalHours(logs: Array<{ hours: number }>) {
  return logs.reduce((sum, log) => sum + log.hours, 0)
}

describe('intern work log totals', () => {
  it('sums hours for a month', () => {
    expect(monthTotalHours([{ hours: 4 }, { hours: 3.5 }, { hours: 2 }])).toBe(9.5)
  })
})
