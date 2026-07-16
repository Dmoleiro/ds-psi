import styles from './FormFields.module.css'

type Props = {
  answers: Record<string, unknown>
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não'
  if (typeof value === 'string') return value.trim()
  return String(value)
}

export function GenericFormAnswers({ answers }: Props) {
  const entries = Object.entries(answers).filter(([, value]) => formatValue(value) !== '')

  if (entries.length === 0) {
    return <p className={styles.muted}>Sem respostas registadas.</p>
  }

  return (
    <dl className={styles.answerList}>
      {entries.map(([key, value]) => (
        <div key={key} className={styles.answerItem}>
          <dt>{key}</dt>
          <dd>{formatValue(value)}</dd>
        </div>
      ))}
    </dl>
  )
}
