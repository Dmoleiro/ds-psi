import type { ReactNode } from 'react'
import styles from './Container.module.css'

interface ContainerProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'section'
}

export function Container({ children, className, as: Tag = 'div' }: ContainerProps) {
  const classes = [styles.container, className].filter(Boolean).join(' ')
  return <Tag className={classes}>{children}</Tag>
}
