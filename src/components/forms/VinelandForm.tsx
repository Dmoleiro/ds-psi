import { QUESTIONNAIRE_NOTES_FIELD, type QuestionnaireDefinition } from '../../lib/questionnaires'
import {
  type AreaCotationConfig,
  computeMaladaptiveCotationSheet,
  computeVinelandAreaCotationSheet,
  type VinelandMaladaptiveCotation,
} from '../../lib/vinelandScoring'
import type { PatientFormRendererProps } from './formRegistry'
import styles from './VinelandForm.module.css'
import formStyles from './FormFields.module.css'

type IdentField = {
  id: string
  text: string
  inputType?: string
  section?: string
  wide?: boolean
}

type VinelandItem = {
  num: number
  id: string
  text: string
  subdomain: string
  age?: string
  rules?: string[]
}

type VinelandSubdomain = { id: string; label: string; max?: number }

type VinelandArea = {
  id: string
  title: string
  prefix: string
  subdomains: VinelandSubdomain[]
  items: VinelandItem[]
  observationsId?: string
}

type MaladaptiveItem = { num: number; id: string; text: string }

type InterviewNote = { id: string; text: string; rows?: number }

type VinelandMeta = {
  identification?: IdentField[]
  areas?: VinelandArea[]
  maladaptivePart1?: MaladaptiveItem[]
  maladaptivePart2?: MaladaptiveItem[]
  interviewNotes?: InterviewNote[]
  responseLabels?: string[]
  subdomainLabels?: Record<string, string>
  cotationConfig?: Record<string, AreaCotationConfig>
  maladaptiveCotation?: VinelandMaladaptiveCotation
}

const DEFAULT_MALADAPTIVE_COTATION: VinelandMaladaptiveCotation = {
  part1Label: 'A. PARTE 1 Cotação Total (Soma de 2, 1, 0 da Parte 1)',
  part2Label: 'B. Soma de 2, 1, 0 da Parte 2',
  totalLabel: 'PARTES 1 e 2 Cotação Total (Somar A e B)',
}

const SECTION_TITLES: Record<string, string> = {
  sujeito: 'Sujeito',
  entrevistado: 'Entrevistado',
  entrevistador: 'Entrevistador',
  idade: 'Idade',
  outros_testes: 'Dados de outros testes',
}

const ADAPTIVE_SCORES = [2, 1, 0, 'N', 'D'] as const
const MALADAPTIVE_SCORES = [2, 1, 0] as const

