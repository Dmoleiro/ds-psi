import { describe, expect, it } from 'vitest'
import { setCoordinatorTherapists } from './coordinatorTherapists.js'

describe('coordinatorTherapists service', () => {
  it('exports assignment helpers', () => {
    expect(typeof setCoordinatorTherapists).toBe('function')
  })
})
