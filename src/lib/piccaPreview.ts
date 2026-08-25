export function piccaModulePreviewHref(moduleId: string): string {
  const base = import.meta.env.BASE_URL ?? '/'
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
  const path = `/backoffice/picca/preview/module/${encodeURIComponent(moduleId)}`
  if (!normalizedBase || normalizedBase === '/') return path
  return `${normalizedBase}${path}`
}

export function piccaInteractivePreviewHref(formId: string): string {
  const base = import.meta.env.BASE_URL ?? '/'
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
  const path = `/backoffice/picca/preview/interactive/${encodeURIComponent(formId)}`
  if (!normalizedBase || normalizedBase === '/') return path
  return `${normalizedBase}${path}`
}
