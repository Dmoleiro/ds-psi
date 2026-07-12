import { useEffect, useState } from 'react'
import { navigation, site } from '../../content/site.pt'
import styles from './Header.module.css'

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

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isDesktop = useIsDesktop()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuOpen : ''}`}
      >
        <div className={styles.inner}>
          <a href="#inicio" className={styles.brand} onClick={closeMenu}>
            <img src="/logo.png" alt="" className={styles.logo} width={48} height={48} />
            <span className={styles.brandText}>
              <span className={styles.brandName}>{site.name}</span>
              <span className={styles.brandTagline}>{site.tagline}</span>
            </span>
          </a>

          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? 'mobile-nav' : 'main-nav'}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={styles.menuBar} />
            <span className={styles.menuBar} />
            <span className={styles.menuBar} />
          </button>

          <nav
            id="main-nav"
            className={`${styles.nav} ${styles.navDesktop}`}
            aria-label="Navegação principal"
            aria-hidden={!isDesktop}
          >
            <ul className={styles.navList}>
              {navigation.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={styles.navLink}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a href={`mailto:${site.email}`} className={styles.cta}>
              Marcar consulta
            </a>
          </nav>
        </div>
      </header>

      {!isDesktop && menuOpen && (
        <div className={styles.mobileMenu} role="presentation">
          <div className={styles.backdrop} onClick={closeMenu} aria-hidden="true" />
          <nav
            id="mobile-nav"
            className={styles.mobileNav}
            aria-label="Navegação principal"
          >
            <ul className={styles.navList}>
              {navigation.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={styles.navLink} onClick={closeMenu}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a href={`mailto:${site.email}`} className={styles.cta} onClick={closeMenu}>
              Marcar consulta
            </a>
          </nav>
        </div>
      )}
    </>
  )
}
