import { piccaVolumeLabel, resolvePiccaModuleVolume } from './piccaVolumes'

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
] as const

export const THERAPIST_ONLY_PICCA_MODULE_IDS = new Set<string>([
  'picca-vol1-mod7',
  'picca-vol1-mod8',
  'picca-vol1-mod9',
  'picca-vol1-mod10',
])

export type PiccaModuleId = (typeof PICCA_MODULE_IDS)[number]

export function isPiccaModuleId(value: string): value is PiccaModuleId {
  return (PICCA_MODULE_IDS as readonly string[]).includes(value)
}

export function isTherapistOnlyPiccaModule(moduleId: string): boolean {
  return THERAPIST_ONLY_PICCA_MODULE_IDS.has(moduleId)
}

export function piccaModuleLabel(moduleId: string, title: string): string {
  const match = moduleId.match(/mod(\d+)/)
  const num = match?.[1]
  return num ? `Módulo ${num} — ${title}` : title
}

export function piccaFullModuleLabel(moduleId: string, title: string, volume?: number): string {
  const vol = volume ?? resolvePiccaModuleVolume({ moduleId }).volume
  return `${piccaVolumeLabel(vol)} · ${piccaModuleLabel(moduleId, title)}`
}

export { piccaVolumeLabel, groupPiccaModulesByVolume, resolvePiccaModuleVolume } from './piccaVolumes'
