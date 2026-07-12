import { formsStub } from '../../content/site.pt'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Section } from '../layout/Section'
import styles from './FormsSection.module.css'

export function FormsSection() {
  return (
    <Section
      id="formularios"
      variant="warm"
      title="Formulários"
      subtitle="Área reservada para pacientes — em desenvolvimento."
    >
      <div className={styles.notice}>
        <p>
          Em breve, cada paciente receberá um link ou código único para aceder aos
          formulários de admissão. As respostas serão enviadas de forma segura à
          terapeuta responsável.
        </p>
      </div>

      <div className={styles.grid}>
        {formsStub.map((form) => (
          <Card key={form.id} as="article" className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{form.title}</h3>
              <Badge variant="muted">Em breve</Badge>
            </div>
            <p className={styles.cardDescription}>{form.description}</p>
            <Button disabled className={styles.stubButton}>
              Aceder ao formulário
            </Button>
          </Card>
        ))}
      </div>

      <div className={styles.future}>
        <h3 className={styles.futureTitle}>Funcionalidades planeadas</h3>
        <ul className={styles.futureList}>
          <li>Backoffice para criação de perfis de pacientes</li>
          <li>Links ou códigos de acesso únicos por paciente</li>
          <li>Suporte a múltiplas terapeutas</li>
          <li>Envio seguro das respostas por email à terapeuta responsável</li>
        </ul>
      </div>
    </Section>
  )
}
