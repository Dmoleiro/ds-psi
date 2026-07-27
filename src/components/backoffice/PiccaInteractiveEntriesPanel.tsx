import { useMemo, useState } from 'react'
import {
  getPiccaInteractiveFormDefaults,
  hasPiccaInteractiveFormRenderer,
  piccaInteractiveFormRegistry,
} from '../picca/interactive/interactiveFormRegistry'
import { formatDayLabelShort, formatWeekLabel, getWeekStartMonday } from '../../lib/piccaInteractiveWeek'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import styles from './BackofficeLayout.module.css'
import panelStyles from './PiccaInteractiveEntriesPanel.module.css'

export type PiccaInteractiveEntriesView = {
  id: string
  status: string
  patient: { id: string; fullName: string }
  forms: Array<{
    formId: string
    title: string
    kind: 'daily_sono' | 'weekly_estrategias'
  }>
  entries: Array<{
    id: string
    formId: string
    formTitle: string
    kind: 'daily_sono' | 'weekly_estrategias'
    periodKey: string
    answers: Record<string, unknown>
    submittedAt: string
    updatedAt: string
  }>
}

type Props = {
  session: PiccaInteractiveEntriesView
  onClose: () => void
  onSaveEntry: (entryId: string, answers: Record<string, unknown>) => Promise<void>
}

export function PiccaInteractiveEntriesPanel({ session, onClose, onSaveEntry }: Props) {
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const grouped = useMemo(() => {
    const sono = session.entries.filter((entry) => entry.kind === 'daily_sono')
    const estrategias = session.entries.filter((entry) => entry.kind === 'weekly_estrategias')

    const sonoByWeek = new Map<string, typeof sono>()
    for (const entry of sono) {
      const week = getWeekStartMonday(entry.periodKey)
      const list = sonoByWeek.get(week) ?? []
      list.push(entry)
      sonoByWeek.set(week, list)
    }
    for (const list of sonoByWeek.values()) {
      list.sort((a, b) => a.periodKey.localeCompare(b.periodKey))
    }

    const estrategiasByWeek = new Map<string, typeof estrategias>()
    for (const entry of estrategias) {
      const list = estrategiasByWeek.get(entry.periodKey) ?? []
      list.push(entry)
      estrategiasByWeek.set(entry.periodKey, list)
    }

    return {
      sonoWeeks: [...sonoByWeek.entries()].sort((a, b) => b[0].localeCompare(a[0])),
      estrategiasWeeks: [...estrategiasByWeek.entries()].sort((a, b) => b[0].localeCompare(a[0])),
    }
  }, [session.entries])

  function openEntry(entryId: string, formId: string, answers: Record<string, unknown>) {
    setActiveEntryId(entryId)
    setValues({ ...getPiccaInteractiveFormDefaults(formId), ...answers })
    setError('')
  }

  async function handleSave() {
    if (!activeEntryId) return
    setSaving(true)
    setError('')
    try {
      await onSaveEntry(activeEntryId, values)
    } catch {
      setError('Não foi possível guardar as alterações.')
    } finally {
      setSaving(false)
    }
  }

  const activeEntry = session.entries.find((entry) => entry.id === activeEntryId)
  const FormComponent =
    activeEntry && hasPiccaInteractiveFormRenderer(activeEntry.formId)
      ? piccaInteractiveFormRegistry[activeEntry.formId]?.Form
      : undefined

  return (
    <Card as="section" className={panelStyles.panel} id="picca-interactive-entries">
      <div className={panelStyles.header}>
        <h2>Registos interativos — respostas</h2>
        <button type="button" className={styles.linkButton} onClick={onClose}>
          Fechar
        </button>
      </div>

      {session.entries.length === 0 ? (
        <p className={styles.muted}>Ainda não existem registos submetidos.</p>
      ) : (
        <div className={panelStyles.groups}>
          {grouped.sonoWeeks.length > 0 && (
            <section>
              <h3>Rituais do Sono</h3>
              {grouped.sonoWeeks.map(([week, entries]) => (
                <div key={week} className={panelStyles.weekBlock}>
                  <h4>{formatWeekLabel(week)}</h4>
                  <ul className={panelStyles.entryList}>
                    {entries.map((entry) => (
                      <li key={entry.id}>
                        <button
                          type="button"
                          className={styles.linkButton}
                          onClick={() => openEntry(entry.id, entry.formId, entry.answers)}
                        >
                          {formatDayLabelShort(entry.periodKey)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {grouped.estrategiasWeeks.length > 0 && (
            <section>
              <h3>Estratégias e Tabelas</h3>
              {grouped.estrategiasWeeks.map(([week, entries]) => (
                <div key={week} className={panelStyles.weekBlock}>
                  <h4>{formatWeekLabel(week)}</h4>
                  <ul className={panelStyles.entryList}>
                    {entries.map((entry) => (
                      <li key={entry.id}>
                        <button
                          type="button"
                          className={styles.linkButton}
                          onClick={() => openEntry(entry.id, entry.formId, entry.answers)}
                        >
                          Ver / editar semana
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
        </div>
      )}

      {activeEntry && FormComponent && (
        <div className={panelStyles.editor}>
          <h3>
            {activeEntry.formTitle}
            {activeEntry.kind === 'daily_sono'
              ? ` — ${formatDayLabelShort(activeEntry.periodKey)}`
              : ` — ${formatWeekLabel(activeEntry.periodKey)}`}
          </h3>
          {error && <p className={styles.error}>{error}</p>}
          <FormComponent value={values} onChange={setValues} />
          <div className={panelStyles.editorActions}>
            <Button type="button" onClick={() => void handleSave()} disabled={saving}>
              {saving ? 'A guardar…' : 'Guardar alterações'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
