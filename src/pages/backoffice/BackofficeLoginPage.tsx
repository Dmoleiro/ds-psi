import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { ApiError } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Container } from '../../components/layout/Container'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

export function BackofficeLoginPage() {
  const { user, login } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    const redirect =
      user.role === 'admin' ? '/backoffice/admin/therapists' : '/backoffice'
    return <Navigate to={redirect} replace />
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível iniciar sessão')
    } finally {
      setSubmitting(false)
    }
  }

  const from = (location.state as { from?: string } | null)?.from

  return (
    <Container as="div" className={styles.loginWrap}>
      <h1 className={styles.pageTitle}>Backoffice</h1>
      <p className={styles.muted}>Acesso reservado a terapeutas e administradores.</p>
      {from && <p className={styles.muted}>Inicie sessão para continuar.</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="password">Palavra-passe</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'A entrar…' : 'Entrar'}
        </Button>
      </form>
      <p className={styles.muted} style={{ marginTop: 'var(--space-lg)' }}>
        <Link to="/">← Voltar ao site</Link>
      </p>
    </Container>
  )
}
