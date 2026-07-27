import type { FormStatus } from '@prisma/client'

type ModuleProgress = { status: FormStatus }

/** Index of the module the patient may currently fill (first not yet submitted). */
export function getCurrentPiccaModuleIndex(modules: ModuleProgress[]): number {
  const idx = modules.findIndex((m) => m.status !== 'submitted')
  return idx === -1 ? modules.length : idx
}

export function canPatientAccessPiccaModule(modules: ModuleProgress[], moduleIndex: number): boolean {
  const mod = modules[moduleIndex]
  if (!mod) return false
  if (mod.status === 'submitted') return true
  return moduleIndex === getCurrentPiccaModuleIndex(modules)
}

export function isPiccaModuleReadOnly(modules: ModuleProgress[], moduleIndex: number): boolean {
  return modules[moduleIndex]?.status === 'submitted'
}
