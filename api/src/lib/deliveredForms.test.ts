import { describe, expect, it } from 'vitest'
import {
  isFormDelivered,
  mergeDeliveredFormIds,
  sanitizeDeliveredFormIds,
  setFormDelivered,
} from './deliveredForms.js'

describe('deliveredForms', () => {
  it('sanitizes delivered form ids', () => {
    expect(sanitizeDeliveredFormIds([' sdq_por ', '', 1, null])).toEqual(['sdq_por'])
  })

  it('merges ids without duplicates', () => {
    expect(mergeDeliveredFormIds(['a'], ['b', 'a'])).toEqual(['a', 'b'])
  })

  it('toggles delivery state per form', () => {
    expect(setFormDelivered(['a'], 'b', true)).toEqual(['a', 'b'])
    expect(setFormDelivered(['a', 'b'], 'a', false)).toEqual(['b'])
  })

  it('checks delivery state', () => {
    expect(isFormDelivered(['brief'], 'brief')).toBe(true)
    expect(isFormDelivered(['brief'], 'sdq_por')).toBe(false)
  })
})
