import { images, therapist, type TimelineEntry } from '../../content/site.pt'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { PortraitPhoto } from '../ui/PortraitPhoto'
import { Section } from '../layout/Section'
import styles from './TherapistSection.module.css'

function timelineYears(year: string): { start: number; end: number } {
  const matches = year.match(/\d{4}/g)?.map(Number) ?? []
  if (matches.length === 0) return { start: 0, end: 0 }
  const start = matches[0]
  if (/presente/i.test(year)) return { start, end: 9999 }
  if (matches.length === 1) return { start, end: matches[0] }
  return { start, end: matches[matches.length - 1] }
}

function sortTimeline(entries: TimelineEntry[]): TimelineEntry[] {
  const undated = entries.filter((entry) => !entry.year)
  const dated = entries
    .filter((entry) => entry.year)
    .sort((a, b) => {
      const aYears = timelineYears(a.year!)
      const bYears = timelineYears(b.year!)
      if (bYears.start !== aYears.start) return bYears.start - aYears.start
      if (bYears.end !== aYears.end) return bYears.end - aYears.end
      return (b.priority ?? 0) - (a.priority ?? 0)
    })

  return [...undated, ...dated]
}

const timeline = sortTimeline(therapist.timeline)

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
          {timeline.map((entry) => (
            <li key={entry.year ? `${entry.year}-${entry.title}` : entry.title} className={styles.timelineItem}>
              <div className={styles.timelineMarker} aria-hidden="true" />
              <Card as="article" className={styles.timelineCard}>
                {entry.year && (
                  <time className={styles.timelineYear} dateTime={entry.year.replace(/\s/g, '')}>
                    {entry.year}
                  </time>
                )}
                <h4 className={styles.timelineTitle}>{entry.title}</h4>
                {entry.items.length > 0 && (
                  <ul className={styles.timelineDetails}>
                    {entry.items.map((item) => (
                      <li key={item.slice(0, 40)}>{item}</li>
                    ))}
                  </ul>
                )}
                {entry.sections?.map((section) => (
                  <div key={section.title} className={styles.timelineSubsection}>
                    <h5 className={styles.timelineSubsectionTitle}>{section.title}</h5>
                    <ul className={styles.timelineDetails}>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
