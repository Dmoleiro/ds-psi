import type { ComponentType } from 'react'
import type { PiccaModuleRendererProps } from '../../moduleRegistry'
import {
  defaultPiccaVol6DisorderAnswers,
  defaultPiccaVol6SinteseAnswers,
} from './piccaVol6Answers'
import { PICCA_VOL6_DISORDERS } from './piccaVol6Content'
import { PiccaVol6DisorderForm } from './PiccaVol6DisorderForm'
import { PiccaVol6SinteseForm } from './PiccaVol6SinteseForm'

type Vol6ModuleDefinition = {
  defaultAnswers: () => Record<string, unknown>
  Form: ComponentType<PiccaModuleRendererProps>
}

function createDisorderForm(number: number): ComponentType<PiccaModuleRendererProps> {
  return function Vol6DisorderModuleForm(props: PiccaModuleRendererProps) {
    return <PiccaVol6DisorderForm {...props} disorderNumber={number} />
  }
}

export const piccaVol6ModuleRegistry: Record<string, Vol6ModuleDefinition> = Object.fromEntries(
  PICCA_VOL6_DISORDERS.map((disorder) => {
    if (disorder.number === 14) {
      return [
        disorder.moduleId,
        {
          defaultAnswers: defaultPiccaVol6SinteseAnswers,
          Form: PiccaVol6SinteseForm,
        },
      ]
    }
    return [
      disorder.moduleId,
      {
        defaultAnswers: () => defaultPiccaVol6DisorderAnswers(disorder.number),
        Form: createDisorderForm(disorder.number),
      },
    ]
  }),
)
