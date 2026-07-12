import type { ReactNode } from 'react'
import { Container } from './Container'
import styles from './Section.module.css'

interface SectionProps {
  id: string
  children: ReactNode
  className?: string
  variant?: 'default' | 'warm' | 'cream'
  title?: string
  subtitle?: string
}

export function Section({
  id,
  children,
  className = '',
  variant = 'default',
  title,
  subtitle,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${styles.section} ${styles[variant]} ${className}`.trim()}
      aria-labelledby={title ? `${id}-heading` : undefined}
    >
      <Container as="div">
        {(title || subtitle) && (
          <header className={styles.header}>
            {title && (
              <h2 id={`${id}-heading`} className={styles.title}>
                {title}
              </h2>
            )}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </header>
        )}
        {children}
      </Container>
    </section>
  )
}
