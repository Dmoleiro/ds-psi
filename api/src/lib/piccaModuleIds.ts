export const PICCA_MODULE_IDS = [
  'picca-vol1-mod1',
  'picca-vol1-mod2',
  'picca-vol1-mod3',
  'picca-vol1-mod4',
  'picca-vol1-mod5',
  'picca-vol1-mod6',
  'picca-vol1-mod7',
  'picca-vol1-mod8',
  'picca-vol1-mod9',
  'picca-vol1-mod10',
  'picca-vol6-mod1',
  'picca-vol6-mod2',
  'picca-vol6-mod3',
  'picca-vol6-mod4',
  'picca-vol6-mod5',
  'picca-vol6-mod6',
  'picca-vol6-mod7',
  'picca-vol6-mod8',
  'picca-vol6-mod9',
  'picca-vol6-mod10',
  'picca-vol6-mod11',
  'picca-vol6-mod12',
  'picca-vol6-mod13',
  'picca-vol6-mod14',
] as const

export const THERAPIST_ONLY_PICCA_MODULE_IDS = new Set<string>([
  'picca-vol1-mod7',
  'picca-vol1-mod8',
  'picca-vol1-mod9',
  'picca-vol1-mod10',
  'picca-vol6-mod1',
  'picca-vol6-mod2',
  'picca-vol6-mod3',
  'picca-vol6-mod4',
  'picca-vol6-mod5',
  'picca-vol6-mod6',
  'picca-vol6-mod7',
  'picca-vol6-mod8',
  'picca-vol6-mod9',
  'picca-vol6-mod10',
  'picca-vol6-mod11',
  'picca-vol6-mod12',
  'picca-vol6-mod13',
  'picca-vol6-mod14',
])

/** Titles/ordering for backoffice — public catalogue: src/content/site.pt.ts `piccaCatalog`. */

export type PiccaModuleId = (typeof PICCA_MODULE_IDS)[number]

export function isPiccaModuleId(value: string): value is PiccaModuleId {
  return (PICCA_MODULE_IDS as readonly string[]).includes(value)
}

export function isTherapistOnlyPiccaModule(moduleId: string): boolean {
  return THERAPIST_ONLY_PICCA_MODULE_IDS.has(moduleId)
}

export function sortPiccaModuleIds(moduleIds: string[]): string[] {
  const order = new Map<string, number>(PICCA_MODULE_IDS.map((id, index) => [id, index]))
  return [...moduleIds].sort((a, b) => (order.get(a) ?? 999) - (order.get(b) ?? 999))
}
