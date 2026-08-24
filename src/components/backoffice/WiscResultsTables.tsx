import { useEffect, useMemo, useState } from 'react'
import {
  WISC_PADRONIZADO_COLUMNS,
  WISC_SCALE_SUMMARY_ROWS,
  WISC_SUBTEST_RESULT_ROWS,
  applyWiscAgeFields,
  canAutoConvertWiscRawScores,
  canAutoFillWiscGai,
  computeSomatorioEscalaCompleta,
  deriveWiscResults,
  emptyWiscGaiSummary,
  emptyWiscResults,
  emptyWiscScaleSummaryRow,
  emptyWiscSubtestResult,
  getWiscAutoScoreBlockReason,
  getWiscScadAcidDesignation,
  getWiscSubtestPadronizadoDisplay,
  getWiscSubtestPadronizadoMediaDesignation,
  getWiscQiClassificacao,
  hasWiscResultsData,
  isWiscPadronizadoEditable,
  WISC_ACID_SUBTEST_KEYS,
  WISC_SCAD_SUBTEST_KEYS,
  type WiscGaiSummary,
  type WiscResults,
  type WiscScaleSummaryRow,
  type WiscSubtestResult,
} from '../../lib/wiscResults'
import { resolveEvaluationAge, type EvaluationAgeFields } from '../../lib/chronologicalAge'
import { EvaluationAgeInput } from './EvaluationAgeInput'
import styles from './PatientEvaluationsPanel.module.css'

type Props = {
  value: WiscResults
  readOnly?: boolean
  defaultOpen?: boolean
  defaultBirthDate?: string
  onChange: (next: WiscResults) => void
}

function getSubtestResult(results: WiscResults, key: string): WiscSubtestResult {
  return results.subtests[key] ?? emptyWiscSubtestResult()
}

function getScaleSummaryRow(results: WiscResults, key: string): WiscScaleSummaryRow {
  return results.scaleSummary[key] ?? emptyWiscScaleSummaryRow()
}

function getSubtestLabel(key: string): string {
  return WISC_SUBTEST_RESULT_ROWS.find((row) => row.key === key)?.label ?? key
}

function WiscSectionTitle({ title, tooltip }: { title: string; tooltip: string }) {
  return (
    <div className={styles.sectionTitleRow}>
      <h4 className={styles.resultsTitle}>{title}</h4>
      <span className={styles.infoTooltipWrap}>
        <button
          type="button"
          className={styles.infoTooltipButton}
          aria-label={`Informação sobre ${title}`}
        >
          i
        </button>
        <span className={styles.infoTooltipContent} role="tooltip">
          {tooltip}
        </span>
      </span>
    </div>
  )
}

