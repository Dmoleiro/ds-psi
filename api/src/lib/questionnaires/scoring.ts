import type { QuestionnaireDefinition, QuestionnaireScores, ScoringRule } from './types.js'

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function sumItems(answers: Record<string, unknown>, itemIds: string[], reverseIds: Set<string> = new Set()): number {
  let total = 0
  for (const id of itemIds) {
    const raw = asNumber(answers[id])
    if (raw === null) continue
    if (reverseIds.has(id)) {
      const max = 2
      total += max - raw
    } else {
      total += raw
    }
  }
  return total
}

const MCHAT_FAIL_WHEN_NO = new Set([1, 2, 3, 4, 5, 6, 7, 9, 10, 12, 13, 14, 15, 16, 17, 19, 21, 22, 23])
const MCHAT_FAIL_WHEN_YES = new Set([11, 18, 20])

/** Inventário de Síndrome de Asperger — subscale item ranges (inclusive). */
const INVENTARIO_ASPERGER_SUBSCALES: Record<string, [number, number]> = {
  interacao_social: [1, 21],
  comunicacao: [22, 43],
  padroes_comportamento: [44, 54],
  motora: [55, 60],
  sensibilidade_sensorial: [61, 75],
}

function sumInventarioAspergerRange(answers: Record<string, unknown>, start: number, end: number): number {
  let total = 0
  for (let n = start; n <= end; n++) {
    const value = asNumber(answers[`item_${String(n).padStart(2, '0')}`])
    if (value !== null) total += value
  }
  return total
}
const RCMAS_LIE_ITEMS = new Set([4, 8, 12, 16, 20, 24, 28, 32, 36])

const OBQ_RT = [1, 5, 6, 8, 15, 16, 17, 19, 22, 23, 29, 33, 34, 36, 39, 41]
const OBQ_PC = [2, 3, 4, 9, 10, 11, 12, 14, 18, 20, 25, 26, 31, 37, 40, 43]
const OBQ_ICT = [7, 13, 21, 24, 27, 28, 30, 32, 35, 38, 42, 44]

const CDI_REVERSE_ITEMS = new Set([2, 3, 4, 7, 8, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 27])

const IEP_SUBSCALES: Record<string, number[]> = {
  A: [1, 8, 15, 22, 29, 36],
  B: [2, 9, 16, 23, 30, 37],
  C: [3, 10, 17, 24, 31, 38],
  D: [4, 11, 18, 25, 32, 39],
  E: [5, 12, 19, 26, 33, 40],
  F: [6, 13, 20, 27, 34, 41],
  G: [7, 14, 21, 28, 35, 42],
}

const SCARED_SUBSCALES = {
  panic: [1, 6, 9, 12, 15, 18, 19, 22, 24, 27, 30, 34, 38],
  generalized: [5, 7, 14, 21, 23, 28, 33, 35, 37],
  separation: [4, 8, 13, 16, 20, 25, 29, 31],
  social: [3, 10, 26, 32, 39, 40, 41],
  school: [2, 11, 17, 36],
}

