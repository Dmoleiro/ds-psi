export type FinancialPeriodMode = 'calendar' | 'fiscal' | 'custom'

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

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

export function parseCustomFinancialPeriod(from: string, to: string): FinancialPeriodRange | null {
  if (!ISO_DATE_RE.test(from) || !ISO_DATE_RE.test(to) || to < from) {
    return null
  }

  const [fromYear, fromMonth, fromDay] = from.split('-').map(Number)
  const [toYear, toMonth, toDay] = to.split('-').map(Number)

  return {
    from: new Date(Date.UTC(fromYear, fromMonth - 1, fromDay)),
    to: new Date(Date.UTC(toYear, toMonth - 1, toDay)),
    appointmentsEndExclusive: new Date(Date.UTC(toYear, toMonth - 1, toDay + 1)),
  }
}

export function formatCustomFinancialPeriodRange(from: string, to: string): string {
  const range = parseCustomFinancialPeriod(from, to)
  if (!range) return ''

  const endYear = range.to.getUTCFullYear()
  const startYear = range.from.getUTCFullYear()
  if (startYear === endYear) {
    return `${formatShortDate(range.from)} – ${formatShortDate(range.to)} ${endYear}`
  }

  return `${formatShortDate(range.from)} ${startYear} – ${formatShortDate(range.to)} ${endYear}`
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

  const range = parseFinancialPeriod(year, month, mode)
  if (!range) return ''

  if (mode === 'calendar') {
    return `1 – ${range.to.getUTCDate()} ${formatShortDate(range.to)} ${year}`
  }

  const endYear = range.to.getUTCFullYear()
  return `${formatShortDate(range.from)} – ${formatShortDate(range.to)} ${endYear}`
}
