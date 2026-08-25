import norms0to2 from './griffiths0to2Norms.json' with { type: 'json' }
import norms2to8 from './griffiths2to8Norms.json' with { type: 'json' }
import type { GriffithsAgeBand, GriffithsSubscaleKey } from './griffithsResults.js'

type BracketRow = [number, number]
type GridTriple = [number, number, number]
type MedianRow = [number, number]

const norms02 = norms0to2 as unknown as {
  table19SubscaleRawToMentalAgeMonths: Record<string, BracketRow[]>
  table20GeneralRawToMentalAgeMonths: BracketRow[]
}

const norms28 = norms2to8 as unknown as {
  tableSubscaleMedianRawByMentalAgeMonths?: Record<string, Record<string, MedianRow[]>>
  tableGeneralMedianRawByMentalAgeMonths?: Record<string, MedianRow[]>
  tableSubscaleRawToMentalAgeMonths: Record<string, GridTriple[]>
  tableGeneralRawToMentalAgeMonths: GridTriple[]
}

const SUBSCALES_0TO2 = new Set(['a', 'b', 'c', 'd', 'e'])
const SUBSCALES_2TO8 = new Set(['a', 'b', 'c', 'd', 'e', 'f'])

function lookupExactBracket(rows: BracketRow[], rawScore: number): number | null {
  if (!Number.isFinite(rawScore) || rows.length === 0) return null
  const roundedRaw = Math.round(rawScore)
  let best: BracketRow | null = null
  for (const row of rows) {
    if (row[0] <= roundedRaw) {
      best = row
    }
    if (row[0] === roundedRaw) {
      return row[1]
    }
  }
  return best?.[1] ?? null
}

function lookupNearestBracket(rows: BracketRow[], rawScore: number): number | null {
  if (!Number.isFinite(rawScore) || rows.length === 0) return null
  const roundedRaw = Math.round(rawScore)
  let nearest: BracketRow | null = null
  let nearestDistance = Number.POSITIVE_INFINITY
  for (const row of rows) {
    const distance = Math.abs(row[0] - roundedRaw)
    if (distance < nearestDistance) {
      nearest = row
      nearestDistance = distance
    }
  }
  return nearest?.[1] ?? null
}

function lookupRawToMentalAge(rows: BracketRow[] | undefined, rawScore: number): number | null {
  if (!rows?.length) return null
  return lookupExactBracket(rows, rawScore) ?? lookupNearestBracket(rows, rawScore)
}

export function griffiths28BandForChronologicalAge(chronologicalAgeMonths: number): string {
  if (chronologicalAgeMonths <= 47.5) return '24.0-47.5'
  if (chronologicalAgeMonths <= 71.5) return '48.0-71.5'
  return '72.0-96.0'
}

function lookupGriffiths28InverseMedian(medianRows: MedianRow[] | undefined, rawScore: number): number | null {
  if (!medianRows?.length || !Number.isFinite(rawScore)) return null

  const sorted = [...medianRows].sort((a, b) => a[1] - b[1])
  const format = (value: number) => Number(value.toFixed(2))

  if (rawScore <= sorted[0][1]) {
    const [mentalAge0, raw0] = sorted[0]
    const [mentalAge1, raw1] = sorted[1] ?? [mentalAge0 - 0.5, raw0 - 1]
    if (raw1 === raw0) return format(mentalAge0)
    const slope = (mentalAge1 - mentalAge0) / (raw1 - raw0)
    return format(mentalAge0 + slope * (rawScore - raw0))
  }

  const lastIndex = sorted.length - 1
  if (rawScore >= sorted[lastIndex][1]) {
    const [mentalAge0, raw0] = sorted[lastIndex - 1] ?? sorted[lastIndex]
    const [mentalAge1, raw1] = sorted[lastIndex]
    if (raw1 === raw0) return format(mentalAge1)
    const slope = (mentalAge1 - mentalAge0) / (raw1 - raw0)
    return format(mentalAge1 + slope * (rawScore - raw1))
  }

  for (let index = 0; index < sorted.length - 1; index += 1) {
    const [mentalAge0, raw0] = sorted[index]
    const [mentalAge1, raw1] = sorted[index + 1]
    if (rawScore >= raw0 && rawScore <= raw1) {
      if (raw1 === raw0) return format(mentalAge0)
      const ratio = (rawScore - raw0) / (raw1 - raw0)
      return format(mentalAge0 + ratio * (mentalAge1 - mentalAge0))
    }
  }

  return null
}

