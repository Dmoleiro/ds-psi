import styles from './FormFields.module.css'
import { QUESTIONNAIRE_NOTES_FIELD, type QuestionnaireDefinition } from '../../lib/questionnaires'
import type { PatientFormRendererProps } from './formRegistry'

const DEFAULT_LABELS: Record<string, string[]> = {
  yes_no: ['Não', 'Sim'],
  likert3_sdq: ['Não é verdade', 'É um pouco verdade', 'É muito verdade'],
  likert4: ['0', '1', '2', '3'],
  likert5: ['1', '2', '3', '4', '5'],
  likert7: ['1', '2', '3', '4', '5', '6', '7'],
  frequency0_3: ['0', '1', '2', '3'],
  frequency0_2: ['0', '1', '2'],
  rating4: ['1', '2', '3', '4'],
}

type Props = PatientFormRendererProps & {
  definition?: QuestionnaireDefinition | null
}

function getLabels(definition: QuestionnaireDefinition): string[] {
  if (definition.responseLabels?.length) return definition.responseLabels
  return DEFAULT_LABELS[definition.responseType] ?? ['0', '1', '2']
}

export function QuestionnaireForm({ values, onChange, readOnly, definition }: Props) {
  if (!definition) {
    return <p className={styles.muted}>A carregar questionário…</p>
  }

  const labels = getLabels(definition)

  function setValue(itemId: string, value: number | string) {
    onChange({ ...values, [itemId]: value })
  }

  return (
    <div className={styles.formSection}>
      <p className={styles.instructions}>{definition.instructions}</p>
      <ol className={styles.questionnaireList}>
        {definition.items.map((item, index) => {
          const current = values[item.id]
          if (item.inputType === 'text' || item.inputType === 'textarea') {
            const InputTag = item.inputType === 'textarea' ? 'textarea' : 'input'
            return (
              <li key={item.id} className={styles.questionnaireItem}>
                <p className={styles.questionText}>
                  <span className={styles.questionNumber}>{index + 1}.</span> {item.text}
                </p>
                <InputTag
                  className={item.inputType === 'textarea' ? styles.textarea : styles.input}
                  value={typeof current === 'string' ? current : ''}
                  disabled={readOnly}
                  rows={item.inputType === 'textarea' ? 3 : undefined}
                  onChange={(event) => setValue(item.id, event.target.value)}
                />
              </li>
            )
          }
          if (definition.responseType === 'forced_choice' && item.options) {
            return (
              <li key={item.id} className={styles.questionnaireItem}>
                <p className={styles.questionText}>
                  <span className={styles.questionNumber}>{index + 1}.</span> {item.text}
                </p>
                <div className={styles.optionGroup}>
                  {item.options.map((option, optionIndex) => (
                    <label key={option} className={styles.radioLabel}>
                      <input
                        type="radio"
                        name={item.id}
                        checked={current === optionIndex}
                        disabled={readOnly}
                        onChange={() => setValue(item.id, optionIndex)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </li>
            )
          }

          return (
            <li key={item.id} className={styles.questionnaireItem}>
              <p className={styles.questionText}>
                <span className={styles.questionNumber}>{index + 1}.</span> {item.text}
              </p>
              <div className={styles.likertRow}>
                {labels.map((label, optionIndex) => {
                  const value =
                    definition.responseType === 'likert5' ||
                    definition.responseType === 'likert7' ||
                    definition.responseType === 'rating4'
                      ? optionIndex + 1
                      : optionIndex
                  return (
                    <label key={label} className={styles.likertOption}>
                      <input
                        type="radio"
                        name={item.id}
                        checked={current === value}
                        disabled={readOnly}
                        onChange={() => setValue(item.id, value)}
                      />
                      <span>{label}</span>
                    </label>
                  )
                })}
              </div>
            </li>
          )
        })}
      </ol>
      <section className={styles.notesSection}>
        <label className={styles.notesLabel} htmlFor={QUESTIONNAIRE_NOTES_FIELD}>
          Notas
        </label>
        <p className={styles.notesHint}>
          Observações sobre o preenchimento em conjunto com o paciente (opcional).
        </p>
        <textarea
          id={QUESTIONNAIRE_NOTES_FIELD}
          className={styles.textarea}
          value={typeof values[QUESTIONNAIRE_NOTES_FIELD] === 'string' ? values[QUESTIONNAIRE_NOTES_FIELD] : ''}
          disabled={readOnly}
          rows={4}
          placeholder="Escreva aqui as suas notas…"
          onChange={(event) => setValue(QUESTIONNAIRE_NOTES_FIELD, event.target.value)}
        />
      </section>
      {readOnly &&
      typeof values._scores === 'object' &&
      values._scores !== null &&
      !Array.isArray(values._scores) ? (
        <section className={styles.scoresSection}>
          <h3>Pontuação</h3>
          <ul>
            {Object.entries(values._scores as Record<string, number>).map(([key, score]) => (
              <li key={key}>
                {key}: <strong>{score}</strong>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
