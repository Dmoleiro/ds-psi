import {
  BANC_COMPOSITE_LABELS,
  BANC_MEASURE_ROWS,
  BANC_SECTION_META,
  deriveBancResults,
  hasBancResultsData,
  isBancPerfilMeasureInactive,
  parseBancAgeYears,
  type BancResults,
  type BancSectionKey,
} from './bancResults'
import { chronologicalAgeYearsMonths, resolveEvaluationAge, type EvaluationAgeFields } from './chronologicalAge'
import {
  deriveGriffithsResults,
  getGriffithsDevelopmentLevel,
  GRIFFITHS_SECTION_SLOT_LABELS,
  GRIFFITHS_SUBSCALES,
  hasGriffithsResultsData,
  type GriffithsResults,
  type GriffithsSectionCells,
  type GriffithsSubscaleFieldKey,
} from './griffithsResults'
import { getPreEscolarNormLevelLabel, type PreEscolarNormLevel } from './preEscolarNorms'
import {
  ADDITIONAL_EVALUATION_METHODS,
  BANC_EVALUATION_OPTIONS,
  type PatientEvaluationSelections,
  WISC_EVALUATION_OPTIONS,
} from './patientEvaluations'
import {
  derivePreEscolarResults,
  getPreEscolarQualitativeLevel,
  hasPreEscolarResultsData,
  PRE_ESCOLAR_SUBTESTS,
  type PreEscolarResults,
} from './preEscolarResults'
import {
  computeSomatorioEscalaCompleta,
  deriveWiscResults,
  getWiscQiClassificacao,
  getWiscScadAcidDesignation,
  getWiscSubtestPadronizadoDisplay,
  getWiscSubtestPadronizadoMediaDesignation,
  hasWiscResultsData,
  isWiscPadronizadoEditable,
  WISC_ACID_SUBTEST_KEYS,
  WISC_PADRONIZADO_COLUMNS,
  WISC_SCALE_SUMMARY_ROWS,
  WISC_SCAD_SUBTEST_KEYS,
  WISC_SUBTEST_RESULT_ROWS,
} from './wiscResults'

export type EvaluationExportMethodId =
  | 'wisc'
  | 'banc'
  | 'griffiths'
  | 'preescolar'
  | `additional-${number}`

export type EvaluationExportContext = {
  patientName: string
  patientBirthDate?: string
  selections: PatientEvaluationSelections
  methodIds?: EvaluationExportMethodId[]
}

const GRIFFITHS_SECTION_ROWS: Array<{ field: GriffithsSubscaleFieldKey; label: string; hint: string }> =
  [
    { field: 'sectionI', label: 'Secção I (meses)', hint: 'Idade mental em meses' },
    { field: 'sectionII', label: 'Secção II (meses)', hint: 'Idade mental em meses' },
    { field: 'sectionIII', label: 'Secção III (itens × 2)', hint: 'Itens conseguidos × 2' },
    { field: 'sectionIV', label: 'Secção IV (itens × 2)', hint: 'Itens conseguidos × 2' },
  ]

const GRIFFITHS_SUMMARY_ROWS: Array<{
  field: GriffithsSubscaleFieldKey | 'totalRaw'
  label: string
  hint?: string
}> = [
  { field: 'totalRaw', label: 'Totais dos resultados brutos' },
  { field: 'developmentalAgeMonths', label: 'Idade de Desenvolvimento / Mental (meses)' },
  {
    field: 'mentalAgeGlobal',
    label: 'Quociente parcial (QDA)',
    hint: '(idade desenvolvimento ÷ IC) × 100',
  },
]

const BANC_SECTION_ORDER: BancSectionKey[] = [
  'memoria',
  'linguagem',
  'atencao',
  'orientacao_motricidade',
]

const BANC_TINT_CLASS: Record<string, string> = {
  blue: 'banc-tint-blue',
  orange: 'banc-tint-orange',
  purple: 'banc-tint-purple',
  green: 'banc-tint-green',
  yellow: 'banc-tint-yellow',
  grey: 'banc-tint-grey',
}

