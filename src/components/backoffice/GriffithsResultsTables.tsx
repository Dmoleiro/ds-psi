import { useEffect, useState } from 'react'
import {
  deriveGriffithsResults,
  emptyGriffithsResults,
  getGriffithsDevelopmentLevel,
  GRIFFITHS_SECTION_SLOT_LABELS,
  GRIFFITHS_SUBSCALES,
  hasGriffithsResultsData,
  type GriffithsResults,
  type GriffithsSectionCells,
  type GriffithsSubscaleFieldKey,
  type GriffithsSubscaleKey,
} from '../../lib/griffithsResults'
import { EvaluationAgeInput } from './EvaluationAgeInput'
import { resolveEvaluationAge } from '../../lib/chronologicalAge'
import styles from './PatientEvaluationsPanel.module.css'

type Props = {
  value: GriffithsResults
  readOnly?: boolean
  defaultOpen?: boolean
  defaultBirthDate?: string
  onChange: (next: GriffithsResults) => void
}

const SECTION_ROWS: Array<{
  field: GriffithsSubscaleFieldKey
  label: string
  hint: string
}> = [
  { field: 'sectionI', label: 'Secção I (meses)', hint: 'Idade mental em meses' },
  { field: 'sectionII', label: 'Secção II (meses)', hint: 'Idade mental em meses' },
  { field: 'sectionIII', label: 'Secção III (itens × 2)', hint: 'Itens conseguidos × 2' },
  { field: 'sectionIV', label: 'Secção IV (itens × 2)', hint: 'Itens conseguidos × 2' },
]

const SUMMARY_ROWS: Array<{
  field: GriffithsSubscaleFieldKey | 'totalRaw'
  label: string
  hint?: string
}> = [
  { field: 'totalRaw', label: 'Totais dos resultados brutos' },
  { field: 'developmentalAgeMonths', label: 'Idade de Desenvolvimento / Mental (meses)' },
  { field: 'mentalAgeGlobal', label: 'Quociente parcial (QDA)', hint: '(idade desenvolvimento ÷ IC) × 100' },
]

