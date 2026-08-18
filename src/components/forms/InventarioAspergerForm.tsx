import { QUESTIONNAIRE_NOTES_FIELD, type QuestionnaireDefinition } from '../../lib/questionnaires'
import type { PatientFormRendererProps } from './formRegistry'
import styles from './InventarioAspergerForm.module.css'
import formStyles from './FormFields.module.css'

type IdentField = {
  id: string
  text: string
  inputType?: 'text' | 'choice'
  options?: string[]
}

type LikertItem = { num: number; text: string }
type LikertSection = { title: string; items: LikertItem[] }
type CompItem = { id: string; text: string; inputType?: 'text' }
type CompSection = { title: string; items: CompItem[] }

type InventarioMeta = {
  identification?: IdentField[]
  likertSections?: LikertSection[]
  complementary?: CompSection[]
  likertLabels?: string[]
}

function inventarioItemId(num: number): string {
  return `item_${String(num).padStart(2, '0')}`
}

function getMeta(definition: QuestionnaireDefinition | null | undefined): InventarioMeta {
  return (definition?.meta as InventarioMeta | undefined) ?? {}
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

export function InventarioAspergerForm({
  values,
  onChange,
  readOnly,
  definition,
}: PatientFormRendererProps) {
  const meta = getMeta(definition)
  const likertLabels = meta.likertLabels ?? ['0', '1', '2', '3']

  function setValue(key: string, value: unknown) {
    onChange({ ...values, [key]: value })
  }

  return (
    <div className={styles.section}>
      {definition?.instructions ? <p className={styles.instructions}>{definition.instructions}</p> : null}

      {meta.identification?.length ? (
        <section>
          <h3 className={styles.sectionTitle}>1. Identificação</h3>
          <div className={styles.identGrid}>
            {meta.identification.map((field) => (
              <div key={field.id} className={styles.field}>
                <label htmlFor={field.id}>{field.text}</label>
                {field.inputType === 'choice' && field.options ? (
                  <div className={styles.optionGroup}>
                    {field.options.map((option, index) => (
                      <label key={option} className={styles.radioLabel}>
                        <input
                          type="radio"
                          name={field.id}
                          checked={values[field.id] === index}
                          disabled={readOnly}
                          onChange={() => setValue(field.id, index)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    id={field.id}
                    className={styles.input}
                    value={textValue(values[field.id])}
                    disabled={readOnly}
                    onChange={(event) => setValue(field.id, event.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {meta.likertSections?.map((section) => (
        <section key={section.title}>
          <h3 className={styles.sectionTitle}>{section.title}</h3>
          <ol className={formStyles.questionnaireList}>
            {section.items.map((item) => {
              const itemId = inventarioItemId(item.num)
              const current = values[itemId]
              return (
                <li key={itemId} className={styles.likertItem}>
                  <p className={styles.questionText}>
                    <span className={formStyles.questionNumber}>{item.num}.</span> {item.text}
                  </p>
                  <div className={styles.likertRow}>
                    {likertLabels.map((label, optionIndex) => (
                      <label key={label} className={styles.likertOption}>
                        <input
                          type="radio"
                          name={itemId}
                          checked={current === optionIndex}
                          disabled={readOnly}
                          onChange={() => setValue(itemId, optionIndex)}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      ))}

      {meta.complementary?.length ? (
        <section>
          <h3 className={styles.sectionTitle}>3. Questões complementares</h3>
          {meta.complementary.map((section) => (
            <div key={section.title}>
              <h4 className={styles.sectionTitle}>{section.title}</h4>
              <ol className={formStyles.questionnaireList}>
                {section.items.map((item) => {
                  if (item.inputType === 'text') {
                    return (
                      <li key={item.id} className={styles.likertItem}>
                        <label htmlFor={item.id} className={styles.questionText}>
                          {item.text}
                        </label>
                        <input
                          id={item.id}
                          className={styles.input}
                          value={textValue(values[item.id])}
                          disabled={readOnly}
                          onChange={(event) => setValue(item.id, event.target.value)}
                        />
                      </li>
                    )
                  }
                  const current = values[item.id]
                  return (
                    <li key={item.id} className={styles.likertItem}>
                      <p className={styles.questionText}>{item.text}</p>
                      <div className={styles.optionGroup}>
                        {['Não', 'Sim'].map((label, optionIndex) => (
                          <label key={label} className={styles.radioLabel}>
                            <input
                              type="radio"
                              name={item.id}
                              checked={current === optionIndex}
                              disabled={readOnly}
                              onChange={() => setValue(item.id, optionIndex)}
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          ))}
        </section>
      ) : null}

      <section className={styles.notesSection}>
        <label className={formStyles.notesLabel} htmlFor={QUESTIONNAIRE_NOTES_FIELD}>
          4. Notas
        </label>
        <textarea
          id={QUESTIONNAIRE_NOTES_FIELD}
          className={styles.textarea}
          value={typeof values[QUESTIONNAIRE_NOTES_FIELD] === 'string' ? values[QUESTIONNAIRE_NOTES_FIELD] : ''}
          disabled={readOnly}
          rows={4}
          placeholder="Notas clínicas adicionais…"
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
