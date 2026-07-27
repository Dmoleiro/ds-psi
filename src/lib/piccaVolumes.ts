const MODULE_ID_RE = /^picca-vol(\d+)-mod(\d+)$/

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'] as const

export function parsePiccaModuleId(moduleId: string): { volume: number; moduleNumber: number } | null {
  const match = moduleId.match(MODULE_ID_RE)
  if (!match) return null
  return { volume: Number(match[1]), moduleNumber: Number(match[2]) }
}

export function piccaVolumeLabel(volume: number): string {
  return `Volume ${ROMAN[volume] ?? volume}`
}

type ModuleVolumeFields = {
  volume?: number
  moduleNumber?: number
  id?: string
  moduleId?: string
}

export function resolvePiccaModuleVolume(mod: ModuleVolumeFields): {
  volume: number
  moduleNumber: number
} {
  if (mod.volume != null && mod.moduleNumber != null) {
    return { volume: mod.volume, moduleNumber: mod.moduleNumber }
  }
  const parsed = parsePiccaModuleId(mod.id ?? mod.moduleId ?? '')
  if (parsed) return parsed
  return { volume: 1, moduleNumber: 0 }
}

export type PiccaVolumeGroup<T> = {
  volume: number
  label: string
  modules: T[]
}

export function groupPiccaModulesByVolume<T extends ModuleVolumeFields>(
  modules: T[],
): PiccaVolumeGroup<T>[] {
  const byVolume = new Map<number, T[]>()

  for (const mod of modules) {
    const { volume } = resolvePiccaModuleVolume(mod)
    const list = byVolume.get(volume) ?? []
    list.push(mod)
    byVolume.set(volume, list)
  }

  return [...byVolume.entries()]
    .sort(([a], [b]) => a - b)
    .map(([volume, groupModules]) => ({
      volume,
      label: piccaVolumeLabel(volume),
      modules: [...groupModules].sort(
        (a, b) =>
          resolvePiccaModuleVolume(a).moduleNumber - resolvePiccaModuleVolume(b).moduleNumber,
      ),
    }))
}
