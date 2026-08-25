import { emptyEvaluationAgeFields, resolveEvaluationAge, type EvaluationAgeFields } from './chronologicalAge.js'
import {
  lookupPreEscolarNorms,
  type PreEscolarNormColumn,
  type PreEscolarNormLevel,
} from './preEscolarNorms.js'

export const PRE_ESCOLAR_SELECTION_KEY = 'prova_avaliacao_pre_escolar'

export const PRE_ESCOLAR_SUBTEST_KEYS = [
  'verbal',
  'conceitos_quantitativos',
  'memoria_auditiva',
  'constancia_de_forma',
  'posicoes_espaco',
  'orientacao_espacial',
  'coordenacao_visiomotora',
  'figura_fundo',
] as const

export type PreEscolarSubtestKey = (typeof PRE_ESCOLAR_SUBTEST_KEYS)[number]

export type PreEscolarScoringFormula = 'c_only' | 'c_minus_e'

export const PRE_ESCOLAR_SUBTESTS: ReadonlyArray<{
  key: PreEscolarSubtestKey
  label: string
  maxPoints: number
  formula: PreEscolarScoringFormula
  zeroIfErrorsGeCorrect?: boolean
  selectionKey: string
}> = [
  {
    key: 'verbal',
    label: 'Verbal',
    maxPoints: 16,
    formula: 'c_only',
    selectionKey: 'prova_pre_escolar_verbal',
  },
  {
    key: 'conceitos_quantitativos',
    label: 'Conceitos Quantitativos',
    maxPoints: 14,
    formula: 'c_only',
    selectionKey: 'prova_pre_escolar_conceitos_quantitativos',
  },
  {
    key: 'memoria_auditiva',
    label: 'Memória Auditiva',
    maxPoints: 7,
    formula: 'c_minus_e',
    zeroIfErrorsGeCorrect: true,
    selectionKey: 'prova_pre_escolar_memoria_auditiva',
  },
  {
    key: 'constancia_de_forma',
    label: 'Constância de Forma',
    maxPoints: 12,
    formula: 'c_minus_e',
    zeroIfErrorsGeCorrect: true,
    selectionKey: 'prova_pre_escolar_constancia_de_forma',
  },
  {
    key: 'posicoes_espaco',
    label: 'Posições no Espaço',
    maxPoints: 14,
    formula: 'c_minus_e',
    zeroIfErrorsGeCorrect: true,
    selectionKey: 'prova_pre_escolar_posicoes_espaco',
  },
  {
    key: 'orientacao_espacial',
    label: 'Orientação Espacial',
    maxPoints: 16,
    formula: 'c_only',
    selectionKey: 'prova_pre_escolar_orientacao_espacial',
  },
  {
    key: 'coordenacao_visiomotora',
    label: 'Coordenação Visuomotora',
    maxPoints: 12,
    formula: 'c_minus_e',
    zeroIfErrorsGeCorrect: true,
    selectionKey: 'prova_pre_escolar_coordenacao_visiomotora',
  },
  {
    key: 'figura_fundo',
    label: 'Figura-Fundo',
    maxPoints: 9,
    formula: 'c_minus_e',
    zeroIfErrorsGeCorrect: true,
    selectionKey: 'prova_pre_escolar_figura_fundo',
  },
]

export const PRE_ESCOLAR_SUBTEST_SELECTION_KEYS = PRE_ESCOLAR_SUBTESTS.map((subtest) => subtest.selectionKey)

export type PreEscolarSubtestResult = {
  correct: string
  errors: string
  points: string
  percentile: string
  stanine: string
}

export type PreEscolarResults = EvaluationAgeFields & {
  normLevel: PreEscolarNormLevel | ''
  subtests: Record<string, PreEscolarSubtestResult>
  totalPoints: string
  totalPercentile: string
  totalStanine: string
}

export type PreEscolarDerivedSubtest = PreEscolarSubtestResult & {
  derivedPoints: string
  derivedPercentile: string
  derivedStanine: string
}

export type PreEscolarDerivedResults = PreEscolarResults & {
  subtests: Record<string, PreEscolarDerivedSubtest>
  derivedTotalPoints: string
  derivedTotalPercentile: string
  derivedTotalStanine: string
}

function emptySubtestResult(): PreEscolarSubtestResult {
  return {
    correct: '',
    errors: '',
    points: '',
    percentile: '',
    stanine: '',
  }
}

export function emptyPreEscolarResults(): PreEscolarResults {
  const subtests: Record<string, PreEscolarSubtestResult> = {}
  for (const subtest of PRE_ESCOLAR_SUBTESTS) {
    subtests[subtest.key] = emptySubtestResult()
  }

  return {
    ...emptyEvaluationAgeFields(),
    normLevel: 'pre_escolar',
    subtests,
    totalPoints: '',
    totalPercentile: '',
    totalStanine: '',
  }
}

