export type FinancialPeriodMode = 'calendar' | 'fiscal'

export const FINANCIAL_PERIOD_STORAGE_KEY = 'financial-period-mode'

export function readFinancialPeriodMode(): FinancialPeriodMode {
  const stored = sessionStorage.getItem(FINANCIAL_PERIOD_STORAGE_KEY)
  return stored === 'fiscal' ? 'fiscal' : 'calendar'
}

export function storeFinancialPeriodMode(mode: FinancialPeriodMode) {
  sessionStorage.setItem(FINANCIAL_PERIOD_STORAGE_KEY, mode)
}

function formatShortDateUtc(year: number, month: number, day: number): string {
  const date = new Date(Date.UTC(year, month - 1, day))
  return new Intl.DateTimeFormat('pt-PT', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export function formatFinancialPeriodRange(
  year: number,
  month: number,
  mode: FinancialPeriodMode,
): string {
  if (mode === 'calendar') {
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
    return `1 – ${formatShortDateUtc(year, month, lastDay)} ${year}`
  }

  const fromMonth = month === 1 ? 12 : month - 1
  const fromYear = month === 1 ? year - 1 : year
  return `${formatShortDateUtc(fromYear, fromMonth, 21)} – ${formatShortDateUtc(year, month, 20)} ${year}`
}

export function financialPeriodModeLabel(mode: FinancialPeriodMode): string {
  return mode === 'calendar' ? 'Mês civil' : 'Mês financeiro'
}
