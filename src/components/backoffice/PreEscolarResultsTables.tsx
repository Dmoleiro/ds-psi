import { useEffect, useMemo, useState } from 'react'
import {
  PRE_ESCOLAR_NORM_LEVELS,
  getPreEscolarNormLevelLabel,
  type PreEscolarNormLevel,
} from '../../lib/preEscolarNorms'
import {
  derivePreEscolarResults,
  emptyPreEscolarResults,
  getPreEscolarQualitativeLevel,
  hasPreEscolarResultsData,
  PRE_ESCOLAR_SUBTESTS,
  type PreEscolarResults,
  type PreEscolarSubtestKey,
} from '../../lib/preEscolarResults'
import { resolveEvaluationAge } from '../../lib/chronologicalAge'
import { EvaluationAgeInput } from './EvaluationAgeInput'
import styles from './PatientEvaluationsPanel.module.css'

type Props = {
  value: PreEscolarResults
  readOnly?: boolean
  defaultOpen?: boolean
  defaultBirthDate?: string
  onChange: (next: PreEscolarResults) => void
}

export function PreEscolarResultsTables({
  value,
  readOnly = false,
  defaultOpen = false,
  defaultBirthDate = '',
  onChange,
}: Props) {
  const [confirmClear, setConfirmClear] = useState(false)
  const rawResults = value ?? emptyPreEscolarResults()
  const results = useMemo(() => derivePreEscolarResults(rawResults), [rawResults])
  const hasData = useMemo(() => hasPreEscolarResultsData(rawResults), [rawResults])
  const [sectionOpen, setSectionOpen] = useState(() => defaultOpen || hasData)
  const totalPointsDisplay = results.derivedTotalPoints || results.totalPoints.trim()
  const totalPercentileDisplay = results.derivedTotalPercentile || results.totalPercentile.trim()
  const totalStanineDisplay = results.derivedTotalStanine || results.totalStanine.trim()
  const qualitativeLevel = getPreEscolarQualitativeLevel(totalPercentileDisplay)

  useEffect(() => {
    if (!confirmClear) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setConfirmClear(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [confirmClear])

  function commit(patch: Partial<PreEscolarResults>) {
    onChange(
      derivePreEscolarResults({
        ...rawResults,
        ...patch,
      }),
    )
  }

  function updateSubtest(
    key: PreEscolarSubtestKey,
    field: 'correct' | 'errors' | 'points',
    nextValue: string,
  ) {
    const current = rawResults.subtests[key] ?? emptyPreEscolarResults().subtests[key]
    commit({
      subtests: {
        ...rawResults.subtests,
        [key]: {
          ...current,
          [field]: nextValue,
        },
      },
    })
  }

  function renderCell(
    cellValue: string,
    onCellChange: ((next: string) => void) | null,
    ariaLabel: string,
    className = '',
  ) {
    if (readOnly || !onCellChange) {
      return (
        <span
          className={`${cellValue ? styles.tableCellValue : styles.tableCellDisabled} ${className}`}
        >
          {cellValue || '—'}
        </span>
      )
    }

    return (
      <input
        className={`${styles.tableInput} ${className}`}
        value={cellValue}
        aria-label={ariaLabel}
        onChange={(event) => onCellChange(event.target.value)}
      />
    )
  }

  return (
    <details
      className={styles.resultsCollapse}
      open={sectionOpen}
      onToggle={(event) => setSectionOpen(event.currentTarget.open)}
    >
      <summary className={styles.resultsSummary}>
        <span className={styles.resultsSummaryMain}>
          <span className={styles.resultsChevron} aria-hidden />
          <span className={styles.resultsSummaryTitle}>Resultados Pré-Escolar</span>
        </span>
        {!hasData && (
          <span className={styles.resultsSummaryHint}>
            Registar acertos/erros da grelha de correcção
          </span>
        )}
        {hasData && totalPointsDisplay && (
          <span className={styles.resultsSummaryMeta}>
            Total: {totalPointsDisplay}
            {totalPercentileDisplay ? ` · P${totalPercentileDisplay}` : ''}
          </span>
        )}
      </summary>

      <div className={styles.resultsBody}>
        <div className={styles.resultsBlock}>
          <div className={styles.ageRow}>
            <EvaluationAgeInput
              value={resolveEvaluationAge(rawResults)}
              readOnly={readOnly}
              defaultBirthDate={defaultBirthDate}
              showEvaluationDate={false}
              onChange={commit}
            />
            {!readOnly ? (
              <div className={styles.toolbar}>
                <button
                  type="button"
                  className={styles.clearButton}
                  disabled={!hasData}
                  onClick={() => setConfirmClear(true)}
                >
                  Limpar
                </button>
              </div>
            ) : null}
          </div>

          <div className={styles.normLevelRow}>
            <label className={styles.normLevelLabel} htmlFor="pre-escolar-norm-level">
              Tabela de normas
            </label>
            {readOnly ? (
              <span className={styles.tableCellValue}>
                {getPreEscolarNormLevelLabel(results.normLevel as PreEscolarNormLevel)}
              </span>
            ) : (
              <select
                id="pre-escolar-norm-level"
                className={styles.normLevelSelect}
                value={results.normLevel}
                onChange={(event) =>
                  commit({ normLevel: event.target.value as PreEscolarNormLevel })
                }
              >
                {PRE_ESCOLAR_NORM_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {getPreEscolarNormLevelLabel(level)}
                  </option>
                ))}
              </select>
            )}
          </div>

          <p className={styles.muted}>
            Pontuação directa (P) calculada conforme o manual: Verbal e Conceitos Quantitativos P =
            C; Orientação Espacial P = C (0/1/2 por item); restantes P = C − E (mín. 0 se E ≥ C).
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th>Subteste</th>
                  <th>C</th>
                  <th>E</th>
                  <th>P</th>
                  <th>P. máx.</th>
                  <th>Percentil</th>
                  <th>Eneatipo</th>
                </tr>
              </thead>
              <tbody>
                {PRE_ESCOLAR_SUBTESTS.map((subtest) => {
                  const row = results.subtests[subtest.key]
                  const pointsDisplay = row?.derivedPoints || row?.points.trim() || ''
                  const percentileDisplay = row?.derivedPercentile || row?.percentile.trim() || ''
                  const stanineDisplay = row?.derivedStanine || row?.stanine.trim() || ''
                  const usesErrors = subtest.formula === 'c_minus_e'

                  return (
                    <tr key={subtest.key}>
                      <th scope="row">{subtest.label}</th>
                      <td>
                        {renderCell(
                          row?.correct ?? '',
                          readOnly ? null : (next) => updateSubtest(subtest.key, 'correct', next),
                          `${subtest.label} — acertos`,
                        )}
                      </td>
                      <td>
                        {usesErrors
                          ? renderCell(
                              row?.errors ?? '',
                              readOnly
                                ? null
                                : (next) => updateSubtest(subtest.key, 'errors', next),
                              `${subtest.label} — erros`,
                            )
                          : <span className={styles.tableCellDisabled}>—</span>}
                      </td>
                      <td className={styles.derivedCell}>{pointsDisplay || '—'}</td>
                      <td className={styles.tableCellDisabled}>{subtest.maxPoints}</td>
                      <td className={styles.derivedCell}>{percentileDisplay || '—'}</td>
                      <td className={styles.derivedCell}>{stanineDisplay || '—'}</td>
                    </tr>
                  )
                })}
                <tr className={styles.totalRow}>
                  <th scope="row">Total</th>
                  <td className={styles.tableCellDisabled}>—</td>
                  <td className={styles.tableCellDisabled}>—</td>
                  <td className={styles.derivedCell}>{totalPointsDisplay || '—'}</td>
                  <td className={styles.tableCellDisabled}>100</td>
                  <td className={styles.derivedCell}>{totalPercentileDisplay || '—'}</td>
                  <td className={styles.derivedCell}>{totalStanineDisplay || '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {qualitativeLevel ? (
            <p className={styles.qualitativeSummary}>
              Interpretação global (total): <strong>{qualitativeLevel}</strong>
            </p>
          ) : null}
        </div>

        {confirmClear ? (
          <div className={styles.confirmOverlay} role="dialog" aria-modal="true">
            <div className={styles.confirmDialog}>
              <p>Limpar todos os resultados Pré-Escolar?</p>
              <div className={styles.confirmActions}>
                <button type="button" onClick={() => setConfirmClear(false)}>Cancelar</button>
                <button
                  type="button"
                  className={styles.confirmDanger}
                  onClick={() => {
                    setConfirmClear(false)
                    onChange(emptyPreEscolarResults())
                  }}
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </details>
  )
}
