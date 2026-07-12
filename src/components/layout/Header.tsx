import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { navigation, site, images } from '../../content/site.pt'
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

  const renderNavLink = (item: (typeof navigation)[number]) =>
    item.path ? (
      <Link to={item.path} className={styles.navLink} onClick={closeMenu}>
        {item.label}
      </Link>
    ) : (
      <Link
        to={{ pathname: '/', hash: `#${item.id}` }}
        className={styles.navLink}
        onClick={closeMenu}
      >
        {item.label}
      </Link>
    )

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuOpen : ''}`}
      >
        <div className={styles.inner}>
          <Link to="/" className={styles.brand} onClick={closeMenu} aria-label={site.name}>
            <img
              src={images.logoIcon}
              alt=""
              className={styles.logoIcon}
              width={52}
              height={52}
            />
            <img
              src={images.logoText}
              alt=""
              className={styles.logoText}
              width={160}
              height={48}
            />
          </Link>

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
                <li key={item.id}>{renderNavLink(item)}</li>
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
                <li key={item.id}>{renderNavLink(item)}</li>
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
