import { WISC_EVALUATION_OPTIONS } from './patientEvaluations'
import wiscGaiNorms from './wiscGaiNorms.json'
import wiscIiiNorms from './wiscIiiNorms.json'

export type WiscPadronizadoColumnKey = 'verbal' | 'performance' | 'cv' | 'op' | 'vp'

export type WiscPadronizadoColumns = Record<WiscPadronizadoColumnKey, string>

export type WiscSubtestResult = {
  brutos: string
  padronizado: WiscPadronizadoColumns
}

export type WiscScaleSummaryRow = {
  resultado: string
  qi: string
  percentil: string
  intervaloConfianca90: string
  intervaloConfianca95: string
}

export type WiscGaiSummary = {
  resultado: string
  gai: string
  percentil: string
  intervaloConfianca90: string
  intervaloConfianca95: string
}

export type WiscResults = {
  ageYears: string
  ageMonths: string
  subtests: Record<string, WiscSubtestResult>
  somaPadronizados: WiscPadronizadoColumns
  scaleSummary: Record<string, WiscScaleSummaryRow>
  gaiSummary: WiscGaiSummary
}

export type WiscQiLookup = {
  qi: string
  percentil: string
  ic90: string
  ic95: string
}

export type WiscGaiLookup = {
  gai: string
  percentil: string
  ic90: string
  ic95: string
}

type AgeBand = {
  years: number
  monthsFrom: number
  monthsTo: number
  subtests: Record<string, number[][]>
}

const NORMS = wiscIiiNorms as {
  ageBands: AgeBand[]
  qiTables: Record<string, Record<string, WiscQiLookup>>
}

const GAI_NORMS = wiscGaiNorms as { gaiTable: Record<string, WiscGaiLookup> }

export const WISC_PADRONIZADO_COLUMNS = [
  { key: 'verbal' as const, label: 'Verb.' },
  { key: 'performance' as const, label: 'Real.' },
  { key: 'cv' as const, label: 'CV' },
  { key: 'op' as const, label: 'OP' },
  { key: 'vp' as const, label: 'VP' },
]

/** Canonical cells where a scaled score is shown (no substitutions). */
export const WISC_SUBTEST_PADRONIZADO_EDITABLE: Record<string, WiscPadronizadoColumnKey[]> = {
  complemento_de_gravuras: ['performance', 'op'],
  informacao: ['verbal', 'cv'],
  codigo: ['performance', 'vp'],
  semelhancas: ['verbal', 'cv'],
  disposicao_de_gravuras: ['performance', 'op'],
  aritmetica: ['verbal'],
  cubos: ['performance', 'op'],
  vocabularios: ['verbal', 'cv'],
  composicao_de_objectos: ['performance', 'op'],
  compreensao: ['verbal', 'cv'],
  pesquisa_de_simbolos: ['performance', 'vp'],
  memoria_de_digitos: ['verbal'],
  labirintos: ['performance'],
}

const OPTIONAL_SUBTEST_KEYS = new Set([
  'pesquisa_de_simbolos',
  'memoria_de_digitos',
  'labirintos',
])

/** Core subtests included in each column sum (standard administration, no substitutions). */
export const WISC_CORE_SUM_KEYS: Record<WiscPadronizadoColumnKey, string[]> = {
  verbal: ['informacao', 'semelhancas', 'aritmetica', 'vocabularios', 'compreensao'],
  performance: [
    'complemento_de_gravuras',
    'codigo',
    'disposicao_de_gravuras',
    'cubos',
    'composicao_de_objectos',
  ],
  cv: ['informacao', 'semelhancas', 'vocabularios', 'compreensao'],
  op: ['complemento_de_gravuras', 'disposicao_de_gravuras', 'cubos', 'composicao_de_objectos'],
  vp: ['codigo', 'pesquisa_de_simbolos'],
}

export const WISC_SUBTEST_RESULT_ROWS = WISC_EVALUATION_OPTIONS.map((option) => ({
  key: option.key,
  label: option.label,
  optional: OPTIONAL_SUBTEST_KEYS.has(option.key),
}))

