import { QUESTIONNAIRE_NOTES_FIELD, type QuestionnaireDefinition } from '../../lib/questionnaires'
import {
  CONNERS_AGE_BAND,
  CONNERS_PAIS_SUBSCALES,
  CONNERS_PROF_SUBSCALES,
  CONNERS_SCORE_LABELS,
  CONNERS_QUALITATIVE_COLUMN,
  computeConnersSummary,
  type ConnersVariant,
} from '../../lib/connersScoring'
import type { PatientFormRendererProps } from './formRegistry'
import formStyles from './FormFields.module.css'
import styles from './ConnersForm.module.css'

const CONNERS_FORM_IDS = new Set([
  'conners_pais',
  'conners_professores',
  'conners_idade_escolar_pais',
])

function variantFromFormId(formId: string | undefined): ConnersVariant {
  return formId === 'conners_professores' ? 'professores' : 'pais'
}

function getLabels(definition: QuestionnaireDefinition): string[] {
  if (definition.responseLabels?.length) return definition.responseLabels
  return ['0', '1', '2', '3']
}

function formatCell(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return String(value)
}

export function ConnersForm({
  values,
  onChange,
  readOnly,
  definition,
}: PatientFormRendererProps) {
  if (!definition) {
    return <p className={formStyles.muted}>A carregar questionário…</p>
  }

  const variant = variantFromFormId(definition.id)
  const labels = getLabels(definition)
  const itemCount = definition.items.length
  const summary = computeConnersSummary(variant, values, itemCount)
  const subscaleDefs =
    variant === 'pais' ? CONNERS_PAIS_SUBSCALES : CONNERS_PROF_SUBSCALES

  function setValue(key: string, value: unknown) {
    onChange({ ...values, [key]: value })
  }

  return (
    <div className={styles.section}>
      <p className={styles.instructions}>{definition.instructions}</p>

      <section className={styles.identSection}>
        <h3 className={styles.identTitle}>Dados para cotação normativa</h3>
        <div className={styles.identGrid}>
          <div className={styles.field}>
            <span>Sexo</span>
            <div className={styles.optionGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="conners_sexo"
                  checked={values.conners_sexo === 0}
                  disabled={readOnly}
                  onChange={() => setValue('conners_sexo', 0)}
                />
                Masculino
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="conners_sexo"
                  checked={values.conners_sexo === 1}
                  disabled={readOnly}
                  onChange={() => setValue('conners_sexo', 1)}
                />
                Feminino
              </label>
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="conners_idade">Idade (anos)</label>
            <input
              id="conners_idade"
              className={styles.input}
              type="number"
              min={1}
              max={18}
              value={
                typeof values.conners_idade === 'number' || typeof values.conners_idade === 'string'
                  ? values.conners_idade
                  : ''
              }
              disabled={readOnly}
              onChange={(event) => {
                const raw = event.target.value
                setValue('conners_idade', raw === '' ? undefined : Number(raw))
              }}
            />
          </div>
        </div>
        <p className={styles.normHint}>
          Tabelas normativas disponíveis para idades {CONNERS_AGE_BAND} anos (sexo masculino e feminino).
        </p>
        {summary.age !== null && !summary.ageInNormBand ? (
          <p className={styles.normWarning}>
            A idade indicada está fora da faixa {CONNERS_AGE_BAND} anos — apenas somas brutas são mostradas.
          </p>
        ) : null}
        {summary.sex === null || summary.age === null ? (
          <p className={styles.normHint}>Indique sexo e idade para calcular scores padrão e percentis.</p>
        ) : null}
        {variant === 'pais' ? (
          <p className={styles.normHint}>
            Problemas de oposição: cotação normativa com tabelas da versão professores.
          </p>
        ) : null}
      </section>

      <section className={styles.cotationSection}>
        <h3 className={styles.cotationTitle}>Cotação</h3>
        <table className={styles.summaryTable}>
          <thead>
            <tr>
              <th>Subescala</th>
              <th>Soma bruta</th>
              <th>Score padrão</th>
              <th>Percentil</th>
              <th>{CONNERS_QUALITATIVE_COLUMN}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(subscaleDefs).map(([key, def]) => {
              const row = summary.subscales[key]
              return (
                <tr key={key}>
                  <td>{def.label}</td>
                  <td>{formatCell(row?.raw)}</td>
                  <td>{formatCell(row?.standardScore)}</td>
                  <td>{formatCell(row?.percentile)}</td>
                  <td>{formatCell(row?.qualitative)}</td>
                </tr>
              )
            })}
            <tr className={styles.totalRow}>
              <td>Total (todos os itens)</td>
              <td>{formatCell(summary.total.raw)}</td>
              <td>—</td>
              <td>—</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </section>

      <ol className={formStyles.questionnaireList}>
        {definition.items.map((item, index) => {
          const current = values[item.id]
          return (
            <li key={item.id} className={formStyles.questionnaireItem}>
              <p className={formStyles.questionText}>
                <span className={formStyles.questionNumber}>{index + 1}.</span> {item.text}
              </p>
              <div className={formStyles.likertRow}>
                {labels.map((label, optionIndex) => (
                  <label key={label} className={formStyles.likertOption}>
                    <input
                      type="radio"
                      name={item.id}
                      checked={current === optionIndex}
                      disabled={readOnly}
                      onChange={() => setValue(item.id, optionIndex)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </li>
          )
        })}
      </ol>

      <section className={formStyles.notesSection}>
        <label className={formStyles.notesLabel} htmlFor={QUESTIONNAIRE_NOTES_FIELD}>
          Notas
        </label>
        <p className={formStyles.notesHint}>
          Observações sobre o preenchimento em conjunto com o paciente (opcional).
        </p>
        <textarea
          id={QUESTIONNAIRE_NOTES_FIELD}
          className={formStyles.textarea}
          value={
            typeof values[QUESTIONNAIRE_NOTES_FIELD] === 'string'
              ? values[QUESTIONNAIRE_NOTES_FIELD]
              : ''
          }
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
          <h3>Pontuação guardada</h3>
          <ul className={styles.scoresList}>
            {Object.entries(values._scores as Record<string, number>).map(([key, score]) => (
              <li key={key}>
                {CONNERS_SCORE_LABELS[key] ?? key}: <strong>{score}</strong>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

export function isConnersFormId(formId: string): boolean {
  return CONNERS_FORM_IDS.has(formId)
}
