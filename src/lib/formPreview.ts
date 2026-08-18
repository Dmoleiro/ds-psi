import { emptyFichaInscricaoForm } from '../components/forms/FichaInscricaoForm'
import { emptyQueixaInicialForm } from '../components/forms/QueixaInicialForm'

export function formPreviewHref(formId: string): string {
  const base = import.meta.env.BASE_URL ?? '/'
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
  const path = `/backoffice/forms/preview/${encodeURIComponent(formId)}`
  if (!normalizedBase || normalizedBase === '/') return path
  return `${normalizedBase}${path}`
}

export function getEmptyFormPreviewValues(formId: string): Record<string, unknown> {
  if (formId === 'ficha-inscricao') {
    return emptyFichaInscricaoForm() as Record<string, unknown>
  }
  if (formId === 'queixa-inicial') {
    return emptyQueixaInicialForm() as Record<string, unknown>
  }
  return {}
}
