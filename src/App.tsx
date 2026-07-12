import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { HeroSection } from './components/sections/HeroSection'
import { ClinicSection } from './components/sections/ClinicSection'
import { ServicesSection } from './components/sections/ServicesSection'
import { TherapistSection } from './components/sections/TherapistSection'
import { ContactSection } from './components/sections/ContactSection'
import { FormsSection } from './components/sections/FormsSection'
import './styles/global.css'

export function App() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ClinicSection />
        <ServicesSection />
        <TherapistSection />
        <ContactSection />
        <FormsSection />
      </main>
      <Footer />
    </>
  )
}
