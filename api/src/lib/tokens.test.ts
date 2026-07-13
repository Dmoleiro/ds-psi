import { describe, expect, it } from 'vitest'
import { generatePatientToken, hashPatientToken, buildPatientUrl } from './tokens.js'

describe('patient tokens', () => {
  it('generates unique tokens and stable hashes', () => {
    const a = generatePatientToken()
    const b = generatePatientToken()
    expect(a).not.toBe(b)
    expect(hashPatientToken(a)).toHaveLength(64)
    expect(hashPatientToken(a)).toBe(hashPatientToken(a))
  })

  it('builds patient URLs', () => {
    expect(buildPatientUrl('abc', 'https://danielasantos.work')).toBe(
      'https://danielasantos.work/formularios/p/abc',
    )
  })
})
