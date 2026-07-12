import type { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  className?: string
  as?: 'article' | 'div'
}

export function Card({ children, className = '', as: Tag = 'div' }: CardProps) {
  return <Tag className={`${styles.card} ${className}`.trim()}>{children}</Tag>
}
