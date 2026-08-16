import styles from '../../PiccaForm.module.css'
import type { Vol7IndicatorAnswer, Vol7IndicatorItem } from './piccaVol7Content'

const TWO_COLUMN_OPTIONS = [
  { id: '', label: '—' },
  { id: 'sim', label: 'Sim' },
  { id: 'nao', label: 'Não' },
] as const

const THREE_COLUMN_OPTIONS = [
  ...TWO_COLUMN_OPTIONS,
  { id: 'nao_observado', label: 'N. obs.' },
] as const

type Props = {
  items: Vol7IndicatorItem[]
  threeColumn: boolean
  value: Record<string, Vol7IndicatorAnswer>
  onChange: (next: Record<string, Vol7IndicatorAnswer>) => void
  readOnly?: boolean
}

export function PiccaVol7ChecklistTable({
  items,
  threeColumn,
  value,
  onChange,
  readOnly,
}: Props) {
  const options = threeColumn ? THREE_COLUMN_OPTIONS : TWO_COLUMN_OPTIONS

  function update(id: string, patch: Partial<Vol7IndicatorAnswer>) {
    const current = value[id] ?? { resposta: '', observacoes: '' }
    onChange({ ...value, [id]: { ...current, ...patch } })
  }

  return (
    <div className={styles.tableWrap}>
      <table className={`${styles.table} ${styles.matrix}`}>
        <thead>
          <tr>
            <th>Indicador clínico</th>
            <th>{threeColumn ? 'Sim / Não / N. obs.' : 'Sim / Não'}</th>
            <th>Observações</th>
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
                    value={row?.resposta ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      update(item.id, {
                        resposta: e.target.value as Vol7IndicatorAnswer['resposta'],
                      })
                    }
                  >
                    {options.map((opt) => (
                      <option key={opt.id || 'empty'} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={row?.observacoes ?? ''}
                    disabled={readOnly}
                    onChange={(e) => update(item.id, { observacoes: e.target.value })}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
