export const PICCA_INTERACTIVE_FORM_IDS = [
  'picca-interactive-sono',
  'picca-interactive-estrategias',
] as const

export type PiccaInteractiveFormId = (typeof PICCA_INTERACTIVE_FORM_IDS)[number]

export function isPiccaInteractiveFormId(value: string): value is PiccaInteractiveFormId {
  return (PICCA_INTERACTIVE_FORM_IDS as readonly string[]).includes(value)
}

export function piccaInteractiveFormLabel(_formId: string, title: string): string {
  return title
}
