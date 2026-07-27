import { piccaVolumeLabel, resolvePiccaModuleVolume } from './piccaVolumes'

export const PICCA_MODULE_IDS = [
  'picca-vol1-mod2',
  'picca-vol1-mod3',
  'picca-vol1-mod4',
] as const

export type PiccaModuleId = (typeof PICCA_MODULE_IDS)[number]

export function isPiccaModuleId(value: string): value is PiccaModuleId {
  return (PICCA_MODULE_IDS as readonly string[]).includes(value)
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
