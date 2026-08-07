import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError, therapistApi } from '../../lib/api'
import {
  ADDITIONAL_EVALUATION_METHODS,
  BANC_EVALUATION_OPTIONS,
  QUESTIONNAIRE_EVALUATION_OPTIONS,
  WISC_EVALUATION_OPTIONS,
  type PatientEvaluationSelections,
} from '../../lib/patientEvaluations'
import { Card } from '../ui/Card'
import styles from './PatientEvaluationsPanel.module.css'

const SAVE_DEBOUNCE_MS = 500

type Props = {
  token: string
  patientId: string
  initialSelections: PatientEvaluationSelections
  readOnly?: boolean
}

type SelectionField = keyof PatientEvaluationSelections

const EMPTY_SELECTIONS: PatientEvaluationSelections = {
  wiscSelections: [],
  bancSelections: [],
  additionalMethodSelections: [],
  questionnaireSelections: [],
}

export function PatientEvaluationsPanel({
  token,
  patientId,
  initialSelections,
  readOnly = false,
}: Props) {
  const [selections, setSelections] = useState<PatientEvaluationSelections>({
    ...EMPTY_SELECTIONS,
    ...initialSelections,
  })
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')
  const saveTimerRef = useRef<number | null>(null)

  useEffect(() => {
    setSelections({
      ...EMPTY_SELECTIONS,
      ...initialSelections,
    })
  }, [
    patientId,
    initialSelections.wiscSelections,
    initialSelections.bancSelections,
    initialSelections.additionalMethodSelections,
    initialSelections.questionnaireSelections,
  ])

  const persist = useCallback(
    async (next: PatientEvaluationSelections) => {
      setSaveState('saving')
      setError('')
      try {
        await therapistApi.updatePatientEvaluations(token, patientId, next)
        setSaveState('saved')
        window.setTimeout(() => {
          setSaveState((current) => (current === 'saved' ? 'idle' : current))
        }, 2000)
      } catch (err) {
        setSaveState('error')
        setError(err instanceof ApiError ? err.message : 'Não foi possível guardar as avaliações')
      }
    },
    [token, patientId],
  )

  const scheduleSave = useCallback(
    (next: PatientEvaluationSelections) => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current)
      }
      saveTimerRef.current = window.setTimeout(() => {
        void persist(next)
      }, SAVE_DEBOUNCE_MS)
    },
    [persist],
  )

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current)
      }
    }
  }, [])

  function sortSelections(keys: string[], options: ReadonlyArray<{ key: string }>) {
    const selected = new Set(keys)
    return options.filter((option) => selected.has(option.key)).map((option) => option.key)
  }

  function toggleSelection(
    field: SelectionField,
    key: string,
    checked: boolean,
    options: ReadonlyArray<{ key: string }>,
  ) {
    if (readOnly) return

    const current = selections[field]
    const nextKeys = sortSelections(
      checked ? [...current, key] : current.filter((entry) => entry !== key),
      options,
    )
    const next = { ...selections, [field]: nextKeys }
    setSelections(next)
    scheduleSave(next)
  }

  function renderMethod(
    title: string,
    options: ReadonlyArray<{ key: string; label: string }>,
    selected: string[],
    field: SelectionField,
    emptyLabel = 'Nenhuma subescala registada.',
  ) {
    const selectedSet = new Set(selected)

    return (
      <section className={styles.methodSection}>
        <h3 className={styles.methodTitle}>{title}</h3>
        {readOnly && selected.length === 0 ? (
          <p className={styles.muted}>{emptyLabel}</p>
        ) : (
          <ul className={styles.optionList}>
            {options.map((option, index) => {
              const checked = selectedSet.has(option.key)
              if (readOnly && !checked) return null

              return (
                <li key={option.key} className={styles.optionItem}>
                  {readOnly ? (
                    <span className={styles.readOnlyOption}>
                      <span className={styles.optionIndex}>{index + 1}.</span>
                      {option.label}
                    </span>
                  ) : (
                    <label className={styles.optionLabel}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) =>
                          toggleSelection(field, option.key, event.target.checked, options)
                        }
                      />
                      <span className={styles.optionIndex}>{index + 1}.</span>
                      <span>{option.label}</span>
                    </label>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    )
  }

  const statusLabel =
    saveState === 'saving'
      ? 'A guardar…'
      : saveState === 'saved'
        ? 'Guardado'
        : saveState === 'error'
          ? 'Erro ao guardar'
          : null

  return (
    <Card as="section" className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2>Métodos de avaliação</h2>
          <p className={styles.muted}>Registe as subescalas e métodos aplicados a este utente.</p>
        </div>
        {!readOnly && statusLabel && <p className={styles.status}>{statusLabel}</p>}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {renderMethod('WISC III', WISC_EVALUATION_OPTIONS, selections.wiscSelections, 'wiscSelections')}
      {renderMethod('BANC', BANC_EVALUATION_OPTIONS, selections.bancSelections, 'bancSelections')}
      {ADDITIONAL_EVALUATION_METHODS.map((method) =>
        renderMethod(
          method.title,
          method.options,
          selections.additionalMethodSelections,
          'additionalMethodSelections',
          'Nenhum método registado.',
        ),
      )}

      <section className={`${styles.methodSection} ${styles.questionnaireSection}`}>
        <h3 className={styles.methodTitle}>Questionários para avaliação</h3>
        <p className={styles.muted}>
          Instrumentos complementares utilizados em conjunto com os métodos de avaliação.
        </p>
        {readOnly && selections.questionnaireSelections.length === 0 ? (
          <p className={styles.muted}>Nenhum questionário registado.</p>
        ) : (
          <ul className={styles.optionList}>
            {QUESTIONNAIRE_EVALUATION_OPTIONS.map((option, index) => {
              const checked = selections.questionnaireSelections.includes(option.key)
              if (readOnly && !checked) return null

              return (
                <li key={option.key} className={styles.optionItem}>
                  {readOnly ? (
                    <span className={styles.readOnlyOption}>
                      <span className={styles.optionIndex}>{index + 1}.</span>
                      {option.label}
                    </span>
                  ) : (
                    <label className={styles.optionLabel}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) =>
                          toggleSelection(
                            'questionnaireSelections',
                            option.key,
                            event.target.checked,
                            QUESTIONNAIRE_EVALUATION_OPTIONS,
                          )
                        }
                      />
                      <span className={styles.optionIndex}>{index + 1}.</span>
                      <span>{option.label}</span>
                    </label>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </Card>
  )
}
