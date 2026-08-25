import {
  emptyEvaluationAgeFields,
  resolveEvaluationAge,
  type EvaluationAgeFields,
} from './chronologicalAge'
import {
  canAutoScoreGriffithsSlot,
  computeGriffithsQuotientFromAges,
  getGriffithsAutoScoreBlockReason,
  lookupGriffithsGeneralMentalAgeMonths,
  lookupGriffithsSubscaleMentalAgeMonths,
} from './griffithsNorms'

export const GRIFFITHS_SUBSCALE_KEYS = ['a', 'b', 'c', 'd', 'e', 'f'] as const

export type GriffithsSubscaleKey = (typeof GRIFFITHS_SUBSCALE_KEYS)[number]

const GRIFFITHS_SUBSCALE_KEYS_0TO2: readonly GriffithsSubscaleKey[] = ['a', 'b', 'c', 'd', 'e']

export const GRIFFITHS_SUBSCALES = [
  { key: 'a', label: 'A', title: 'Locomotora' },
  { key: 'b', label: 'B', title: 'Pessoal/Social' },
  { key: 'c', label: 'C', title: 'Audição e Linguagem' },
  { key: 'd', label: 'D', title: 'Coordenação óculo-manual' },
  { key: 'e', label: 'E', title: 'Realização' },
  { key: 'f', label: 'F', title: 'Raciocínio Prático' },
] as const

export const GRIFFITHS_AGE_BANDS = ['0-2', '2-8'] as const

export type GriffithsAgeBand = (typeof GRIFFITHS_AGE_BANDS)[number]

export const GRIFFITHS_SECTION_SLOT_LABELS = ['0–2 anos', '2–8 anos'] as const

export type GriffithsSectionKey = 'sectionI' | 'sectionII' | 'sectionIII' | 'sectionIV'

export type GriffithsSubscaleFieldKey =
  | GriffithsSectionKey
  | 'developmentalAgeMonths'
  | 'mentalAgeGlobal'

export type GriffithsSectionCells = [string, string]

export const GRIFFITHS_SELECTION_KEY = 'escala_desenvolvimento_ruth_griffiths'

export type GriffithsSubscaleResult = {
  sectionI: GriffithsSectionCells
  sectionII: GriffithsSectionCells
  sectionIII: GriffithsSectionCells
  sectionIV: GriffithsSectionCells
  developmentalAgeMonths: GriffithsSectionCells
  mentalAgeGlobal: GriffithsSectionCells
}

export type GriffithsDerivedSubscale = GriffithsSubscaleResult & {
  totalRaw: GriffithsSectionCells
}

export type GriffithsResults = EvaluationAgeFields & {
  subscales: Record<string, GriffithsSubscaleResult>
  qgQuotient: string
}

export type GriffithsDerivedResults = GriffithsResults & {
  subscales: Record<string, GriffithsDerivedSubscale>
  chronologicalAgeMonths: string
  qgRaw: string
  derivedQgQuotient: string
  derivedGlobalMentalAgeMonths: string
  autoScored: boolean
  autoScoreBlockReason: string
}

function emptySectionCells(): GriffithsSectionCells {
  return ['', '']
}

function emptySubscaleResult(): GriffithsSubscaleResult {
  return {
    sectionI: emptySectionCells(),
    sectionII: emptySectionCells(),
    sectionIII: emptySectionCells(),
    sectionIV: emptySectionCells(),
    developmentalAgeMonths: emptySectionCells(),
    mentalAgeGlobal: emptySectionCells(),
  }
}

export function emptyGriffithsResults(): GriffithsResults {
  const subscales: Record<string, GriffithsSubscaleResult> = {}
  for (const subscale of GRIFFITHS_SUBSCALES) {
    subscales[subscale.key] = emptySubscaleResult()
  }

  return {
    ...emptyEvaluationAgeFields(),
    subscales,
    qgQuotient: '',
  }
}