export const WISC_SCALE_SUMMARY_ROWS = [
  { key: 'verbal', label: 'Verbal', somaKey: 'verbal' as const, qiTable: 'verbal' },
  { key: 'performance', label: 'Realização', somaKey: 'performance' as const, qiTable: 'performance' },
  { key: 'full_scale', label: 'Escala Completa', somaKey: null, qiTable: 'full_scale' },
  { key: 'cv', label: 'CV', somaKey: 'cv' as const, qiTable: 'cv' },
  { key: 'op', label: 'OP', somaKey: 'op' as const, qiTable: 'op' },
  { key: 'vp', label: 'VP', somaKey: 'vp' as const, qiTable: 'vp' },
] as const

export function emptyWiscPadronizadoColumns(): WiscPadronizadoColumns {
  return { verbal: '', performance: '', cv: '', op: '', vp: '' }
}

export function emptyWiscSubtestResult(): WiscSubtestResult {
  return { brutos: '', padronizado: emptyWiscPadronizadoColumns() }
}

export function emptyWiscScaleSummaryRow(): WiscScaleSummaryRow {
  return { resultado: '', qi: '', percentil: '', intervaloConfianca90: '', intervaloConfianca95: '' }
}

export function emptyWiscGaiSummary(): WiscGaiSummary {
  return { resultado: '', gai: '', percentil: '', intervaloConfianca90: '', intervaloConfianca95: '' }
}

export function emptyWiscResults(): WiscResults {
  return {
    ageYears: '',
    ageMonths: '',
    subtests: {},
    somaPadronizados: emptyWiscPadronizadoColumns(),
    scaleSummary: {},
    gaiSummary: emptyWiscGaiSummary(),
  }
}

export function isWiscPadronizadoEditable(
  subtestKey: string,
  column: WiscPadronizadoColumnKey,
): boolean {
  return WISC_SUBTEST_PADRONIZADO_EDITABLE[subtestKey]?.includes(column) ?? false
}

