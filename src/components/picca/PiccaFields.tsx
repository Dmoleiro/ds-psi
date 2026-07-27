import type { ReactNode } from 'react'
import styles from './PiccaForm.module.css'

type FrequencyValue = 'nunca' | 'as_vezes' | 'frequentemente' | ''

export function PiccaSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </section>
  )
}

export function PiccaObjective({ children }: { children: ReactNode }) {
  return <p className={styles.objective}>{children}</p>
}

export function PiccaCheckboxGroup({
  label,
  options,
  value,
  onChange,
  readOnly,
}: {
  label?: string
  options: Array<{ id: string; label: string }>
  value: string[]
  onChange: (next: string[]) => void
  readOnly?: boolean
}) {
  function toggle(id: string) {
    if (readOnly) return
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])
  }

  return (
    <div className={styles.field}>
      {label && <span>{label}</span>}
      <div className={`${styles.checkboxGrid} ${readOnly ? styles.readOnly : ''}`}>
        {options.map((opt) => (
          <label key={opt.id} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={value.includes(opt.id)}
              onChange={() => toggle(opt.id)}
              disabled={readOnly}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  )
}

export function PiccaTextField({
  label,
  value,
  onChange,
  readOnly,
  multiline,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  readOnly?: boolean
  multiline?: boolean
}) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          disabled={readOnly}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          disabled={readOnly}
        />
      )}
    </div>
  )
}

export function PiccaFrequencyMatrix({
  rows,
  value,
  onChange,
  readOnly,
}: {
  rows: Array<{ id: string; label: string }>
  value: Record<string, FrequencyValue>
  onChange: (next: Record<string, FrequencyValue>) => void
  readOnly?: boolean
}) {
  const cols: Array<{ id: FrequencyValue; label: string }> = [
    { id: 'nunca', label: 'Nunca' },
    { id: 'as_vezes', label: 'Às vezes' },
    { id: 'frequentemente', label: 'Frequentemente' },
  ]

  return (
    <div className={styles.tableWrap}>
      <table className={`${styles.table} ${styles.matrix}`}>
        <thead>
          <tr>
            <th>Característica</th>
            {cols.map((col) => (
              <th key={col.id}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.label}</td>
              {cols.map((col) => (
                <td key={col.id}>
                  <input
                    type="radio"
                    name={`freq-${row.id}`}
                    checked={value[row.id] === col.id}
                    onChange={() => onChange({ ...value, [row.id]: col.id })}
                    disabled={readOnly}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function PiccaFamilyTable({
  rows,
  onChange,
  readOnly,
}: {
  rows: Array<{
    name: string
    age: string
    parentesco: string
    viveCom: string
    qualidadeRelacao: string
  }>
  onChange: (next: typeof rows) => void
  readOnly?: boolean
}) {
  function updateRow(index: number, field: keyof (typeof rows)[number], val: string) {
    const next = rows.map((row, i) => (i === index ? { ...row, [field]: val } : row))
    onChange(next)
  }

  function addRow() {
    onChange([
      ...rows,
      { name: '', age: '', parentesco: '', viveCom: '', qualidadeRelacao: '' },
    ])
  }

  function removeRow(index: number) {
    onChange(rows.filter((_, i) => i !== index))
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Idade</th>
            <th>Parentesco</th>
            <th>Vive com a criança</th>
            <th>Qualidade da relação</th>
            {!readOnly && <th />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {(['name', 'age', 'parentesco', 'viveCom', 'qualidadeRelacao'] as const).map((field) => (
                <td key={field}>
                  <input
                    type="text"
                    value={row[field]}
                    onChange={(e) => updateRow(index, field, e.target.value)}
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                </td>
              ))}
              {!readOnly && (
                <td>
                  <button type="button" onClick={() => removeRow(index)}>
                    Remover
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!readOnly && (
        <div className={styles.rowActions}>
          <button type="button" onClick={addRow}>
            Adicionar linha
          </button>
        </div>
      )}
    </div>
  )
}

export function PiccaAntecedentesTable({
  conditions,
  value,
  onChange,
  readOnly,
}: {
  conditions: Array<{ id: string; label: string }>
  value: Record<string, { mae: boolean; pai: boolean; famMaterna: boolean; famPaterna: boolean }>
  onChange: (next: typeof value) => void
  readOnly?: boolean
}) {
  const cols = [
    { key: 'mae' as const, label: 'Mãe' },
    { key: 'pai' as const, label: 'Pai' },
    { key: 'famMaterna' as const, label: 'Família materna' },
    { key: 'famPaterna' as const, label: 'Família paterna' },
  ]

  function toggle(conditionId: string, col: (typeof cols)[number]['key']) {
    const current = value[conditionId] ?? {
      mae: false,
      pai: false,
      famMaterna: false,
      famPaterna: false,
    }
    onChange({
      ...value,
      [conditionId]: { ...current, [col]: !current[col] },
    })
  }

  return (
    <div className={styles.tableWrap}>
      <table className={`${styles.table} ${styles.matrix}`}>
        <thead>
          <tr>
            <th>Condição</th>
            {cols.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {conditions.map((cond) => (
            <tr key={cond.id}>
              <td>{cond.label}</td>
              {cols.map((col) => (
                <td key={col.key}>
                  <input
                    type="checkbox"
                    checked={value[cond.id]?.[col.key] ?? false}
                    onChange={() => toggle(cond.id, col.key)}
                    disabled={readOnly}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function PiccaAlertTable({
  rows,
  value,
  onChange,
  readOnly,
  withSeverity,
}: {
  rows: Array<{ id: string; label: string }>
  value: Record<string, { presente: boolean; notas: string; gravidade?: string }>
  onChange: (next: typeof value) => void
  readOnly?: boolean
  withSeverity?: boolean
}) {
  function update(id: string, patch: Partial<(typeof value)[string]>) {
    const current = value[id] ?? { presente: false, notas: '' }
    onChange({
      ...value,
      [id]: { ...current, ...patch },
    })
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Indicador</th>
            <th>Presente</th>
            {withSeverity && <th>Gravidade</th>}
            <th>Notas</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.label}</td>
              <td>
                <input
                  type="checkbox"
                  checked={value[row.id]?.presente ?? false}
                  onChange={(e) => update(row.id, { presente: e.target.checked })}
                  disabled={readOnly}
                />
              </td>
              {withSeverity && (
                <td>
                  <select
                    value={value[row.id]?.gravidade ?? ''}
                    onChange={(e) => update(row.id, { gravidade: e.target.value })}
                    disabled={readOnly}
                  >
                    <option value="">—</option>
                    <option value="ligeiro">Ligeiro</option>
                    <option value="moderado">Moderado</option>
                    <option value="grave">Grave</option>
                  </select>
                </td>
              )}
              <td>
                <input
                  type="text"
                  value={value[row.id]?.notas ?? ''}
                  onChange={(e) => update(row.id, { notas: e.target.value })}
                  readOnly={readOnly}
                  disabled={readOnly}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
