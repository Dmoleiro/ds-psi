export const PICCA_INTERACTIVE_FORM_IDS = [
  'picca-interactive-sono',
  'picca-interactive-estrategias',
  'picca-interactive-kit-rotinas',
  'picca-interactive-kit-sono',
  'picca-interactive-kit-birras',
  'picca-interactive-kit-autonomia',
  'picca-interactive-kit-flexibilidade',
  'picca-interactive-kit-conquistas',
  'picca-interactive-kit-comportamentos',
  'picca-interactive-portage',
] as const

export type PiccaInteractiveFormId = (typeof PICCA_INTERACTIVE_FORM_IDS)[number]

export function isPiccaInteractiveFormId(value: string): value is PiccaInteractiveFormId {
  return (PICCA_INTERACTIVE_FORM_IDS as readonly string[]).includes(value)
}

export function piccaInteractiveFormLabel(_formId: string, title: string): string {
  return title
}

export function sortPiccaInteractiveFormIds(formIds: string[]): string[] {
  const order = new Map<string, number>(
    PICCA_INTERACTIVE_FORM_IDS.map((id, index) => [id, index]),
  )
  return [...formIds].sort((a, b) => (order.get(a) ?? 999) - (order.get(b) ?? 999))
}
