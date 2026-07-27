export const PICCA_INTERACTIVE_FORM_IDS = [
  'picca-interactive-sono',
  'picca-interactive-estrategias',
] as const

export type PiccaInteractiveFormId = (typeof PICCA_INTERACTIVE_FORM_IDS)[number]

export function isPiccaInteractiveFormId(value: string): value is PiccaInteractiveFormId {
  return (PICCA_INTERACTIVE_FORM_IDS as readonly string[]).includes(value)
}

export function sortPiccaInteractiveFormIds(formIds: string[]): string[] {
  const order = new Map<string, number>(
    PICCA_INTERACTIVE_FORM_IDS.map((id, index) => [id, index]),
  )
  return [...formIds].sort((a, b) => (order.get(a) ?? 999) - (order.get(b) ?? 999))
}
