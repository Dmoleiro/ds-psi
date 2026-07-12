import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from './App'
import { clearCookieConsent } from './hooks/useCookieConsent'

describe('App', () => {
  beforeEach(() => {
    clearCookieConsent()
  })

  it('renders the clinic name and main sections', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: /Daniela Santos Psicologia/i })).toBeInTheDocument()
    expect(document.getElementById('clinica')).toBeInTheDocument()
    expect(document.getElementById('servicos')).toBeInTheDocument()
    expect(document.getElementById('terapeuta')).toBeInTheDocument()
    expect(document.getElementById('contacto')).toBeInTheDocument()
    expect(document.getElementById('formularios')).toBeInTheDocument()
  })

  it('renders all services', () => {
    render(<App />)

    expect(screen.getByText('Apoio Psicológico')).toBeInTheDocument()
    expect(screen.getByText('Avaliação do Neurodesenvolvimento')).toBeInTheDocument()
    expect(screen.getByText('Aluguer de Salas')).toBeInTheDocument()
  })

  it('shows contact details', () => {
    render(<App />)

    expect(screen.getAllByText(/danielasantos\.consultas@gmail\.com/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/2050-385/i).length).toBeGreaterThan(0)
    expect(screen.queryByText(/966 419 142/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/WhatsApp/i)).not.toBeInTheDocument()
  })

  it('shows forms as coming soon', () => {
    render(<App />)

    expect(screen.getAllByText('Em breve').length).toBeGreaterThan(0)
    expect(screen.getByText('Formulário de Admissão')).toBeInTheDocument()
  })

  it('shows the cookie banner until consent is given', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /aceitar/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('links to the cookie policy page', () => {
    render(<App />)

    const footerLink = screen.getByRole('contentinfo').querySelector('a[href="/politica-cookies"]')
    expect(footerLink).toBeTruthy()
    expect(footerLink).toHaveTextContent('Política de Cookies')
  })

  it('loads the map only after the user clicks', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.queryByTitle(/Mapa/i)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /ver mapa da clínica/i }))
    expect(screen.getByTitle(/Mapa/i)).toBeInTheDocument()
  })
})

describe('Header', () => {
  beforeEach(() => {
    clearCookieConsent()
  })

  it('toggles mobile navigation menu', async () => {
    const user = userEvent.setup()
    render(<App />)

    const toggle = screen.getByRole('button', { name: /abrir menu/i })
    await user.click(toggle)

    expect(screen.getByRole('button', { name: /fechar menu/i })).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById('mobile-nav')).toBeVisible()
  })
})

describe('Cookies policy page', () => {
  beforeEach(() => {
    clearCookieConsent()
  })

  it('renders the cookie policy content', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getAllByRole('link', { name: /política de cookies/i })[0])

    expect(screen.getByRole('heading', { level: 1, name: /Política de Cookies/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /Google Maps/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /voltar ao início/i })).toBeInTheDocument()
  })
})
