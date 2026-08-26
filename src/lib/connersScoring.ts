/** Client-side Conners scoring — mirrors api/src/lib/connersScoring.ts */

import normsData from './connersNorms.json'

export const CONNERS_AGE_BAND = normsData.ageBand as string

type NormRow = { t: number } & Record<string, string | number | undefined>
type NormTables = Record<string, NormRow[]>

const TABLES = normsData.tables as unknown as NormTables

/** CPRS-R:S item numbers — opposition norms use professores table (Rodrigues, 2000). */
export const CONNERS_PAIS_OPPOSITION_ITEMS = [2, 6, 10, 15, 20] as const

export const CONNERS_PAIS_SUBSCALES = {
  opposition: { label: 'Problemas de oposição', items: CONNERS_PAIS_OPPOSITION_ITEMS },
  cognitive: { label: 'Problemas cognitivos / desatenção', items: [3, 8, 12, 17, 21, 25] },
  hyperactivity: { label: 'Excesso de actividade motora', items: [4, 9, 14, 18, 22, 26] },
  adhd_index: { label: 'Índice de défice de atenção e hiperactividade', items: [1, 4, 5, 8, 10, 11, 14, 15, 17, 21] },
} as const

export const CONNERS_PROF_SUBSCALES = {
  opposition: { label: 'Problemas de oposição', items: [2, 6, 10, 15, 20] },
  cognitive: { label: 'Problemas cognitivos / desatenção', items: [4, 8, 13, 18, 22] },
  hyperactivity: { label: 'Excesso de actividade motora', items: [3, 7, 11, 17, 21, 24] },
  adhd_index: { label: 'Índice de défice de atenção e hiperactividade', items: [1, 5, 9, 12, 14, 16, 19, 23, 25] },
} as const

export type ConnersVariant = 'pais' | 'professores'

export type ConnersQualitative =
  | 'Típico'
  | 'Ligeiramente atípico'
  | 'Possivelmente atípico'
  | 'Moderadamente atípico'
  | 'Marcadamente atípico'

export type ConnersNormResult = {
  raw: number
  standardScore: number | null
  percentile: string | null
  qualitative: ConnersQualitative | null
}

export type ConnersScoreSummary = {
  variant: ConnersVariant
  sex: 'masculino' | 'feminino' | null
  age: number | null
  ageInNormBand: boolean
  total: ConnersNormResult
  subscales: Record<string, ConnersNormResult>
}

function asItemScore(value: unknown): number | null {
  if (value === 0 || value === 1 || value === 2 || value === 3) return value
  if (typeof value === 'number' && value >= 0 && value <= 3) return value
  return null
}

function sumItems(answers: Record<string, unknown>, itemNums: readonly number[]): number {
  let total = 0
  let answered = 0
  for (const num of itemNums) {
    const score = asItemScore(answers[`q${num}`])
    if (score === null) continue
    total += score
    answered += 1
  }
  return answered > 0 ? total : 0
}

function sumAllItems(answers: Record<string, unknown>, itemCount: number): number {
  let total = 0
  for (let i = 1; i <= itemCount; i++) {
    const score = asItemScore(answers[`q${i}`])
    if (score !== null) total += score
  }
  return total
}

function parseThreshold(cell: string): { min: number } | null {
  const token = cell.trim().split(/\s+/)[0]
  if (!token) return null
  if (token.includes('-')) {
    const [a] = token.split('-', 1)
    const min = Number(a)
    return Number.isFinite(min) ? { min } : null
  }
  const n = Number(token)
  return Number.isFinite(n) ? { min: n } : null
}

function lookupPercentileForStandardScore(
  table: NormRow[],
  prefix: string,
  standardScore: number,
): string | null {
  for (const row of table) {
    if (row.t !== standardScore) continue
    const pt = row[`${prefix}_pt`]
    if (typeof pt === 'string') return pt
  }

  // Paper tables omit many PT cells — use the closest lower T row with a percentile.
  let floorPt: string | null = null
  let floorT = -Infinity
  for (const row of table) {
    const pt = row[`${prefix}_pt`]
    if (typeof pt !== 'string') continue
    if (row.t <= standardScore && row.t > floorT) {
      floorT = row.t
      floorPt = pt
    }
  }
  if (floorPt !== null) return floorPt

  // Below every tabulated T with PT — use the lowest available band.
  let lowestPt: string | null = null
  let lowestT = Infinity
  for (const row of table) {
    const pt = row[`${prefix}_pt`]
    if (typeof pt !== 'string') continue
    if (row.t < lowestT) {
      lowestT = row.t
      lowestPt = pt
    }
  }
  return lowestPt
}

