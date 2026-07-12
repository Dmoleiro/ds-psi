import { site } from '../../content/site.pt'
import { Button } from '../ui/Button'
import { Container } from '../layout/Container'
import styles from './HeroSection.module.css'

export function HeroSection() {
  return (
    <section id="inicio" className={styles.hero} aria-label="Início">
      <Container as="div" className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>{site.tagline}</p>
          <h1 className={styles.title}>{site.name}</h1>
          <p className={styles.subtitle}>{site.subtitle}</p>

          <div className={styles.actions}>
            <Button href={`mailto:${site.email}`}>Marcar consulta</Button>
            <Button href="#servicos" variant="outline">
              Ver serviços
            </Button>
          </div>

          <div className={styles.quickContact}>
            <a href={`tel:+351${site.phone}`} className={styles.contactItem}>
              <span aria-hidden="true">📞</span> {site.phoneDisplay}
            </a>
            <a href={site.whatsappUrl} className={styles.contactItem} target="_blank" rel="noopener noreferrer">
              <span aria-hidden="true">💬</span> WhatsApp
            </a>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.imageFrame}>
            <div className={styles.placeholder}>
              <img src="/logo.png" alt="" className={styles.placeholderLogo} />
              <span>Fotografia da clínica em breve</span>
            </div>
          </div>
          <div className={styles.blob1} />
          <div className={styles.blob2} />
        </div>
      </Container>
    </section>
  )
}
