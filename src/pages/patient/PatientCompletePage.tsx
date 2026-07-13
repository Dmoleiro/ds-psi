import { Link } from 'react-router-dom'
import { Container } from '../../components/layout/Container'
import { Card } from '../../components/ui/Card'
import styles from './PatientPortal.module.css'

export function PatientCompletePage() {
  return (
    <Container className={styles.page}>
      <Card>
        <h1>Formulários submetidos</h1>
        <p>
          Obrigado. Todos os formulários foram submetidos com sucesso e este link já não pode ser
          utilizado.
        </p>
        <p className={styles.intro}>
          Se precisar de preencher novos formulários, peça um novo link à sua terapeuta.
        </p>
        <Link to="/">Voltar ao início</Link>
      </Card>
    </Container>
  )
}
