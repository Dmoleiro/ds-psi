/** Client-side Vineland cotação — mirrors api/src/lib/questionnaires/vinelandScoring.ts */

type VinelandSubdomain = { id: string; label: string; max?: number }
type VinelandAreaItem = {
  id: string
  subdomain: string
  num: number
  text: string
  age?: string
  rules?: string[]
}
type VinelandArea = {
  id: string
  title: string
  prefix: string
  subdomains: VinelandSubdomain[]
  items: VinelandAreaItem[]
  observationsId?: string
}

type PageRowConfig = { id: string; label: string; from: number; to: number }
export type AreaCotationConfig = {
  pageRows: PageRowConfig[]
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

function initSubdomainMap(subdomains: VinelandSubdomain[]): Record<string, number> {
  return Object.fromEntries(subdomains.map((sub) => [sub.id, 0]))
}

export function computeVinelandAreaCotationSheet(
  area: VinelandArea,
  config: AreaCotationConfig,
  values: Record<string, unknown>,
): { subdomains: VinelandSubdomain[]; rows: VinelandCotationRow[] } {
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
  part1Ids: string[],
  part2Ids: string[],
  values: Record<string, unknown>,
  labels: VinelandMaladaptiveCotation,
): { rows: Array<{ id: string; label: string; value: number }> } {
  let part1 = 0
  let part2 = 0
  for (const id of part1Ids) {
    const score = asScore(values[id])
    if (score !== null) part1 += score
  }
  for (const id of part2Ids) {
    const score = asScore(values[id])
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