function mergeSubscaleMedianRows(
  subscale: GriffithsSubscaleKey,
  preferredBand?: string,
): MedianRow[] {
  const subscaleBands = norms28.tableSubscaleMedianRawByMentalAgeMonths?.[subscale]
  if (!subscaleBands) return []

  const map = new Map<number, number>()
  const bandOrder = preferredBand
    ? [preferredBand, ...Object.keys(subscaleBands).filter((band) => band !== preferredBand)]
    : Object.keys(subscaleBands)

  for (const band of bandOrder) {
    for (const [ageMonths, medianRaw] of subscaleBands[band] ?? []) {
      map.set(ageMonths, medianRaw)
    }
  }

  return [...map.entries()].sort((a, b) => a[0] - b[0])
}

function lookupGriffiths28SubscaleDevelopmental(
  subscale: GriffithsSubscaleKey,
  chronologicalAgeMonths: number,
  rawScore: number,
): number | null {
  const band = griffiths28BandForChronologicalAge(chronologicalAgeMonths)
  const bandRows = norms28.tableSubscaleMedianRawByMentalAgeMonths?.[subscale]?.[band]
  let result = lookupGriffiths28InverseMedian(bandRows, rawScore)

  const mergedRows = mergeSubscaleMedianRows(subscale, band)
  const mergedResult = lookupGriffiths28InverseMedian(mergedRows, rawScore)
  if (mergedResult !== null && (result === null || (bandRows?.length ?? 0) < 5)) {
    result = mergedResult
  }

  if (mergedRows.length < 5 || result === null) {
    const generalResult = lookupGriffiths28GeneralFromRaw(chronologicalAgeMonths, rawScore)
    if (generalResult !== null) {
      result = generalResult
    }
  }

  return result
}

function lookupGriffiths28GeneralFromRaw(
  chronologicalAgeMonths: number,
  rawScore: number,
): number | null {
  const band = griffiths28BandForChronologicalAge(chronologicalAgeMonths)
  const medianRows = norms28.tableGeneralMedianRawByMentalAgeMonths?.[band]
  return lookupGriffiths28InverseMedian(medianRows, rawScore)
}

export function lookupGriffithsSubscaleMentalAgeMonths(
  band: GriffithsAgeBand,
  subscale: GriffithsSubscaleKey,
  rawScore: number,
  chronologicalAgeMonths: number | null = null,
): number | null {
  if (band === '0-2') {
    if (!SUBSCALES_0TO2.has(subscale)) return null
    const rows = norms02.table19SubscaleRawToMentalAgeMonths[subscale]
    return lookupRawToMentalAge(rows, rawScore)
  }

  if (!SUBSCALES_2TO8.has(subscale)) return null
  if (chronologicalAgeMonths === null) return null
  return lookupGriffiths28SubscaleDevelopmental(subscale, chronologicalAgeMonths, rawScore)
}

export function lookupGriffithsGeneralMentalAgeMonths(
  band: GriffithsAgeBand,
  rawScore: number,
  chronologicalAgeMonths: number | null = null,
): number | null {
  if (band === '0-2') {
    return lookupRawToMentalAge(norms02.table20GeneralRawToMentalAgeMonths, rawScore)
  }
  if (chronologicalAgeMonths === null) return null
  return lookupGriffiths28GeneralFromRaw(chronologicalAgeMonths, rawScore)
}

export function lookupGriffithsSubscaleGlobalMentalAgeMonths(
  rawScore: number,
  chronologicalAgeMonths: number | null,
): number | null {
  if (chronologicalAgeMonths === null) return null
  return lookupGriffiths28GeneralFromRaw(chronologicalAgeMonths, rawScore)
}

export function computeGriffithsQuotientFromAges(
  mentalAgeMonths: number,
  chronologicalAgeMonths: number,
): number | null {
  if (chronologicalAgeMonths <= 0 || mentalAgeMonths < 0) return null

  let adjustedMentalAge = mentalAgeMonths
  let adjustedChronologicalAge = chronologicalAgeMonths

  if (chronologicalAgeMonths < 8) {
    adjustedMentalAge += 2
    adjustedChronologicalAge += 2
  }

  return Math.round((adjustedMentalAge / adjustedChronologicalAge) * 10000) / 100
}

export function canAutoScoreGriffithsSlot(rawScore: number | null): boolean {
  return rawScore !== null && rawScore > 0
}

export function getGriffithsAutoScoreBlockReason(chronologicalAgeMonths: number | null): string {
  if (chronologicalAgeMonths === null || chronologicalAgeMonths <= 0) {
    return 'Indique a idade cronológica para calcular normas automáticas e o quociente geral.'
  }
  if (chronologicalAgeMonths > 96) {
    return 'Normas automáticas disponíveis até aos 96 meses (8 anos).'
  }
  return ''
}
