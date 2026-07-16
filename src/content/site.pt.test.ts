import { describe, expect, it } from 'vitest'
import { legal, services, site, social, therapist } from '../content/site.pt'

describe('site content', () => {
  it('has required contact information', () => {
    expect(site.email).toBe('danielasantos.consultas@gmail.com')
    expect(site.address.city).toBe('Azambuja')
  })

  it('lists all five services', () => {
    expect(services).toHaveLength(5)
    expect(services.map((s) => s.title)).toContain('Orientação Vocacional')
  })

  it('includes therapist timeline entries', () => {
    expect(therapist.timeline.length).toBeGreaterThan(5)
    expect(therapist.role).toBe('Diretora Clínica')
    expect(therapist.oppNumber).toBe('022377')
  })

  it('links to the data protection PDF with the site base URL', () => {
    expect(legal.dataProtection.label).toContain('proteção de dados')
    expect(legal.dataProtection.href).toBe(
      `${import.meta.env.BASE_URL}docs/consentimento-e-protecao-dados-2026.pdf`,
    )
  })

  it('links to the pricing PDF with the site base URL', () => {
    expect(legal.pricing.label).toBe('Preçários das consultas')
    expect(legal.pricing.href).toBe(
      `${import.meta.env.BASE_URL}docs/precarios-consultas-povoa-santa-iria-2026.pdf`,
    )
  })

  it('includes the cookie policy label', () => {
    expect(legal.cookies.label).toBe('Política de Cookies')
  })

  it('includes social and complaints book links', () => {
    expect(social.instagram.href).toBe('https://www.instagram.com/danielasantos.psicologia')
    expect(social.facebook.href).toBe('https://www.facebook.com/daniela.santos.963434')
    expect(social.complaintsBook.href).toBe('https://www.livroreclamacoes.pt/inicio')
  })
})
