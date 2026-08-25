import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError, therapistApi } from '../../lib/api'
import {
  ADDITIONAL_EVALUATION_METHODS,
  BANC_EVALUATION_OPTIONS,
  WISC_EVALUATION_OPTIONS,
  type PatientEvaluationSelections,
} from '../../lib/patientEvaluations'
import { emptyWiscResults, hasWiscResultsData } from '../../lib/wiscResults'
import { emptyBancResults, hasBancResultsData } from '../../lib/bancResults'
import { emptyGriffithsResults, hasGriffithsResultsData } from '../../lib/griffithsResults'
import { WiscResultsTables } from './WiscResultsTables'
import { BancResultsTables } from './BancResultsTables'
import { GriffithsResultsTables } from './GriffithsResultsTables'
import { Card } from '../ui/Card'
import styles from './PatientEvaluationsPanel.module.css'

const SAVE_DEBOUNCE_MS = 500

type Props = {
  token: string
  patientId: string
  initialSelections: PatientEvaluationSelections
  readOnly?: boolean
  patientBirthDate?: string
}

type SelectionField = 'wiscSelections' | 'bancSelections' | 'additionalMethodSelections'

type MethodTab =
  | { id: 'wisc'; label: 'WISC III' }
  | { id: 'banc'; label: 'BANC' }
  | { id: 'griffiths'; label: 'Ruth Griffiths' }
  | { id: `additional-${number}`; label: string; methodIndex: number }

const METHOD_TABS: MethodTab[] = [
  { id: 'wisc', label: 'WISC III' },
  { id: 'banc', label: 'BANC' },
  { id: 'griffiths', label: 'Ruth Griffiths' },
  ...ADDITIONAL_EVALUATION_METHODS.map((method, methodIndex) => ({
    id: `additional-${methodIndex}` as const,
    label: method.title,
    methodIndex,
  })),
]

const EMPTY_SELECTIONS: PatientEvaluationSelections = {
  wiscSelections: [],
  bancSelections: [],
  additionalMethodSelections: [],
  wiscResults: emptyWiscResults(),
  bancResults: emptyBancResults(),
  griffithsResults: emptyGriffithsResults(),
}

