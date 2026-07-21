import { useEffect, useState, type ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import type { StaffUser } from '../../lib/api'
import { Container } from '../layout/Container'
import styles from './BackofficeLayout.module.css'

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return

    const media = window.matchMedia('(min-width: 900px)')
    const onChange = () => setIsDesktop(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return isDesktop
}

function BackofficeNavLinks({
  user,
  onNavigate,
  className,
}: {
  user: StaffUser
  onNavigate?: () => void
  className?: string
}) {
  const link = (to: string, label: string) => (
    <Link key={to} to={to} onClick={onNavigate} className={styles.navLink}>
      {label}
    </Link>
  )

  return (
    <nav className={className} aria-label="Backoffice">
      {user.role === 'therapist' && (
        <>
          {link('/backoffice', 'Dashboard')}
          {link('/backoffice/patients', 'Pacientes')}
          {link('/backoffice/appointments', 'Consultas')}
          {link('/backoffice/attendance', 'Presenças')}
          {user.financialOverviewEnabled && link('/backoffice/financial', 'Finanças')}
          {link('/backoffice/workshops', 'Workshops')}
        </>
      )}
      {user.role === 'coordinator' && (
        <>
          {link('/backoffice', 'Dashboard')}
          {link('/backoffice/appointments', 'Consultas')}
          {link('/backoffice/attendance', 'Presenças')}
        </>
      )}
      {user.role === 'admin' && (
        <>
          {link('/backoffice/admin/therapists', 'Terapeutas')}
          {link('/backoffice/admin/coordinators', 'Administrativos')}
          {link('/backoffice/admin/locations', 'Locais')}
          {link('/backoffice/workshops', 'Workshops')}
        </>
      )}
      {link('/', 'Site público')}
    </nav>
  )
}

export function BackofficeLayout({ children }: { children: ReactNode }) {
  const { user, logout, loading } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const isDesktop = useIsDesktop()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (isDesktop) {
      setMenuOpen(false)
    }
  }, [isDesktop])

  useEffect(() => {
    document.body.style.overflow = menuOpen && !isDesktop ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, isDesktop])

  useEffect(() => {
    if (!menuOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

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

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className={styles.shell}>
      <header className={`${styles.header} ${menuOpen ? styles.headerMenuOpen : ''}`}>
        <Container className={styles.headerInner}>
          <Link to="/backoffice" className={styles.brand} onClick={closeMenu}>
            Backoffice
          </Link>

          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={menuOpen}
            aria-controls="backoffice-mobile-nav"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={styles.menuBar} />
            <span className={styles.menuBar} />
            <span className={styles.menuBar} />
          </button>

          <BackofficeNavLinks
            user={user}
            className={`${styles.nav} ${styles.navDesktop}`}
          />

          <div className={styles.user}>
            {user.role === 'therapist' ? (
              <Link to="/backoffice/profile" className={styles.userName}>
                {user.name}
              </Link>
            ) : (
              <span>{user.name}</span>
            )}
            <button type="button" onClick={logout} className={styles.logout}>
              Sair
            </button>
          </div>
        </Container>
      </header>

      {!isDesktop && menuOpen && (
        <div className={styles.mobileMenu} role="presentation">
          <button
            type="button"
            className={styles.backdrop}
            onClick={closeMenu}
            aria-label="Fechar menu"
          />
          <div id="backoffice-mobile-nav" className={styles.mobileNav}>
            <BackofficeNavLinks user={user} onNavigate={closeMenu} className={styles.mobileNavLinks} />
            <div className={styles.mobileUser}>
              {user.role === 'therapist' ? (
                <Link to="/backoffice/profile" className={styles.mobileUserName} onClick={closeMenu}>
                  {user.name}
                </Link>
              ) : (
                <span className={styles.mobileUserName}>{user.name}</span>
              )}
              <button
                type="button"
                onClick={() => {
                  closeMenu()
                  logout()
                }}
                className={styles.mobileLogout}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

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

export function RequireTherapist({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user || user.role !== 'therapist') {
    return <Navigate to="/backoffice/attendance" replace />
  }
  return <>{children}</>
}

export function RequireWorkshopManager({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user || (user.role !== 'therapist' && user.role !== 'admin')) {
    return <Navigate to="/backoffice" replace />
  }
  return <>{children}</>
}
