import { useEffect, useState } from 'react'
import {
  announcementApi,
  announcementImageUrl,
  type AnnouncementSummary,
} from '../../lib/api'
import styles from './AnnouncementsPopup.module.css'

const DISMISS_STORAGE_KEY = 'ds-psi-announcements-dismissed'

function announcementsFingerprint(announcements: AnnouncementSummary[]): string {
  return announcements.map((item) => item.id).join(',')
}

function wasDismissedThisSession(announcements: AnnouncementSummary[]): boolean {
  if (typeof sessionStorage === 'undefined') return false
  const fingerprint = announcementsFingerprint(announcements)
  return sessionStorage.getItem(DISMISS_STORAGE_KEY) === fingerprint
}

function markDismissedThisSession(announcements: AnnouncementSummary[]) {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.setItem(DISMISS_STORAGE_KEY, announcementsFingerprint(announcements))
}

export function AnnouncementsPopup() {
  const [announcements, setAnnouncements] = useState<AnnouncementSummary[]>([])
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let cancelled = false

    announcementApi
      .listPublic()
      .then((data) => {
        if (cancelled) return
        if (data.announcements.length === 0 || wasDismissedThisSession(data.announcements)) {
          return
        }
        setAnnouncements(data.announcements)
        setIndex(0)
        setOpen(true)
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!open) return

    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        markDismissedThisSession(announcements)
      }
      if (event.key === 'ArrowLeft') {
        setIndex((current) => (current > 0 ? current - 1 : current))
      }
      if (event.key === 'ArrowRight') {
        setIndex((current) => (current < announcements.length - 1 ? current + 1 : current))
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, announcements])

  if (!open || announcements.length === 0) {
    return null
  }

  const current = announcements[index]
  const imageAlt = current.title?.trim() || 'Anúncio da clínica'
  const hasMultiple = announcements.length > 1

  function close() {
    markDismissedThisSession(announcements)
    setOpen(false)
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={close}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={imageAlt}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={close} aria-label="Fechar">
          ×
        </button>

        <img
          src={announcementImageUrl(current.imagePath)}
          alt={imageAlt}
          className={styles.image}
        />

        {hasMultiple && (
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.navButton}
              onClick={() => setIndex((currentIndex) => Math.max(0, currentIndex - 1))}
              disabled={index === 0}
              aria-label="Anúncio anterior"
            >
              ‹
            </button>
            <span className={styles.counter} aria-live="polite">
              {index + 1} / {announcements.length}
            </span>
            <button
              type="button"
              className={styles.navButton}
              onClick={() =>
                setIndex((currentIndex) => Math.min(announcements.length - 1, currentIndex + 1))
              }
              disabled={index === announcements.length - 1}
              aria-label="Anúncio seguinte"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
