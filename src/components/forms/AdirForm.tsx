import { QUESTIONNAIRE_NOTES_FIELD, type QuestionnaireDefinition } from '../../lib/questionnaires'
import type { PatientFormRendererProps } from './formRegistry'
import styles from './AdirForm.module.css'
import formStyles from './FormFields.module.css'

type CodeOption = { code: number; text: string }

type IdentField = {
  id: string
  text: string
  inputType?: 'text' | 'textarea' | 'choice'
  options?: string[]
}

type SectionItem = {
  num: string
  id: string
  text: string
  type: 'coded' | 'age' | 'concerns' | 'retrospective' | 'loss'
  notes?: string[]
  probes?: string[]
  codes?: CodeOption[]
  timepoints?: string[]
}

type Section = {
  title: string
  items: SectionItem[]
}

type AdirMeta = {
  introScript?: string
  identification?: IdentField[]
  background?: IdentField[]
  sections?: Section[]
  timepointLabels?: Record<string, string>
  concernsCodes?: CodeOption[]
  retroCodes?: CodeOption[]
  lossCodes?: CodeOption[]
  ageHint?: string
}

const PRIORITY_LABELS = ['A — principal', 'B', 'C', 'D']

function getMeta(definition: QuestionnaireDefinition | null | undefined): AdirMeta {
  return (definition?.meta as AdirMeta | undefined) ?? {}
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function fieldId(itemId: string, suffix: string): string {
  return `${itemId}_${suffix}`
}

function renderCodeRadios(
  name: string,
  codes: CodeOption[],
  current: unknown,
  readOnly: boolean,
  onSelect: (code: number) => void,
) {
  return (
    <div className={styles.codeGrid}>
      {codes.map(({ code, text }) => (
        <label key={`${name}-${code}`} className={styles.codeOption}>
          <input
            type="radio"
            name={name}
            checked={current === code}
            disabled={readOnly}
            onChange={() => onSelect(code)}
          />
          <span>
            <strong>{code}</strong> — {text}
          </span>
        </label>
      ))}
    </div>
  )
}

export function AdirForm({ values, onChange, readOnly, definition }: PatientFormRendererProps) {
  const meta = getMeta(definition)
  const timepointLabels = meta.timepointLabels ?? {}
  const concernsCodes = meta.concernsCodes ?? []
  const retroCodes = meta.retroCodes ?? []
  const lossCodes = meta.lossCodes ?? []
  const ageHint = meta.ageHint ?? 'Idade em meses'

  function setValue(key: string, value: unknown) {
    onChange({ ...values, [key]: value })
  }

  function renderIdentField(field: IdentField) {
    if (field.inputType === 'choice' && field.options) {
      return (
        <div key={field.id} className={styles.field}>
          <span className={styles.fieldLabel}>{field.text}</span>
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
        </div>
      )
    }

    if (field.inputType === 'textarea') {
      return (
        <div key={field.id} className={styles.fieldFull}>
          <label htmlFor={field.id} className={styles.fieldLabel}>
            {field.text}
          </label>
          <textarea
            id={field.id}
            className={styles.textarea}
            value={textValue(values[field.id])}
            disabled={readOnly}
            rows={3}
            onChange={(event) => setValue(field.id, event.target.value)}
          />
        </div>
      )
    }

    return (
      <div key={field.id} className={styles.field}>
        <label htmlFor={field.id} className={styles.fieldLabel}>
          {field.text}
        </label>
        <input
          id={field.id}
          className={styles.input}
          value={textValue(values[field.id])}
          disabled={readOnly}
          onChange={(event) => setValue(field.id, event.target.value)}
        />
      </div>
    )
  }

  function renderDetailsField(itemId: string) {
    const id = fieldId(itemId, 'detalhe')
    return (
      <div className={styles.detailsBlock}>
        <label htmlFor={id} className={styles.detailsLabel}>
          Descrição do comportamento (obrigatório para verificação da cotação)
        </label>
        <textarea
          id={id}
          className={styles.textarea}
          value={textValue(values[id])}
          disabled={readOnly}
          rows={3}
          placeholder="Registe exemplos e pormenores observados…"
          onChange={(event) => setValue(id, event.target.value)}
        />
      </div>
    )
  }

  function renderItemBody(item: SectionItem) {
    if (item.type === 'concerns') {
      return (
        <>
          <p className={styles.itemHint}>Cote as preocupações por ordem de prioridade (A–D).</p>
          {(['a', 'b', 'c', 'd'] as const).map((box, index) => {
            const id = fieldId(item.id, box)
            return (
              <div key={id} className={styles.timepointBlock}>
                <p className={styles.timepointTitle}>{PRIORITY_LABELS[index]}</p>
                {renderCodeRadios(id, concernsCodes, values[id], readOnly, (code) => setValue(id, code))}
              </div>
            )
          })}
          {renderDetailsField(item.id)}
        </>
      )
    }

    if (item.type === 'age') {
      return (
        <>
          <p className={styles.ageHint}>{ageHint}</p>
          <input
            id={item.id}
            className={styles.input}
            value={textValue(values[item.id])}
            disabled={readOnly}
            placeholder="meses ou código 991–999"
            onChange={(event) => setValue(item.id, event.target.value)}
          />
          {renderDetailsField(item.id)}
        </>
      )
    }

    if (item.type === 'retrospective') {
      return (
        <>
          {renderCodeRadios(item.id, retroCodes, values[item.id], readOnly, (code) => setValue(item.id, code))}
          {renderDetailsField(item.id)}
        </>
      )
    }

    if (item.type === 'loss') {
      const id = fieldId(item.id, 'ever')
      return (
        <>
          <p className={styles.timepointTitle}>{timepointLabels.ever ?? 'Alguma vez'}</p>
          {renderCodeRadios(id, lossCodes, values[id], readOnly, (code) => setValue(id, code))}
          {renderDetailsField(item.id)}
        </>
      )
    }

    const codes = item.codes ?? []
    const timepoints = item.timepoints ?? ['actual']
    return (
      <>
        {timepoints.map((tp) => {
          const id = fieldId(item.id, tp)
          return (
            <div key={id} className={styles.timepointBlock}>
              <p className={styles.timepointTitle}>{timepointLabels[tp] ?? tp}</p>
              {renderCodeRadios(id, codes, values[id], readOnly, (code) => setValue(id, code))}
            </div>
          )
        })}
        {renderDetailsField(item.id)}
      </>
    )
  }

  return (
    <div className={styles.section}>
      {definition?.instructions ? <p className={styles.instructions}>{definition.instructions}</p> : null}

      {meta.introScript ? (
        <section className={styles.scriptBox}>
          <h3 className={styles.sectionTitle}>Perguntas introdutórias</h3>
          <p>{meta.introScript}</p>
        </section>
      ) : null}

      {meta.identification?.length ? (
        <section>
          <h3 className={styles.sectionTitle}>Identificação</h3>
          <div className={styles.identGrid}>{meta.identification.map(renderIdentField)}</div>
        </section>
      ) : null}

      {meta.background?.length ? (
        <section>
          <h3 className={styles.sectionTitle}>Antecedentes e contexto</h3>
          <div className={styles.backgroundGrid}>{meta.background.map(renderIdentField)}</div>
        </section>
      ) : null}

      {meta.sections?.map((section) => (
        <section key={section.title}>
          <h3 className={styles.sectionTitle}>{section.title}</h3>
          <ol className={formStyles.questionnaireList}>
            {section.items.map((item) => (
              <li key={item.id} className={styles.itemBlock}>
                <p className={styles.questionText}>
                  <span className={formStyles.questionNumber}>{item.num}.</span> {item.text}
                </p>

                {item.notes?.length ? (
                  <div className={styles.notesBox}>
                    {item.notes.map((note) => (
                      <p key={note.slice(0, 40)}>{note}</p>
                    ))}
                  </div>
                ) : null}

                {item.probes?.length ? (
                  <details className={styles.probeDetails}>
                    <summary>Sondagens / texto da entrevista</summary>
                    <ol className={styles.probeList}>
                      {item.probes.map((probe) => (
                        <li key={probe.slice(0, 60)}>{probe}</li>
                      ))}
                    </ol>
                  </details>
                ) : null}

                {item.codes?.length && item.type === 'coded' ? (
                  <details className={styles.probeDetails}>
                    <summary>Critérios de cotação (referência)</summary>
                    <ul className={styles.codeRefList}>
                      {item.codes.map(({ code, text }) => (
                        <li key={`${item.id}-ref-${code}`}>
                          <strong>{code}</strong> — {text}
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}

                {renderItemBody(item)}
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section className={styles.notesSection}>
        <label className={formStyles.notesLabel} htmlFor={QUESTIONNAIRE_NOTES_FIELD}>
          Impressões gerais e sumário da entrevista
        </label>
        <p className={formStyles.notesHint}>
          Discrepâncias entre informador e observação, impressões clínicas, circunstâncias da entrevista.
        </p>
        <textarea
          id={QUESTIONNAIRE_NOTES_FIELD}
          className={styles.textarea}
          value={typeof values[QUESTIONNAIRE_NOTES_FIELD] === 'string' ? values[QUESTIONNAIRE_NOTES_FIELD] : ''}
          disabled={readOnly}
          rows={5}
          placeholder="Notas clínicas adicionais…"
          onChange={(event) => setValue(QUESTIONNAIRE_NOTES_FIELD, event.target.value)}
        />
      </section>
    </div>
  )
}
