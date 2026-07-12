import { describe, expect, it } from 'vitest'
import { publicAsset } from './publicAsset'

describe('publicAsset', () => {
  it('prefixes paths with the Vite base URL', () => {
    expect(publicAsset('images/hero.png')).toBe(`${import.meta.env.BASE_URL}images/hero.png`)
    expect(publicAsset('/logo.png')).toBe(`${import.meta.env.BASE_URL}logo.png`)
  })
})
