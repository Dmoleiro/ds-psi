import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { exportSessionSubmissionsPdf, type SessionSubmissionsView } from '../../lib/exportFormSubmissionsPdf'
import styles from './FormSubmissionsPanel.module.css'

type Props = {
  session: SessionSubmissionsView
  onClose?: () => void
}

export function FormSubmissionsPanel({ session, onClose }: Props) {
  function handleExportPdf() {
    try {
      exportSessionSubmissionsPdf(session)
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Não foi possível exportar o PDF')
    }
  }

  return (
    <Card as="section" className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h2>Respostas submetidas</h2>
          <p className={styles.meta}>
            {session.patient.fullName} · {session.location.name}
          </p>
        </div>
        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={handleExportPdf}>
            Exportar PDF
          </Button>
          {onClose && (
            <button type="button" className={styles.closeButton} onClick={onClose}>
              Fechar
            </button>
          )}
        </div>
      </div>

      {session.submissions.length === 0 ? (
        <p className={styles.empty}>Ainda não existem formulários submetidos nesta sessão.</p>
      ) : (
        <div className={styles.forms}>
          {session.submissions.map((submission) => (
            <article key={submission.formId} className={styles.formBlock}>
              <header className={styles.formHeader}>
                <h3>{submission.title}</h3>
                <time dateTime={submission.submittedAt}>
                  {new Date(submission.submittedAt).toLocaleString('pt-PT')}
                </time>
              </header>
              <dl className={styles.fieldList}>
                {submission.fields.map((field) => (
                  <div key={field.key} className={styles.field}>
                    <dt>{field.label}</dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      )}
    </Card>
  )
}
