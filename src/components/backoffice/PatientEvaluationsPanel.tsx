import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError, therapistApi } from '../../lib/api'
import {
  BANC_EVALUATION_OPTIONS,
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

export function PatientEvaluationsPanel({
  token,
  patientId,
  initialSelections,
  readOnly = false,
}: Props) {
  const [wiscSelections, setWiscSelections] = useState(initialSelections.wiscSelections)
  const [bancSelections, setBancSelections] = useState(initialSelections.bancSelections)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')
  const saveTimerRef = useRef<number | null>(null)
  const selectionsRef = useRef({ wiscSelections, bancSelections })

  selectionsRef.current = { wiscSelections, bancSelections }

  useEffect(() => {
    setWiscSelections(initialSelections.wiscSelections)
    setBancSelections(initialSelections.bancSelections)
  }, [initialSelections.wiscSelections, initialSelections.bancSelections, patientId])

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
    method: 'wisc' | 'banc',
    key: string,
    checked: boolean,
  ) {
    if (readOnly) return

    const nextWisc =
      method === 'wisc'
        ? sortSelections(
            checked ? [...wiscSelections, key] : wiscSelections.filter((entry) => entry !== key),
            WISC_EVALUATION_OPTIONS,
          )
        : wiscSelections

    const nextBanc =
      method === 'banc'
        ? sortSelections(
            checked ? [...bancSelections, key] : bancSelections.filter((entry) => entry !== key),
            BANC_EVALUATION_OPTIONS,
          )
        : bancSelections

    const next = { wiscSelections: nextWisc, bancSelections: nextBanc }
    setWiscSelections(next.wiscSelections)
    setBancSelections(next.bancSelections)
    scheduleSave(next)
  }

  function renderMethod(
    title: string,
    options: ReadonlyArray<{ key: string; label: string }>,
    selected: string[],
    method: 'wisc' | 'banc',
  ) {
    const selectedSet = new Set(selected)

    return (
      <section className={styles.methodSection}>
        <h3 className={styles.methodTitle}>{title}</h3>
        {readOnly && selected.length === 0 ? (
          <p className={styles.muted}>Nenhuma subescala registada.</p>
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
                        onChange={(event) => toggleSelection(method, option.key, event.target.checked)}
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
          <p className={styles.muted}>Registe as subescalas aplicadas a este utente.</p>
        </div>
        {!readOnly && statusLabel && <p className={styles.status}>{statusLabel}</p>}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {renderMethod('WISC III', WISC_EVALUATION_OPTIONS, wiscSelections, 'wisc')}
      {renderMethod('BANC', BANC_EVALUATION_OPTIONS, bancSelections, 'banc')}
    </Card>
  )
}
