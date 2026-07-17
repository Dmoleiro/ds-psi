import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { moreNavigation, navigation, site, images } from '../../content/site.pt'
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

type NavLinkItem = (typeof navigation)[number] | (typeof moreNavigation)[number]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [maisOpen, setMaisOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isDesktop = useIsDesktop()
  const maisMenuId = useId()
  const maisRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (!maisOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (!maisRef.current?.contains(event.target as Node)) {
        setMaisOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMaisOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [maisOpen])

  const closeMenus = () => {
    setMenuOpen(false)
    setMaisOpen(false)
  }

  const renderNavLink = (item: NavLinkItem) =>
    item.path ? (
      <Link to={item.path} className={styles.navLink} onClick={closeMenus}>
        {item.label}
      </Link>
    ) : (
      <Link
        to={{ pathname: '/', hash: `#${item.id}` }}
        className={styles.navLink}
        onClick={closeMenus}
      >
        {item.label}
      </Link>
    )

  const maisMenu = (
    <div className={styles.maisGroup} ref={maisRef}>
      <button
        type="button"
        className={`${styles.navLink} ${styles.maisButton}`}
        aria-expanded={maisOpen}
        aria-haspopup="menu"
        aria-controls={maisMenuId}
        onClick={() => setMaisOpen((open) => !open)}
      >
        Mais
        <span className={styles.maisChevron} aria-hidden="true" />
      </button>
      {maisOpen && (
        <ul id={maisMenuId} className={styles.maisMenu} role="menu">
          {moreNavigation.map((item) => (
            <li key={item.id} role="none">
              {item.path ? (
                <Link
                  to={item.path}
                  className={styles.maisMenuLink}
                  role="menuitem"
                  onClick={closeMenus}
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  to={{ pathname: '/', hash: `#${item.id}` }}
                  className={styles.maisMenuLink}
                  role="menuitem"
                  onClick={closeMenus}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuOpen : ''}`}
      >
        <div className={styles.inner}>
          <Link to="/" className={styles.brand} onClick={closeMenus} aria-label={site.name}>
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
              <li className={styles.maisListItem}>{maisMenu}</li>
            </ul>
            <a href={`mailto:${site.email}`} className={styles.cta}>
              Marcar consulta
            </a>
          </nav>
        </div>
      </header>

      {!isDesktop && menuOpen && (
        <div className={styles.mobileMenu} role="presentation">
          <div className={styles.backdrop} onClick={closeMenus} aria-hidden="true" />
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
            <div className={styles.mobileMaisSection}>
              <p className={styles.mobileMaisLabel}>Mais</p>
              <ul className={styles.navList}>
                {moreNavigation.map((item) => (
                  <li key={item.id}>{renderNavLink(item)}</li>
                ))}
              </ul>
            </div>
            <a href={`mailto:${site.email}`} className={styles.cta} onClick={closeMenus}>
              Marcar consulta
            </a>
          </nav>
        </div>
      )}
    </>
  )
}
