import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { HeroSection } from '../components/sections/HeroSection'
import { ClinicSection } from '../components/sections/ClinicSection'
import { ServicesSection } from '../components/sections/ServicesSection'
import { TherapistSection } from '../components/sections/TherapistSection'
import { ContactSection } from '../components/sections/ContactSection'
import { FormsSection } from '../components/sections/FormsSection'

function ScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return

    const id = hash.replace('#', '')
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView()
    }
  }, [hash])

  return null
}

export function HomePage() {
  return (
    <>
      <ScrollToHash />
      <HeroSection />
      <ClinicSection />
      <ServicesSection />
      <TherapistSection />
      <ContactSection />
      <FormsSection />
    </>
  )
}
