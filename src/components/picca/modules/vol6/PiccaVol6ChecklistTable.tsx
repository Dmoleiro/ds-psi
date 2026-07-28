import styles from '../../PiccaForm.module.css'
import type { Vol6IndicatorAnswer, Vol6IndicatorItem } from './piccaVol6Content'

const NIVEL_OPTIONS = [
  { id: '', label: '—' },
  { id: 'n', label: 'N' },
  { id: 'o', label: 'O' },
  { id: 'f', label: 'F' },
] as const

type Props = {
  items: Vol6IndicatorItem[]
  value: Record<string, Vol6IndicatorAnswer>
  onChange: (next: Record<string, Vol6IndicatorAnswer>) => void
  readOnly?: boolean
}

export function PiccaVol6ChecklistTable({ items, value, onChange, readOnly }: Props) {
  function update(id: string, patch: Partial<Vol6IndicatorAnswer>) {
    const current = value[id] ?? {
      nivel: '',
      casa: false,
      escola: false,
      clinica: false,
      outros: false,
      notas: '',
    }
    onChange({ ...value, [id]: { ...current, ...patch } })
  }

  return (
    <div className={styles.tableWrap}>
      <table className={`${styles.table} ${styles.matrix}`}>
        <thead>
          <tr>
            <th>Indicador clínico</th>
            <th>N/O/F</th>
            <th>Casa</th>
            <th>Escola</th>
            <th>Clínica</th>
            <th>Outros</th>
            <th>Notas</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const row = value[item.id]
            return (
              <tr key={item.id}>
                <td>{item.label}</td>
                <td>
                  <select
                    value={row?.nivel ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      update(item.id, { nivel: e.target.value as Vol6IndicatorAnswer['nivel'] })
                    }
                  >
                    {NIVEL_OPTIONS.map((opt) => (
                      <option key={opt.id || 'empty'} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                {(['casa', 'escola', 'clinica', 'outros'] as const).map((field) => (
                  <td key={field}>
                    <input
                      type="checkbox"
                      checked={row?.[field] ?? false}
                      disabled={readOnly}
                      onChange={() => update(item.id, { [field]: !row?.[field] })}
                    />
                  </td>
                ))}
                <td>
                  <input
                    type="text"
                    value={row?.notas ?? ''}
                    disabled={readOnly}
                    onChange={(e) => update(item.id, { notas: e.target.value })}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className={styles.objective}>
        N = não observado · O = observado mas insuficientemente caracterizado · F = evidência
        frequente, persistente e clinicamente relevante
      </p>
    </div>
  )
}
