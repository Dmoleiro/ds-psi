import type { ComponentType } from 'react'
import type { PiccaModuleRendererProps } from '../../moduleRegistry'
import { defaultPiccaVol7DisorderAnswers } from './piccaVol7Answers'
import { PICCA_VOL7_DISORDERS } from './piccaVol7Content'
import { PiccaVol7DisorderForm } from './PiccaVol7DisorderForm'

type Vol7ModuleDefinition = {
  defaultAnswers: () => Record<string, unknown>
  Form: ComponentType<PiccaModuleRendererProps>
}

function createDisorderForm(number: number): ComponentType<PiccaModuleRendererProps> {
  return function Vol7DisorderModuleForm(props: PiccaModuleRendererProps) {
    return <PiccaVol7DisorderForm {...props} disorderNumber={number} />
  }
}

export const piccaVol7ModuleRegistry: Record<string, Vol7ModuleDefinition> = Object.fromEntries(
  PICCA_VOL7_DISORDERS.map((disorder) => [
    disorder.moduleId,
    {
      defaultAnswers: () => defaultPiccaVol7DisorderAnswers(disorder.number),
      Form: createDisorderForm(disorder.number),
    },
  ]),
)