function computeRuleScores(rule: ScoringRule, answers: Record<string, unknown>): QuestionnaireScores {
  switch (rule.type) {
    case 'sum_subscales': {
      const scores: QuestionnaireScores = {}
      for (const subscale of rule.subscales) {
        const reverse = new Set(subscale.reverseItemIds ?? [])
        scores[subscale.id] = sumItems(answers, subscale.itemIds, reverse)
      }
      if (rule.totalLabel) {
        const included = rule.subscales.filter(
          (s) => !(rule.totalExcludeSubscaleIds ?? []).includes(s.id),
        )
        scores.total = included.reduce((sum, s) => sum + (scores[s.id] ?? 0), 0)
      }
      return scores
    }
    case 'mchat': {
      let failed = 0
      for (let i = 1; i <= 23; i++) {
        const value = asNumber(answers[`q${i}`])
        if (value === null) continue
        const isYes = value === 1
        if ((MCHAT_FAIL_WHEN_NO.has(i) && !isYes) || (MCHAT_FAIL_WHEN_YES.has(i) && isYes)) {
          failed += 1
        }
      }
      return { failed_items: failed, at_risk: failed >= 3 ? 1 : 0 }
    }
    case 'inventario_asperger': {
      const scores: QuestionnaireScores = {}
      let total = 0
      for (const [key, [start, end]] of Object.entries(INVENTARIO_ASPERGER_SUBSCALES)) {
        const subtotal = sumInventarioAspergerRange(answers, start, end)
        scores[key] = subtotal
        total += subtotal
      }
      scores.total = total
      return scores
    }
    case 'rcmas': {
      let anxiety = 0
      let lie = 0
      for (let i = 1; i <= 37; i++) {
        const value = asNumber(answers[`q${i}`])
        if (value === null) continue
        const isYes = value === 1
        if (RCMAS_LIE_ITEMS.has(i)) {
          if (isYes) lie += 1
        } else if (isYes) {
          anxiety += 1
        }
      }
      return { anxiety_total: anxiety, lie_scale: lie }
    }
    case 'cdi': {
      let total = 0
      for (let i = 1; i <= 27; i++) {
        const value = asNumber(answers[`q${i}`])
        if (value === null) continue
        total += CDI_REVERSE_ITEMS.has(i) ? 2 - value : value
      }
      return { depression_total: total }
    }
    case 'iep': {
      const scores: QuestionnaireScores = {}
      let positive = 0
      let negative = 0
      for (const [key, items] of Object.entries(IEP_SUBSCALES)) {
        const subtotal = sumItems(
          answers,
          items.map((n) => `q${n}`),
        )
        scores[key] = subtotal
        if (key === 'A' || key === 'B') positive += subtotal
        else negative += subtotal
      }
      scores.iep_index = positive - negative
      return scores
    }
    case 'obq44': {
      const sumGroup = (nums: number[]) =>
        nums.reduce((sum, n) => sum + (asNumber(answers[`q${n}`]) ?? 0), 0)
      return {
        rt: sumGroup(OBQ_RT),
        pc: sumGroup(OBQ_PC),
        ict: sumGroup(OBQ_ICT),
        total: sumGroup([...OBQ_RT, ...OBQ_PC, ...OBQ_ICT]),
      }
    }
    case 'cars_total': {
      let total = 0
      for (let i = 1; i <= 15; i++) {
        total += asNumber(answers[`q${i}`]) ?? 0
      }
      return { cars_total: total }
    }
    case 'scared': {
      const scores: QuestionnaireScores = { total: 0 }
      for (const [key, items] of Object.entries(SCARED_SUBSCALES)) {
        scores[key] = sumItems(
          answers,
          items.map((n) => `q${n}`),
        )
      }
      scores.total = Object.values(SCARED_SUBSCALES)
        .flat()
        .reduce((sum, n) => sum + (asNumber(answers[`q${n}`]) ?? 0), 0)
      return scores
    }
    case 'custom':
      return rule.compute(answers)
    default:
      return {}
  }
}

export function computeQuestionnaireScores(
  definition: QuestionnaireDefinition,
  answers: Record<string, unknown>,
): QuestionnaireScores {
  if (!definition.scoring) {
    const total = definition.items.reduce((sum, item) => sum + (asNumber(answers[item.id]) ?? 0), 0)
    return { total }
  }
  if (definition.scoring.type === 'custom') {
    return definition.scoring.compute(answers)
  }
  if (definition.scoring.type === 'scared') {
    return computeRuleScores({ type: 'scared' }, answers)
  }
  return computeRuleScores(definition.scoring, answers)
}

export function attachScoresToAnswers(
  definition: QuestionnaireDefinition,
  answers: Record<string, unknown>,
): Record<string, unknown> {
  const scores = computeQuestionnaireScores(definition, answers)
  return {
    ...answers,
    _scores: scores,
  }
}
