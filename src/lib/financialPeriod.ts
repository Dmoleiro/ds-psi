export type FinancialPeriodMode = 'calendar' | 'fiscal' | 'custom'

export const FINANCIAL_PERIOD_STORAGE_KEY = 'financial-period-mode'
export const FINANCIAL_CUSTOM_FROM_KEY = 'financial-custom-from'
export const FINANCIAL_CUSTOM_TO_KEY = 'financial-custom-to'

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function readFinancialPeriodMode(): FinancialPeriodMode {
  const stored = sessionStorage.getItem(FINANCIAL_PERIOD_STORAGE_KEY)
  if (stored === 'fiscal' || stored === 'custom') return stored
  return 'calendar'
}

export function storeFinancialPeriodMode(mode: FinancialPeriodMode) {
  sessionStorage.setItem(FINANCIAL_PERIOD_STORAGE_KEY, mode)
}

export function formatIsoDateLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function defaultCustomRange(): { from: string; to: string } {
  const today = new Date()
  const from = formatIsoDateLocal(new Date(today.getFullYear(), today.getMonth(), 1))
  const to = formatIsoDateLocal(today)
  return { from, to }
}

export function readCustomFinancialRange(): { from: string; to: string } {
  const defaults = defaultCustomRange()
  const from = sessionStorage.getItem(FINANCIAL_CUSTOM_FROM_KEY)
  const to = sessionStorage.getItem(FINANCIAL_CUSTOM_TO_KEY)
  if (!from || !to || !ISO_DATE_RE.test(from) || !ISO_DATE_RE.test(to) || to < from) {
    return defaults
  }
  return { from, to }
}

export function storeCustomFinancialRange(from: string, to: string) {
  sessionStorage.setItem(FINANCIAL_CUSTOM_FROM_KEY, from)
  sessionStorage.setItem(FINANCIAL_CUSTOM_TO_KEY, to)
}

function formatShortDateUtc(year: number, month: number, day: number): string {
  const date = new Date(Date.UTC(year, month - 1, day))
  return new Intl.DateTimeFormat('pt-PT', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
  }).format(date)
}

function formatShortDateFromIso(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  return formatShortDateUtc(year, month, day)
}

export function formatCustomFinancialPeriodRange(from: string, to: string): string {
  if (!ISO_DATE_RE.test(from) || !ISO_DATE_RE.test(to) || to < from) return ''

  const [fromYear] = from.split('-').map(Number)
  const [toYear] = to.split('-').map(Number)
  if (fromYear === toYear) {
    return `${formatShortDateFromIso(from)} – ${formatShortDateFromIso(to)} ${toYear}`
  }

  return `${formatShortDateFromIso(from)} ${fromYear} – ${formatShortDateFromIso(to)} ${toYear}`
}

export function formatFinancialPeriodRange(
  year: number,
  month: number,
  mode: FinancialPeriodMode,
  custom?: { from: string; to: string },
): string {
  if (mode === 'custom' && custom) {
    return formatCustomFinancialPeriodRange(custom.from, custom.to)
  }

  if (mode === 'calendar') {
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
    return `1 – ${formatShortDateUtc(year, month, lastDay)} ${year}`
  }

  const fromMonth = month === 1 ? 12 : month - 1
  const fromYear = month === 1 ? year - 1 : year
  return `${formatShortDateUtc(fromYear, fromMonth, 21)} – ${formatShortDateUtc(year, month, 20)} ${year}`
}

export function financialPeriodModeLabel(mode: FinancialPeriodMode): string {
  if (mode === 'calendar') return 'Mês civil'
  if (mode === 'fiscal') return 'Mês financeiro'
  return 'Período personalizado'
}

export function clampCustomRange(from: string, to: string): { from: string; to: string } {
  if (!ISO_DATE_RE.test(from) || !ISO_DATE_RE.test(to)) {
    return defaultCustomRange()
  }
  if (to < from) {
    return { from, to: from }
  }
  return { from, to }
}