function WiscProfileTable({
  title,
  tooltip,
  subtestKeys,
  subtests,
}: {
  title: string
  tooltip: string
  subtestKeys: readonly string[]
  subtests: Record<string, WiscSubtestResult>
}) {
  const designation = getWiscScadAcidDesignation(subtests, subtestKeys)

  return (
    <>
      <WiscSectionTitle title={title} tooltip={tooltip} />
      <div className={styles.tableWrap}>
        <table className={styles.resultsTable}>
          <thead>
            <tr>
              <th />
              <th>Padronizado</th>
            </tr>
          </thead>
          <tbody>
            {subtestKeys.map((key) => (
              <tr key={key}>
                <th scope="row">{getSubtestLabel(key)}</th>
                <td className={styles.disabledCell}>
                  {getWiscSubtestPadronizadoDisplay(subtests, key) || '—'}
                </td>
              </tr>
            ))}
            <tr className={styles.summaryRow}>
              <th scope="row">Perfil</th>
              <td className={styles.profileDesignationCell}>{designation || '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export function WiscResultsTables({
  value,
  readOnly = false,
  defaultOpen = false,
  defaultBirthDate = '',
  onChange,
}: Props) {
  const [infoOpen, setInfoOpen] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const rawResults = value ?? emptyWiscResults()
  const results = useMemo(() => deriveWiscResults(rawResults), [rawResults])
  const somatorioEscalaCompleta = computeSomatorioEscalaCompleta(results.somaPadronizados)
  const hasData = useMemo(() => hasWiscResultsData(rawResults), [rawResults])
  const [sectionOpen, setSectionOpen] = useState(() => defaultOpen || hasWiscResultsData(rawResults))
  const autoConvert = canAutoConvertWiscRawScores(results)
  const autoFillGai = canAutoFillWiscGai(results.somaPadronizados)
  const blockReason = getWiscAutoScoreBlockReason(results)

  useEffect(() => {
    if (!infoOpen && !confirmClear) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setInfoOpen(false)
      setConfirmClear(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [infoOpen, confirmClear])

  function clearAllResults() {
    setConfirmClear(false)
    onChange(emptyWiscResults())
  }

  function commit(patch: Partial<WiscResults>) {
    onChange(
      deriveWiscResults({
        ...rawResults,
        ...patch,
      }),
    )
  }

  function updateAgeFields(next: EvaluationAgeFields) {
    onChange(applyWiscAgeFields(rawResults, next))
  }

  function updateSubtest(key: string, patch: Partial<WiscSubtestResult>) {
    const current = getSubtestResult(rawResults, key)
    commit({
      subtests: {
        ...rawResults.subtests,
        [key]: {
          ...current,
          ...patch,
          padronizado: {
            ...current.padronizado,
            ...(patch.padronizado ?? {}),
          },
        },
      },
    })
  }

  function updateScaleSummaryManual(
    key: string,
    patch: Partial<Pick<WiscScaleSummaryRow, 'qi' | 'percentil' | 'intervaloConfianca90' | 'intervaloConfianca95'>>,
  ) {
    commit({
      scaleSummary: {
        ...rawResults.scaleSummary,
        [key]: {
          ...getScaleSummaryRow(rawResults, key),
          ...patch,
        },
      },
    })
  }

  function updateGaiSummaryManual(
    patch: Partial<Pick<WiscGaiSummary, 'gai' | 'percentil' | 'intervaloConfianca90' | 'intervaloConfianca95'>>,
  ) {
    commit({
      gaiSummary: {
        ...(rawResults.gaiSummary ?? emptyWiscGaiSummary()),
        ...patch,
      },
    })
  }

  function renderCell(
    cellValue: string,
    onCellChange: ((next: string) => void) | null,
    ariaLabel: string,
    disabled = false,
  ) {
    if (disabled || readOnly || !onCellChange) {
      return (
        <span className={cellValue ? styles.tableCellValue : styles.tableCellDisabled}>
          {cellValue || (disabled ? '' : '—')}
        </span>
      )
    }

    return (
      <input
        className={styles.tableInput}
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
          <span className={styles.resultsSummaryTitle}>Resultados WISC III</span>
        </span>
        {!hasData && (
          <span className={styles.resultsSummaryHint}>Registar idade e resultados brutos</span>
        )}
        {hasData && somatorioEscalaCompleta && (
          <span className={styles.resultsSummaryMeta}>Escala completa: {somatorioEscalaCompleta}</span>
        )}
      </summary>

      <div className={styles.resultsBody}>
        <div className={styles.resultsBlock}>
          <div className={styles.ageRow}>
            <EvaluationAgeInput
              value={resolveEvaluationAge(results)}
              readOnly={readOnly}
              defaultBirthDate={defaultBirthDate}
              yearsPlaceholder="6–16"
              onChange={updateAgeFields}
            />
            <div className={styles.toolbar}>
              <button type="button" className={styles.infoButton} onClick={() => setInfoOpen(true)}>
                Como é calculado
              </button>
              {!readOnly ? (
                <button
                  type="button"
                  className={styles.clearButton}
                  disabled={!hasData}
                  onClick={() => setConfirmClear(true)}
                >
                  Limpar
                </button>
              ) : null}
            </div>
          </div>

          {!readOnly && blockReason ? <p className={styles.autoScoreNote}>{blockReason}</p> : null}
          {!readOnly && autoConvert ? (
            <p className={styles.autoScoreOk}>
              Conversão automática activa: só precisa de preencher os resultados brutos.
            </p>
          ) : null}

          <h4 className={styles.resultsTitle}>Resultados dos subtestes</h4>
          <div className={styles.tableWrap}>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th rowSpan={2}>Subtestes</th>
                  <th rowSpan={2}>Resultados brutos</th>
                  <th colSpan={WISC_PADRONIZADO_COLUMNS.length}>Resultados padronizados</th>
                  <th rowSpan={2} className={styles.mediaDesignationHeader}>
                    Classificação
                  </th>
                </tr>
                <tr>
                  {WISC_PADRONIZADO_COLUMNS.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WISC_SUBTEST_RESULT_ROWS.map((row) => {
                  const subtest = getSubtestResult(results, row.key)
                  return (
                    <tr key={row.key}>
                      <th scope="row" className={row.optional ? styles.optionalRowLabel : undefined}>
                        {row.optional ? `(${row.label})` : row.label}
                      </th>
                      <td>
                        {renderCell(
                          subtest.brutos,
                          (next) => updateSubtest(row.key, { brutos: next }),
                          `${row.label} — resultados brutos`,
                        )}
                      </td>
                      {WISC_PADRONIZADO_COLUMNS.map((column) => {
                        const editable = isWiscPadronizadoEditable(row.key, column.key)
                        const lockScaled = autoConvert || !editable
                        return (
                          <td key={column.key} className={editable ? undefined : styles.disabledCell}>
                            {renderCell(
                              editable ? subtest.padronizado[column.key] : '',
                              editable && !autoConvert
                                ? (next) =>
                                    updateSubtest(row.key, {
                                      padronizado: { ...subtest.padronizado, [column.key]: next },
                                    })
                                : null,
                              `${row.label} — ${column.label}`,
                              lockScaled,
                            )}
                          </td>
                        )
                      })}
                      <td className={styles.mediaDesignationCell}>
                        {getWiscSubtestPadronizadoMediaDesignation(results.subtests, row.key) || '—'}
                      </td>
                    </tr>
                  )
                })}
                <tr className={styles.summaryRow}>
                  <th scope="row">Soma dos resultados padronizados</th>
                  <td className={styles.disabledCell} />
                  {WISC_PADRONIZADO_COLUMNS.map((column) => (
                    <td key={column.key} className={styles.disabledCell}>
                      {renderCell(
                        results.somaPadronizados[column.key],
                        null,
                        `Soma dos resultados padronizados — ${column.label}`,
                        true,
                      )}
                    </td>
                  ))}
                  <td className={styles.disabledCell} />
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.somatorioBox}>
            <span className={styles.somatorioLabel}>Somatório da escala completa</span>
            <span className={styles.somatorioValue}>{somatorioEscalaCompleta || '—'}</span>
          </div>

          <h4 className={styles.resultsTitle}>QI e índices</h4>
          <div className={styles.tableWrap}>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th />
                  <th>Resultado</th>
                  <th>QI / Índice</th>
                  <th className={styles.mediaDesignationHeader}>Classificação</th>
                  <th>Percentil</th>
                  <th>IC 90%</th>
                  <th>IC 95%</th>
                </tr>
              </thead>
              <tbody>
                {WISC_SCALE_SUMMARY_ROWS.map((row) => {
                  const summary = getScaleSummaryRow(results, row.key)
                  return (
                    <tr key={row.key}>
                      <th scope="row">{row.label}</th>
                      <td className={styles.disabledCell}>
                        {renderCell(summary.resultado, null, `${row.label} — resultado`, true)}
                      </td>
                      <td className={autoConvert ? styles.disabledCell : undefined}>
                        {renderCell(
                          summary.qi,
                          autoConvert ? null : (next) => updateScaleSummaryManual(row.key, { qi: next }),
                          `${row.label} — QI / índice`,
                          autoConvert,
                        )}
                      </td>
                      <td className={styles.mediaDesignationCell}>
                        {getWiscQiClassificacao(summary.qi) || '—'}
                      </td>
                      <td className={autoConvert ? styles.disabledCell : undefined}>
                        {renderCell(
                          summary.percentil,
                          autoConvert
                            ? null
                            : (next) => updateScaleSummaryManual(row.key, { percentil: next }),
                          `${row.label} — percentil`,
                          autoConvert,
                        )}
                      </td>
                      <td className={autoConvert ? styles.disabledCell : undefined}>
                        {renderCell(
                          summary.intervaloConfianca90,
                          autoConvert
                            ? null
                            : (next) => updateScaleSummaryManual(row.key, { intervaloConfianca90: next }),
                          `${row.label} — intervalo de confiança 90%`,
                          autoConvert,
                        )}
                      </td>
                      <td className={autoConvert ? styles.disabledCell : undefined}>
                        {renderCell(
                          summary.intervaloConfianca95,
                          autoConvert
                            ? null
                            : (next) => updateScaleSummaryManual(row.key, { intervaloConfianca95: next }),
                          `${row.label} — intervalo de confiança 95%`,
                          autoConvert,
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <WiscSectionTitle
            title="GAI"
            tooltip="Somatório CV + OP (Tabela 1.5 — Prifitera, Weiss e Saklofske)."
          />
          <div className={styles.tableWrap}>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th />
                  <th>Resultado</th>
                  <th>GAI</th>
                  <th>Percentil</th>
                  <th>IC 90%</th>
                  <th>IC 95%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">GAI</th>
                  <td className={styles.disabledCell}>
                    {renderCell(
                      results.gaiSummary.resultado,
                      null,
                      'GAI — resultado (CV + OP)',
                      true,
                    )}
                  </td>
                  <td className={autoFillGai ? styles.disabledCell : undefined}>
                    {renderCell(
                      results.gaiSummary.gai,
                      autoFillGai ? null : (next) => updateGaiSummaryManual({ gai: next }),
                      'GAI — índice',
                      autoFillGai,
                    )}
                  </td>
                  <td className={autoFillGai ? styles.disabledCell : undefined}>
                    {renderCell(
                      results.gaiSummary.percentil,
                      autoFillGai ? null : (next) => updateGaiSummaryManual({ percentil: next }),
                      'GAI — percentil',
                      autoFillGai,
                    )}
                  </td>
                  <td className={autoFillGai ? styles.disabledCell : undefined}>
                    {renderCell(
                      results.gaiSummary.intervaloConfianca90,
                      autoFillGai
                        ? null
                        : (next) => updateGaiSummaryManual({ intervaloConfianca90: next }),
                      'GAI — intervalo de confiança 90%',
                      autoFillGai,
                    )}
                  </td>
                  <td className={autoFillGai ? styles.disabledCell : undefined}>
                    {renderCell(
                      results.gaiSummary.intervaloConfianca95,
                      autoFillGai
                        ? null
                        : (next) => updateGaiSummaryManual({ intervaloConfianca95: next }),
                      'GAI — intervalo de confiança 95%',
                      autoFillGai,
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <WiscProfileTable
            title="SCAD"
            tooltip="Usa os padronizados de Informação, Aritmética, Código e Memória de Dígitos. Conta quantos têm valor 8 ou menos: 0 ou 1 — Não há perfil; 2 — Parcial; mais de 2 — Total."
            subtestKeys={WISC_SCAD_SUBTEST_KEYS}
            subtests={results.subtests}
          />

          <WiscProfileTable
            title="ACID"
            tooltip="Usa os padronizados de Pesquisa de Símbolos, Código, Aritmética e Memória de Dígitos. Conta quantos têm valor 8 ou menos: 0 ou 1 — Não há perfil; 2 — Parcial; mais de 2 — Total."
            subtestKeys={WISC_ACID_SUBTEST_KEYS}
            subtests={results.subtests}
          />
        </div>
      </div>

      {confirmClear ? (
        <div
          className={styles.infoOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="wisc-clear-title"
          onClick={() => setConfirmClear(false)}
        >
          <div className={styles.confirmPanel} onClick={(event) => event.stopPropagation()}>
            <h3 id="wisc-clear-title">Limpar resultados WISC-III?</h3>
            <p>
              A idade, os resultados brutos, os padronizados, o QI / índices e o GAI serão apagados. Esta
              ação não pode ser desfeita.
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

      {infoOpen ? (
        <div
          className={styles.infoOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="wisc-calc-title"
          onClick={() => setInfoOpen(false)}
        >
          <div className={styles.infoPanel} onClick={(event) => event.stopPropagation()}>
            <div className={styles.infoHeader}>
              <h3 id="wisc-calc-title">Como o WISC-III é calculado</h3>
              <button type="button" className={styles.infoClose} onClick={() => setInfoOpen(false)}>
                Fechar
              </button>
            </div>
            <div className={styles.infoBody}>
              <p>
                O sistema segue o Anexo A do manual CEGOC (WISC-III). Só precisa de indicar a{' '}
                <strong>idade na avaliação</strong> — em anos e meses, ou a partir da data de
                nascimento e da data da avaliação — e os <strong>resultados brutos</strong> de cada
                subteste. O resto é calculado a partir das tabelas oficiais.
              </p>

              <h4>1. Idade e Tabela 36 (bruto → padronizado)</h4>
              <p>
                A idade escolhe a tabela de conversão certa — em anos e meses, ou calculada a partir
                das datas. As normas vão dos <strong>6;0</strong> aos{' '}
                <strong>16;11</strong>, em intervalos de <strong>6 meses</strong>:
              </p>
              <ul>
                <li>
                  Meses <strong>0 a 5</strong> — primeira metade do ano (ex.: 8;0 a 8;5).
                </li>
                <li>
                  Meses <strong>6 a 11</strong> — segunda metade do ano (ex.: 8;6 a 8;11).
                </li>
              </ul>
              <p>
                Os dias não são necessários. Cada resultado bruto de um subteste é convertido num
                resultado padronizado de <strong>1 a 19</strong> para essa idade.
              </p>

              <h4>2. Onde vai cada padronizado</h4>
              <p>
                Cada subteste tem colunas próprias na grelha (Verb., Real., CV, OP, VP). O valor
                padronizado é copiado para essas colunas — as células cinzentas ficam vazias e não
                entram no cálculo. Não há substituições: cada subteste só aparece nas colunas que lhe
                correspondem no manual.
              </p>

              <h4>3. Somas dos padronizados (subtestes nucleares)</h4>
              <p>
                A linha «Soma dos resultados padronizados» só inclui os subtestes nucleares de cada
                coluna. A soma só é feita quando <strong>todos</strong> os subtestes dessa coluna têm
                padronizado:
              </p>
              <ul>
                <li>
                  <strong>Verbal:</strong> Informação, Semelhanças, Aritmética, Vocabulário,
                  Compreensão (5 subtestes).
                </li>
                <li>
                  <strong>Realização:</strong> Complemento de Gravuras, Código, Disposição de Gravuras,
                  Cubos, Composição de Objectos (5 subtestes).
                </li>
                <li>
                  <strong>CV:</strong> Informação, Semelhanças, Vocabulário, Compreensão (4 subtestes —
                  sem Aritmética).
                </li>
                <li>
                  <strong>OP:</strong> Complemento de Gravuras, Disposição de Gravuras, Cubos,
                  Composição de Objectos (4 subtestes — sem Código).
                </li>
                <li>
                  <strong>VP:</strong> Código + Pesquisa de Símbolos (2 subtestes).
                </li>
              </ul>
              <p>
                <strong>Escala completa</strong> = soma Verbal + soma Realização (aparece no
                somatório e na linha «Escala Completa» da segunda tabela).
              </p>

              <h4>4. Subtestes opcionais e excepções</h4>
              <ul>
                <li>
                  <strong>Memória de Dígitos</strong> e <strong>Labirintos</strong> — pode registar o
                  padronizado (coluna Verb. ou Real.), mas <strong>não entram</strong> em nenhuma soma
                  nem no QI.
                </li>
                <li>
                  <strong>Pesquisa de Símbolos</strong> — o padronizado aparece nas colunas Real. e VP;
                  só entra na soma VP (com Código), não na soma Realização.
                </li>
              </ul>
              <p>
                Não são aplicadas substituições nem prorações: administração standard, sem preencher
                células «em substituição» de outros subtestes.
              </p>

              <h4>5. QI, índices, percentil e intervalos de confiança</h4>
              <p>
                Com cada soma completa, as Tabelas 37–42 do manual convertem o total em:
              </p>
              <ul>
                <li>
                  <strong>Tabela 37</strong> — QI Verbal
                </li>
                <li>
                  <strong>Tabela 38</strong> — QI Realização
                </li>
                <li>
                  <strong>Tabela 39</strong> — QI Escala Completa
                </li>
                <li>
                  <strong>Tabela 40</strong> — Índice CV
                </li>
                <li>
                  <strong>Tabela 41</strong> — Índice OP
                </li>
                <li>
                  <strong>Tabela 42</strong> — Índice VP
                </li>
              </ul>
              <p>
                Para cada linha são também preenchidos o <strong>percentil</strong>, o{' '}
                <strong>intervalo de confiança a 90%</strong> e o <strong>a 95%</strong>, conforme o
                manual.
              </p>

              <h4>6. GAI (General Ability Index)</h4>
              <p>
                O GAI usa a <strong>soma dos padronizados CV + OP</strong> (8 subtestes nucleares de
                compreensão verbal e organização perceptiva, sem Aritmética nem Código). A Tabela 1.5
                do suplemento (Prifitera, Weiss e Saklofske) converte esse total em GAI, percentil e
                intervalos de confiança a 90% e 95%.
              </p>

              <h4>7. SCAD e ACID</h4>
              <p>
                Os perfis <strong>SCAD</strong> e <strong>ACID</strong> reutilizam os padronizados já
                calculados nos subtestes indicados. Conta-se quantos têm valor <strong>8 ou menos</strong>:
              </p>
              <ul>
                <li>
                  <strong>SCAD:</strong> Informação, Aritmética, Código, Memória de Dígitos.
                </li>
                <li>
                  <strong>ACID:</strong> Pesquisa de Símbolos, Código, Aritmética, Memória de Dígitos.
                </li>
              </ul>
              <ul>
                <li>
                  <strong>0 ou 1</strong> subtestes ≤ 8 — Não há perfil
                </li>
                <li>
                  <strong>2</strong> subtestes ≤ 8 — Parcial
                </li>
                <li>
                  <strong>Mais de 2</strong> subtestes ≤ 8 — Total
                </li>
              </ul>

              <h4>Quando a conversão automática não funciona</h4>
              <p>
                Se a idade estiver fora dos 6;0–16;11, a conversão automática é desligada. Pode
                continuar a preencher manualmente os padronizados, o QI / índice, o percentil e os
                intervalos de confiança.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </details>
  )
}
