import type { ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Container } from '../layout/Container'
import styles from './BackofficeLayout.module.css'

export function BackofficeLayout({ children }: { children: ReactNode }) {
  const { user, logout, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className={styles.loading}>
        <Container>A carregar…</Container>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/backoffice/login" state={{ from: location.pathname }} replace />
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Container className={styles.headerInner}>
          <Link to="/backoffice" className={styles.brand}>
            Backoffice
          </Link>
          <nav className={styles.nav} aria-label="Backoffice">
            {user.role === 'therapist' && (
              <>
                <Link to="/backoffice">Painel</Link>
                <Link to="/backoffice/patients">Pacientes</Link>
                <Link to="/backoffice/attendance">Presenças</Link>
              </>
            )}
            {user.role === 'admin' && (
              <>
                <Link to="/backoffice/admin/therapists">Terapeutas</Link>
                <Link to="/backoffice/admin/locations">Locais</Link>
              </>
            )}
            <Link to="/">Site público</Link>
          </nav>
          <div className={styles.user}>
            <span>{user.name}</span>
            <button type="button" onClick={logout} className={styles.logout}>
              Sair
            </button>
          </div>
        </Container>
      </header>
      <main className={styles.main}>
        <Container>{children}</Container>
      </main>
    </div>
  )
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user || user.role !== 'admin') {
    return <Navigate to="/backoffice" replace />
  }
  return <>{children}</>
}
