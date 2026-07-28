import type { ComponentType } from 'react'
import { defaultPiccaModulo1Answers } from './modules/piccaModulo1'
import { PiccaModulo1Form } from './modules/PiccaModulo1Form'
import { defaultPiccaModulo2Answers } from './modules/piccaModulo2'
import { PiccaModulo2Form } from './modules/PiccaModulo2Form'
import { defaultPiccaModulo3Answers } from './modules/piccaModulo3'
import { PiccaModulo3Form } from './modules/PiccaModulo3Form'
import { defaultPiccaModulo4Answers } from './modules/piccaModulo4'
import { PiccaModulo4Form } from './modules/PiccaModulo4Form'
import { defaultPiccaModulo5Answers } from './modules/piccaModulo5'
import { PiccaModulo5Form } from './modules/PiccaModulo5Form'
import { defaultPiccaModulo6Answers } from './modules/piccaModulo6'
import { PiccaModulo6Form } from './modules/PiccaModulo6Form'
import { defaultPiccaModulo7Answers } from './modules/piccaModulo7'
import { PiccaModulo7Form } from './modules/PiccaModulo7Form'
import { defaultPiccaModulo8Answers } from './modules/piccaModulo8'
import { PiccaModulo8Form } from './modules/PiccaModulo8Form'
import { defaultPiccaModulo9Answers } from './modules/piccaModulo9'
import { PiccaModulo9Form } from './modules/PiccaModulo9Form'
import { defaultPiccaModulo10Answers } from './modules/piccaModulo10'
import { PiccaModulo10Form } from './modules/PiccaModulo10Form'
import { piccaVol6ModuleRegistry } from './modules/vol6/vol6Registry'

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
  'picca-vol1-mod1': {
    defaultAnswers: defaultPiccaModulo1Answers,
    Form: PiccaModulo1Form,
  },
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
  'picca-vol1-mod5': {
    defaultAnswers: defaultPiccaModulo5Answers,
    Form: PiccaModulo5Form,
  },
  'picca-vol1-mod6': {
    defaultAnswers: defaultPiccaModulo6Answers,
    Form: PiccaModulo6Form,
  },
  'picca-vol1-mod7': {
    defaultAnswers: defaultPiccaModulo7Answers,
    Form: PiccaModulo7Form,
  },
  'picca-vol1-mod8': {
    defaultAnswers: defaultPiccaModulo8Answers,
    Form: PiccaModulo8Form,
  },
  'picca-vol1-mod9': {
    defaultAnswers: defaultPiccaModulo9Answers,
    Form: PiccaModulo9Form,
  },
  'picca-vol1-mod10': {
    defaultAnswers: defaultPiccaModulo10Answers,
    Form: PiccaModulo10Form,
  },
  ...piccaVol6ModuleRegistry,
}

export function getPiccaModuleDefaults(moduleId: string): Record<string, unknown> {
  return piccaModuleRegistry[moduleId]?.defaultAnswers() ?? {}
}

export function hasPiccaModuleRenderer(moduleId: string): boolean {
  return moduleId in piccaModuleRegistry
}
