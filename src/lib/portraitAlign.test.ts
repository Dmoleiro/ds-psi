import { describe, expect, it } from 'vitest'
import { portraitAlignStyle, portraitLayerAlignStyle } from './portraitAlign'

describe('portraitAlignStyle', () => {
  it('returns undefined when no alignment is set', () => {
    expect(portraitAlignStyle(undefined)).toBeUndefined()
    expect(portraitAlignStyle({})).toBeUndefined()
    expect(portraitAlignStyle({ layer: true, x: -5 })).toBeUndefined()
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

describe('portraitLayerAlignStyle', () => {
  it('only applies when layer mode is enabled', () => {
    expect(portraitLayerAlignStyle({ x: -5 })).toBeUndefined()
    expect(portraitLayerAlignStyle({ layer: true, x: -5 })).toEqual({
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: '143.75%',
      height: '143.75%',
      transform: 'translate(calc(-50% + -5%), calc(-50% + 0%))',
    })
  })

  it('supports explicit layer frame overrides', () => {
    expect(
      portraitLayerAlignStyle({
        layer: true,
        layerFrame: {
          width: '161.76%',
          height: '221.76%',
          transform: 'translate(calc(-70%), calc(-31%))',
        },
      }),
    ).toEqual({
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: '161.76%',
      height: '221.76%',
      transform: 'translate(calc(-70%), calc(-31%))',
    })
  })
})
