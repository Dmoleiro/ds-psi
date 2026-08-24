export const AGE_INPUT_MODES = [
  { value: 'years_months', label: 'Anos e meses' },
  { value: 'dates', label: 'Datas (nascimento e avaliação)' },
] as const

export type AgeInputMode = (typeof AGE_INPUT_MODES)[number]['value']

export type EvaluationAgeFields = {
  ageInputMode: AgeInputMode
  ageYears: string
  ageMonths: string
  birthDate: string
  evaluationDate: string
}

export type ChronologicalAge = {
  years: number
  months: number
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

export function emptyEvaluationAgeFields(): EvaluationAgeFields {
  return {
    ageInputMode: 'years_months',
    ageYears: '',
    ageMonths: '',
    birthDate: '',
    evaluationDate: '',
  }
}

export function sanitizeAgeInputMode(value: unknown): AgeInputMode {
  return value === 'dates' ? 'dates' : 'years_months'
}

export function parseIsoDateParts(value: string): { y: number; m: number; d: number } | null {
  const match = ISO_DATE.exec(value.trim())
  if (!match) return null
  const y = Number(match[1])
  const m = Number(match[2])
  const d = Number(match[3])
  const date = new Date(Date.UTC(y, m - 1, d))
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) {
    return null
  }
  return { y, m, d }
}

export function sanitizeIsoDate(value: unknown): string {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim().slice(0, 10)
  return parseIsoDateParts(trimmed) ? trimmed : ''
}

export function isEvaluationBeforeBirth(birthDate: string, evaluationDate: string): boolean {
  const birth = parseIsoDateParts(birthDate)
  const evaluation = parseIsoDateParts(evaluationDate)
  if (!birth || !evaluation) return false
  if (evaluation.y !== birth.y) return evaluation.y < birth.y
  if (evaluation.m !== birth.m) return evaluation.m < birth.m
  return evaluation.d < birth.d
}

export function chronologicalAgeYearsMonths(
  birthDate: string,
  evaluationDate: string,
): ChronologicalAge | null {
  const birth = parseIsoDateParts(birthDate)
  const evaluation = parseIsoDateParts(evaluationDate)
  if (!birth || !evaluation) return null

  let years = evaluation.y - birth.y
  let months = evaluation.m - birth.m
  const days = evaluation.d - birth.d
  if (days < 0) months -= 1
  if (months < 0) {
    years -= 1
    months += 12
  }
  if (years < 0) return null
  return { years, months }
}

export function resolveEvaluationAge(
  input: Partial<EvaluationAgeFields> | null | undefined,
): EvaluationAgeFields {
  const ageInputMode = sanitizeAgeInputMode(input?.ageInputMode)
  const birthDate = sanitizeIsoDate(input?.birthDate ?? '')
  const evaluationDate = sanitizeIsoDate(input?.evaluationDate ?? '')
  let ageYears = typeof input?.ageYears === 'string' ? input.ageYears : ''
  let ageMonths = typeof input?.ageMonths === 'string' ? input.ageMonths : ''

  if (ageInputMode === 'dates') {
    const age = chronologicalAgeYearsMonths(birthDate, evaluationDate)
    if (age) {
      ageYears = String(age.years)
      ageMonths = String(age.months)
    }
  }

  return { ageInputMode, ageYears, ageMonths, birthDate, evaluationDate }
}
