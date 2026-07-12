import { legal, site } from '../../content/site.pt'
import { Container } from './Container'
import styles from './Footer.module.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <img src="/logo.png" alt="" width={56} height={56} className={styles.logo} />
            <p className={styles.name}>{site.name}</p>
            <p className={styles.tagline}>{site.tagline}</p>
          </div>

          <div>
            <h3 className={styles.heading}>Contacto</h3>
            <ul className={styles.links}>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <a href={`tel:+351${site.phone}`}>{site.phoneDisplay}</a>
              </li>
              <li>{site.address.full}</li>
            </ul>
          </div>

          <div>
            <h3 className={styles.heading}>Informação</h3>
            <ul className={styles.links}>
              <li>
                <span className={styles.stub}>{legal.privacyPolicy}</span>
              </li>
              <li>
                <span className={styles.stub}>{legal.cookies}</span>
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
