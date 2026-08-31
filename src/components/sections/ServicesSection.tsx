import { useEffect, useState } from 'react'
import type { Service } from '../../content/site.pt'
import { services } from '../../content/site.pt'
import { Card } from '../ui/Card'
import { Section } from '../layout/Section'
import styles from './ServicesSection.module.css'

function ServiceDetailModal({
  service,
  onClose,
}: {
  service: Service
  onClose: () => void
}) {
  const detail = service.detail!

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className={styles.modalOverlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modalDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`service-modal-title-${service.id}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Fechar">
          ×
        </button>

        <div className={styles.modalHeader}>
          {detail.badge && <p className={styles.modalBadge}>{detail.badge}</p>}
          <h3 id={`service-modal-title-${service.id}`} className={styles.modalTitle}>
            {service.title}
          </h3>
          {detail.intro && <p className={styles.modalIntro}>{detail.intro}</p>}
        </div>

        {detail.image && (
          <img
            src={detail.image.src}
            alt={detail.image.alt}
            className={styles.modalImage}
            loading="lazy"
          />
        )}

        <div className={styles.modalSections}>
          {detail.sections.map((section) => (
            <section key={section.title} className={styles.modalSection}>
              <h4 className={styles.modalSectionTitle}>{section.title}</h4>
              <ul className={styles.modalList}>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {detail.cta && (
          <div className={styles.modalCta}>
            <h4 className={styles.modalCtaTitle}>{detail.cta.title}</h4>
            <p className={styles.modalCtaDescription}>{detail.cta.description}</p>
            <a
              href={detail.cta.href}
              className={styles.modalCtaLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {detail.cta.label}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

function ServiceCard({
  service,
  onOpenDetail,
}: {
  service: Service
  onOpenDetail: (service: Service) => void
}) {
  if (!service.detail) {
    return (
      <Card as="article" className={styles.card}>
        <span className={styles.icon} aria-hidden="true">
          {service.icon}
        </span>
        <h3 className={styles.title}>{service.title}</h3>
        <p className={styles.description}>{service.description}</p>
      </Card>
    )
  }

  return (
    <Card as="article" className={styles.card}>
      <button
        type="button"
        className={styles.cardButton}
        onClick={() => onOpenDetail(service)}
        aria-haspopup="dialog"
      >
        <span className={styles.icon} aria-hidden="true">
          {service.icon}
        </span>
        <h3 className={styles.title}>{service.title}</h3>
        <p className={styles.description}>{service.description}</p>
        <span className={styles.seeMore}>Ver mais</span>
      </button>
    </Card>
  )
}

export function ServicesSection() {
  const [activeService, setActiveService] = useState<Service | null>(null)

  return (
    <Section
      id="servicos"
      title="Serviços"
      subtitle="Apoio especializado para crianças, jovens e adultos — e espaços para outros profissionais."
    >
      <div className={styles.grid}>
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onOpenDetail={setActiveService}
          />
        ))}
      </div>

      {activeService?.detail && (
        <ServiceDetailModal service={activeService} onClose={() => setActiveService(null)} />
      )}
    </Section>
  )
}
