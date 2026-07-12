import type { ReactNode } from 'react'
import { CookieBanner } from './CookieBanner'
import { Footer } from './Footer'
import { Header } from './Header'

interface SiteLayoutProps {
  children: ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
    </>
  )
}