function parseNumericCell(value: string | undefined): number | null {
  if (value === undefined) return null
  const trimmed = value.trim().replace(',', '.')
  if (!trimmed) return null
  const parsed = Number.parseFloat(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

function formatNumeric(value: number, decimals = 1): string {
  const rounded = Number(value.toFixed(decimals))
  if (Number.isInteger(rounded)) return String(rounded)
  return rounded.toFixed(decimals).replace(/\.0$/, '')
}

/** Griffiths derived fields: always 2 decimal places, no trailing-zero stripping. */
function formatCalculatedNumeric(value: number): string {
  return Number(value.toFixed(2)).toFixed(2)
}

function sumNumericValues(values: Array<number | null>): number | null {
  if (values.every((value) => value === null)) {
    return null
  }
  return values.reduce<number>((sum, value) => sum + (value ?? 0), 0)
}

function sumSectionCells(cells: GriffithsSectionCells): number | null {
  return sumNumericValues(cells.map((cell) => parseNumericCell(cell)))
}

function sumSectionSlot(subscale: GriffithsSubscaleResult, slotIndex: number): number | null {
  return sumNumericValues([
    parseNumericCell(subscale.sectionI[slotIndex]),
    parseNumericCell(subscale.sectionII[slotIndex]),
    parseNumericCell(subscale.sectionIII[slotIndex]),
    parseNumericCell(subscale.sectionIV[slotIndex]),
  ])
}

function computeGriffithsPartialQuotient(
  developmentalAgeMonths: number,
  chronologicalAgeMonths: number,
): number | null {
  if (chronologicalAgeMonths <= 0 || developmentalAgeMonths < 0) return null
  return Math.round((developmentalAgeMonths / chronologicalAgeMonths) * 10000) / 100
}

function normalizeSectionCells(value: unknown): GriffithsSectionCells {
  if (Array.isArray(value)) {
    if (value.length >= 3) {
      return [trimCell(value[0], 16), trimCell(value[2], 16)]
    }
    return [trimCell(value[0], 16), trimCell(value[1], 16)]
  }
  if (typeof value === 'string') {
    return [trimCell(value, 16), '']
  }
  return emptySectionCells()
}

function setCell(cells: GriffithsSectionCells, slotIndex: number, value: string): GriffithsSectionCells {
  const next = [...cells] as GriffithsSectionCells
  next[slotIndex] = value
  return next
}

export function griffithsAgeBandForSlot(slotIndex: number): GriffithsAgeBand {
  return GRIFFITHS_AGE_BANDS[slotIndex] ?? '0-2'
}

export function griffithsAgeBandSlotForChronologicalAge(chronologicalAgeMonths: number): number {
  if (chronologicalAgeMonths <= 24) return 0
  return 1
}

export function griffithsSubscaleKeysForSlot(slotIndex: number): readonly GriffithsSubscaleKey[] {
  return slotIndex === 0 ? GRIFFITHS_SUBSCALE_KEYS_0TO2 : GRIFFITHS_SUBSCALE_KEYS
}

function computeGriffithsBandRawTotalSum(
  subscales: Record<string, GriffithsDerivedSubscale>,
  slotIndex: number,
): number | null {
  const keys = griffithsSubscaleKeysForSlot(slotIndex)
  const totals = keys.map((key) => parseNumericCell(subscales[key]?.totalRaw[slotIndex]))
  if (totals.some((value) => value === null)) {
    return null
  }
  return sumNumericValues(totals)!
}

export function computeGriffithsSubscaleTotalBySlot(
  subscale: GriffithsSubscaleResult,
): GriffithsSectionCells {
  return GRIFFITHS_SECTION_SLOT_LABELS.map((_, slotIndex) => {
    const sum = sumSectionSlot(subscale, slotIndex)
    return sum === null ? '' : formatCalculatedNumeric(sum)
  }) as GriffithsSectionCells
}

export function computeGriffithsSubscaleTotal(subscale: GriffithsSubscaleResult): string {
  const triple = computeGriffithsSubscaleTotalBySlot(subscale)
  const total = sumNumericValues(triple.map((cell) => parseNumericCell(cell)))
  if (total === null) {
    return ''
  }
  return formatCalculatedNumeric(total)
}

export function computeGriffithsQgRaw(
  subscales: Record<string, GriffithsDerivedSubscale>,
  slotIndex: number,
): string {
  const sum = computeGriffithsBandRawTotalSum(subscales, slotIndex)
  if (sum === null) {
    return ''
  }
  const keys = griffithsSubscaleKeysForSlot(slotIndex)
  return formatCalculatedNumeric(sum / keys.length)
}

function computeGriffithsGeneralRawSumBySlot(
  subscales: Record<string, GriffithsDerivedSubscale>,
  slotIndex: number,
): string {
  const sum = computeGriffithsBandRawTotalSum(subscales, slotIndex)
  return sum === null ? '' : formatCalculatedNumeric(sum)
}

function computeGriffithsGeneralRawSumBySlotCells(
  subscales: Record<string, GriffithsDerivedSubscale>,
): GriffithsSectionCells {
  return GRIFFITHS_SECTION_SLOT_LABELS.map((_, slotIndex) =>
    computeGriffithsGeneralRawSumBySlot(subscales, slotIndex),
  ) as GriffithsSectionCells
}

// function computeGriffithsQgRawBySlot(
//   subscales: Record<string, GriffithsDerivedSubscale>,
// ): GriffithsSectionCells {
//   return GRIFFITHS_SECTION_SLOT_LABELS.map((_, slotIndex) =>
//     computeGriffithsQgRaw(subscales, slotIndex),
//   ) as GriffithsSectionCells
// }

export function computeGriffithsGlobalMentalAgeMonths(
  subscales: Record<string, GriffithsSubscaleResult>,
): string {
  const values = GRIFFITHS_SUBSCALE_KEYS.map((key) =>
    sumSectionCells(subscales[key]?.mentalAgeGlobal ?? emptySectionCells()),
  ).filter((value): value is number => value !== null)

  if (values.length === 0) {
    return ''
  }

  const average = values.reduce((sum, value) => sum + value, 0) / values.length
  return formatCalculatedNumeric(average)
}

export function computeGriffithsQgQuotient(
  qgRawAverage: string,
  chronologicalAgeMonths: string,
): string {
  const rawAverage = parseNumericCell(qgRawAverage)
  const chronologicalAge = parseNumericCell(chronologicalAgeMonths)
  if (rawAverage === null || chronologicalAge === null || chronologicalAge <= 0) {
    return ''
  }
  const quotient = computeGriffithsQuotientFromAges(rawAverage, chronologicalAge)
  return quotient === null ? '' : formatCalculatedNumeric(quotient)
}

export function getGriffithsDevelopmentLevel(quotient: string): string {
  const value = parseNumericCell(quotient)
  if (value === null) return ''
  if (value > 125) return 'Superior'
  if (value > 100 && value <= 125) return 'Médio alto'
  if (value === 100) return 'Médio'
  if (value >= 75 && value < 100) return 'Médio baixo'
  if (value < 75) return 'Deficitário'
  return ''
}

function parseChronologicalAgeMonths(age: EvaluationAgeFields): number | null {
  const years = Number.parseInt(age.ageYears, 10)
  const months = Number.parseInt(age.ageMonths, 10)
  if (!Number.isFinite(years) || !Number.isFinite(months)) return null
  return years * 12 + months
}

export function canAutoScoreGriffithsResults(results: GriffithsResults): boolean {
  return GRIFFITHS_SUBSCALE_KEYS.some((key) => {
    const subscale = results.subscales[key] ?? emptySubscaleResult()
    return computeGriffithsSubscaleTotalBySlot(subscale).some((cell) => Boolean(cell.trim()))
  })
}

function applyAutoScoringToSubscale(
  key: GriffithsSubscaleKey,
  _subscale: GriffithsSubscaleResult,
  totalRaw: GriffithsSectionCells,
  chronologicalAgeMonths: number | null,
): Pick<GriffithsSubscaleResult, 'developmentalAgeMonths' | 'mentalAgeGlobal'> {
  let developmentalAgeMonths = emptySectionCells()
  let mentalAgeGlobal = emptySectionCells()

  for (let slotIndex = 0; slotIndex < GRIFFITHS_SECTION_SLOT_LABELS.length; slotIndex += 1) {
    const band = griffithsAgeBandForSlot(slotIndex)
    const lookupAge = band === '2-8' ? chronologicalAgeMonths : null
    if (band === '2-8' && lookupAge === null) continue

    const rawScore = parseNumericCell(totalRaw[slotIndex])
    if (canAutoScoreGriffithsSlot(rawScore)) {
      const developmentalMentalAge = lookupGriffithsSubscaleMentalAgeMonths(
        band,
        key,
        rawScore ?? 0,
        lookupAge,
      )
      if (developmentalMentalAge !== null) {
        developmentalAgeMonths = setCell(
          developmentalAgeMonths,
          slotIndex,
          formatCalculatedNumeric(developmentalMentalAge),
        )

        if (band === '2-8' && lookupAge !== null) {
          const partialQuotient = computeGriffithsPartialQuotient(
            developmentalMentalAge,
            lookupAge,
          )
          if (partialQuotient !== null) {
            mentalAgeGlobal = setCell(
              mentalAgeGlobal,
              slotIndex,
              formatCalculatedNumeric(partialQuotient),
            )
          }
        }
      }
    }
  }

  return {
    developmentalAgeMonths,
    mentalAgeGlobal,
  }
}

export function deriveGriffithsResults(raw: GriffithsResults): GriffithsDerivedResults {
  const age = resolveEvaluationAge(raw)
  const chronologicalAgeMonthsNumber = parseChronologicalAgeMonths(age)
  const chronologicalAgeMonths =
    chronologicalAgeMonthsNumber === null
      ? ''
      : formatNumeric(chronologicalAgeMonthsNumber, 0)
  const autoScoreBlockReason = getGriffithsAutoScoreBlockReason(chronologicalAgeMonthsNumber)
  const canAutoScoreNorms = canAutoScoreGriffithsResults(raw)
  const canAutoScoreQuotient = autoScoreBlockReason === '' && canAutoScoreNorms

  const subscales: Record<string, GriffithsDerivedSubscale> = {}
  for (const subscale of GRIFFITHS_SUBSCALES) {
    const current = raw.subscales[subscale.key] ?? emptySubscaleResult()
    const totalRaw = computeGriffithsSubscaleTotalBySlot(current)
    subscales[subscale.key] = {
      ...current,
      totalRaw,
      developmentalAgeMonths: canAutoScoreNorms
        ? applyAutoScoringToSubscale(
            subscale.key,
            current,
            totalRaw,
            chronologicalAgeMonthsNumber,
          ).developmentalAgeMonths
        : current.developmentalAgeMonths,
      mentalAgeGlobal: canAutoScoreNorms
        ? applyAutoScoringToSubscale(
            subscale.key,
            current,
            totalRaw,
            chronologicalAgeMonthsNumber,
          ).mentalAgeGlobal
        : current.mentalAgeGlobal,
    }
  }

  const generalRawSumBySlot = computeGriffithsGeneralRawSumBySlotCells(subscales)
  const activeSlotIndex =
    chronologicalAgeMonthsNumber === null
      ? null
      : griffithsAgeBandSlotForChronologicalAge(chronologicalAgeMonthsNumber)
  const qgRaw =
    activeSlotIndex === null ? '' : computeGriffithsQgRaw(subscales, activeSlotIndex)
  let derivedGlobalMentalAgeMonths = ''
  const derivedQgQuotient = canAutoScoreQuotient
    ? computeGriffithsQgQuotient(qgRaw, chronologicalAgeMonths)
    : ''

  if (canAutoScoreNorms) {
    for (let slotIndex = 0; slotIndex < GRIFFITHS_SECTION_SLOT_LABELS.length; slotIndex += 1) {
      const band = griffithsAgeBandForSlot(slotIndex)
      if (band !== '0-2') continue

      const slotGeneralRaw = parseNumericCell(generalRawSumBySlot[slotIndex])
      if (slotGeneralRaw === null) continue

      const globalMentalAge = lookupGriffithsGeneralMentalAgeMonths(
        band,
        Math.round(slotGeneralRaw),
        null,
      )
      if (globalMentalAge === null) continue

      const formattedGlobal = formatCalculatedNumeric(globalMentalAge)
      for (const subscale of GRIFFITHS_SUBSCALES) {
        subscales[subscale.key] = {
          ...subscales[subscale.key],
          mentalAgeGlobal: setCell(subscales[subscale.key].mentalAgeGlobal, slotIndex, formattedGlobal),
        }
      }
    }

    if (activeSlotIndex !== null) {
      const activeBand = griffithsAgeBandForSlot(activeSlotIndex)
      if (activeBand === '0-2') {
        const activeGlobal = parseNumericCell(
          subscales[GRIFFITHS_SUBSCALE_KEYS[0]]?.mentalAgeGlobal[activeSlotIndex],
        )
        if (activeGlobal !== null) {
          derivedGlobalMentalAgeMonths = formatCalculatedNumeric(activeGlobal)
        }
      } else if (chronologicalAgeMonthsNumber !== null) {
        derivedGlobalMentalAgeMonths = qgRaw
      }
    }
  }

  return {
    ...age,
    subscales,
    qgQuotient: raw.qgQuotient,
    chronologicalAgeMonths,
    qgRaw,
    derivedGlobalMentalAgeMonths,
    derivedQgQuotient,
    autoScored: canAutoScoreNorms,
    autoScoreBlockReason,
  }
}

function sectionHasData(cells: GriffithsSectionCells): boolean {
  return cells.some((cell) => Boolean(cell.trim()))
}

function hasSubscaleData(subscale: GriffithsSubscaleResult | undefined): boolean {
  if (!subscale) return false
  return (
    sectionHasData(subscale.sectionI) ||
    sectionHasData(subscale.sectionII) ||
    sectionHasData(subscale.sectionIII) ||
    sectionHasData(subscale.sectionIV)
  )
}

export function hasGriffithsResultsData(results: GriffithsResults | undefined): boolean {
  if (!results) return false
  if (Boolean(results.ageYears.trim()) || Boolean(results.ageMonths.trim())) return true
  if (Boolean(results.birthDate?.trim())) return true
  if (Boolean(results.qgQuotient.trim())) return true
  return GRIFFITHS_SUBSCALE_KEYS.some((key) => hasSubscaleData(results.subscales[key]))
}

function trimCell(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

export function sanitizeGriffithsResults(value: unknown): GriffithsResults {
  const raw = (value ?? {}) as Partial<GriffithsResults> & {
    globalMentalAgeMonths?: unknown
    qgPercentile?: unknown
    qgConfidenceInterval?: unknown
    subscales?: Record<
      string,
      Partial<GriffithsSubscaleResult> & {
        percentile?: unknown
        confidenceInterval?: unknown
        zScore?: unknown
      }
    >
  }
  const subscales: Record<string, GriffithsSubscaleResult> = {}

  for (const subscale of GRIFFITHS_SUBSCALES) {
    const current = raw.subscales?.[subscale.key]

    subscales[subscale.key] = {
      sectionI: normalizeSectionCells(current?.sectionI),
      sectionII: normalizeSectionCells(current?.sectionII),
      sectionIII: normalizeSectionCells(current?.sectionIII),
      sectionIV: normalizeSectionCells(current?.sectionIV),
      developmentalAgeMonths: emptySectionCells(),
      mentalAgeGlobal: emptySectionCells(),
    }
  }

  return {
    ...resolveEvaluationAge(raw),
    subscales,
    qgQuotient: trimCell(raw.qgQuotient, 16),
  }
}

export { getGriffithsAutoScoreBlockReason }
