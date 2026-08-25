import {
  VINELAND_AREAS,
  VINELAND_COTATION_CONFIG,
  VINELAND_MALADAPTIVE_COTATION,
  VINELAND_MALADAPTIVE_PART1,
  VINELAND_MALADAPTIVE_PART2,
} from './definitions/vineland.js'
import type { QuestionnaireScores } from './types.js'

type VinelandItem = { num: number; id: string; subdomain: string }
type VinelandSubdomain = { id: string; label: string; max?: number }
type VinelandArea = {
  id: string
  subdomains: readonly VinelandSubdomain[]
  items: readonly VinelandItem[]
}

type PageRowConfig = { id: string; label: string; from: number; to: number }
export type AreaCotationConfig = {
  pageRows: readonly PageRowConfig[]
  nLabel: string
  dLabel: string
  totalLabel: string
}

export type VinelandCotationRow = {
  id: string
  label: string
  kind: 'page' | 'n' | 'd' | 'total'
  values: Record<string, number>
}

export type VinelandMaladaptiveCotation = {
  part1Label: string
  part2Label: string
  totalLabel: string
}

function asScore(value: unknown): number | null {
  if (value === 2 || value === 1 || value === 0) return value
  if (typeof value === 'number' && value >= 0 && value <= 2) return value
  return null
}

function initSubdomainMap(subdomains: readonly VinelandSubdomain[]): Record<string, number> {
  return Object.fromEntries(subdomains.map((sub) => [sub.id, 0]))
}

export function computeVinelandAreaCotationSheet(
  area: VinelandArea,
  config: AreaCotationConfig,
  values: Record<string, unknown>,
): { subdomains: readonly VinelandSubdomain[]; rows: VinelandCotationRow[] } {
  const rows: VinelandCotationRow[] = []

  for (const pageRow of config.pageRows) {
    const pageScores = initSubdomainMap(area.subdomains)
    for (const item of area.items) {
      if (item.num < pageRow.from || item.num > pageRow.to) continue
      const score = asScore(values[item.id])
      if (score !== null) pageScores[item.subdomain] += score
    }
    rows.push({
      id: pageRow.id,
      label: pageRow.label,
      kind: 'page',
      values: pageScores,
    })
  }

  const nCounts = initSubdomainMap(area.subdomains)
  const dCounts = initSubdomainMap(area.subdomains)
  const totals = initSubdomainMap(area.subdomains)

  for (const item of area.items) {
    const value = values[item.id]
    if (value === 'N') nCounts[item.subdomain] += 1
    else if (value === 'D') dCounts[item.subdomain] += 1
    const score = asScore(value)
    if (score !== null) totals[item.subdomain] += score
  }

  rows.push({ id: 'n', label: config.nLabel, kind: 'n', values: nCounts })
  rows.push({ id: 'd', label: config.dLabel, kind: 'd', values: dCounts })
  rows.push({ id: 'total', label: config.totalLabel, kind: 'total', values: totals })

  return { subdomains: area.subdomains, rows }
}

export function computeMaladaptiveCotationSheet(
  values: Record<string, unknown>,
  labels: VinelandMaladaptiveCotation = VINELAND_MALADAPTIVE_COTATION,
): { rows: Array<{ id: string; label: string; value: number }> } {
  let part1 = 0
  let part2 = 0
  for (const item of VINELAND_MALADAPTIVE_PART1) {
    const score = asScore(values[item.id])
    if (score !== null) part1 += score
  }
  for (const item of VINELAND_MALADAPTIVE_PART2) {
    const score = asScore(values[item.id])
    if (score !== null) part2 += score
  }
  return {
    rows: [
      { id: 'part1', label: labels.part1Label, value: part1 },
      { id: 'part2', label: labels.part2Label, value: part2 },
      { id: 'total', label: labels.totalLabel, value: part1 + part2 },
    ],
  }
}

export function computeVinelandScores(answers: Record<string, unknown>): QuestionnaireScores {
  const scores: QuestionnaireScores = {}

  for (const area of VINELAND_AREAS) {
    const config = VINELAND_COTATION_CONFIG[area.id as keyof typeof VINELAND_COTATION_CONFIG]
    if (!config) continue

    const sheet = computeVinelandAreaCotationSheet(area, config, answers)

    for (const row of sheet.rows) {
      for (const sub of area.subdomains) {
        const value = row.values[sub.id] ?? 0
        if (row.kind === 'total') {
          scores[`${area.id}_${sub.id}`] = value
        } else if (row.kind === 'page') {
          scores[`${area.id}_${row.id}_${sub.id}`] = value
        } else if (row.kind === 'n') {
          scores[`${area.id}_${sub.id}_n`] = value
        } else if (row.kind === 'd') {
          scores[`${area.id}_${sub.id}_d`] = value
        }
      }
    }

    const areaTotal = area.subdomains.reduce(
      (sum, sub) => sum + (scores[`${area.id}_${sub.id}`] ?? 0),
      0,
    )
    scores[`${area.id}_total`] = areaTotal
  }

  const maladaptive = computeMaladaptiveCotationSheet(answers)
  scores.maladaptativo_parte1 = maladaptive.rows[0]?.value ?? 0
  scores.maladaptativo_parte2 = maladaptive.rows[1]?.value ?? 0
  scores.maladaptativo_total = maladaptive.rows[2]?.value ?? 0

  return scores
}

export const VINELAND_SCORE_LABELS: Record<string, string> = {
  comunicacao_total: 'Comunicação — total da área',
  autonomia_total: 'Autonomia — total da área',
  socializacao_total: 'Socialização — total da área',
  motricidade_total: 'Motricidade — total da área',
  maladaptativo_parte1: 'Comportamento desajustado — Parte 1',
  maladaptativo_parte2: 'Comportamento desajustado — Parte 2',
  maladaptativo_total: 'Comportamento desajustado — total',
}

for (const area of VINELAND_AREAS) {
  const config = VINELAND_COTATION_CONFIG[area.id as keyof typeof VINELAND_COTATION_CONFIG]
  if (!config) continue
  for (const sub of area.subdomains) {
    VINELAND_SCORE_LABELS[`${area.id}_${sub.id}`] = `${area.title} — ${sub.label} (total)`
    VINELAND_SCORE_LABELS[`${area.id}_${sub.id}_n`] = `${area.title} — ${sub.label} (N)`
    VINELAND_SCORE_LABELS[`${area.id}_${sub.id}_d`] = `${area.title} — ${sub.label} (D)`
    for (const pageRow of config.pageRows) {
      VINELAND_SCORE_LABELS[`${area.id}_${pageRow.id}_${sub.id}`] =
        `${area.title} — ${sub.label} (${pageRow.label})`
    }
  }
}
