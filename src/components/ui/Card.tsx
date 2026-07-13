import type { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  className?: string
  as?: 'article' | 'div' | 'section'
  id?: string
}

export function Card({ children, className = '', as: Tag = 'div', id }: CardProps) {
  return (
    <Tag id={id} className={`${styles.card} ${className}`.trim()}>
      {children}
    </Tag>
  )
}
