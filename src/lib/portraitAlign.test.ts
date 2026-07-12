import { describe, expect, it } from 'vitest'
import { portraitAlignStyle } from './portraitAlign'

describe('portraitAlignStyle', () => {
  it('returns undefined when no alignment is set', () => {
    expect(portraitAlignStyle(undefined)).toBeUndefined()
    expect(portraitAlignStyle({})).toBeUndefined()
  })

  it('builds a transform from scale and offsets', () => {
    expect(portraitAlignStyle({ scale: 1.2, x: -8, y: -1 })).toEqual({
      transform: 'scale(1.2) translate3d(-8%, -1%, 0)',
      transformOrigin: 'center center',
    })
  })

  it('defaults scale when only x or y is provided', () => {
    expect(portraitAlignStyle({ x: -5 })).toEqual({
      transform: 'scale(1.15) translate3d(-5%, 0%, 0)',
      transformOrigin: 'center center',
    })
  })

  it('clamps extreme offsets that would push the photo out of frame', () => {
    expect(portraitAlignStyle({ scale: 1.15, x: -55, y: 50 })).toEqual({
      transform: 'scale(1.15) translate3d(-40%, 40%, 0)',
      transformOrigin: 'center center',
    })
  })
})