export function parseWiscNumericCell(value: string): number | null {
  const trimmed = value.trim().replace(',', '.')
  if (!trimmed) return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

function formatWiscNumericTotal(total: number): string {
  if (!Number.isFinite(total)) return ''
  return Number.isInteger(total) ? String(total) : String(Math.round(total * 100) / 100)
}

export function parseWiscAge(results: WiscResults): { years: number; months: number } | null {
  const years = parseWiscNumericCell(results.ageYears ?? '')
  const months = parseWiscNumericCell(results.ageMonths ?? '')
  if (years === null || months === null) return null
  if (!Number.isInteger(years) || !Number.isInteger(months)) return null
  if (years < 0 || months < 0 || months > 11) return null
  return { years, months }
}

export function findWiscAgeBand(years: number, months: number): AgeBand | null {
  return (
    NORMS.ageBands.find(
      (band) => band.years === years && months >= band.monthsFrom && months <= band.monthsTo,
    ) ?? null
  )
}

export function getWiscAutoScoreBlockReason(results: WiscResults): string | null {
  const age = parseWiscAge(results)
  if (!age) {
    return 'Indique a idade de avaliação em anos e meses (0 a 11 meses) para converter os resultados brutos.'
  }
  if (age.years < 6 || age.years > 16 || (age.years === 16 && age.months > 11)) {
    return 'O WISC-III tem normas dos 6;0 aos 16;11. Fora desta idade a conversão automática não é possível — pode preencher os resultados padronizados manualmente.'
  }
  if (!findWiscAgeBand(age.years, age.months)) {
    return 'Não há tabela de conversão disponível para esta idade neste sistema (faltam as normas de 8;6 a 9;5 no manual digitalizado). Pode preencher os resultados padronizados manualmente.'
  }
  return null
}

export function canAutoConvertWiscRawScores(results: WiscResults): boolean {
  return getWiscAutoScoreBlockReason(results) === null
}

export function lookupWiscScaledScore(
  years: number,
  months: number,
  subtestKey: string,
  rawScore: number,
): number | null {
  const band = findWiscAgeBand(years, months)
  const ranges = band?.subtests[subtestKey]
  if (!ranges) return null
  for (const entry of ranges) {
    const [min, max, scaled] = entry
    if (rawScore >= min && rawScore <= max) return scaled
  }
  return null
}

function scaledCellForSubtest(
  subtests: Record<string, WiscSubtestResult>,
  subtestKey: string,
): number | null {
  const row = subtests[subtestKey]
  if (!row) return null
  for (const column of WISC_PADRONIZADO_COLUMNS) {
    if (!isWiscPadronizadoEditable(subtestKey, column.key)) continue
    const value = parseWiscNumericCell(row.padronizado[column.key])
    if (value !== null) return value
  }
  return null
}

export function getWiscPadronizadoMediaDesignation(scaled: number | null): string {
  if (scaled === null) return ''
  if (scaled < 8) return 'Inferior à média'
  if (scaled === 8) return 'Média inferior'
  if (scaled >= 9 && scaled <= 11) return 'Média'
  if (scaled === 12) return 'Média superior'
  if (scaled > 12) return 'Acima da média'
  return ''
}

export function getWiscSubtestPadronizadoMediaDesignation(
  subtests: Record<string, WiscSubtestResult>,
  subtestKey: string,
): string {
  return getWiscPadronizadoMediaDesignation(scaledCellForSubtest(subtests, subtestKey))
}

export function getWiscQiClassificacao(qi: string): string {
  const trimmed = qi.trim()
  if (!trimmed) return ''

  if (trimmed.startsWith('>')) {
    const bound = parseWiscNumericCell(trimmed.slice(1))
    if (bound === null) return ''
    return bound >= 130 ? 'Muito Superior' : getWiscQiClassificacao(String(bound))
  }

  if (trimmed.startsWith('<')) {
    return 'Muito Inferior'
  }

  const value = parseWiscNumericCell(trimmed)
  if (value === null) return ''
  if (value >= 130) return 'Muito Superior'
  if (value >= 120) return 'Superior'
  if (value >= 110) return 'Médio Superior'
  if (value >= 90) return 'Médio'
  if (value >= 80) return 'Médio Inferior'
  if (value >= 70) return 'Inferior'
  return 'Muito Inferior'
}

export const WISC_SCAD_SUBTEST_KEYS = [
  'informacao',
  'aritmetica',
  'codigo',
  'memoria_de_digitos',
] as const

export const WISC_ACID_SUBTEST_KEYS = [
  'pesquisa_de_simbolos',
  'codigo',
  'aritmetica',
  'memoria_de_digitos',
] as const

export type WiscScadAcidDesignation = 'Não há perfil' | 'Parcial' | 'Total'

export function getWiscScaledScoreForSubtest(
  subtests: Record<string, WiscSubtestResult>,
  subtestKey: string,
): number | null {
  return scaledCellForSubtest(subtests, subtestKey)
}

export function getWiscSubtestPadronizadoDisplay(
  subtests: Record<string, WiscSubtestResult>,
  subtestKey: string,
): string {
  const row = subtests[subtestKey]
  if (!row) return ''
  for (const column of WISC_PADRONIZADO_COLUMNS) {
    if (!isWiscPadronizadoEditable(subtestKey, column.key)) continue
    const cell = row.padronizado[column.key].trim()
    if (cell) return cell
  }
  return ''
}

export function countWiscSubtestsAtOrBelowScaled(
  subtests: Record<string, WiscSubtestResult>,
  subtestKeys: readonly string[],
  threshold = 8,
): number {
  let count = 0
  for (const key of subtestKeys) {
    const scaled = scaledCellForSubtest(subtests, key)
    if (scaled !== null && scaled <= threshold) count++
  }
  return count
}

export function getWiscScadAcidDesignation(
  subtests: Record<string, WiscSubtestResult>,
  subtestKeys: readonly string[],
): WiscScadAcidDesignation | '' {
  const hasAny = subtestKeys.some((key) => scaledCellForSubtest(subtests, key) !== null)
  if (!hasAny) return ''

  const lowCount = countWiscSubtestsAtOrBelowScaled(subtests, subtestKeys)
  if (lowCount <= 1) return 'Não há perfil'
  if (lowCount === 2) return 'Parcial'
  return 'Total'
}

export function applyWiscRawScoreConversion(
  results: WiscResults,
): Record<string, WiscSubtestResult> {
  const age = parseWiscAge(results)
  if (!age || !findWiscAgeBand(age.years, age.months)) {
    return stripNonEditableWiscPadronizado(results.subtests)
  }

  const next: Record<string, WiscSubtestResult> = {}
  for (const row of WISC_SUBTEST_RESULT_ROWS) {
    const current = results.subtests[row.key] ?? emptyWiscSubtestResult()
    const raw = parseWiscNumericCell(current.brutos)
    const padronizado = emptyWiscPadronizadoColumns()
    if (raw !== null) {
      const scaled = lookupWiscScaledScore(age.years, age.months, row.key, raw)
      if (scaled !== null) {
        for (const column of WISC_PADRONIZADO_COLUMNS) {
          if (isWiscPadronizadoEditable(row.key, column.key)) {
            padronizado[column.key] = String(scaled)
          }
        }
      }
    }
    next[row.key] = { brutos: current.brutos ?? '', padronizado }
  }
  return next
}

export function computeWiscSomaPadronizados(
  subtests: Record<string, WiscSubtestResult>,
): WiscPadronizadoColumns {
  const totals = emptyWiscPadronizadoColumns()

  for (const column of WISC_PADRONIZADO_COLUMNS) {
    const keys = WISC_CORE_SUM_KEYS[column.key]
    const values: number[] = []
    for (const key of keys) {
      const value = scaledCellForSubtest(subtests, key)
      if (value === null) {
        totals[column.key] = ''
        break
      }
      values.push(value)
    }
    if (values.length === keys.length) {
      totals[column.key] = formatWiscNumericTotal(values.reduce((a, b) => a + b, 0))
    }
  }

  return totals
}

export function computeSomatorioEscalaCompleta(soma: WiscPadronizadoColumns): string {
  const verbal = parseWiscNumericCell(soma.verbal)
  const performance = parseWiscNumericCell(soma.performance)
  if (verbal === null || performance === null) return ''
  return formatWiscNumericTotal(verbal + performance)
}

export function computeWiscScaleResultados(soma: WiscPadronizadoColumns): Record<string, string> {
  return {
    verbal: soma.verbal,
    performance: soma.performance,
    full_scale: computeSomatorioEscalaCompleta(soma),
    cv: soma.cv,
    op: soma.op,
    vp: soma.vp,
  }
}

export function lookupWiscQi(tableId: string, soma: string): WiscQiLookup | null {
  const total = parseWiscNumericCell(soma)
  if (total === null) return null
  const key = String(Math.round(total))
  return NORMS.qiTables[tableId]?.[key] ?? null
}

export function computeGaiResultado(soma: WiscPadronizadoColumns): string {
  const cv = parseWiscNumericCell(soma.cv)
  const op = parseWiscNumericCell(soma.op)
  if (cv === null || op === null) return ''
  return formatWiscNumericTotal(cv + op)
}

export function lookupWiscGai(soma: string): WiscGaiLookup | null {
  const total = parseWiscNumericCell(soma)
  if (total === null) return null
  const key = String(Math.round(total))
  return GAI_NORMS.gaiTable[key] ?? null
}

export function deriveWiscGaiSummary(
  somaPadronizados: WiscPadronizadoColumns,
  current: WiscGaiSummary = emptyWiscGaiSummary(),
): WiscGaiSummary {
  const resultado = computeGaiResultado(somaPadronizados)
  if (!resultado) {
    return {
      resultado: '',
      gai: current.gai ?? '',
      percentil: current.percentil ?? '',
      intervaloConfianca90: current.intervaloConfianca90 ?? '',
      intervaloConfianca95: current.intervaloConfianca95 ?? '',
    }
  }

  const lookedUp = lookupWiscGai(resultado)
  if (lookedUp) {
    return {
      resultado,
      gai: lookedUp.gai,
      percentil: lookedUp.percentil,
      intervaloConfianca90: lookedUp.ic90,
      intervaloConfianca95: lookedUp.ic95,
    }
  }

  return {
    resultado,
    gai: current.gai ?? '',
    percentil: current.percentil ?? '',
    intervaloConfianca90: current.intervaloConfianca90 ?? '',
    intervaloConfianca95: current.intervaloConfianca95 ?? '',
  }
}

export function canAutoFillWiscGai(soma: WiscPadronizadoColumns): boolean {
  const resultado = computeGaiResultado(soma)
  return resultado !== '' && lookupWiscGai(resultado) !== null
}

export function stripNonEditableWiscPadronizado(
  subtests: Record<string, WiscSubtestResult>,
): Record<string, WiscSubtestResult> {
  const next: Record<string, WiscSubtestResult> = {}

  for (const row of WISC_SUBTEST_RESULT_ROWS) {
    const current = subtests[row.key]
    if (!current) continue

    const padronizado = emptyWiscPadronizadoColumns()
    for (const column of WISC_PADRONIZADO_COLUMNS) {
      if (isWiscPadronizadoEditable(row.key, column.key)) {
        padronizado[column.key] = current.padronizado[column.key] ?? ''
      }
    }

    next[row.key] = {
      brutos: current.brutos ?? '',
      padronizado,
    }
  }

  return next
}

export function deriveWiscResults(results: WiscResults): WiscResults {
  const autoConvert = canAutoConvertWiscRawScores(results)
  const subtests = autoConvert
    ? applyWiscRawScoreConversion(results)
    : stripNonEditableWiscPadronizado(results.subtests)
  const somaPadronizados = computeWiscSomaPadronizados(subtests)
  const scaleResultados = computeWiscScaleResultados(somaPadronizados)
  const scaleSummary: Record<string, WiscScaleSummaryRow> = {}

  for (const row of WISC_SCALE_SUMMARY_ROWS) {
    const current = results.scaleSummary[row.key] ?? emptyWiscScaleSummaryRow()
    const resultado = scaleResultados[row.key] ?? ''
    const lookedUp = autoConvert ? lookupWiscQi(row.qiTable, resultado) : null
    scaleSummary[row.key] = {
      resultado,
      qi: lookedUp?.qi ?? (autoConvert ? '' : current.qi ?? ''),
      percentil: lookedUp?.percentil ?? (autoConvert ? '' : current.percentil ?? ''),
      intervaloConfianca90: lookedUp?.ic90 ?? (autoConvert ? '' : current.intervaloConfianca90 ?? ''),
      intervaloConfianca95: lookedUp?.ic95 ?? (autoConvert ? '' : current.intervaloConfianca95 ?? ''),
    }
  }

  return {
    ageYears: results.ageYears ?? '',
    ageMonths: results.ageMonths ?? '',
    subtests,
    somaPadronizados,
    scaleSummary,
    gaiSummary: deriveWiscGaiSummary(somaPadronizados, results.gaiSummary ?? emptyWiscGaiSummary()),
  }
}

export function hasWiscResultsData(results: WiscResults): boolean {
  const derived = deriveWiscResults(results)
  if (derived.ageYears.trim() !== '' || derived.ageMonths.trim() !== '') return true
  const hasSubtests = Object.entries(derived.subtests).some(
    ([key, row]) =>
      row.brutos !== '' ||
      WISC_PADRONIZADO_COLUMNS.some(
        (column) => isWiscPadronizadoEditable(key, column.key) && row.padronizado[column.key] !== '',
      ),
  )
  const hasManualScale = Object.values(derived.scaleSummary).some(
    (row) =>
      row.qi !== '' ||
      row.percentil !== '' ||
      row.intervaloConfianca90 !== '' ||
      row.intervaloConfianca95 !== '',
  )
  const hasGai =
    derived.gaiSummary.gai !== '' ||
    derived.gaiSummary.percentil !== '' ||
    derived.gaiSummary.intervaloConfianca90 !== '' ||
    derived.gaiSummary.intervaloConfianca95 !== ''
  return hasSubtests || hasManualScale || hasGai
}
