import { useState } from 'react'
import { site } from '../../content/site.pt'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Section } from '../layout/Section'
import styles from './ContactSection.module.css'

export function ContactSection() {
  const [mapLoaded, setMapLoaded] = useState(false)

  return (
    <Section
      id="contacto"
      title="Contacto"
      subtitle="Marque a sua consulta por email."
    >
      <div className={styles.grid}>
        <div className={styles.info}>
          <Card className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Marcar consulta</h3>
            <p className={styles.infoText}>
              Para agendar uma consulta, contacte-nos por email.
            </p>

            <div className={styles.contactMethods}>
              <a href={`mailto:${site.email}`} className={styles.contactLink}>
                <span className={styles.contactLabel}>Email</span>
                <span className={styles.contactValue}>{site.email}</span>
              </a>
            </div>

            <div className={styles.actions}>
              <Button href={`mailto:${site.email}`}>Enviar email</Button>
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

        <div className={styles.mapColumn}>
          <div className={styles.mapWrapper}>
            {mapLoaded ? (
              <iframe
                title="Mapa — Clínica Psicologia Daniela Santos, Azambuja"
                src={site.mapEmbedUrl}
                className={styles.map}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                className={styles.mapPlaceholder}
                onClick={() => setMapLoaded(true)}
              >
                <span className={styles.mapPlaceholderTitle}>Ver mapa da clínica</span>
                <span className={styles.mapPlaceholderText}>
                  O mapa do Google só é carregado após o seu clique.
                </span>
              </button>
            )}
          </div>
          <a
            href={site.mapUrl}
            className={styles.mapLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir no Google Maps
          </a>
        </div>
      </div>
    </Section>
  )
}
