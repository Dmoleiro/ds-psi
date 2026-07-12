import { Link } from 'react-router-dom'
import { piccaFormsPage } from '../content/site.pt'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/layout/Container'
import styles from './FormulariosPiccaPage.module.css'

export function FormulariosPiccaPage() {
  return (
    <Container as="div" className={styles.page}>
      <nav className={styles.back}>
        <Link to="/">← Voltar ao início</Link>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.title}>{piccaFormsPage.title}</h1>
        <p className={styles.intro}>{piccaFormsPage.intro}</p>
      </header>

      <div className={styles.grid}>
        {piccaFormsPage.forms.map((form) => (
          <Card key={form.id} as="article" className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{form.title}</h2>
              <Badge variant="muted">Em breve</Badge>
            </div>
            <p className={styles.cardDescription}>{form.description}</p>
            <Button disabled className={styles.stubButton}>
              Aceder ao formulário
            </Button>
          </Card>
        ))}
      </div>
    </Container>
  )
}
