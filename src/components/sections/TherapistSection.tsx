import { images, therapist } from '../../content/site.pt'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { PortraitPhoto } from '../ui/PortraitPhoto'
import { Section } from '../layout/Section'
import styles from './TherapistSection.module.css'

export function TherapistSection() {
  return (
    <Section
      id="diretora-clinica"
      variant="cream"
      title="Diretora Clínica"
      subtitle="Conheça a formação e experiência de Daniela Santos."
    >
      <div className={styles.profile}>
        <PortraitPhoto
          src={images.therapistPortrait.src}
          alt={images.therapistPortrait.alt}
          align={images.therapistPortrait.align}
          frameClassName={styles.photoFrame}
          width={478}
          height={478}
        />

        <div className={styles.profileInfo}>
          <h3 className={styles.name}>{therapist.name}</h3>
          <p className={styles.role}>{therapist.role}</p>
          <p className={styles.credentials}>{therapist.subtitle} — {therapist.credentials}</p>
          <Badge variant="accent">{`OPP n.º ${therapist.oppNumber}`}</Badge>
        </div>
      </div>

      <Card className={styles.introCard}>
        <h3 className={styles.sectionHeading}>{therapist.introduction.title}</h3>
        {therapist.introduction.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className={styles.introText}>
            {paragraph}
          </p>
        ))}
      </Card>

      <div className={styles.qualifications}>
        <h3 className={styles.sectionHeading}>Habilitações</h3>
        <ul className={styles.qualList}>
          {therapist.qualifications.map((q) => (
            <li key={q.label} className={styles.qualItem}>
              {q.label}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.timeline}>
        <h3 className={styles.sectionHeading}>Desenvolvimento Profissional</h3>
        <ol className={styles.timelineList}>
          {therapist.timeline.map((entry) => (
            <li key={`${entry.year}-${entry.title}`} className={styles.timelineItem}>
              <div className={styles.timelineMarker} aria-hidden="true" />
              <Card as="article" className={styles.timelineCard}>
                <time className={styles.timelineYear} dateTime={entry.year.replace(/\s/g, '')}>
                  {entry.year}
                </time>
                <h4 className={styles.timelineTitle}>{entry.title}</h4>
                <ul className={styles.timelineDetails}>
                  {entry.items.map((item) => (
                    <li key={item.slice(0, 40)}>{item}</li>
                  ))}
                </ul>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
