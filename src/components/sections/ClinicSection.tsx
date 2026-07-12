import { clinic } from '../../content/site.pt'
import { Card } from '../ui/Card'
import { Section } from '../layout/Section'
import styles from './ClinicSection.module.css'

export function ClinicSection() {
  return (
    <Section id="clinica" variant="warm" title={clinic.title}>
      <div className={styles.intro}>
        <p className={styles.lead}>{clinic.intro}</p>
        {clinic.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
      </div>

      <div className={styles.values}>
        {clinic.values.map((value) => (
          <Card key={value.title} as="article" className={styles.valueCard}>
            <h3 className={styles.valueTitle}>{value.title}</h3>
            <p className={styles.valueDescription}>{value.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
