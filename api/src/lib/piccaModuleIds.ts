export const PICCA_MODULE_IDS = [
  'picca-vol1-mod2',
  'picca-vol1-mod3',
  'picca-vol1-mod4',
] as const

/** Titles/ordering for backoffice — public catalogue: src/content/site.pt.ts `piccaCatalog`. */

export type PiccaModuleId = (typeof PICCA_MODULE_IDS)[number]

export function isPiccaModuleId(value: string): value is PiccaModuleId {
  return (PICCA_MODULE_IDS as readonly string[]).includes(value)
}

export function sortPiccaModuleIds(moduleIds: string[]): string[] {
  const order = new Map<string, number>(PICCA_MODULE_IDS.map((id, index) => [id, index]))
  return [...moduleIds].sort((a, b) => (order.get(a) ?? 999) - (order.get(b) ?? 999))
}
