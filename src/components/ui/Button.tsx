import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'

interface BaseProps {
  variant?: ButtonVariant
  children: ReactNode
  className?: string
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never }

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

type ButtonProps = ButtonAsButton | ButtonAsLink

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const classes = `${styles.button} ${styles[variant]} ${className}`.trim()

  if ('href' in props && props.href) {
    const { href, ...linkProps } = props
    return (
      <a href={href} className={classes} {...linkProps}>
        {children}
      </a>
    )
  }

  const { disabled, type = 'button', ...buttonProps } = props as ButtonHTMLAttributes<HTMLButtonElement>

  return (
    <button type={type} className={classes} disabled={disabled} {...buttonProps}>
      {children}
    </button>
  )
}
