import { describe, expect, it } from 'vitest'
import { accreditations, legal, services, site, social, therapist } from '../content/site.pt'

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
      `${import.meta.env.BASE_URL}docs/precarios-consultas-2026.pdf`,
    )
  })

  it('includes the cookie policy label', () => {
    expect(legal.cookies.label).toBe('Política de Cookies')
  })

  it('includes accreditation logos for regulatory bodies', () => {
    const opp = accreditations.find((item) => item.id === 'opp')
    expect(opp?.image).toContain('images/accreditations/opp-member.png')
    expect(opp?.imageAlt).toContain('022377')
  })

  it('includes social links', () => {
    expect(social.instagram.href).toBe('https://www.instagram.com/danielasantos.psicologia')
    expect(social.facebook.href).toBe('https://www.facebook.com/daniela.santos.963434')
  })

  it('includes accreditation and complaints book entries', () => {
    const complaintsBook = accreditations.find((item) => item.id === 'complaints-book')
    expect(complaintsBook?.href).toBe('https://www.livroreclamacoes.pt/inicio')
    expect(complaintsBook?.image).toContain('livro-reclamacoes.png')

    const ers = accreditations.find((item) => item.id === 'ers')
    expect(ers?.layout).toBe('text')
    expect(ers?.text).toContain('E166638')
  })
})
