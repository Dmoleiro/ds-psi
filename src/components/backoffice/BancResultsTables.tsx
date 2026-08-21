import { useEffect, useMemo, useState } from 'react'
import {
  BANC_COMPOSITE_LABELS,
  BANC_MEASURE_ROWS,
  BANC_SECTION_META,
  canAutoConvertBancRb,
  deriveBancResults,
  emptyBancResults,
  getBancAutoScoreBlockReason,
  getBancPerfilMeasureHint,
  hasBancResultsData,
  isBancPerfilMeasureInactive,
  parseBancAgeYears,
  type BancMeasureRow,
  type BancResults,
  type BancSectionKey,
} from '../../lib/bancResults'
import styles from './PatientEvaluationsPanel.module.css'

type Props = {
  value: BancResults
  readOnly?: boolean
  defaultOpen?: boolean
  onChange: (next: BancResults) => void
}

const SECTION_ORDER: BancSectionKey[] = ['memoria', 'linguagem', 'atencao', 'orientacao_motricidade']

function tintClass(tint: BancMeasureRow['tint']): string {
  const key = `bancTint${tint.charAt(0).toUpperCase()}${tint.slice(1)}` as keyof typeof styles
  return styles[key] ?? ''
}

const PLOT_SCALE = Array.from({ length: 19 }, (_, index) => index + 1)

function PlotScaleHeader({ plotClass }: { plotClass: string }) {
  return (
    <div className={`${styles.bancPlotScaleHeader} ${styles[plotClass as keyof typeof styles]}`} aria-hidden>
      {PLOT_SCALE.map((value) => (
        <span
          key={value}
          className={
            value >= 8 && value <= 12 ? styles.bancPlotScaleTickAverage : styles.bancPlotScaleTick
          }
        >
          {value}
        </span>
      ))}
    </div>
  )
}

function PlotMarker({ rp }: { rp: string }) {
  const value = Number.parseInt(rp, 10)
  const hasDot = Number.isFinite(value) && value >= 1 && value <= 19
  const left = hasDot ? `calc((${value} - 0.5) / 19 * 100%)` : undefined

  return (
    <div className={styles.bancPlotTrack} aria-hidden>
      <div className={styles.bancPlotGrid}>
        {PLOT_SCALE.map((tick) => (
          <span key={tick} className={styles.bancPlotGridCell} />
        ))}
      </div>
      <span className={styles.bancPlotAverageBand} />
      {hasDot ? <span className={styles.bancPlotDot} style={{ left }} /> : null}
    </div>
  )
}

