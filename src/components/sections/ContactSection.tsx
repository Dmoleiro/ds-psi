import { site } from '../../content/site.pt'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Section } from '../layout/Section'
import styles from './ContactSection.module.css'

export function ContactSection() {
  return (
    <Section
      id="contacto"
      title="Contacto"
      subtitle="Marque a sua consulta por email, telefone ou WhatsApp."
    >
      <div className={styles.grid}>
        <div className={styles.info}>
          <Card className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Marcar consulta</h3>
            <p className={styles.infoText}>
              Para agendar uma consulta, contacte-nos por email, telefone ou WhatsApp.
            </p>

            <div className={styles.contactMethods}>
              <a href={`mailto:${site.email}`} className={styles.contactLink}>
                <span className={styles.contactLabel}>Email</span>
                <span className={styles.contactValue}>{site.email}</span>
              </a>

              <a href={`tel:+351${site.phone}`} className={styles.contactLink}>
                <span className={styles.contactLabel}>Telefone</span>
                <span className={styles.contactValue}>{site.phoneDisplay}</span>
              </a>

              <a
                href={site.whatsappUrl}
                className={styles.contactLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.contactLabel}>WhatsApp</span>
                <span className={styles.contactValue}>{site.phoneDisplay}</span>
              </a>
            </div>

            <div className={styles.actions}>
              <Button href={`mailto:${site.email}`}>Enviar email</Button>
              <Button href={site.whatsappUrl} variant="secondary">
                WhatsApp
              </Button>
            </div>
          </Card>

          <Card className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Morada</h3>
            <address className={styles.address}>
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
            </address>
            <Button href={site.mapUrl} variant="outline" target="_blank" rel="noopener noreferrer">
              Ver no Google Maps
            </Button>
          </Card>
        </div>

        <a
          href={site.mapUrl}
          className={styles.mapWrapper}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver localização da clínica no Google Maps"
        >
          <div className={styles.mapPlaceholder}>
            <span className={styles.mapIcon} aria-hidden="true">📍</span>
            <span className={styles.mapText}>Ver localização no Google Maps</span>
            <span className={styles.mapAddress}>{site.address.full}</span>
          </div>
        </a>
      </div>
    </Section>
  )
}
