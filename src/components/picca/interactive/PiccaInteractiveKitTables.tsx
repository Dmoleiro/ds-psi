import type { PaiMaeCell, PaiMaeAmbosCell, TriStateOutcome, WeekdayKey } from './piccaInteractiveShared'
import { WEEKDAY_KEYS, WEEKDAY_LABELS } from './piccaInteractiveShared'
import { PiccaReadOnlyText } from '../PiccaFields'
import tableStyles from './PiccaInteractiveForm.module.css'

export function KitReadOnlyGuidance({ children }: { children: string }) {
  return (
    <div className={tableStyles.readonlyBlock}>
      <h3>Orientações aos pais</h3>
      <p style={{ margin: 0, color: 'var(--color-ink-muted)', whiteSpace: 'pre-wrap' }}>{children}</p>
    </div>
  )
}

export function PaiMaeWeekMatrix({
  rows,
  value,
  onChange,
  readOnly,
}: {
  rows: Array<{ id: string; label: string }>
  value: Record<string, Record<WeekdayKey, PaiMaeCell>>
  onChange: (next: Record<string, Record<WeekdayKey, PaiMaeCell>>) => void
  readOnly?: boolean
}) {
  function toggle(rowId: string, day: WeekdayKey, field: 'pai' | 'mae') {
    if (readOnly) return
    const cell = value[rowId]?.[day] ?? { pai: false, mae: false }
    onChange({
      ...value,
      [rowId]: {
        ...value[rowId],
        [day]: { ...cell, [field]: !cell[field] },
      },
    })
  }

  return (
    <div className={tableStyles.tableScroll}>
      <table className={tableStyles.gridTable}>
        <thead>
          <tr>
            <th>Tarefa</th>
            {WEEKDAY_KEYS.map((day) => (
              <th key={day}>{WEEKDAY_LABELS[day]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row">{row.label}</th>
              {WEEKDAY_KEYS.map((day) => {
                const cell = value[row.id]?.[day]
                return (
                  <td key={day}>
                    <div className={tableStyles.checkboxPair}>
                      <label>
                        <input
                          type="checkbox"
                          checked={cell?.pai ?? false}
                          disabled={readOnly}
                          onChange={() => toggle(row.id, day, 'pai')}
                        />
                        Pai
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={cell?.mae ?? false}
                          disabled={readOnly}
                          onChange={() => toggle(row.id, day, 'mae')}
                        />
                        Mãe
                      </label>
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function RegistoDiarioTable({
  rows,
  value,
  onChange,
  readOnly,
}: {
  rows: Array<{ id: string; label: string }>
  value: Record<string, { responsavel: PaiMaeAmbosCell; resultado: TriStateOutcome }>
  onChange: (next: typeof value) => void
  readOnly?: boolean
}) {
  function update(
    rowId: string,
    patch: Partial<{ responsavel: PaiMaeAmbosCell; resultado: TriStateOutcome }>,
  ) {
    const current = value[rowId] ?? {
      responsavel: { pai: false, mae: false, ambos: false },
      resultado: '' as TriStateOutcome,
    }
    onChange({ ...value, [rowId]: { ...current, ...patch } })
  }

  function toggleResp(rowId: string, field: keyof PaiMaeAmbosCell) {
    const current = value[rowId]?.responsavel ?? { pai: false, mae: false, ambos: false }
    update(rowId, { responsavel: { ...current, [field]: !current[field] } })
  }

  return (
    <div className={tableStyles.tableScroll}>
      <table className={tableStyles.gridTable}>
        <thead>
          <tr>
            <th>Momento</th>
            <th>Pai</th>
            <th>Mãe</th>
            <th>Ambos</th>
            <th>Como correu?</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const entry = value[row.id]
            return (
              <tr key={row.id}>
                <th scope="row">{row.label}</th>
                {(['pai', 'mae', 'ambos'] as const).map((field) => (
                  <td key={field}>
                    <input
                      type="checkbox"
                      checked={entry?.responsavel?.[field] ?? false}
                      disabled={readOnly}
                      onChange={() => toggleResp(row.id, field)}
                    />
                  </td>
                ))}
                <td>
                  <select
                    value={entry?.resultado ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      update(row.id, { resultado: e.target.value as TriStateOutcome })
                    }
                  >
                    <option value="">—</option>
                    <option value="sim">Sim</option>
                    <option value="parcial">Parcial</option>
                    <option value="nao">Não</option>
                  </select>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function KitStaticObjective({ children }: { children: string }) {
  return <PiccaReadOnlyText>{children}</PiccaReadOnlyText>
}
