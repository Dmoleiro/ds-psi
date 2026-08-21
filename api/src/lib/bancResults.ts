import bancAnexoANorms from './bancAnexoANorms.json' with { type: 'json' }
import bancIndexNorms from './bancIndexNorms.json' with { type: 'json' }
import bancRegressionNorms from './bancRegressionNorms.json' with { type: 'json' }

export type BancSectionKey = 'memoria' | 'linguagem' | 'atencao' | 'orientacao_motricidade'

export type BancMeasureRow = {
  key: string
  label: string
  parentLabel?: string
  italic?: boolean
  section: BancSectionKey
  tint: 'blue' | 'orange' | 'purple' | 'green' | 'yellow' | 'grey'
  regressionKey?: string
  manualRpOnly?: boolean
}

export type BancMeasureResult = {
  rb: string
  rp: string
}

export type BancCompositeCell = {
  measureKey: string
  rp: string
}

export type BancGlobalIndexRow = {
  grupoNormativo: string
  somatorio: string
  indice: string
  percentil: string
}

export type BancResults = {
  ageYears: string
  ageMonths: string
  normGroup: string
  measures: Record<string, BancMeasureResult>
  globalIndices: {
    memoria: BancGlobalIndexRow
    linguagem: BancGlobalIndexRow
    atencao: BancGlobalIndexRow
  }
  compositeMemoria: Record<string, BancCompositeCell>
  compositeLinguagem: Record<string, BancCompositeCell>
  compositeAtencao: Record<string, BancCompositeCell>
}

type RegressionMeasure = {
  intercept: number
  slope: number
  sd: number
  inverted: boolean
}

const REGRESSION = bancRegressionNorms as { measures: Record<string, RegressionMeasure> }

type AnexoAAgeBand = { years: number; measures: Record<string, number[][] | undefined> }

function asAnexoANorms(value: unknown): { ageBands: AnexoAAgeBand[] } {
  return value as { ageBands: AnexoAAgeBand[] }
}

const ANEXO_A = asAnexoANorms(bancAnexoANorms)

const INDEX_TABLES = bancIndexNorms as unknown as Record<
  string,
  Record<string, Array<[number, number, number, string]>>
>