function lookupNorm(
  table: NormRow[],
  prefix: string,
  raw: number,
): { standardScore: number; percentile: string | null } | null {
  for (const row of table) {
    const rawCell = row[`${prefix}_raw`]
    if (typeof rawCell !== 'string') continue
    const threshold = parseThreshold(rawCell)
    if (!threshold) continue
    if (raw >= threshold.min) {
      const standardScore = row.t
      const ptOnRow = row[`${prefix}_pt`]
      const percentile =
        typeof ptOnRow === 'string'
          ? ptOnRow
          : lookupPercentileForStandardScore(table, prefix, standardScore)
      return { standardScore, percentile }
    }
  }
  const last = table[table.length - 1]
  if (!last) return null
  const standardScore = last.t
  const ptOnRow = last[`${prefix}_pt`]
  return {
    standardScore,
    percentile:
      typeof ptOnRow === 'string'
        ? ptOnRow
        : lookupPercentileForStandardScore(table, prefix, standardScore),
  }
}

function normTableKey(variant: ConnersVariant, sex: 'masculino' | 'feminino'): string {
  return `${variant}_${sex}`
}

function resolveNormTable(
  variant: ConnersVariant,
  sex: 'masculino' | 'feminino',
  subscaleKey: string,
): NormRow[] | undefined {
  if (subscaleKey === 'opposition') {
    return TABLES[normTableKey('professores', sex)]
  }
  return TABLES[normTableKey(variant, sex)]
}

function normPrefixForSubscale(subscaleKey: string): string {
  if (subscaleKey === 'opposition') return 'a'
  if (subscaleKey === 'cognitive') return 'b'
  if (subscaleKey === 'hyperactivity') return 'c'
  if (subscaleKey === 'adhd_index') return 'd'
  return subscaleKey
}

export function qualitativeFromStandardScore(standardScore: number | null): ConnersQualitative | null {
  if (standardScore === null) return null
  if (standardScore <= 55) return 'Típico'
  if (standardScore <= 60) return 'Ligeiramente atípico'
  if (standardScore <= 65) return 'Possivelmente atípico'
  if (standardScore <= 70) return 'Moderadamente atípico'
  return 'Marcadamente atípico'
}

function parseSex(value: unknown): 'masculino' | 'feminino' | null {
  if (value === 'masculino' || value === 'M' || value === 'm' || value === 0) return 'masculino'
  if (value === 'feminino' || value === 'F' || value === 'f' || value === 1) return 'feminino'
  return null
}

function parseAge(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value.trim())
    return Number.isFinite(n) ? n : null
  }
  return null
}

function ageInBand(age: number | null): boolean {
  if (age === null) return false
  const [lo, hi] = CONNERS_AGE_BAND.split('-').map((s) => Number(s.trim()))
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return false
  return age >= lo && age <= hi
}

function buildNormResult(
  raw: number,
  standardScore: number | null,
  percentile: string | null,
): ConnersNormResult {
  return {
    raw,
    standardScore,
    percentile,
    qualitative: qualitativeFromStandardScore(standardScore),
  }
}

export function computeConnersSummary(
  variant: ConnersVariant,
  answers: Record<string, unknown>,
  itemCount?: number,
): ConnersScoreSummary {
  const sex = parseSex(answers.conners_sexo)
  const age = parseAge(answers.conners_idade)
  const inBand = ageInBand(age)
  const subscaleDefs =
    variant === 'pais' ? CONNERS_PAIS_SUBSCALES : CONNERS_PROF_SUBSCALES

  const subscales: Record<string, ConnersNormResult> = {}
  for (const [key, def] of Object.entries(subscaleDefs)) {
    const raw = sumItems(answers, def.items)
    let standardScore: number | null = null
    let percentile: string | null = null
    if (sex && inBand) {
      const table = resolveNormTable(variant, sex, key)
      if (table) {
        const prefix = normPrefixForSubscale(key)
        const norm = lookupNorm(table, prefix, raw)
        if (norm) {
          standardScore = norm.standardScore
          percentile = norm.percentile
        }
      }
    }
    subscales[key] = buildNormResult(raw, standardScore, percentile)
  }

  const count = itemCount ?? (variant === 'pais' ? 27 : 25)

  return {
    variant,
    sex,
    age,
    ageInNormBand: inBand,
    total: buildNormResult(sumAllItems(answers, count), null, null),
    subscales,
  }
}

export const CONNERS_SCORE_LABELS: Record<string, string> = {
  total_raw: 'Total — soma bruta',
  cognitive_raw: 'Problemas cognitivos / desatenção — soma bruta',
  cognitive_standard: 'Problemas cognitivos / desatenção — score padrão',
  cognitive_percentile: 'Problemas cognitivos / desatenção — percentil',
  hyperactivity_raw: 'Excesso de actividade motora — soma bruta',
  hyperactivity_standard: 'Excesso de actividade motora — score padrão',
  hyperactivity_percentile: 'Excesso de actividade motora — percentil',
  adhd_index_raw: 'Índice ADHD — soma bruta',
  adhd_index_standard: 'Índice ADHD — score padrão',
  adhd_index_percentile: 'Índice ADHD — percentil',
  opposition_raw: 'Problemas de oposição — soma bruta',
  opposition_standard: 'Problemas de oposição — score padrão',
  opposition_percentile: 'Problemas de oposição — percentil',
}

export const CONNERS_QUALITATIVE_COLUMN = 'Resultado qualitativo'
