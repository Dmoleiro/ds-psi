import { describe, expect, it } from 'vitest'
import { services, site, therapist } from '../content/site.pt'

describe('site content', () => {
  it('has required contact information', () => {
    expect(site.email).toBe('danielasantos.consultas@gmail.com')
    expect(site.phone).toBe('966419142')
    expect(site.address.city).toBe('Azambuja')
  })

  it('lists all five services', () => {
    expect(services).toHaveLength(5)
    expect(services.map((s) => s.title)).toContain('Orientação Vocacional')
  })

  it('includes therapist timeline entries', () => {
    expect(therapist.timeline.length).toBeGreaterThan(5)
    expect(therapist.oppNumber).toBe('022377')
  })
})
