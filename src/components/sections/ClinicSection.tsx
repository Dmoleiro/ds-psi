import { clinic, images } from '../../content/site.pt'
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

      {images.gallery.length > 0 && (
        <div className={styles.gallery}>
          {images.gallery.map((photo) => (
            <figure key={photo.id} className={styles.galleryItem}>
              <img src={photo.src} alt={photo.alt} className={styles.galleryImage} loading="lazy" />
              {photo.caption && <figcaption className={styles.galleryCaption}>{photo.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}

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