export const BANC_MEASURE_ROWS: BancMeasureRow[] = [
  { key: 'reconhecimento_imediato', label: 'Reconhecimento Imediato', parentLabel: '2. Reconhecimento de Faces', section: 'memoria', tint: 'blue', regressionKey: 'reconhecimento_imediato' },
  { key: 'reconhecimento_diferido', label: 'Reconhecimento Diferido', parentLabel: '2. Reconhecimento de Faces', section: 'memoria', tint: 'blue', italic: true, regressionKey: 'reconhecimento_diferido' },
  { key: 'memoria_historias_ei', label: 'Evocação Imediata', parentLabel: '6. Memória de Histórias (A+B ou C+D)', section: 'memoria', tint: 'orange', regressionKey: 'memoria_historias_ei' },
  { key: 'memoria_historias_ed', label: 'Evocação Diferida', parentLabel: '6. Memória de Histórias (A+B ou C+D)', section: 'memoria', tint: 'orange', italic: true, regressionKey: 'memoria_historias_ed' },
  { key: 'memoria_historias_rd', label: 'Reconhecimento Diferido', parentLabel: '6. Memória de Histórias (A+B ou C+D)', section: 'memoria', tint: 'orange', regressionKey: 'memoria_historias_rd' },
  { key: 'fc_rey_copia', label: 'Cópia', parentLabel: '9. Figura Complexa de Rey', section: 'memoria', tint: 'orange', regressionKey: 'fc_rey_copia' },
  { key: 'fc_rey_edic', label: 'Evocação Diferida – intervalo curto', parentLabel: '9. Figura Complexa de Rey', section: 'memoria', tint: 'orange', regressionKey: 'fc_rey_edic' },
  { key: 'fc_rey_edil', label: 'Evocação Diferida – intervalo longo', parentLabel: '9. Figura Complexa de Rey', section: 'memoria', tint: 'blue', italic: true, regressionKey: 'fc_rey_edil' },
  { key: 'lista_palavras_ei', label: 'Evocação Imediata – 1.º ensaio', parentLabel: '12. Lista de Palavras', section: 'memoria', tint: 'orange', regressionKey: 'lista_palavras_ei' },
  { key: 'lista_palavras_ta', label: 'Total de Aprendizagem', parentLabel: '12. Lista de Palavras', section: 'memoria', tint: 'orange', regressionKey: 'lista_palavras_ta' },
  { key: 'lista_palavras_interferencia', label: 'Total de Interferência', parentLabel: '12. Lista de Palavras', section: 'memoria', tint: 'orange', regressionKey: 'lista_palavras_interferencia' },
  { key: 'lista_palavras_edic', label: 'Evocação Diferida – intervalo curto', parentLabel: '12. Lista de Palavras', section: 'memoria', tint: 'orange', regressionKey: 'lista_palavras_edic' },
  { key: 'lista_palavras_edil', label: 'Evocação Diferida – intervalo longo', parentLabel: '12. Lista de Palavras', section: 'memoria', tint: 'blue', italic: true, regressionKey: 'lista_palavras_edil' },
  { key: 'lista_palavras_rd', label: 'Reconhecimento Diferido', parentLabel: '12. Lista de Palavras', section: 'memoria', tint: 'orange', regressionKey: 'lista_palavras_rd' },
  { key: 'tabuleiro_corsi', label: '14. Tabuleiro de Corsi', section: 'memoria', tint: 'blue', regressionKey: 'tabuleiro_corsi' },
  { key: 'nomeacao_rapida_cores', label: 'Cores', parentLabel: '4. Nomeação Rápida', section: 'linguagem', tint: 'purple', manualRpOnly: true },
  { key: 'nomeacao_rapida_fc', label: 'Formas e Cores', parentLabel: '4. Nomeação Rápida', section: 'linguagem', tint: 'purple', italic: true, regressionKey: 'nomeacao_rapida_fc' },
  { key: 'nomeacao_rapida_digitos', label: 'Dígitos', parentLabel: '4. Nomeação Rápida', section: 'linguagem', tint: 'purple', regressionKey: 'nomeacao_rapida_digitos' },
  { key: 'compreensao_instrucoes', label: '10. Compreensão de Instruções', section: 'linguagem', tint: 'purple', regressionKey: 'compreensao_instrucoes' },
  { key: 'cf_eliminacao', label: 'Eliminação', parentLabel: '11. Consciência Fonológica', section: 'linguagem', tint: 'purple', regressionKey: 'cf_eliminacao' },
  { key: 'cf_substituicao', label: 'Substituição (Lista 1 ou Lista 2)', parentLabel: '11. Consciência Fonológica', section: 'linguagem', tint: 'purple', italic: true, regressionKey: 'cf_substituicao' },
  { key: 'fluencia_fonemica', label: 'Fonémica', parentLabel: '5. Fluência Verbal', section: 'atencao', tint: 'green', italic: true, regressionKey: 'fluencia_fonemica' },
  { key: 'fluencia_semantica', label: 'Semântica', parentLabel: '5. Fluência Verbal', section: 'atencao', tint: 'green', italic: true, regressionKey: 'fluencia_semantica' },
  { key: 'torre_ensaios', label: 'Ensaios realizados', parentLabel: '7. Torre', section: 'atencao', tint: 'yellow', regressionKey: 'torre_ensaios' },
  { key: 'torre_problemas_sucesso', label: 'Problemas realizados com sucesso', parentLabel: '7. Torre', section: 'atencao', tint: 'orange', regressionKey: 'torre_problemas_sucesso' },
  { key: 'torre_problemas_1_ensaio', label: 'Problemas realizados com sucesso ao 1.º ensaio', parentLabel: '7. Torre', section: 'atencao', tint: 'orange', regressionKey: 'torre_problemas_1_ensaio' },
  { key: 'cancelamento_sinais', label: '8. Cancelamento de Sinais (2 ou 3)', section: 'atencao', tint: 'orange', regressionKey: 'cancelamento_sinais' },
  { key: 'trilhas_a', label: 'Parte A', parentLabel: '13. Trilhas', section: 'atencao', tint: 'yellow', italic: true, regressionKey: 'trilhas_a' },
  { key: 'trilhas_b', label: 'Parte B', parentLabel: '13. Trilhas', section: 'atencao', tint: 'yellow', italic: true, regressionKey: 'trilhas_b' },
  { key: 'teste_orientacao', label: '1. Teste de Orientação', section: 'orientacao_motricidade', tint: 'orange', manualRpOnly: true },
  { key: 'motricidade_mao_dominante', label: 'Mão Dominante', parentLabel: '15. Tabuleiro de Motricidade', section: 'orientacao_motricidade', tint: 'orange', regressionKey: 'motricidade_mao_dominante' },
  { key: 'motricidade_mao_nao_dominante', label: 'Mão Não Dominante', parentLabel: '15. Tabuleiro de Motricidade', section: 'orientacao_motricidade', tint: 'orange', regressionKey: 'motricidade_mao_nao_dominante' },
  { key: 'motricidade_ambas_maos', label: 'Ambas as Mãos', parentLabel: '15. Tabuleiro de Motricidade', section: 'orientacao_motricidade', tint: 'orange', regressionKey: 'motricidade_ambas_maos' },
]