const BANC_HEADER_CLASS: Record<string, string> = {
  memoria: 'banc-header-memoria',
  linguagem: 'banc-header-linguagem',
  atencao: 'banc-header-atencao',
  orientacao_motricidade: 'banc-header-orientacao',
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function displayCell(value: string | undefined | null): string {
  const trimmed = value?.trim() ?? ''
  return escapeHtml(trimmed || '—')
}

function formatIsoDate(value: string): string {
  const trimmed = value.trim().slice(0, 10)
  if (!trimmed) return '—'
  const [year, month, day] = trimmed.split('-')
  if (!year || !month || !day) return escapeHtml(trimmed)
  return escapeHtml(`${day}/${month}/${year}`)
}

function buildAgeBlock(
  fields: EvaluationAgeFields,
  options?: { showEvaluationDate?: boolean },
): string {
  const age = resolveEvaluationAge(fields)
  if (age.ageInputMode === 'dates') {
    const calculated = chronologicalAgeYearsMonths(age.birthDate, age.evaluationDate)
    const lines = [
      `<p><strong>Data de nascimento:</strong> ${formatIsoDate(age.birthDate)}</p>`,
    ]
    if (options?.showEvaluationDate !== false) {
      lines.push(`<p><strong>Data da avaliação:</strong> ${formatIsoDate(age.evaluationDate)}</p>`)
    }
    if (calculated) {
      lines.push(
        `<p><strong>Idade:</strong> ${calculated.years} anos e ${calculated.months} meses</p>`,
      )
    }
    return `<div class="age-block">${lines.join('')}</div>`
  }

  const years = age.ageYears.trim()
  const months = age.ageMonths.trim()
  if (!years && !months) return ''
  return `<p class="age-block"><strong>Idade:</strong> ${displayCell(years)} anos e ${displayCell(months)} meses</p>`
}

function buildSelectionList(
  options: ReadonlyArray<{ key: string; label: string }>,
  selectedKeys: string[],
): string {
  const selected = new Set(selectedKeys)
  const labels = options.filter((option) => selected.has(option.key)).map((option) => option.label)
  if (labels.length === 0) {
    return '<p class="muted">Nenhuma subescala registada.</p>'
  }
  const items = labels.map((label) => `<li>${escapeHtml(label)}</li>`).join('')
  return `<ol class="selection-list">${items}</ol>`
}

function buildBancPlotHtml(rp: string): string {
  const value = Number.parseInt(rp, 10)
  const hasDot = Number.isFinite(value) && value >= 1 && value <= 19
  const left = hasDot ? `calc((${value} - 0.5) / 19 * 100%)` : undefined
  const ticks = Array.from({ length: 19 }, (_, index) => {
    const tick = index + 1
    const average = tick >= 8 && tick <= 12 ? ' average' : ''
    return `<span class="banc-plot-tick${average}">${tick}</span>`
  }).join('')
  const dot = hasDot ? `<span class="banc-plot-dot" style="left: ${left}"></span>` : ''
  return `<div class="banc-plot" aria-hidden="true"><div class="banc-plot-track">${dot}</div><div class="banc-plot-scale">${ticks}</div></div>`
}

function buildWiscProfileTable(
  title: string,
  subtestKeys: readonly string[],
  subtests: ReturnType<typeof deriveWiscResults>['subtests'],
): string {
  const designation = getWiscScadAcidDesignation(subtests, subtestKeys)
  const rows = subtestKeys
    .map((key) => {
      const label = WISC_SUBTEST_RESULT_ROWS.find((row) => row.key === key)?.label ?? key
      const display = getWiscSubtestPadronizadoDisplay(subtests, key) || '—'
      return `<tr><th scope="row">${escapeHtml(label)}</th><td>${displayCell(display === '—' ? '' : display)}</td></tr>`
    })
    .join('')
  return `
    <h4 class="section-title">${escapeHtml(title)}</h4>
    <table class="data-table">
      <thead><tr><th></th><th>Padronizado</th></tr></thead>
      <tbody>
        ${rows}
        <tr class="summary-row"><th scope="row">Perfil</th><td>${displayCell(designation)}</td></tr>
      </tbody>
    </table>
  `
}

function buildWiscSection(selections: PatientEvaluationSelections): string {
  const derived = deriveWiscResults(selections.wiscResults)
  const somatorio = computeSomatorioEscalaCompleta(derived.somaPadronizados)
  const padronizadoHead = WISC_PADRONIZADO_COLUMNS.map((column) => `<th>${escapeHtml(column.label)}</th>`).join('')
  const subtestRows = WISC_SUBTEST_RESULT_ROWS.map((row) => {
    const subtest = derived.subtests[row.key] ?? { brutos: '', padronizado: {} }
    const label = row.optional ? `(${row.label})` : row.label
    const padronizadoCells = WISC_PADRONIZADO_COLUMNS.map((column) => {
      const editable = isWiscPadronizadoEditable(row.key, column.key)
      const value = editable ? subtest.padronizado[column.key] ?? '' : ''
      return `<td class="${editable ? '' : 'muted-cell'}">${displayCell(value)}</td>`
    }).join('')
    const classification = getWiscSubtestPadronizadoMediaDesignation(derived.subtests, row.key) || '—'
    return `
      <tr>
        <th scope="row">${escapeHtml(label)}</th>
        <td>${displayCell(subtest.brutos)}</td>
        ${padronizadoCells}
        <td>${displayCell(classification)}</td>
      </tr>
    `
  }).join('')
  const somaCells = WISC_PADRONIZADO_COLUMNS.map(
    (column) => `<td class="muted-cell">${displayCell(derived.somaPadronizados[column.key])}</td>`,
  ).join('')
  const scaleRows = WISC_SCALE_SUMMARY_ROWS.map((row) => {
    const summary = derived.scaleSummary[row.key] ?? {
      resultado: '',
      qi: '',
      percentil: '',
      intervaloConfianca90: '',
      intervaloConfianca95: '',
    }
    return `
      <tr>
        <th scope="row">${escapeHtml(row.label)}</th>
        <td class="muted-cell">${displayCell(summary.resultado)}</td>
        <td>${displayCell(summary.qi)}</td>
        <td>${displayCell(getWiscQiClassificacao(summary.qi))}</td>
        <td>${displayCell(summary.percentil)}</td>
        <td>${displayCell(summary.intervaloConfianca90)}</td>
        <td>${displayCell(summary.intervaloConfianca95)}</td>
      </tr>
    `
  }).join('')

  return `
    <section class="method-block">
      <h2>WISC III</h2>
      ${buildSelectionList(WISC_EVALUATION_OPTIONS, selections.wiscSelections)}
      ${buildAgeBlock(resolveEvaluationAge(derived), { showEvaluationDate: true })}
      <h3>Resultados dos subtestes</h3>
      <table class="data-table wisc-table">
        <thead>
          <tr>
            <th rowspan="2">Subtestes</th>
            <th rowspan="2">Resultados brutos</th>
            <th colspan="${WISC_PADRONIZADO_COLUMNS.length}">Resultados padronizados</th>
            <th rowspan="2">Classificação</th>
          </tr>
          <tr>${padronizadoHead}</tr>
        </thead>
        <tbody>
          ${subtestRows}
          <tr class="summary-row">
            <th scope="row">Soma dos resultados padronizados</th>
            <td class="muted-cell"></td>
            ${somaCells}
            <td class="muted-cell"></td>
          </tr>
        </tbody>
      </table>
      <p class="highlight-box"><strong>Somatório da escala completa:</strong> ${displayCell(somatorio)}</p>
      <h3>QI e índices</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th></th>
            <th>Resultado</th>
            <th>QI / Índice</th>
            <th>Classificação</th>
            <th>Percentil</th>
            <th>IC 90%</th>
            <th>IC 95%</th>
          </tr>
        </thead>
        <tbody>${scaleRows}</tbody>
      </table>
      <h3>GAI</h3>
      <table class="data-table">
        <thead>
          <tr><th></th><th>Resultado</th><th>GAI</th><th>Percentil</th><th>IC 90%</th><th>IC 95%</th></tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">GAI</th>
            <td class="muted-cell">${displayCell(derived.gaiSummary.resultado)}</td>
            <td>${displayCell(derived.gaiSummary.gai)}</td>
            <td>${displayCell(derived.gaiSummary.percentil)}</td>
            <td>${displayCell(derived.gaiSummary.intervaloConfianca90)}</td>
            <td>${displayCell(derived.gaiSummary.intervaloConfianca95)}</td>
          </tr>
        </tbody>
      </table>
      ${buildWiscProfileTable('SCAD', WISC_SCAD_SUBTEST_KEYS, derived.subtests)}
      ${buildWiscProfileTable('ACID', WISC_ACID_SUBTEST_KEYS, derived.subtests)}
    </section>
  `
}

function buildBancPerfilSection(results: BancResults, section: BancSectionKey): string {
  const derived = deriveBancResults(results)
  const rows = BANC_MEASURE_ROWS.filter((row) => row.section === section)
  if (rows.length === 0) return ''
  const meta = BANC_SECTION_META[section]
  const ageYearsNum = parseBancAgeYears(derived.ageYears)
  const body = rows
    .map((row) => {
      const measure = derived.measures[row.key] ?? { rb: '', rp: '' }
      const inactive = isBancPerfilMeasureInactive(row.key, ageYearsNum)
      const label = row.parentLabel
        ? `${row.parentLabel} — ${row.label}`
        : row.label
      const tintClass = BANC_TINT_CLASS[row.tint] ?? ''
      if (inactive) {
        return `<tr class="inactive-row"><th scope="row">${escapeHtml(label)}</th><td>—</td><td class="${tintClass}">—</td><td>—</td></tr>`
      }
      return `
        <tr>
          <th scope="row">${escapeHtml(label)}</th>
          <td>${displayCell(measure.rb)}</td>
          <td class="${tintClass}">${displayCell(measure.rp)}</td>
          <td>${buildBancPlotHtml(measure.rp)}</td>
        </tr>
      `
    })
    .join('')

  return `
    <div class="banc-perfil-section">
      <h4 class="banc-section-heading ${BANC_HEADER_CLASS[section] ?? ''}">${escapeHtml(meta.label)}</h4>
      <table class="data-table banc-table">
        <thead>
          <tr>
            <th>Testes</th>
            <th>RB</th>
            <th>RP</th>
            <th>Resultado padronizado</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  `
}

function buildBancCompositeTable(
  title: string,
  headerClass: string,
  labels: ReadonlyArray<{ key: string; label: string }>,
  cells: BancResults['compositeMemoria'],
  somatorio: string,
): string {
  const body = labels
    .map((row) => {
      const cell = cells[row.key]
      if (!cell) {
        return `<tr class="inactive-row"><th scope="row">${escapeHtml(row.label)}</th><td>—</td></tr>`
      }
      return `<tr><th scope="row">${escapeHtml(row.label)}</th><td class="muted-cell">${displayCell(cell.rp)}</td></tr>`
    })
    .join('')
  return `
    <div class="banc-composite-block">
      <h4 class="banc-section-heading ${headerClass}">${escapeHtml(title)}</h4>
      <table class="data-table">
        <thead><tr><th>Testes</th><th>RP</th></tr></thead>
        <tbody>
          ${body}
          <tr class="summary-row"><th scope="row">Somatório dos resultados padronizados</th><td class="muted-cell">${displayCell(somatorio)}</td></tr>
        </tbody>
      </table>
    </div>
  `
}

function buildBancSection(selections: PatientEvaluationSelections): string {
  const derived = deriveBancResults(selections.bancResults)
  const globalRows = (
    [
      ['memoria', 'Memória', 'banc-header-memoria'],
      ['linguagem', 'Linguagem', 'banc-header-linguagem'],
      ['atencao', 'Atenção / Funções Executivas', 'banc-header-atencao'],
    ] as const
  )
    .map(([key, label, headerClass]) => {
      const row = derived.globalIndices[key]
      return `
        <tr>
          <th scope="row" class="${headerClass}">${escapeHtml(label)}</th>
          <td class="muted-cell">${displayCell(row.grupoNormativo)}</td>
          <td class="muted-cell">${displayCell(row.somatorio)}</td>
          <td class="muted-cell">${displayCell(row.indice)}</td>
          <td class="muted-cell">${displayCell(row.percentil)}</td>
        </tr>
      `
    })
    .join('')
  const perfil = BANC_SECTION_ORDER.map((section) =>
    buildBancPerfilSection(selections.bancResults, section),
  ).join('')

  return `
    <section class="method-block">
      <h2>BANC</h2>
      ${buildSelectionList(BANC_EVALUATION_OPTIONS, selections.bancSelections)}
      ${buildAgeBlock(resolveEvaluationAge(derived), { showEvaluationDate: true })}
      ${derived.normGroup.trim() ? `<p><strong>Grupo normativo de referência:</strong> ${displayCell(derived.normGroup)}</p>` : ''}
      <h3>Cálculo dos índices globais</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Índices globais</th>
            <th>Grupo normativo</th>
            <th>Somatório</th>
            <th>Índice</th>
            <th>PC</th>
          </tr>
        </thead>
        <tbody>${globalRows}</tbody>
      </table>
      ${buildBancCompositeTable(
        'Resultado compósito de Memória',
        'banc-header-memoria',
        BANC_COMPOSITE_LABELS.memoria,
        derived.compositeMemoria,
        derived.globalIndices.memoria.somatorio,
      )}
      ${buildBancCompositeTable(
        'Resultado compósito de Linguagem',
        'banc-header-linguagem',
        BANC_COMPOSITE_LABELS.linguagem,
        derived.compositeLinguagem,
        derived.globalIndices.linguagem.somatorio,
      )}
      ${buildBancCompositeTable(
        'Resultado compósito de Atenção / Funções Executivas',
        'banc-header-atencao',
        BANC_COMPOSITE_LABELS.atencao,
        derived.compositeAtencao,
        derived.globalIndices.atencao.somatorio,
      )}
      <h3>Perfil de resultados</h3>
      ${perfil}
    </section>
  `
}

function renderGriffithsCells(cells: GriffithsSectionCells): string {
  return GRIFFITHS_SECTION_SLOT_LABELS.map((_, slotIndex) =>
    `<td>${displayCell(cells[slotIndex] ?? '')}</td>`,
  ).join('')
}

function buildGriffithsSection(results: GriffithsResults): string {
  const derived = deriveGriffithsResults(results)
  const qgDisplay = derived.derivedQgQuotient || derived.qgQuotient.trim()
  const globalMentalAgeDisplay = derived.derivedGlobalMentalAgeMonths || derived.qgRaw
  const developmentLevel = getGriffithsDevelopmentLevel(qgDisplay)
  const subscaleHead = GRIFFITHS_SUBSCALES.map(
    (subscale) =>
      `<th colspan="${GRIFFITHS_SECTION_SLOT_LABELS.length}" class="griffiths-subscale-header"><span>${escapeHtml(subscale.label)}</span><span class="griffiths-subscale-title">${escapeHtml(subscale.title)}</span></th>`,
  ).join('')
  const slotHead = GRIFFITHS_SUBSCALES.map(() =>
    GRIFFITHS_SECTION_SLOT_LABELS.map(
      (slotLabel) => `<th class="griffiths-slot-header">${escapeHtml(slotLabel)}</th>`,
    ).join(''),
  ).join('')
  const sectionRows = GRIFFITHS_SECTION_ROWS.map((row) => {
    const cells = GRIFFITHS_SUBSCALES.map((subscale) => {
      const subscaleResult = derived.subscales[subscale.key]
      const values = subscaleResult?.[row.field] ?? ['', '']
      return renderGriffithsCells(values)
    }).join('')
    return `
      <tr>
        <th scope="row" class="griffiths-row-header">
          ${escapeHtml(row.label)}
          <span class="row-hint">${escapeHtml(row.hint)}</span>
        </th>
        ${cells}
      </tr>
    `
  }).join('')
  const summaryRows = GRIFFITHS_SUMMARY_ROWS.map((row) => {
    const cells = GRIFFITHS_SUBSCALES.map((subscale) => {
      const subscaleResult = derived.subscales[subscale.key]
      const values =
        row.field === 'totalRaw'
          ? subscaleResult?.totalRaw ?? ['', '']
          : subscaleResult?.[row.field] ?? ['', '']
      return renderGriffithsCells(values)
    }).join('')
    return `
      <tr class="summary-row">
        <th scope="row" class="griffiths-row-header">
          ${escapeHtml(row.label)}
          ${row.hint ? `<span class="row-hint">${escapeHtml(row.hint)}</span>` : ''}
        </th>
        ${cells}
      </tr>
    `
  }).join('')

  return `
    <section class="method-block">
      <h2>Ruth Griffiths</h2>
      <p class="muted">Escala de Desenvolvimento de Ruth Griffiths — subescalas A (Locomotora) a F (Raciocínio Prático).</p>
      ${buildAgeBlock(resolveEvaluationAge(derived))}
      <h3>Sumário dos resultados da avaliação</h3>
      <table class="data-table griffiths-table">
        <thead>
          <tr><th rowspan="2" class="griffiths-row-header"></th>${subscaleHead}</tr>
          <tr>${slotHead}</tr>
        </thead>
        <tbody>
          ${sectionRows}
          ${summaryRows}
          <tr class="summary-row">
            <th scope="row" class="griffiths-row-header">Idade cronológica (meses)</th>
            <td colspan="${GRIFFITHS_SUBSCALES.length * GRIFFITHS_SECTION_SLOT_LABELS.length}">${displayCell(derived.chronologicalAgeMonths)}</td>
          </tr>
        </tbody>
      </table>
      <h3>Resultado global</h3>
      <table class="data-table">
        <tbody>
          <tr>
            <th scope="row">Idade mental global (meses)</th>
            <td>${displayCell(globalMentalAgeDisplay)}</td>
          </tr>
          <tr>
            <th scope="row">Quociente geral (QG)</th>
            <td>
              ${displayCell(qgDisplay)}
              ${developmentLevel ? `<span class="level-tag">${escapeHtml(developmentLevel)}</span>` : ''}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  `
}

function buildPreEscolarSection(results: PreEscolarResults): string {
  const derived = derivePreEscolarResults(results)
  const totalPointsDisplay = derived.derivedTotalPoints || derived.totalPoints.trim()
  const totalPercentileDisplay = derived.derivedTotalPercentile || derived.totalPercentile.trim()
  const totalStanineDisplay = derived.derivedTotalStanine || derived.totalStanine.trim()
  const qualitativeLevel = getPreEscolarQualitativeLevel(totalPercentileDisplay)
  const rows = PRE_ESCOLAR_SUBTESTS.map((subtest) => {
    const row = derived.subtests[subtest.key]
    const pointsDisplay = row?.derivedPoints || row?.points.trim() || ''
    const percentileDisplay = row?.derivedPercentile || row?.percentile.trim() || ''
    const stanineDisplay = row?.derivedStanine || row?.stanine.trim() || ''
    const usesErrors = subtest.formula === 'c_minus_e'
    return `
      <tr>
        <th scope="row">${escapeHtml(subtest.label)}</th>
        <td>${displayCell(row?.correct ?? '')}</td>
        <td>${usesErrors ? displayCell(row?.errors ?? '') : '—'}</td>
        <td class="derived-cell">${displayCell(pointsDisplay)}</td>
        <td class="muted-cell">${subtest.maxPoints}</td>
        <td class="derived-cell">${displayCell(percentileDisplay)}</td>
        <td class="derived-cell">${displayCell(stanineDisplay)}</td>
      </tr>
    `
  }).join('')

  return `
    <section class="method-block">
      <h2>Pré-Escolar</h2>
      <p class="muted">Provas de Diagnóstico Pré-Escolar (CEGOC) — Cadernos A e B.</p>
      ${buildAgeBlock(resolveEvaluationAge(derived), { showEvaluationDate: false })}
      <p><strong>Tabela de normas:</strong> ${escapeHtml(getPreEscolarNormLevelLabel(derived.normLevel as PreEscolarNormLevel))}</p>
      <table class="data-table">
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
          ${rows}
          <tr class="summary-row">
            <th scope="row">Total</th>
            <td class="muted-cell">—</td>
            <td class="muted-cell">—</td>
            <td class="derived-cell">${displayCell(totalPointsDisplay)}</td>
            <td class="muted-cell">100</td>
            <td class="derived-cell">${displayCell(totalPercentileDisplay)}</td>
            <td class="derived-cell">${displayCell(totalStanineDisplay)}</td>
          </tr>
        </tbody>
      </table>
      ${qualitativeLevel ? `<p class="highlight-box"><strong>Interpretação global (total):</strong> ${escapeHtml(qualitativeLevel)}</p>` : ''}
    </section>
  `
}

function buildAdditionalMethodSection(methodIndex: number, selections: PatientEvaluationSelections): string {
  const method = ADDITIONAL_EVALUATION_METHODS[methodIndex]
  if (!method) return ''
  const optionKeys = new Set(method.options.map((option) => option.key))
  const selected = selections.additionalMethodSelections.filter((key) => optionKeys.has(key))
  if (selected.length === 0) return ''
  const list = buildSelectionList(method.options, selected)
  return `
    <section class="method-block">
      <h2>${escapeHtml(method.title)}</h2>
      ${list}
    </section>
  `
}

export function resolveEvaluationExportMethodIds(
  selections: PatientEvaluationSelections,
): EvaluationExportMethodId[] {
  const ids: EvaluationExportMethodId[] = []
  if (selections.wiscSelections.length > 0 || hasWiscResultsData(selections.wiscResults)) {
    ids.push('wisc')
  }
  if (selections.bancSelections.length > 0 || hasBancResultsData(selections.bancResults)) {
    ids.push('banc')
  }
  if (hasGriffithsResultsData(selections.griffithsResults)) {
    ids.push('griffiths')
  }
  if (hasPreEscolarResultsData(selections.preEscolarResults)) {
    ids.push('preescolar')
  }
  ADDITIONAL_EVALUATION_METHODS.forEach((method, methodIndex) => {
    const optionKeys = new Set(method.options.map((option) => option.key))
    if (selections.additionalMethodSelections.some((key) => optionKeys.has(key))) {
      ids.push(`additional-${methodIndex}`)
    }
  })
  return ids
}

function buildMethodSection(
  methodId: EvaluationExportMethodId,
  selections: PatientEvaluationSelections,
): string {
  if (methodId === 'wisc') return buildWiscSection(selections)
  if (methodId === 'banc') return buildBancSection(selections)
  if (methodId === 'griffiths') return buildGriffithsSection(selections.griffithsResults)
  if (methodId === 'preescolar') return buildPreEscolarSection(selections.preEscolarResults)
  if (methodId.startsWith('additional-')) {
    const methodIndex = Number.parseInt(methodId.replace('additional-', ''), 10)
    return buildAdditionalMethodSection(methodIndex, selections)
  }
  return ''
}

const PRINT_STYLES = `
  body {
    font-family: "Helvetica Neue", Arial, sans-serif;
    color: #1a1a1a;
    line-height: 1.45;
    margin: 32px;
    font-size: 11pt;
  }
  h1 { font-size: 1.5rem; margin: 0 0 8px; }
  h2 { font-size: 1.2rem; margin: 0 0 12px; }
  h3 { font-size: 1rem; margin: 20px 0 8px; }
  h4.section-title, h4.banc-section-heading { font-size: 0.95rem; margin: 16px 0 8px; }
  .header-meta { color: #4a4a4a; margin: 0 0 24px; }
  .method-block {
    break-inside: avoid-page;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid #e8ddd2;
  }
  .muted { color: #6b6b6b; font-size: 0.9rem; }
  .age-block { margin: 12px 0; }
  .age-block p { margin: 4px 0; }
  .selection-list { margin: 8px 0 16px 20px; padding: 0; }
  .selection-list li { margin-bottom: 4px; }
  .highlight-box {
    margin: 12px 0;
    padding: 10px 12px;
    background: #f5f0ea;
    border: 1px solid #e8ddd2;
    border-radius: 4px;
  }
  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.86rem;
    margin: 8px 0 16px;
  }
  .data-table th,
  .data-table td {
    border: 1px solid #e8ddd2;
    padding: 5px 7px;
    text-align: left;
    vertical-align: top;
  }
  .data-table th {
    background: #f5f0ea;
    font-weight: 700;
  }
  .data-table tr.summary-row th,
  .data-table tr.summary-row td,
  .derived-cell { font-weight: 700; }
  .muted-cell { color: #6b6b6b; }
  .inactive-row { color: #9a9a9a; }
  .griffiths-subscale-header { text-align: center; }
  .griffiths-subscale-title { display: block; font-size: 0.75rem; font-weight: 400; color: #6b6b6b; }
  .griffiths-slot-header { text-align: center; font-size: 0.75rem; }
  .griffiths-row-header { min-width: 140px; }
  .row-hint { display: block; font-size: 0.72rem; font-weight: 400; color: #6b6b6b; }
  .level-tag {
    display: inline-block;
    margin-left: 8px;
    padding: 2px 8px;
    border-radius: 999px;
    background: #e8ddd2;
    font-size: 0.8rem;
    font-weight: 600;
  }
  .banc-header-memoria { color: #1e5a8a; background: rgba(135, 206, 250, 0.2); }
  .banc-header-linguagem { color: #6b2d7b; background: rgba(186, 104, 200, 0.18); }
  .banc-header-atencao { color: #2d6a2d; background: rgba(144, 238, 144, 0.22); }
  .banc-header-orientacao { color: #555; background: rgba(180, 180, 180, 0.2); }
  .banc-tint-blue { background: rgba(135, 206, 250, 0.25); }
  .banc-tint-orange { background: rgba(255, 200, 120, 0.35); }
  .banc-tint-purple { background: rgba(186, 104, 200, 0.2); }
  .banc-tint-green { background: rgba(144, 238, 144, 0.25); }
  .banc-tint-yellow { background: rgba(255, 255, 160, 0.35); }
  .banc-tint-grey { background: rgba(200, 200, 200, 0.25); }
  .banc-perfil-section { margin-top: 16px; }
  .banc-composite-block { margin-top: 16px; }
  .banc-plot { min-width: 180px; }
  .banc-plot-track {
    position: relative;
    height: 14px;
    margin: 4px 0;
    border: 1px solid #d8cdc2;
    background: linear-gradient(to right, #faf7f4 0%, #faf7f4 100%);
  }
  .banc-plot-dot {
    position: absolute;
    top: 2px;
    width: 10px;
    height: 10px;
    margin-left: -5px;
    border-radius: 50%;
    background: #1a1a1a;
  }
  .banc-plot-scale {
    display: flex;
    justify-content: space-between;
    font-size: 0.62rem;
    color: #6b6b6b;
  }
  .banc-plot-tick.average { font-weight: 700; color: #1a1a1a; }
  .footer { margin-top: 32px; font-size: 0.8125rem; color: #6b6b6b; }
  @media print {
    body { margin: 14mm; }
    .method-block { page-break-inside: avoid; }
  }
`

export function buildEvaluationResultsPrintHtml(context: EvaluationExportContext): string {
  const methodIds = context.methodIds ?? resolveEvaluationExportMethodIds(context.selections)
  if (methodIds.length === 0) {
    throw new Error('Não existem resultados de avaliação para exportar.')
  }

  const generatedAt = new Date().toLocaleString('pt-PT')
  const birthDate = context.patientBirthDate?.trim().slice(0, 10) ?? ''
  const sections = methodIds
    .map((methodId) => buildMethodSection(methodId, context.selections))
    .filter(Boolean)
    .join('')

  return `<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8" />
    <title>Resultados de avaliação — ${escapeHtml(context.patientName)}</title>
    <style>${PRINT_STYLES}</style>
  </head>
  <body>
    <h1>${escapeHtml(context.patientName)}</h1>
    <p class="header-meta">
      ${birthDate ? `<strong>Data de nascimento:</strong> ${formatIsoDate(birthDate)}<br />` : ''}
      <strong>Documento gerado:</strong> ${escapeHtml(generatedAt)}
    </p>
    ${sections}
    <p class="footer">Daniela Santos Psicologia — resultados de avaliação</p>
  </body>
</html>`
}
