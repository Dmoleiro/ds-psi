import { Link } from 'react-router-dom'
import { piccaFormsPage } from '../content/site.pt'
import { Container } from '../components/layout/Container'
import styles from './FormulariosPiccaPage.module.css'

export function FormulariosPiccaPage() {
  return (
    <Container as="div" className={styles.page}>
      <nav className={styles.back}>
        <Link to="/">← Voltar ao início</Link>
      </nav>

      <header className={styles.header}>
        <p className={styles.comingSoon}>{piccaFormsPage.comingSoon}</p>
        <h1 className={styles.title}>{piccaFormsPage.title}</h1>
        <p className={styles.intro}>{piccaFormsPage.intro}</p>
      </header>
    </Container>
  )
}