function parseNumeric(value: string | undefined): number | null {
  if (value === undefined) return null
  const trimmed = value.trim().replace(',', '.')
  if (!trimmed) return null
  const parsed = Number.parseFloat(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

function clampPoints(value: number, maxPoints: number): number {
  return Math.max(0, Math.min(maxPoints, value))
}

function computePointsFromCounts(
  correct: number | null,
  errors: number | null,
  formula: PreEscolarScoringFormula,
  maxPoints: number,
  zeroIfErrorsGeCorrect = false,
): number | null {
  if (formula === 'c_only') {
    if (correct === null) return null
    return clampPoints(correct, maxPoints)
  }

  if (correct === null && errors === null) return null
  const c = correct ?? 0
  const e = errors ?? 0
  if (zeroIfErrorsGeCorrect && e >= c) return 0
  return clampPoints(c - e, maxPoints)
}

function resolveNormLevel(value: string | undefined): PreEscolarNormLevel {
  if (value === 'primeiro_ano') return 'primeiro_ano'
  return 'pre_escolar'
}

export function getPreEscolarQualitativeLevel(percentile: string): string {
  const value = Number.parseInt(percentile, 10)
  if (!Number.isFinite(value)) return ''
  if (value >= 85) return 'Acima da média'
  if (value >= 16) return 'Na média'
  return 'Abaixo da média'
}

export function derivePreEscolarResults(raw: PreEscolarResults): PreEscolarDerivedResults {
  const normLevel = resolveNormLevel(raw.normLevel)
  const subtests: Record<string, PreEscolarDerivedSubtest> = {}
  let totalSum = 0
  let totalCount = 0

  for (const spec of PRE_ESCOLAR_SUBTESTS) {
    const current = raw.subtests[spec.key] ?? emptySubtestResult()
    const correct = parseNumeric(current.correct)
    const errors = parseNumeric(current.errors)
    const manualPoints = parseNumeric(current.points)

    const computed =
      computePointsFromCounts(
        correct,
        errors,
        spec.formula,
        spec.maxPoints,
        spec.zeroIfErrorsGeCorrect,
      ) ?? manualPoints

    let derivedPercentile = ''
    let derivedStanine = ''
    if (computed !== null) {
      const lookup = lookupPreEscolarNorms(normLevel, spec.key as PreEscolarNormColumn, computed)
      derivedPercentile = lookup.percentile
      derivedStanine = lookup.stanine
      totalSum += computed
      totalCount += 1
    }

    subtests[spec.key] = {
      ...current,
      derivedPoints: computed === null ? '' : String(computed),
      derivedPercentile,
      derivedStanine,
    }
  }

  const derivedTotalPoints = totalCount > 0 ? String(totalSum) : ''
  let derivedTotalPercentile = ''
  let derivedTotalStanine = ''
  if (derivedTotalPoints) {
    const totalLookup = lookupPreEscolarNorms(
      normLevel,
      'total',
      Number.parseFloat(derivedTotalPoints),
    )
    if (totalLookup) {
      derivedTotalPercentile = totalLookup.percentile
      derivedTotalStanine = totalLookup.stanine
    }
  }

  return {
    ...resolveEvaluationAge(raw),
    normLevel,
    subtests,
    totalPoints: raw.totalPoints,
    totalPercentile: raw.totalPercentile,
    totalStanine: raw.totalStanine,
    derivedTotalPoints,
    derivedTotalPercentile,
    derivedTotalStanine,
  }
}

export function hasPreEscolarResultsData(results: PreEscolarResults | undefined): boolean {
  if (!results) return false
  if ((results.birthDate ?? '').trim() || (results.evaluationDate ?? '').trim()) return true
  if (results.ageYears.trim() || results.ageMonths.trim()) return true
  if (results.normLevel && results.normLevel !== 'pre_escolar') return true

  for (const subtest of PRE_ESCOLAR_SUBTESTS) {
    const entry = results.subtests[subtest.key]
    if (!entry) continue
    if (
      entry.correct.trim() ||
      entry.errors.trim() ||
      entry.points.trim() ||
      entry.percentile.trim() ||
      entry.stanine.trim()
    ) {
      return true
    }
  }

  return Boolean(
    results.totalPoints.trim() ||
      results.totalPercentile.trim() ||
      results.totalStanine.trim(),
  )
}

export function sanitizePreEscolarResults(value: unknown): PreEscolarResults {
  const base = emptyPreEscolarResults()
  if (!value || typeof value !== 'object') return base

  const input = value as Partial<PreEscolarResults>
  const subtests: Record<string, PreEscolarSubtestResult> = { ...base.subtests }

  if (input.subtests && typeof input.subtests === 'object') {
    for (const spec of PRE_ESCOLAR_SUBTESTS) {
      const entry = (input.subtests as Record<string, unknown>)[spec.key]
      if (!entry || typeof entry !== 'object') continue
      const row = entry as Partial<PreEscolarSubtestResult>
      subtests[spec.key] = {
        correct: typeof row.correct === 'string' ? row.correct.slice(0, 8) : '',
        errors: typeof row.errors === 'string' ? row.errors.slice(0, 8) : '',
        points: typeof row.points === 'string' ? row.points.slice(0, 8) : '',
        percentile: typeof row.percentile === 'string' ? row.percentile.slice(0, 8) : '',
        stanine: typeof row.stanine === 'string' ? row.stanine.slice(0, 4) : '',
      }
    }
  }

  const normLevel =
    input.normLevel === 'primeiro_ano' || input.normLevel === 'pre_escolar'
      ? input.normLevel
      : base.normLevel

  return derivePreEscolarResults({
    ...resolveEvaluationAge(input),
    normLevel,
    subtests,
    totalPoints: typeof input.totalPoints === 'string' ? input.totalPoints.slice(0, 8) : '',
    totalPercentile:
      typeof input.totalPercentile === 'string' ? input.totalPercentile.slice(0, 8) : '',
    totalStanine: typeof input.totalStanine === 'string' ? input.totalStanine.slice(0, 4) : '',
  })
}
