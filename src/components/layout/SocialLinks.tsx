import { social } from '../../content/site.pt'
import { FacebookIcon, InstagramIcon } from '../icons/SocialIcons'
import styles from './SocialLinks.module.css'

export function SocialLinks() {
  return (
    <ul className={styles.list}>
      <li>
        <a
          href={social.instagram.href}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.instagram.label}
        >
          <InstagramIcon className={styles.icon} />
        </a>
      </li>
      <li>
        <a
          href={social.facebook.href}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.facebook.label}
        >
          <FacebookIcon className={styles.icon} />
        </a>
      </li>
      <li>
        <a
          href={social.complaintsBook.href}
          className={`${styles.link} ${styles.complaintsLink}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.complaintsBook.label}
        >
          <img
            src={social.complaintsBook.icon}
            alt=""
            className={styles.complaintsIcon}
            width={136}
            height={54}
          />
        </a>
      </li>
    </ul>
  )
}
