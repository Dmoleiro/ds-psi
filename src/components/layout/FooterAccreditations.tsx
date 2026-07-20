import { accreditations } from '../../content/site.pt'
import styles from './Footer.module.css'

export function FooterAccreditations() {
  const visible = accreditations.filter((item) => item.image || item.text)

  if (visible.length === 0) return null

  return (
    <section className={styles.accreditations} aria-label="Acreditação e regulação">
      <h3 className={styles.accreditationsHeading}>Acreditação e regulação</h3>
      <ul className={styles.accreditationList}>
        {visible.map((item) => {
          const isBanner = item.layout === 'banner'
          const isText = item.layout === 'text'

          return (
            <li
              key={item.id}
              className={`${styles.accreditationItem} ${isBanner ? styles.accreditationItemBanner : ''} ${isText ? styles.accreditationItemText : ''}`}
            >
              <a
                href={item.href}
                className={styles.accreditationLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
              >
                {isText ? (
                  <span className={styles.accreditationMediaText}>{item.text}</span>
                ) : (
                  <span
                    className={`${styles.accreditationMedia} ${isBanner ? styles.accreditationMediaBanner : styles.accreditationMediaLogo}`}
                  >
                    <img
                      src={item.image}
                      alt={item.imageAlt ?? item.label}
                      className={styles.accreditationImage}
                    />
                  </span>
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
