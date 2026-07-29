import { useMemo, useState } from 'react'
import {
  getPiccaInteractiveFormDefaults,
  hasPiccaInteractiveFormRenderer,
  piccaInteractiveFormRegistry,
} from '../picca/interactive/interactiveFormRegistry'
import {
  isDailyPiccaInteractiveKind,
  isPortageAssessmentKind,
  type PiccaInteractiveFormKind,
} from '../../lib/piccaInteractiveKinds'
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
    kind: PiccaInteractiveFormKind
  }>
  entries: Array<{
    id: string
    formId: string
    formTitle: string
    kind: PiccaInteractiveFormKind
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
    return session.forms
      .map((form) => {
        const entries = session.entries.filter((entry) => entry.formId === form.formId)
        if (entries.length === 0) return null

        if (isDailyPiccaInteractiveKind(form.kind)) {
          const byWeek = new Map<string, typeof entries>()
          for (const entry of entries) {
            const week = getWeekStartMonday(entry.periodKey)
            const list = byWeek.get(week) ?? []
            list.push(entry)
            byWeek.set(week, list)
          }
          for (const list of byWeek.values()) {
            list.sort((a, b) => a.periodKey.localeCompare(b.periodKey))
          }
          return {
            form,
            dailyWeeks: [...byWeek.entries()].sort((a, b) => b[0].localeCompare(a[0])),
          }
        }

        if (isPortageAssessmentKind(form.kind)) {
          return { form, assessmentEntries: entries }
        }

        const byWeek = new Map<string, typeof entries>()
        for (const entry of entries) {
          const list = byWeek.get(entry.periodKey) ?? []
          list.push(entry)
          byWeek.set(entry.periodKey, list)
        }
        return {
          form,
          weeklyWeeks: [...byWeek.entries()].sort((a, b) => b[0].localeCompare(a[0])),
        }
      })
      .filter((group): group is NonNullable<typeof group> => group !== null)
  }, [session.entries, session.forms])

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
          {grouped.map((group) => (
            <section key={group.form.formId}>
              <h3>{group.form.title}</h3>
              {'dailyWeeks' in group &&
                group.dailyWeeks?.map(([week, entries]) => (
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
              {'weeklyWeeks' in group &&
                group.weeklyWeeks?.map(([week, entries]) => (
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
              {'assessmentEntries' in group && group.assessmentEntries && (
                <ul className={panelStyles.entryList}>
                  {group.assessmentEntries.map((entry) => (
                    <li key={entry.id}>
                      <button
                        type="button"
                        className={styles.linkButton}
                        onClick={() => openEntry(entry.id, entry.formId, entry.answers)}
                      >
                        Ver / editar avaliação
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}

      {activeEntry && FormComponent && (
        <div className={panelStyles.editor}>
          <h3>
            {activeEntry.formTitle}
            {isDailyPiccaInteractiveKind(activeEntry.kind)
              ? ` — ${formatDayLabelShort(activeEntry.periodKey)}`
              : isPortageAssessmentKind(activeEntry.kind)
                ? ' — Avaliação'
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
