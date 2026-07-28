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

export function PiccaReadOnlyText({ children }: { children: ReactNode }) {
  return <div className={styles.staticText}>{children}</div>
}

export function PiccaRadioGroup({
  label,
  options,
  value,
  onChange,
  readOnly,
}: {
  label?: string
  options: Array<{ id: string; label: string }>
  value: string
  onChange: (next: string) => void
  readOnly?: boolean
}) {
  return (
    <div className={styles.field}>
      {label && <span>{label}</span>}
      <div className={`${styles.radioGroup} ${readOnly ? styles.readOnly : ''}`}>
        {options.map((opt) => (
          <label key={opt.id} className={styles.radioLabel}>
            <input
              type="radio"
              name={label ?? 'radio'}
              checked={value === opt.id}
              onChange={() => onChange(opt.id)}
              disabled={readOnly}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  )
}

type CaregiverInfo = {
  nome: string
  idade: string
  escolaridade: string
  profissao: string
  contacto: string
}

export function PiccaCaregiverFields({
  title,
  value,
  onChange,
  readOnly,
}: {
  title: string
  value: CaregiverInfo
  onChange: (next: CaregiverInfo) => void
  readOnly?: boolean
}) {
  function set(field: keyof CaregiverInfo, val: string) {
    onChange({ ...value, [field]: val })
  }

  return (
    <div className={styles.caregiverBlock}>
      <h4 className={styles.caregiverTitle}>{title}</h4>
      <div className={styles.inlineFields}>
        <PiccaTextField
          label="Nome"
          value={value.nome}
          onChange={(nome) => set('nome', nome)}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Idade"
          value={value.idade}
          onChange={(idade) => set('idade', idade)}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Escolaridade"
          value={value.escolaridade}
          onChange={(escolaridade) => set('escolaridade', escolaridade)}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Profissão"
          value={value.profissao}
          onChange={(profissao) => set('profissao', profissao)}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Contacto"
          value={value.contacto}
          onChange={(contacto) => set('contacto', contacto)}
          readOnly={readOnly}
        />
      </div>
    </div>
  )
}

type ClinicalObservationRow = {
  observacao: string
  alerta: boolean
  integracao5Ps: string
}

export function PiccaClinicalObservationTable({
  rows,
  value,
  onChange,
  readOnly,
}: {
  rows: Array<{ id: string; label: string }>
  value: Record<string, ClinicalObservationRow>
  onChange: (next: Record<string, ClinicalObservationRow>) => void
  readOnly?: boolean
}) {
  function update(id: string, patch: Partial<ClinicalObservationRow>) {
    const current = value[id] ?? { observacao: '', alerta: false, integracao5Ps: '' }
    onChange({ ...value, [id]: { ...current, ...patch } })
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Indicador</th>
            <th>Observação</th>
            <th>Alerta</th>
            <th>Integração Clínica (5 P&apos;s)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.label}</td>
              <td>
                <input
                  type="text"
                  value={value[row.id]?.observacao ?? ''}
                  onChange={(e) => update(row.id, { observacao: e.target.value })}
                  readOnly={readOnly}
                  disabled={readOnly}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={value[row.id]?.alerta ?? false}
                  onChange={(e) => update(row.id, { alerta: e.target.checked })}
                  disabled={readOnly}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={value[row.id]?.integracao5Ps ?? ''}
                  onChange={(e) => update(row.id, { integracao5Ps: e.target.value })}
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

export function PiccaInstrumentTable({
  instruments,
  value,
  onChange,
  readOnly,
}: {
  instruments: Array<{ id: string; label: string }>
  value: Record<string, { resultados: string; integracao: string }>
  onChange: (next: Record<string, { resultados: string; integracao: string }>) => void
  readOnly?: boolean
}) {
  function update(id: string, field: 'resultados' | 'integracao', val: string) {
    const current = value[id] ?? { resultados: '', integracao: '' }
    onChange({ ...value, [id]: { ...current, [field]: val } })
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Instrumento</th>
            <th>Resultados relevantes</th>
            <th>Integração clínica</th>
          </tr>
        </thead>
        <tbody>
          {instruments.map((inst) => (
            <tr key={inst.id}>
              <td>{inst.label}</td>
              <td>
                <input
                  type="text"
                  value={value[inst.id]?.resultados ?? ''}
                  onChange={(e) => update(inst.id, 'resultados', e.target.value)}
                  readOnly={readOnly}
                  disabled={readOnly}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={value[inst.id]?.integracao ?? ''}
                  onChange={(e) => update(inst.id, 'integracao', e.target.value)}
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

type AcademicLevel = 'sem' | 'alguma' | 'significativa' | ''

export function PiccaAcademicLevelMatrix({
  rows,
  value,
  onChange,
  readOnly,
}: {
  rows: Array<{ id: string; label: string }>
  value: Record<string, AcademicLevel>
  onChange: (next: Record<string, AcademicLevel>) => void
  readOnly?: boolean
}) {
  const cols: Array<{ id: AcademicLevel; label: string }> = [
    { id: 'sem', label: 'Sem dificuldade' },
    { id: 'alguma', label: 'Alguma dificuldade' },
    { id: 'significativa', label: 'Dificuldade significativa' },
  ]

  return (
    <div className={styles.tableWrap}>
      <table className={`${styles.table} ${styles.matrix}`}>
        <thead>
          <tr>
            <th>Domínio</th>
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
                    name={`acad-${row.id}`}
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

export function PiccaFixedRowTable({
  rows,
  columns,
  value,
  onChange,
  readOnly,
  rowHeaderLabel = 'Área',
}: {
  rows: Array<{ id: string; label: string }>
  columns: Array<{ key: string; label: string }>
  value: Record<string, Record<string, string>>
  onChange: (next: Record<string, Record<string, string>>) => void
  readOnly?: boolean
  rowHeaderLabel?: string
}) {
  function update(rowId: string, colKey: string, val: string) {
    const current = value[rowId] ?? Object.fromEntries(columns.map((col) => [col.key, '']))
    onChange({ ...value, [rowId]: { ...current, [colKey]: val } })
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{rowHeaderLabel}</th>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.label}</td>
              {columns.map((col) => (
                <td key={col.key}>
                  <input
                    type="text"
                    value={value[row.id]?.[col.key] ?? ''}
                    onChange={(e) => update(row.id, col.key, e.target.value)}
                    readOnly={readOnly}
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

export function PiccaEditableDataTable({
  columns,
  rows,
  onChange,
  readOnly,
}: {
  columns: Array<{ key: string; label: string }>
  rows: Array<Record<string, string>>
  onChange: (next: Array<Record<string, string>>) => void
  readOnly?: boolean
}) {
  function updateRow(index: number, key: string, val: string) {
    onChange(rows.map((row, i) => (i === index ? { ...row, [key]: val } : row)))
  }

  function addRow() {
    onChange([...rows, Object.fromEntries(columns.map((col) => [col.key, '']))])
  }

  function removeRow(index: number) {
    onChange(rows.filter((_, i) => i !== index))
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {!readOnly && <th />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col.key}>
                  <input
                    type="text"
                    value={row[col.key] ?? ''}
                    onChange={(e) => updateRow(index, col.key, e.target.value)}
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
