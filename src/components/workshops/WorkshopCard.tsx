import { useEffect, useState } from 'react'
import { site } from '../../content/site.pt'
import { workshopImageUrl, type WorkshopSummary } from '../../lib/api'
import { formatWorkshopDatePt, isWorkshopUpcoming } from '../../lib/workshopDates'
import { Button } from '../ui/Button'
import styles from './WorkshopCard.module.css'

type Props = {
  workshop: WorkshopSummary
}

export function WorkshopCard({ workshop }: Props) {
  const [imageOpen, setImageOpen] = useState(false)
  const imageSrc = workshopImageUrl(workshop.imagePath)
  const imageAlt = `Flyer do workshop ${workshop.title}`

  useEffect(() => {
    if (!imageOpen) return

    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setImageOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [imageOpen])

  return (
    <>
      <article className={styles.card}>
        <h2 className={styles.title}>{workshop.title}</h2>
        <p className={styles.meta}>
          <span>{formatWorkshopDatePt(workshop.eventDate)}</span>
          <span aria-hidden="true"> · </span>
          <span>{workshop.location}</span>
        </p>
        <button
          type="button"
          className={styles.imageButton}
          onClick={() => setImageOpen(true)}
          aria-label={`Ver ${imageAlt} em tamanho real`}
        >
          <img src={imageSrc} alt="" className={styles.image} loading="lazy" />
        </button>
        <p className={styles.description}>{workshop.description}</p>
        {isWorkshopUpcoming(workshop.eventDate) && (
          <Button href={`mailto:${site.email}`} variant="secondary">
            Reservar vaga
          </Button>
        )}
      </article>

      {imageOpen && (
        <div
          className={styles.lightboxOverlay}
          role="presentation"
          onClick={() => setImageOpen(false)}
        >
          <div
            className={styles.lightboxDialog}
            role="dialog"
            aria-modal="true"
            aria-label={imageAlt}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={() => setImageOpen(false)}
              aria-label="Fechar"
            >
              ×
            </button>
            <img src={imageSrc} alt={imageAlt} className={styles.lightboxImage} />
          </div>
        </div>
      )}
    </>
  )
}

export function WorkshopsEmptyState() {
  return (
    <p className={styles.empty}>
      Brevemente mostraremos informação dos próximos workshops.
    </p>
  )
}