function getMeta(definition: QuestionnaireDefinition | null | undefined): VinelandMeta {
  return (definition?.meta as VinelandMeta | undefined) ?? {}
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function severityId(num: number): string {
  return `mbd_${String(num).padStart(2, '0')}_sev`
}

function ruleLabel(rule: string): string {
  if (rule === 'no_score_1') return '(NÃO COTAR 1)'
  if (rule === 'allow_n') return '(PODE-SE COTAR N)'
  return rule
}

function renderAreaCotationTable(
  area: VinelandArea,
  config: AreaCotationConfig,
  values: Record<string, unknown>,
) {
  const sheet = computeVinelandAreaCotationSheet(area, config, values)
  return (
    <div className={styles.cotationSection}>
      <h4 className={styles.cotationTitle}>Cotação</h4>
      <table className={styles.summaryTable}>
        <thead>
          <tr>
            <th />
            {sheet.subdomains.map((sub) => (
              <th key={sub.id}>{sub.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sheet.rows.map((row) => (
            <tr key={row.id} className={row.kind === 'total' ? styles.cotationTotalRow : undefined}>
              <td>{row.label}</td>
              {sheet.subdomains.map((sub) => (
                <td key={sub.id}>
                  {row.values[sub.id] ?? 0}
                  {row.kind === 'total' && sub.max ? (
                    <span className={styles.cotationMax}> / {sub.max}</span>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function VinelandForm({ values, onChange, readOnly, definition }: PatientFormRendererProps) {
  const meta = getMeta(definition)
  const responseLabels = meta.responseLabels ?? definition?.responseLabels ?? []
  const maladaptivePart1 = meta.maladaptivePart1 ?? []
  const maladaptivePart2 = meta.maladaptivePart2 ?? []

  function setValue(key: string, value: unknown) {
    onChange({ ...values, [key]: value })
  }

  function renderIdentSection(sectionKey: string, fields: IdentField[]) {
    return (
      <div key={sectionKey} className={styles.identSection}>
        <h4 className={styles.sectionTitle}>{SECTION_TITLES[sectionKey] ?? sectionKey}</h4>
        <div className={styles.identGrid}>
          {fields.map((field) => {
            const isWide = field.wide === true
            return (
              <div key={field.id} className={isWide ? styles.fieldFull : styles.field}>
                <label htmlFor={field.id}>{field.text}</label>
                {isWide ? (
                  <textarea
                    id={field.id}
                    className={styles.textarea}
                    rows={3}
                    value={textValue(values[field.id])}
                    disabled={readOnly}
                    onChange={(event) => setValue(field.id, event.target.value)}
                  />
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
            )
          })}
        </div>
      </div>
    )
  }

  function renderAdaptiveScoreOptions(
    itemId: string,
    current: unknown,
    rules: string[] | undefined,
  ) {
    const noScore1 = rules?.includes('no_score_1')
    return (
      <div className={styles.scoreRow}>
        {ADAPTIVE_SCORES.map((score, index) => {
          const disabled = readOnly || (noScore1 && score === 1)
          const label = responseLabels[index] ?? String(score)
          return (
            <label
              key={`${itemId}-${score}`}
              className={`${styles.scoreOption} ${disabled && score === 1 && noScore1 ? styles.scoreOptionDisabled : ''}`}
            >
              <input
                type="radio"
                name={itemId}
                checked={current === score}
                disabled={disabled}
                onChange={() => setValue(itemId, score)}
              />
              <span>{label}</span>
            </label>
          )
        })}
      </div>
    )
  }

  function renderMaladaptiveScoreOptions(itemId: string, current: unknown) {
    return (
      <div className={styles.scoreRow}>
        {MALADAPTIVE_SCORES.map((score, index) => {
          const label = responseLabels[index] ?? String(score)
          return (
            <label key={`${itemId}-${score}`} className={styles.scoreOption}>
              <input
                type="radio"
                name={itemId}
                checked={current === score}
                disabled={readOnly}
                onChange={() => setValue(itemId, score)}
              />
              <span>{label}</span>
            </label>
          )
        })}
      </div>
    )
  }

  function renderSeverityOptions(num: number) {
    const fieldId = severityId(num)
    const current = values[fieldId]
    return (
      <div className={styles.severityRow}>
        <span>Severidade:</span>
        <label className={styles.scoreOption}>
          <input
            type="radio"
            name={fieldId}
            checked={current === 'S'}
            disabled={readOnly}
            onChange={() => setValue(fieldId, 'S')}
          />
          S — Severo
        </label>
        <label className={styles.scoreOption}>
          <input
            type="radio"
            name={fieldId}
            checked={current === 'M'}
            disabled={readOnly}
            onChange={() => setValue(fieldId, 'M')}
          />
          M — Moderado
        </label>
      </div>
    )
  }

  const identBySection = new Map<string, IdentField[]>()
  for (const field of meta.identification ?? []) {
    const section = field.section ?? 'outros'
    const list = identBySection.get(section) ?? []
    list.push(field)
    identBySection.set(section, list)
  }

  const maladaptiveCotation = computeMaladaptiveCotationSheet(
    maladaptivePart1.map((item) => item.id),
    maladaptivePart2.map((item) => item.id),
    values,
    meta.maladaptiveCotation ?? DEFAULT_MALADAPTIVE_COTATION,
  )

  return (
    <div className={styles.section}>
      {definition?.instructions ? <p className={styles.instructions}>{definition.instructions}</p> : null}

      {identBySection.size > 0 ? (
        <section>
          <h3 className={styles.sectionTitle}>Identificação</h3>
          {Array.from(identBySection.entries()).map(([sectionKey, fields]) =>
            renderIdentSection(sectionKey, fields),
          )}
        </section>
      ) : null}

      {meta.areas?.map((area) => {
        const cotationConfig = meta.cotationConfig?.[area.id]
        return (
          <section key={area.id} className={styles.areaBlock}>
            <h3 className={styles.areaHeader}>{area.title}</h3>
            <div className={styles.subdomainLegend}>
              {area.subdomains.map((sub) => (
                <span
                  key={sub.id}
                  className={`${styles.subdomainBadge} ${styles[`subdomain_${sub.id}`] ?? ''}`}
                >
                  {sub.label}
                  {sub.max ? ` (máx. ${sub.max})` : ''}
                </span>
              ))}
            </div>
            <ol className={formStyles.questionnaireList}>
              {area.items.map((item) => (
                <li key={item.id} className={styles.itemRow}>
                  <div className={styles.itemMeta}>
                    <span className={styles.itemNum}>{item.num}.</span>
                    {item.age ? <span className={styles.itemAge}>Idade {item.age}</span> : null}
                    <span
                      className={`${styles.subdomainBadge} ${styles[`subdomain_${item.subdomain}`] ?? ''}`}
                    >
                      {area.subdomains.find((s) => s.id === item.subdomain)?.label ?? item.subdomain}
                    </span>
                    {item.rules?.map((rule) => (
                      <span key={rule} className={styles.ruleNote}>{ruleLabel(rule)}</span>
                    ))}
                  </div>
                  <p className={styles.questionText}>{item.text}</p>
                  {renderAdaptiveScoreOptions(item.id, values[item.id], item.rules)}
                </li>
              ))}
            </ol>
            {cotationConfig ? renderAreaCotationTable(area, cotationConfig, values) : null}
            {area.observationsId ? (
              <div className={styles.fieldFull} style={{ marginTop: 'var(--space-md)' }}>
                <label htmlFor={area.observationsId} className={styles.fieldLabel}>
                  Observações
                </label>
                <textarea
                  id={area.observationsId}
                  className={styles.textarea}
                  rows={3}
                  value={textValue(values[area.observationsId])}
                  disabled={readOnly}
                  onChange={(event) => setValue(area.observationsId!, event.target.value)}
                />
              </div>
            ) : null}
          </section>
        )
      })}

      <section className={styles.areaBlock}>
        <h3 className={styles.areaHeader}>Área do Comportamento Desajustado</h3>
        <p className={styles.maladaptiveNote}>
          Opcional — para indivíduos com idade ≥ 5 anos. Cotar apenas com 2, 1 ou 0 (não usar N ou D).
          A Parte 2 é só para comparação com grupos normativos.
        </p>
        <h4 className={styles.sectionTitle}>Parte 1</h4>
        <ol className={formStyles.questionnaireList}>
          {maladaptivePart1.map((item) => (
            <li key={item.id} className={styles.itemRow}>
              <p className={styles.questionText}>
                <span className={styles.itemNum}>{item.num}.</span> {item.text}
              </p>
              {renderMaladaptiveScoreOptions(item.id, values[item.id])}
            </li>
          ))}
        </ol>

        <h4 className={styles.sectionTitle}>Parte 2</h4>
        <ol className={formStyles.questionnaireList}>
          {maladaptivePart2.map((item) => (
            <li key={item.id} className={styles.itemRow}>
              <p className={styles.questionText}>
                <span className={styles.itemNum}>{item.num}.</span> {item.text}
              </p>
              {renderMaladaptiveScoreOptions(item.id, values[item.id])}
              {renderSeverityOptions(item.num)}
            </li>
          ))}
        </ol>
        <table className={`${styles.summaryTable} ${styles.maladaptiveCotationTable}`}>
          <tbody>
            {maladaptiveCotation.rows.map((row) => (
              <tr key={row.id} className={row.id === 'total' ? styles.cotationTotalRow : undefined}>
                <td>{row.label}</td>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.fieldFull}>
          <label htmlFor="mbd_observations" className={styles.fieldLabel}>Observações</label>
          <textarea
            id="mbd_observations"
            className={styles.textarea}
            rows={3}
            value={textValue(values.mbd_observations)}
            disabled={readOnly}
            onChange={(event) => setValue('mbd_observations', event.target.value)}
          />
        </div>
      </section>

      {meta.interviewNotes?.length ? (
        <section>
          <h3 className={styles.sectionTitle}>Acerca da entrevista</h3>
          {meta.interviewNotes.map((note) => (
            <div key={note.id} className={styles.fieldFull} style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor={note.id} className={styles.fieldLabel}>{note.text}</label>
              <textarea
                id={note.id}
                className={styles.textarea}
                rows={note.rows ?? 3}
                value={textValue(values[note.id])}
                disabled={readOnly}
                onChange={(event) => setValue(note.id, event.target.value)}
              />
            </div>
          ))}
        </section>
      ) : null}

      <section className={styles.notesSection}>
        <label htmlFor={QUESTIONNAIRE_NOTES_FIELD} className={styles.fieldLabel}>
          Notas adicionais
        </label>
        <textarea
          id={QUESTIONNAIRE_NOTES_FIELD}
          className={styles.textarea}
          rows={4}
          value={textValue(values[QUESTIONNAIRE_NOTES_FIELD])}
          disabled={readOnly}
          onChange={(event) => setValue(QUESTIONNAIRE_NOTES_FIELD, event.target.value)}
        />
      </section>
    </div>
  )
}