export function BancResultsTables({
  value,
  readOnly = false,
  defaultOpen = false,
  onChange,
}: Props) {
  const [confirmClear, setConfirmClear] = useState(false)
  const rawResults = value ?? emptyBancResults()
  const results = useMemo(() => deriveBancResults(rawResults), [rawResults])
  const hasData = useMemo(() => hasBancResultsData(rawResults), [rawResults])
  const [sectionOpen, setSectionOpen] = useState(() => defaultOpen || hasData)
  const autoConvert = canAutoConvertBancRb(rawResults.ageYears, rawResults.ageMonths)
  const blockReason = getBancAutoScoreBlockReason(rawResults.ageYears, rawResults.ageMonths)
  const ageYearsNum = parseBancAgeYears(rawResults.ageYears)

  useEffect(() => {
    if (!confirmClear) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setConfirmClear(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [confirmClear])

  function commit(patch: Partial<BancResults>) {
    onChange(
      deriveBancResults({
        ...rawResults,
        ...patch,
      }),
    )
  }

  function updateMeasure(key: string, field: 'rb' | 'rp', nextValue: string) {
    const current = rawResults.measures[key] ?? { rb: '', rp: '' }
    commit({
      measures: {
        ...rawResults.measures,
        [key]: { ...current, [field]: nextValue },
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

  function renderPerfilSection(section: BancSectionKey) {
    const rows = BANC_MEASURE_ROWS.filter((row) => row.section === section)
    if (rows.length === 0) return null
    const meta = BANC_SECTION_META[section]

    return (
      <div key={section} className={styles.bancPerfilSection}>
        <h5 className={`${styles.bancSectionHeading} ${styles[meta.headerClass as keyof typeof styles]}`}>
          {meta.label}
        </h5>
        <div className={styles.tableWrap}>
          <table className={`${styles.resultsTable} ${styles.bancTable} ${styles.bancTablePerfil}`}>
            <colgroup>
              <col className={styles.bancColTests} />
              <col className={styles.bancColRb} />
              <col className={styles.bancColRp} />
              <col className={styles.bancColPlot} />
            </colgroup>
            <thead>
              <tr>
                <th>Testes</th>
                <th className={styles.bancColRbHeader}>RB</th>
                <th className={styles.bancColRpHeader}>RP</th>
                <th className={styles.bancPlotHeaderCell}>
                  <span className={styles.bancPlotHeaderLabel}>Resultado padronizado</span>
                  <PlotScaleHeader plotClass={meta.plotClass} />
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const measure = results.measures[row.key] ?? { rb: '', rp: '' }
                const inactive = isBancPerfilMeasureInactive(row.key, ageYearsNum)
                const hint = getBancPerfilMeasureHint(row.key, ageYearsNum)
                const rpEditable =
                  !inactive &&
                  (!autoConvert ||
                    (row.manualRpOnly &&
                      (ageYearsNum === null || ageYearsNum < 5 || ageYearsNum > 15)))
                return (
                  <tr key={row.key} className={inactive ? styles.bancPerfilInactive : undefined}>
                    <th scope="row" className={styles.bancMeasureLabel}>
                      {row.parentLabel ? (
                        <>
                          <span>{row.parentLabel}</span>
                          <span className={row.italic ? styles.bancItalic : undefined}>{row.label}</span>
                        </>
                      ) : (
                        row.label
                      )}
                      {hint ? <span className={styles.bancMeasureHint}>{hint}</span> : null}
                    </th>
                    <td>
                      {inactive ? (
                        <span className={styles.tableCellDisabled}>—</span>
                      ) : (
                        renderCell(
                          measure.rb,
                          (next) => updateMeasure(row.key, 'rb', next),
                          `${row.label} — RB`,
                        )
                      )}
                    </td>
                    <td className={tintClass(row.tint)}>
                      {inactive ? (
                        <span className={styles.tableCellDisabled}>—</span>
                      ) : (
                        renderCell(
                          measure.rp,
                          rpEditable ? (next) => updateMeasure(row.key, 'rp', next) : null,
                          `${row.label} — RP`,
                          styles.bancRpCell,
                        )
                      )}
                    </td>
                    <td className={styles[meta.plotClass as keyof typeof styles]}>
                      {inactive ? <span className={styles.bancPlotEmpty}>—</span> : <PlotMarker rp={measure.rp} />}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  function renderCompositeTable(
    title: string,
    headerClass: string,
    labels: ReadonlyArray<{ key: string; label: string }>,
    cells: BancResults['compositeMemoria'],
    somatorio: string,
  ) {
    return (
      <div className={styles.bancCompositeBlock}>
        <h5 className={`${styles.bancCompositeTitle} ${styles[headerClass as keyof typeof styles]}`}>
          {title}
        </h5>
        <div className={styles.tableWrap}>
          <table className={`${styles.resultsTable} ${styles.bancTable} ${styles.bancTableComposite}`}>
            <colgroup>
              <col className={styles.bancColTestsComposite} />
              <col className={styles.bancColRp} />
            </colgroup>
            <thead>
              <tr>
                <th>Testes</th>
                <th className={styles.bancColRpHeader}>RP</th>
              </tr>
            </thead>
            <tbody>
              {labels.map((row) => {
                const cell = cells[row.key]
                if (!cell) {
                  return (
                    <tr key={row.key} className={styles.bancCompositeInactive}>
                      <th scope="row">{row.label}</th>
                      <td className={styles.disabledCell}>—</td>
                    </tr>
                  )
                }
                return (
                  <tr key={row.key}>
                    <th scope="row">{row.label}</th>
                    <td className={styles.disabledCell}>{cell.rp || '—'}</td>
                  </tr>
                )
              })}
              <tr className={styles.summaryRow}>
                <th scope="row">Somatório dos resultados padronizados</th>
                <td className={styles.disabledCell}>{somatorio || '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
          <span className={styles.resultsSummaryTitle}>Resultados BANC</span>
        </span>
        {!hasData && (
          <span className={styles.resultsSummaryHint}>Registar idade e resultados brutos</span>
        )}
      </summary>

      <div className={`${styles.resultsBody} ${styles.bancResultsBody}`}>
        <div className={styles.ageRow}>
          <label className={styles.ageField}>
            Idade (anos)
            <input
              className={styles.tableInput}
              value={rawResults.ageYears}
              readOnly={readOnly}
              aria-label="Idade em anos"
              onChange={(event) => commit({ ageYears: event.target.value })}
            />
          </label>
          <label className={styles.ageField}>
            Idade (meses)
            <input
              className={styles.tableInput}
              value={rawResults.ageMonths}
              readOnly={readOnly}
              aria-label="Idade em meses"
              onChange={(event) => commit({ ageMonths: event.target.value })}
            />
          </label>
          <label className={styles.ageFieldWide}>
            Grupo normativo de referência
            <input
              className={styles.tableInput}
              value={results.normGroup}
              readOnly={readOnly || autoConvert}
              aria-label="Grupo normativo de referência"
              onChange={(event) => commit({ normGroup: event.target.value })}
            />
          </label>
        </div>

        {blockReason ? (
          <p className={styles.autoScoreNote}>{blockReason}</p>
        ) : (
          <p className={styles.autoScoreOk}>
            Conversão RB → RP: tabelas normativas (5–15 anos) e algoritmos de regressão (16–17 anos).
          </p>
        )}

        <h4 className={styles.resultsTitle}>Cálculo dos índices globais</h4>
        <div className={styles.tableWrap}>
          <table className={`${styles.resultsTable} ${styles.bancTable} ${styles.bancTableGlobal}`}>
            <colgroup>
              <col className={styles.bancColTestsComposite} />
              <col className={styles.bancColGrupo} />
              <col className={styles.bancColRp} />
              <col className={styles.bancColIndex} />
              <col className={styles.bancColPc} />
            </colgroup>
            <thead>
              <tr>
                <th>Índices globais</th>
                <th>Grupo normativo</th>
                <th className={styles.bancColRpHeader}>Somatório</th>
                <th>Índice</th>
                <th>PC</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['memoria', 'Memória', styles.bancHeaderMemoria],
                  ['linguagem', 'Linguagem', styles.bancHeaderLinguagem],
                  ['atencao', 'Atenção / Funções Executivas', styles.bancHeaderAtencao],
                ] as const
              ).map(([key, label, headerClass]) => {
                const row = results.globalIndices[key]
                return (
                  <tr key={key}>
                    <th scope="row" className={headerClass}>
                      {label}
                    </th>
                    <td className={styles.disabledCell}>{row.grupoNormativo || '—'}</td>
                    <td className={styles.disabledCell}>{row.somatorio || '—'}</td>
                    <td className={styles.disabledCell}>{row.indice || '—'}</td>
                    <td className={styles.disabledCell}>{row.percentil || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {renderCompositeTable(
          'Resultado compósito de Memória',
          'bancHeaderMemoria',
          BANC_COMPOSITE_LABELS.memoria,
          results.compositeMemoria,
          results.globalIndices.memoria.somatorio,
        )}
        {renderCompositeTable(
          'Resultado compósito de Linguagem',
          'bancHeaderLinguagem',
          BANC_COMPOSITE_LABELS.linguagem,
          results.compositeLinguagem,
          results.globalIndices.linguagem.somatorio,
        )}
        {renderCompositeTable(
          'Resultado compósito de Atenção / Funções Executivas',
          'bancHeaderAtencao',
          BANC_COMPOSITE_LABELS.atencao,
          results.compositeAtencao,
          results.globalIndices.atencao.somatorio,
        )}

        <h4 className={styles.resultsTitle}>Perfil de resultados</h4>
        {SECTION_ORDER.map((section) => renderPerfilSection(section))}

        {!readOnly && hasData && (
          <div className={styles.resultsActions}>
            <button type="button" className={styles.clearButton} onClick={() => setConfirmClear(true)}>
              Limpar resultados
            </button>
          </div>
        )}
      </div>

      {confirmClear && (
        <div className={styles.infoOverlay} role="presentation">
          <div className={styles.infoPanel} role="dialog" aria-labelledby="banc-clear-title">
            <div className={styles.infoHeader}>
              <h3 id="banc-clear-title">Limpar resultados BANC</h3>
              <button type="button" className={styles.infoClose} onClick={() => setConfirmClear(false)}>
                Fechar
              </button>
            </div>
            <div className={styles.infoBody}>
              <p>Os resultados brutos, padronizados e índices serão apagados.</p>
              <button
                type="button"
                className={styles.clearButton}
                onClick={() => {
                  setConfirmClear(false)
                  onChange(emptyBancResults())
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </details>
  )
}
