import type { ComponentType } from 'react'
import { defaultPiccaModulo2Answers } from './modules/piccaModulo2'
import { PiccaModulo2Form } from './modules/PiccaModulo2Form'
import { defaultPiccaModulo3Answers } from './modules/piccaModulo3'
import { PiccaModulo3Form } from './modules/PiccaModulo3Form'
import { defaultPiccaModulo4Answers } from './modules/piccaModulo4'
import { PiccaModulo4Form } from './modules/PiccaModulo4Form'

export type PiccaModuleRendererProps = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

type PiccaModuleDefinition = {
  defaultAnswers: () => Record<string, unknown>
  Form: ComponentType<PiccaModuleRendererProps>
}

export const piccaModuleRegistry: Record<string, PiccaModuleDefinition> = {
  'picca-vol1-mod2': {
    defaultAnswers: defaultPiccaModulo2Answers,
    Form: PiccaModulo2Form,
  },
  'picca-vol1-mod3': {
    defaultAnswers: defaultPiccaModulo3Answers,
    Form: PiccaModulo3Form,
  },
  'picca-vol1-mod4': {
    defaultAnswers: defaultPiccaModulo4Answers,
    Form: PiccaModulo4Form,
  },
}

export function getPiccaModuleDefaults(moduleId: string): Record<string, unknown> {
  return piccaModuleRegistry[moduleId]?.defaultAnswers() ?? {}
}

export function hasPiccaModuleRenderer(moduleId: string): boolean {
  return moduleId in piccaModuleRegistry
}