export const BANC_SECTION_META: Record<
  BancSectionKey,
  { label: string; plotClass: string; headerClass: string }
> = {
  memoria: { label: 'Memória', plotClass: 'bancPlotMemoria', headerClass: 'bancHeaderMemoria' },
  linguagem: { label: 'Linguagem', plotClass: 'bancPlotLinguagem', headerClass: 'bancHeaderLinguagem' },
  atencao: { label: 'Atenção / Funções Executivas', plotClass: 'bancPlotAtencao', headerClass: 'bancHeaderAtencao' },
  orientacao_motricidade: {
    label: 'Orientação e Motricidade',
    plotClass: 'bancPlotOrientacao',
    headerClass: 'bancHeaderOrientacao',
  },
}

const MEASURE_KEYS = BANC_MEASURE_ROWS.map((row) => row.key)

function emptyMeasureResult(): BancMeasureResult {
  return { rb: '', rp: '' }
}

function emptyGlobalIndexRow(): BancGlobalIndexRow {
  return { grupoNormativo: '', somatorio: '', indice: '', percentil: '' }
}

export function emptyBancResults(): BancResults {
  const measures: Record<string, BancMeasureResult> = {}
  for (const key of MEASURE_KEYS) {
    measures[key] = emptyMeasureResult()
  }
  return {
    ageYears: '',
    ageMonths: '',
    normGroup: '',
    measures,
    globalIndices: {
      memoria: emptyGlobalIndexRow(),
      linguagem: emptyGlobalIndexRow(),
      atencao: emptyGlobalIndexRow(),
    },
    compositeMemoria: {},
    compositeLinguagem: {},
    compositeAtencao: {},
  }
}

export function getBancAgeInYears(ageYears: string, ageMonths: string): number | null {
  const years = Number.parseInt(ageYears, 10)
  if (!Number.isFinite(years) || years < 5 || years > 17) return null
  const months = Number.parseInt(ageMonths || '0', 10)
  if (!Number.isFinite(months) || months < 0 || months > 11) return years
  return years + months / 12
}

export function getBancNormGroupLabel(ageYears: string, ageMonths: string): string {
  const years = Number.parseInt(ageYears, 10)
  if (!Number.isFinite(years)) return ''
  if (years >= 16) return `${years} anos (estimativa por regressão)`
  if (years >= 10) return '10 – 15 anos'
  if (years >= 7) return '7 – 9 anos'
  if (years === 6) return '6 anos'
  if (years === 5) return '5 anos'
  return ''
}