export function GriffithsResultsTables({
  value,
  readOnly = false,
  defaultOpen = false,
  defaultBirthDate = '',
  onChange,
}: Props) {
  const [confirmClear, setConfirmClear] = useState(false)
  const rawResults = value ?? emptyGriffithsResults()
  const results = deriveGriffithsResults(rawResults)
  const hasData = hasGriffithsResultsData(rawResults)
  const [sectionOpen, setSectionOpen] = useState(() => defaultOpen || hasData)
  const qgDisplay = results.derivedQgQuotient || results.qgQuotient.trim()
  const globalMentalAgeDisplay =
    results.derivedGlobalMentalAgeMonths || results.qgRaw
  const developmentLevel = getGriffithsDevelopmentLevel(qgDisplay)

  useEffect(() => {
    if (!confirmClear) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setConfirmClear(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [confirmClear])

  function clearAllResults() {
    setConfirmClear(false)
    onChange(emptyGriffithsResults())
  }

  function commit(patch: Partial<GriffithsResults>) {
    onChange({
      ...rawResults,
      ...patch,
    })
  }

  function updateSubscaleCell(
    key: GriffithsSubscaleKey,
    field: GriffithsSubscaleFieldKey,
    slotIndex: number,
    nextValue: string,
  ) {
    const current = rawResults.subscales[key] ?? emptyGriffithsResults().subscales[key]
    const cells = [...current[field]] as GriffithsSectionCells
    cells[slotIndex] = nextValue
    commit({
      subscales: {
        ...rawResults.subscales,
        [key]: {
          ...current,
          [field]: cells,
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
        <span className={`${cellValue ? styles.tableCellValue : styles.tableCellDisabled} ${className}`}>
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

  function isDerivedRow(field: GriffithsSubscaleFieldKey | 'totalRaw'): boolean {
    if (field === 'totalRaw') return true
    return results.autoScored
  }

  function renderSlotCells(
    subscale: (typeof GRIFFITHS_SUBSCALES)[number],
    field: GriffithsSubscaleFieldKey | 'totalRaw',
    rowLabel: string,
    cells: GriffithsSectionCells,
    derived = false,
  ) {
    return GRIFFITHS_SECTION_SLOT_LABELS.map((slotLabel, slotIndex) => (
      <td key={`${subscale.key}-${field}-${slotIndex}`} className={styles.griffithsSlotCell}>
        {renderCell(
          cells[slotIndex] ?? '',
          readOnly || derived
            ? null
            : (next) =>
                updateSubscaleCell(
                  subscale.key,
                  field as GriffithsSubscaleFieldKey,
                  slotIndex,
                  next,
                ),
          `${rowLabel} — subescala ${subscale.label}, ${slotLabel}`,
          styles.griffithsSlotInput,
        )}
      </td>
    ))
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
          <span className={styles.resultsSummaryTitle}>Resultados Ruth Griffiths</span>
        </span>
        {!hasData && (
          <span className={styles.resultsSummaryHint}>Registar idade e resultados por subescala</span>
        )}
        {hasData && qgDisplay && (
          <span className={styles.resultsSummaryMeta}>QG: {qgDisplay}</span>
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

          <p className={styles.muted}>
            Cada subescala tem dois campos por linha: o primeiro usa as tabelas de normas dos{' '}
            <strong>0–2 anos</strong> e o segundo as dos <strong>2–8 anos</strong>. Os totais brutos
            são calculados automaticamente. A idade de desenvolvimento/mental usa a tabela da
            subescala (Tabela 19 no 0–2; coluna z=0 no 2–8) com o total bruto. No 2–8, o
            quociente parcial (QDA) = (idade desenvolvimento ÷ idade cronológica) × 100. No 0–2 a
            idade mental global usa a Tabela 20 (soma geral).
            {results.autoScoreBlockReason ? ` ${results.autoScoreBlockReason}` : ''}
          </p>

          <h4 className={styles.resultsTitle}>Sumário dos resultados da avaliação</h4>
          <div className={styles.tableWrap}>
            <table className={`${styles.resultsTable} ${styles.griffithsTable}`}>
              <thead>
                <tr>
                  <th scope="col" rowSpan={2} className={styles.griffithsRowHeader} />
                  {GRIFFITHS_SUBSCALES.map((subscale) => (
                    <th
                      key={subscale.key}
                      scope="colgroup"
                      colSpan={GRIFFITHS_SECTION_SLOT_LABELS.length}
                      className={styles.griffithsSubscaleHeader}
                    >
                      <span>{subscale.label}</span>
                      <span className={styles.griffithsSubscaleTitle}>{subscale.title}</span>
                    </th>
                  ))}
                </tr>
                <tr>
                  {GRIFFITHS_SUBSCALES.map((subscale) =>
                    GRIFFITHS_SECTION_SLOT_LABELS.map((slotLabel) => (
                      <th
                        key={`${subscale.key}-${slotLabel}`}
                        scope="col"
                        className={styles.griffithsSlotHeader}
                      >
                        {slotLabel}
                      </th>
                    )),
                  )}
                </tr>
              </thead>
              <tbody>
                {SECTION_ROWS.map((row) => (
                  <tr key={row.field}>
                    <th scope="row" className={styles.griffithsRowHeader}>
                      {row.label}
                      <span className={styles.griffithsRowHint}>{row.hint}</span>
                    </th>
                    {GRIFFITHS_SUBSCALES.map((subscale) => {
                      const subscaleResult = results.subscales[subscale.key]
                      const cells = subscaleResult?.[row.field] ?? ['', '']
                      return renderSlotCells(subscale, row.field, row.label, cells)
                    })}
                  </tr>
                ))}

                {SUMMARY_ROWS.map((row) => (
                  <tr key={row.field} className={isDerivedRow(row.field) ? styles.summaryRow : undefined}>
                    <th scope="row" className={styles.griffithsRowHeader}>
                      {row.label}
                      {row.hint ? <span className={styles.griffithsRowHint}>{row.hint}</span> : null}
                    </th>
                    {GRIFFITHS_SUBSCALES.map((subscale) => {
                      const subscaleResult = results.subscales[subscale.key]
                      const cells =
                        row.field === 'totalRaw'
                          ? subscaleResult?.totalRaw ?? ['', '']
                          : subscaleResult?.[row.field] ?? ['', '']
                      return renderSlotCells(
                        subscale,
                        row.field,
                        row.label,
                        cells,
                        isDerivedRow(row.field),
                      )
                    })}
                  </tr>
                ))}

                <tr className={styles.summaryRow}>
                  <th scope="row" className={styles.griffithsRowHeader}>
                    Idade cronológica (meses)
                  </th>
                  <td colSpan={GRIFFITHS_SUBSCALES.length * GRIFFITHS_SECTION_SLOT_LABELS.length}>
                    {renderCell(results.chronologicalAgeMonths, null, 'Idade cronológica em meses')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.griffithsQgBlock}>
            <h4 className={styles.resultsTitle}>Resultado global</h4>
            <div className={styles.tableWrap}>
              <table className={styles.resultsTable}>
                <tbody>
                  <tr>
                    <th scope="row">Idade mental global (meses)</th>
                    <td>{renderCell(globalMentalAgeDisplay, null, 'Idade mental global em meses')}</td>
                  </tr>
                  <tr>
                    <th scope="row">Quociente geral (QG)</th>
                    <td>
                      {renderCell(qgDisplay, null, 'Quociente geral')}
                      {developmentLevel ? (
                        <span className={styles.griffithsLevelTag}>{developmentLevel}</span>
                      ) : null}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.muted}>
              Secções I e II: idade mental em meses. Secções III e IV: itens × 2. Total bruto por coluna
              = soma das quatro secções nesse campo. Idade mental global: no 2–8 anos, média dos totais
              brutos das seis subescalas (como na folha do terapeuta: IM). No 0–2 anos, Tabela 20 sobre
              a soma geral. QG = (idade mental global ÷ idade cronológica) × 100 quando ambas vêm do
              cálculo automático; no 0–2 o QG usa a média dos totais brutos por subescala.
            </p>
          </div>
        </div>
      </div>

      {confirmClear ? (
        <div
          className={styles.infoOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="griffiths-clear-title"
          onClick={() => setConfirmClear(false)}
        >
          <div className={styles.confirmPanel} onClick={(event) => event.stopPropagation()}>
            <h3 id="griffiths-clear-title">Limpar resultados Ruth Griffiths?</h3>
            <p>
              A idade, os resultados por subescala, o QG e as idades mentais serão apagados. Esta ação
              não pode ser desfeita.
            </p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.clearConfirmButton} onClick={clearAllResults}>
                Limpar tudo
              </button>
              <button type="button" className={styles.infoButton} onClick={() => setConfirmClear(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </details>
  )
}
