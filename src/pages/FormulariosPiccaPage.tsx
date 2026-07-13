import { Link } from 'react-router-dom'
import { piccaFormsPage } from '../content/site.pt'
import { Badge } from '../components/ui/Badge'
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
        <p className={styles.intro}>
          Os pacientes recebem um link único da sua terapeuta para preencher os formulários de
          admissão de forma segura. O progresso é guardado automaticamente e o link deixa de
          funcionar após a submissão de todos os formulários atribuídos.
        </p>
      </header>

      <div className={styles.grid}>
        {piccaFormsPage.forms.map((form) => (
          <Card key={form.id} as="article" className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{form.title}</h2>
              <Badge variant="accent">Disponível</Badge>
            </div>
            <p className={styles.cardDescription}>{form.description}</p>
          </Card>
        ))}
      </div>

      <p className={styles.note}>
        É terapeuta? <Link to="/backoffice/login">Aceder ao backoffice</Link>
      </p>
    </Container>
  )
}