export function PatientEvaluationsPanel({
  token,
  patientId,
  initialSelections,
  readOnly = false,
  patientBirthDate = '',
}: Props) {
  const [selections, setSelections] = useState<PatientEvaluationSelections>({
    ...EMPTY_SELECTIONS,
    ...initialSelections,
  })
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')
  const [activeMethodTab, setActiveMethodTab] = useState<MethodTab['id']>('wisc')
  const saveTimerRef = useRef<number | null>(null)

  useEffect(() => {
    setSelections({
      ...EMPTY_SELECTIONS,
      ...initialSelections,
      wiscResults: initialSelections.wiscResults ?? emptyWiscResults(),
      bancResults: initialSelections.bancResults ?? emptyBancResults(),
      griffithsResults: initialSelections.griffithsResults ?? emptyGriffithsResults(),
    })
  }, [
    patientId,
    initialSelections.wiscSelections,
    initialSelections.bancSelections,
    initialSelections.additionalMethodSelections,
    initialSelections.wiscResults,
    initialSelections.bancResults,
    initialSelections.griffithsResults,
  ])

  function hasAdditionalMethodContent(methodIndex: number): boolean {
    const method = ADDITIONAL_EVALUATION_METHODS[methodIndex]
    if (!method) return false
    const optionKeys = new Set(method.options.map((option) => option.key))
    return selections.additionalMethodSelections.some((key) => optionKeys.has(key))
  }

  function hasMethodTabContent(tab: MethodTab): boolean {
    if (tab.id === 'wisc') {
      return selections.wiscSelections.length > 0 || hasWiscResultsData(selections.wiscResults)
    }
    if (tab.id === 'banc') {
      return selections.bancSelections.length > 0 || hasBancResultsData(selections.bancResults)
    }
    if (tab.id === 'griffiths') {
      return hasGriffithsResultsData(selections.griffithsResults)
    }
    if (tab.id.startsWith('additional-')) {
      return hasAdditionalMethodContent(tab.methodIndex)
    }
    return false
  }

  function methodButtonClassName(tab: MethodTab): string {
    const classes = [styles.methodButton]
    if (activeMethodTab === tab.id) {
      classes.push(styles.methodButtonActive)
    } else if (hasMethodTabContent(tab)) {
      classes.push(styles.methodButtonFilled)
    }
    return classes.join(' ')
  }

  const visibleMethodTabs = METHOD_TABS.filter((tab) => {
    if (!readOnly) return true
    return hasMethodTabContent(tab)
  })

  useEffect(() => {
    setActiveMethodTab('wisc')
  }, [patientId])

  useEffect(() => {
    if (visibleMethodTabs.some((tab) => tab.id === activeMethodTab)) return
    setActiveMethodTab(visibleMethodTabs[0]?.id ?? 'wisc')
  }, [activeMethodTab, visibleMethodTabs])

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

  function updateWiscResults(nextWiscResults: PatientEvaluationSelections['wiscResults']) {
    if (readOnly) return
    const next = { ...selections, wiscResults: nextWiscResults }
    setSelections(next)
    scheduleSave(next)
  }

  function renderWiscSection() {
    const selectedSet = new Set(selections.wiscSelections)

    return (
      <section className={styles.methodSection} aria-labelledby="wisc-method-heading">
        <h3 id="wisc-method-heading" className={styles.srOnly}>
          WISC III
        </h3>
        {readOnly && selections.wiscSelections.length === 0 ? (
          <p className={styles.muted}>Nenhuma subescala registada.</p>
        ) : (
          <ul className={styles.optionList}>
            {WISC_EVALUATION_OPTIONS.map((option, index) => {
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
                          toggleSelection(
                            'wiscSelections',
                            option.key,
                            event.target.checked,
                            WISC_EVALUATION_OPTIONS,
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

        <WiscResultsTables
          key={patientId}
          value={selections.wiscResults}
          readOnly={readOnly}
          defaultBirthDate={patientBirthDate}
          onChange={updateWiscResults}
        />
      </section>
    )
  }

  function updateBancResults(nextBancResults: PatientEvaluationSelections['bancResults']) {
    if (readOnly) return
    const next = { ...selections, bancResults: nextBancResults }
    setSelections(next)
    scheduleSave(next)
  }

  function updateGriffithsResults(
    nextGriffithsResults: PatientEvaluationSelections['griffithsResults'],
  ) {
    if (readOnly) return
    const next = { ...selections, griffithsResults: nextGriffithsResults }
    setSelections(next)
    scheduleSave(next)
  }

  function renderGriffithsSection() {
    return (
      <section className={styles.methodSection} aria-labelledby="griffiths-method-heading">
        <h3 id="griffiths-method-heading" className={styles.srOnly}>
          Ruth Griffiths
        </h3>
        <p className={styles.muted}>
          Escala de Desenvolvimento de Ruth Griffiths — subescalas A (Locomotora) a F (Raciocínio
          Prático). A subescala F aplica-se a partir dos 3 anos.
        </p>
        <GriffithsResultsTables
          key={`${patientId}-griffiths`}
          value={selections.griffithsResults}
          readOnly={readOnly}
          defaultBirthDate={patientBirthDate}
          onChange={updateGriffithsResults}
        />
      </section>
    )
  }

  function renderBancSection() {
    const selectedSet = new Set(selections.bancSelections)

    return (
      <section className={styles.methodSection} aria-labelledby="banc-method-heading">
        <h3 id="banc-method-heading" className={styles.srOnly}>
          BANC
        </h3>
        {readOnly && selections.bancSelections.length === 0 ? (
          <p className={styles.muted}>Nenhuma subescala registada.</p>
        ) : (
          <ul className={styles.optionList}>
            {BANC_EVALUATION_OPTIONS.map((option, index) => {
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
                          toggleSelection(
                            'bancSelections',
                            option.key,
                            event.target.checked,
                            BANC_EVALUATION_OPTIONS,
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

        <BancResultsTables
          key={`${patientId}-banc`}
          value={selections.bancResults}
          readOnly={readOnly}
          defaultBirthDate={patientBirthDate}
          onChange={updateBancResults}
        />
      </section>
    )
  }

  function renderMethod(
    title: string,
    headingId: string,
    options: ReadonlyArray<{ key: string; label: string }>,
    selected: string[],
    field: SelectionField,
    emptyLabel = 'Nenhuma subescala registada.',
  ) {
    const selectedSet = new Set(selected)

    return (
      <section className={styles.methodSection} aria-labelledby={headingId}>
        <h3 id={headingId} className={styles.srOnly}>
          {title}
        </h3>
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

      {visibleMethodTabs.length === 0 ? (
        <p className={styles.muted}>Nenhum método de avaliação registado.</p>
      ) : (
        <>
          <div className={styles.methodButtonGroup} role="tablist" aria-label="Métodos de avaliação">
            {visibleMethodTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`method-tab-${tab.id}`}
                aria-selected={activeMethodTab === tab.id}
                aria-controls={`method-panel-${tab.id}`}
                className={methodButtonClassName(tab)}
                onClick={() => setActiveMethodTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={styles.methodTabPanels}>
            {visibleMethodTabs.map((tab) => (
              <div
                key={tab.id}
                id={`method-panel-${tab.id}`}
                role="tabpanel"
                aria-labelledby={`method-tab-${tab.id}`}
                hidden={activeMethodTab !== tab.id}
                className={styles.methodTabPanel}
              >
                {tab.id === 'wisc' && renderWiscSection()}
                {tab.id === 'banc' && renderBancSection()}
                {tab.id === 'griffiths' && renderGriffithsSection()}
                {'methodIndex' in tab &&
                  renderMethod(
                    ADDITIONAL_EVALUATION_METHODS[tab.methodIndex]!.title,
                    `additional-method-heading-${tab.methodIndex}`,
                    ADDITIONAL_EVALUATION_METHODS[tab.methodIndex]!.options,
                    selections.additionalMethodSelections,
                    'additionalMethodSelections',
                    'Nenhum método registado.',
                  )}
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  )
}
