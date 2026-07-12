import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
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
    expect(screen.getAllByText(/966 419 142/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/2050-385/i).length).toBeGreaterThan(0)
  })

  it('shows forms as coming soon', () => {
    render(<App />)

    expect(screen.getAllByText('Em breve').length).toBeGreaterThan(0)
    expect(screen.getByText('Formulário de Admissão')).toBeInTheDocument()
  })
})

describe('Header', () => {
  it('toggles mobile navigation menu', async () => {
    const user = userEvent.setup()
    render(<App />)

    const toggle = screen.getByRole('button', { name: /abrir menu/i })
    await user.click(toggle)

    expect(screen.getByRole('button', { name: /fechar menu/i })).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById('mobile-nav')).toBeVisible()
  })
})