function parseNumeric(value: string): number | null {
  const trimmed = value.trim().replace(',', '.')
  if (!trimmed) return null
  const parsed = Number.parseFloat(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

function clampRp(value: number): number {
  return Math.max(1, Math.min(19, Math.round(value)))
}

export function computeBancRpFromRegression(
  regressionKey: string,
  rb: number,
  ageYears: number,
): number | null {
  const spec = REGRESSION.measures[regressionKey]
  if (!spec || spec.sd === 0) return null
  const expected = spec.intercept + ageYears * spec.slope
  let z = (rb - expected) / spec.sd
  if (spec.inverted) z = -z
  return clampRp(z * 3 + 10)
}

export function canAutoConvertBancRb(ageYears: string, ageMonths: string): boolean {
  return getBancAgeInYears(ageYears, ageMonths) !== null
}

export function getBancAutoScoreBlockReason(ageYears: string, ageMonths: string): string {
  if (!ageYears.trim()) return 'Indique a idade cronológica para calcular os RP.'
  const years = Number.parseInt(ageYears, 10)
  if (!Number.isFinite(years) || years < 5 || years > 17) {
    return 'A conversão automática está disponível entre os 5 e os 17 anos.'
  }
  return ''
}

export function parseBancAgeYears(ageYears: string): number | null {
  const years = Number.parseInt(ageYears, 10)
  return Number.isFinite(years) ? years : null
}

export function isBancPerfilMeasureInactive(measureKey: string, ageYears: number | null): boolean {
  if (ageYears === null) return false
  if (measureKey === 'nomeacao_rapida_cores') return ageYears < 5 || ageYears > 6
  return false
}

export function getBancPerfilMeasureHint(measureKey: string, ageYears: number | null): string | null {
  if (isBancPerfilMeasureInactive(measureKey, ageYears)) {
    return 'Não administrado nesta idade (apenas 5–6 anos).'
  }
  if (measureKey === 'teste_orientacao' && ageYears !== null && ageYears >= 16) {
    return 'Sem conversão automática — preencher RP manualmente.'
  }
  return null
}

function getMemoryIndexBand(ageYears: number): '5-9' | '10-15' {
  return ageYears <= 9 ? '5-9' : '10-15'
}

function getLanguageIndexBand(ageYears: number): string {
  if (ageYears >= 10) return '10-15'
  if (ageYears === 6) return '6'
  if (ageYears === 5) return '5'
  return '7-9'
}

function getAttentionIndexBand(ageYears: number): string {
  if (ageYears >= 10) return '10-15'
  if (ageYears >= 7) return '7-9'
  if (ageYears === 6) return '6'
  if (ageYears === 5) return '5'
  return '7-9'
}

export function lookupBancRpFromTable(
  tableAgeYears: number,
  measureKey: string,
  rb: number,
): number | null {
  const band = ANEXO_A.ageBands.find((entry) => entry.years === tableAgeYears)
  const ranges = band?.measures[measureKey]
  if (!ranges?.length) return null
  for (const range of ranges) {
    const min = range[0]
    const max = range[1]
    const rp = range[2]
    if (min === undefined || max === undefined || rp === undefined) continue
    if (rb >= min && rb <= max) return rp
  }
  return null
}

function lookupIndexFromTable(
  domain: 'memoria' | 'linguagem' | 'atencao',
  band: string,
  sum: number,
): { indice: string; percentil: string } | null {
  const rows = INDEX_TABLES[domain]?.[band]
  if (!rows) return null
  for (const [min, max, index, percentile] of rows) {
    if (sum >= min && sum <= max) {
      return { indice: String(index), percentil: percentile }
    }
  }
  return null
}

function estimateIndexFromSum(sum: number, componentCount: number): { indice: string; percentil: string } {
  const mean = 10 * componentCount
  const sd = 3 * Math.sqrt(componentCount)
  const index = Math.round(100 + (15 * (sum - mean)) / sd)
  const z = (index - 100) / 15
  let percentile = '50'
  if (z <= -2) percentile = '< 1'
  else if (z <= -1) percentile = '1-16'
  else if (z <= 0) percentile = '17-50'
  else if (z <= 1) percentile = '51-84'
  else if (z <= 2) percentile = '85-98'
  else percentile = '> 99'
  return { indice: String(index), percentil: percentile }
}

function lookupGlobalIndex(
  domain: 'memoria' | 'linguagem' | 'atencao',
  ageYears: number,
  sum: number,
  componentCount: number,
): { indice: string; percentil: string } {
  const band =
    domain === 'memoria'
      ? getMemoryIndexBand(ageYears)
      : domain === 'linguagem'
        ? getLanguageIndexBand(ageYears)
        : getAttentionIndexBand(ageYears)

  return lookupIndexFromTable(domain, band, sum) ?? estimateIndexFromSum(sum, componentCount)
}

type CompositeSpec = { key: string; measureKey: string; minAge?: number; maxAge?: number }

const COMPOSITE_MEMORIA: CompositeSpec[] = [
  { key: 'faces_rd', measureKey: 'reconhecimento_diferido' },
  { key: 'historias_ed', measureKey: 'memoria_historias_ed' },
  { key: 'rey_edil', measureKey: 'fc_rey_edil' },
  { key: 'lista_edil', measureKey: 'lista_palavras_edil' },
]

const COMPOSITE_LINGUAGEM: CompositeSpec[] = [
  { key: 'nr_cores', measureKey: 'nomeacao_rapida_cores', maxAge: 9 },
  { key: 'nr_fc', measureKey: 'nomeacao_rapida_fc', maxAge: 6 },
  { key: 'nr_digitos', measureKey: 'nomeacao_rapida_digitos', minAge: 7 },
  { key: 'compreensao', measureKey: 'compreensao_instrucoes' },
  { key: 'cf_eliminacao', measureKey: 'cf_eliminacao' },
  { key: 'cf_substituicao', measureKey: 'cf_substituicao' },
]

const COMPOSITE_ATENCAO: CompositeSpec[] = [
  { key: 'fluencia_fonemica', measureKey: 'fluencia_fonemica', minAge: 7 },
  { key: 'fluencia_semantica', measureKey: 'fluencia_semantica' },
  { key: 'torre_ensaios', measureKey: 'torre_ensaios' },
  { key: 'cancelamento', measureKey: 'cancelamento_sinais' },
  { key: 'trilhas_a', measureKey: 'trilhas_a', minAge: 6 },
  { key: 'trilhas_b', measureKey: 'trilhas_b', minAge: 7 },
]

function isCompositeActive(spec: CompositeSpec, ageYears: number): boolean {
  if (spec.minAge !== undefined && ageYears < spec.minAge) return false
  if (spec.maxAge !== undefined && ageYears > spec.maxAge) return false
  return true
}

function buildCompositeCells(
  specs: CompositeSpec[],
  ageYears: number,
  measures: Record<string, BancMeasureResult>,
): Record<string, BancCompositeCell> {
  const cells: Record<string, BancCompositeCell> = {}
  for (const spec of specs) {
    if (!isCompositeActive(spec, ageYears)) continue
    cells[spec.key] = {
      measureKey: spec.measureKey,
      rp: measures[spec.measureKey]?.rp ?? '',
    }
  }
  return cells
}

function sumCompositeRp(cells: Record<string, BancCompositeCell>): number | null {
  let sum = 0
  let count = 0
  for (const cell of Object.values(cells)) {
    const rp = parseNumeric(cell.rp)
    if (rp === null) continue
    sum += rp
    count += 1
  }
  if (count === 0) return null
  return sum
}

function deriveMeasureRp(
  row: BancMeasureRow,
  rb: string,
  existingRp: string,
  ageDecimal: number | null,
  ageYearsInt: number | null,
): string {
  const rbNum = parseNumeric(rb)
  if (rbNum === null || ageDecimal === null) {
    return row.manualRpOnly ? existingRp : existingRp
  }

  if (ageYearsInt !== null && ageYearsInt >= 5 && ageYearsInt <= 15) {
    const fromTable = lookupBancRpFromTable(ageYearsInt, row.key, rbNum)
    if (fromTable !== null) return String(fromTable)
  }

  if (ageDecimal >= 16 && row.regressionKey) {
    const computed = computeBancRpFromRegression(row.regressionKey, rbNum, ageDecimal)
    if (computed !== null) return String(computed)
  }

  return row.manualRpOnly ? existingRp : existingRp
}

export function deriveBancResults(raw: BancResults): BancResults {
  const ageYearsNum = Number.parseInt(raw.ageYears, 10)
  const ageDecimal = getBancAgeInYears(raw.ageYears, raw.ageMonths)
  const normGroup = Number.isFinite(ageYearsNum)
    ? getBancNormGroupLabel(raw.ageYears, raw.ageMonths)
    : raw.normGroup.trim()

  const measures: Record<string, BancMeasureResult> = {}
  for (const row of BANC_MEASURE_ROWS) {
    const current = raw.measures[row.key] ?? emptyMeasureResult()
    measures[row.key] = {
      rb: current.rb,
      rp: deriveMeasureRp(
        row,
        current.rb,
        current.rp,
        ageDecimal,
        Number.isFinite(ageYearsNum) ? ageYearsNum : null,
      ),
    }
  }

  const compositeMemoria =
    Number.isFinite(ageYearsNum) && ageYearsNum >= 5
      ? buildCompositeCells(COMPOSITE_MEMORIA, ageYearsNum, measures)
      : {}
  const compositeLinguagem =
    Number.isFinite(ageYearsNum) && ageYearsNum >= 5
      ? buildCompositeCells(COMPOSITE_LINGUAGEM, ageYearsNum, measures)
      : {}
  const compositeAtencao =
    Number.isFinite(ageYearsNum) && ageYearsNum >= 5
      ? buildCompositeCells(COMPOSITE_ATENCAO, ageYearsNum, measures)
      : {}

  const memoriaSum = sumCompositeRp(compositeMemoria)
  const linguagemSum = sumCompositeRp(compositeLinguagem)
  const atencaoSum = sumCompositeRp(compositeAtencao)

  const globalIndices = {
    memoria: { ...emptyGlobalIndexRow(), ...raw.globalIndices.memoria },
    linguagem: { ...emptyGlobalIndexRow(), ...raw.globalIndices.linguagem },
    atencao: { ...emptyGlobalIndexRow(), ...raw.globalIndices.atencao },
  }

  if (Number.isFinite(ageYearsNum) && ageYearsNum >= 5) {
    globalIndices.memoria.grupoNormativo = normGroup
    globalIndices.linguagem.grupoNormativo = normGroup
    globalIndices.atencao.grupoNormativo = normGroup

    if (memoriaSum !== null) {
      globalIndices.memoria.somatorio = String(memoriaSum)
      const lookup = lookupGlobalIndex('memoria', ageYearsNum, memoriaSum, Object.keys(compositeMemoria).length)
      globalIndices.memoria.indice = lookup.indice
      globalIndices.memoria.percentil = lookup.percentil
    }
    if (linguagemSum !== null) {
      globalIndices.linguagem.somatorio = String(linguagemSum)
      const lookup = lookupGlobalIndex(
        'linguagem',
        ageYearsNum,
        linguagemSum,
        Object.keys(compositeLinguagem).length,
      )
      globalIndices.linguagem.indice = lookup.indice
      globalIndices.linguagem.percentil = lookup.percentil
    }
    if (atencaoSum !== null) {
      globalIndices.atencao.somatorio = String(atencaoSum)
      const lookup = lookupGlobalIndex('atencao', ageYearsNum, atencaoSum, Object.keys(compositeAtencao).length)
      globalIndices.atencao.indice = lookup.indice
      globalIndices.atencao.percentil = lookup.percentil
    }
  }

  return {
    ageYears: raw.ageYears,
    ageMonths: raw.ageMonths,
    normGroup,
    measures,
    globalIndices,
    compositeMemoria,
    compositeLinguagem,
    compositeAtencao,
  }
}

export function hasBancResultsData(results: BancResults): boolean {
  if (results.ageYears.trim() || results.ageMonths.trim() || results.normGroup.trim()) return true
  for (const measure of Object.values(results.measures)) {
    if (measure.rb.trim() || measure.rp.trim()) return true
  }
  return false
}

export function sanitizeBancResults(value: unknown): BancResults {
  const base = emptyBancResults()
  if (!value || typeof value !== 'object') return base
  const input = value as Partial<BancResults>

  const measures: Record<string, BancMeasureResult> = { ...base.measures }
  if (input.measures && typeof input.measures === 'object') {
    for (const key of MEASURE_KEYS) {
      const entry = (input.measures as Record<string, unknown>)[key]
      if (!entry || typeof entry !== 'object') continue
      const row = entry as Partial<BancMeasureResult>
      measures[key] = {
        rb: typeof row.rb === 'string' ? row.rb.slice(0, 16) : '',
        rp: typeof row.rp === 'string' ? row.rp.slice(0, 8) : '',
      }
    }
  }

  function sanitizeGlobalRow(row: unknown): BancGlobalIndexRow {
    if (!row || typeof row !== 'object') return emptyGlobalIndexRow()
    const r = row as Partial<BancGlobalIndexRow>
    return {
      grupoNormativo: typeof r.grupoNormativo === 'string' ? r.grupoNormativo.slice(0, 64) : '',
      somatorio: typeof r.somatorio === 'string' ? r.somatorio.slice(0, 8) : '',
      indice: typeof r.indice === 'string' ? r.indice.slice(0, 8) : '',
      percentil: typeof r.percentil === 'string' ? r.percentil.slice(0, 16) : '',
    }
  }

  function sanitizeComposite(value: unknown): Record<string, BancCompositeCell> {
    if (!value || typeof value !== 'object') return {}
    const out: Record<string, BancCompositeCell> = {}
    for (const [key, cell] of Object.entries(value as Record<string, unknown>)) {
      if (!cell || typeof cell !== 'object') continue
      const c = cell as Partial<BancCompositeCell>
      out[key.slice(0, 32)] = {
        measureKey: typeof c.measureKey === 'string' ? c.measureKey.slice(0, 64) : '',
        rp: typeof c.rp === 'string' ? c.rp.slice(0, 8) : '',
      }
    }
    return out
  }

  return deriveBancResults({
    ageYears: typeof input.ageYears === 'string' ? input.ageYears.slice(0, 8) : '',
    ageMonths: typeof input.ageMonths === 'string' ? input.ageMonths.slice(0, 8) : '',
    normGroup: typeof input.normGroup === 'string' ? input.normGroup.slice(0, 64) : '',
    measures,
    globalIndices: {
      memoria: sanitizeGlobalRow(input.globalIndices?.memoria),
      linguagem: sanitizeGlobalRow(input.globalIndices?.linguagem),
      atencao: sanitizeGlobalRow(input.globalIndices?.atencao),
    },
    compositeMemoria: sanitizeComposite(input.compositeMemoria),
    compositeLinguagem: sanitizeComposite(input.compositeLinguagem),
    compositeAtencao: sanitizeComposite(input.compositeAtencao),
  })
}

export const BANC_COMPOSITE_LABELS = {
  memoria: [
    { key: 'faces_rd', label: '2. Reconhecimento de Faces / Reconhecimento Diferido' },
    { key: 'historias_ed', label: '6. Memória de Histórias / Evocação Diferida' },
    { key: 'rey_edil', label: '9. Figura Complexa de Rey / Evocação Diferida – intervalo longo' },
    { key: 'lista_edil', label: '12. Lista de Palavras / Evocação Diferida – intervalo longo' },
  ],
  linguagem: [
    { key: 'nr_cores', label: '4. Nomeação Rápida / Cores' },
    { key: 'nr_fc', label: '4. Nomeação Rápida / Formas e Cores' },
    { key: 'nr_digitos', label: '4. Nomeação Rápida / Dígitos' },
    { key: 'compreensao', label: '10. Compreensão de Instruções' },
    { key: 'cf_eliminacao', label: '11. Consciência Fonológica / Eliminação' },
    { key: 'cf_substituicao', label: '11. Consciência Fonológica / Substituição' },
  ],
  atencao: [
    { key: 'fluencia_fonemica', label: '5. Fluência Verbal / Fonémica' },
    { key: 'fluencia_semantica', label: '5. Fluência Verbal / Semântica' },
    { key: 'torre_ensaios', label: '7. Torre / Ensaios realizados' },
    { key: 'cancelamento', label: '8. Cancelamento de Sinais' },
    { key: 'trilhas_a', label: '13. Trilhas / Parte A' },
    { key: 'trilhas_b', label: '13. Trilhas / Parte B' },
  ],
} as const
