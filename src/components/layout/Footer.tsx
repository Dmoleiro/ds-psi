import { Link } from 'react-router-dom'
import { legal, site, images } from '../../content/site.pt'
import { Container } from './Container'
import { SocialLinks } from './SocialLinks'
import styles from './Footer.module.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.brandMark} aria-hidden="true">
              <img
                src={images.logoIcon}
                alt=""
                className={styles.logoIcon}
                width={56}
                height={56}
              />
              <img
                src={images.logoText}
                alt=""
                className={styles.logoText}
                width={180}
                height={52}
              />
            </div>
            <p className={styles.name}>{site.name}</p>
            <p className={styles.tagline}>{site.tagline}</p>
          </div>

          <div>
            <h3 className={styles.heading}>Contacto</h3>
            <ul className={styles.links}>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>{site.address.full}</li>
            </ul>
            <SocialLinks />
          </div>

          <div>
            <h3 className={styles.heading}>Informação</h3>
            <ul className={styles.links}>
              <li>
                <a
                  href={legal.dataProtection.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {legal.dataProtection.label}
                </a>
              </li>
              <li>
                <a href={legal.pricing.href} target="_blank" rel="noopener noreferrer">
                  {legal.pricing.label}
                </a>
              </li>
              <li>
                <Link to="/politica-cookies">{legal.cookies.label}</Link>
              </li>
              <li>{legal.oppDisclaimer}</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {year} {site.name}. Todos os direitos reservados.</p>
        </div>
      </Container>
    </footer>
  )
}
