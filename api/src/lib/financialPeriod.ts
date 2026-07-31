export type FinancialPeriodMode = 'calendar' | 'fiscal'

export type FinancialPeriodRange = {
  from: Date
  to: Date
  appointmentsEndExclusive: Date
}

export function parseFinancialPeriod(
  year: number,
  month: number,
  mode: FinancialPeriodMode = 'calendar',
): FinancialPeriodRange | null {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return null
  }

  if (mode === 'calendar') {
    return {
      from: new Date(Date.UTC(year, month - 1, 1)),
      to: new Date(Date.UTC(year, month, 0)),
      appointmentsEndExclusive: new Date(Date.UTC(year, month, 1)),
    }
  }

  return {
    from: new Date(Date.UTC(year, month - 2, 21)),
    to: new Date(Date.UTC(year, month - 1, 20)),
    appointmentsEndExclusive: new Date(Date.UTC(year, month - 1, 21)),
  }
}

function formatShortDate(date: Date): string {
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
  const range = parseFinancialPeriod(year, month, mode)
  if (!range) return ''

  if (mode === 'calendar') {
    return `1 – ${range.to.getUTCDate()} ${formatShortDate(range.to)} ${year}`
  }

  const endYear = range.to.getUTCFullYear()
  return `${formatShortDate(range.from)} – ${formatShortDate(range.to)} ${endYear}`
}
