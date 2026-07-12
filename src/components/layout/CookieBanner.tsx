import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { acceptCookieConsent, getCookieConsent } from '../../hooks/useCookieConsent'
import styles from './CookieBanner.module.css'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(getCookieConsent() === 'pending')
  }, [])

  if (!visible) return null

  const handleAccept = () => {
    acceptCookieConsent()
    setVisible(false)
  }

  return (
    <div className={styles.banner} role="dialog" aria-labelledby="cookie-banner-title" aria-live="polite">
      <div className={styles.inner}>
        <p id="cookie-banner-title" className={styles.text}>
          Este website utiliza tecnologias de terceiros (Google Fonts e Google Maps) para
          funcionar corretamente. Ao continuar, aceita a nossa{' '}
          <Link to="/politica-cookies" className={styles.link}>
            Política de Cookies
          </Link>
          .
        </p>
        <div className={styles.actions}>
          <Link to="/politica-cookies" className={styles.secondary}>
            Saber mais
          </Link>
          <button type="button" className={styles.primary} onClick={handleAccept}>
            Aceitar
          </button>
        </div>
      </div>
    </div>
  )
}
