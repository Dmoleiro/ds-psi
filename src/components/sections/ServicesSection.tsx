import { services } from '../../content/site.pt'
import { Card } from '../ui/Card'
import { Section } from '../layout/Section'
import styles from './ServicesSection.module.css'

export function ServicesSection() {
  return (
    <Section
      id="servicos"
      title="Serviços"
      subtitle="Apoio especializado para crianças, jovens e adultos — e espaços para outros profissionais."
    >
      <div className={styles.grid}>
        {services.map((service) => (
          <Card key={service.id} as="article" className={styles.card}>
            <span className={styles.icon} aria-hidden="true">
              {service.icon}
            </span>
            <h3 className={styles.title}>{service.title}</h3>
            <p className={styles.description}>{service.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
