import type { ComponentType } from 'react'
import type { PiccaModuleRendererProps } from '../../moduleRegistry'
import { defaultPiccaVol7DisorderAnswers } from './piccaVol7Answers'
import { defaultPiccaVol7ManualReferenceAnswers } from './piccaVol7ManualAnswers'
import { defaultPiccaVol7SinteseAnswers } from './piccaVol7SinteseAnswers'
import { PICCA_VOL7_DISORDERS } from './piccaVol7Content'
import { PiccaVol7DisorderForm } from './PiccaVol7DisorderForm'
import { PiccaVol7ManualReferenceForm } from './PiccaVol7ManualReferenceForm'
import { PICCA_VOL7_MANUAL_MODULE_ID } from './piccaVol7ManualAnswers'
import { PiccaVol7SinteseForm } from './PiccaVol7SinteseForm'
import { PICCA_VOL7_SINTESE_MODULE_ID } from './piccaVol7SinteseContent'

type Vol7ModuleDefinition = {
  defaultAnswers: () => Record<string, unknown>
  Form: ComponentType<PiccaModuleRendererProps>
}

function createDisorderForm(number: number): ComponentType<PiccaModuleRendererProps> {
  return function Vol7DisorderModuleForm(props: PiccaModuleRendererProps) {
    return <PiccaVol7DisorderForm {...props} disorderNumber={number} />
  }
}

const checklistRegistry: Record<string, Vol7ModuleDefinition> = Object.fromEntries(
  PICCA_VOL7_DISORDERS.filter((disorder) => disorder.number <= 33).map((disorder) => [
    disorder.moduleId,
    {
      defaultAnswers: () => defaultPiccaVol7DisorderAnswers(disorder.number),
      Form: createDisorderForm(disorder.number),
    },
  ]),
)

export const piccaVol7ModuleRegistry: Record<string, Vol7ModuleDefinition> = {
  ...checklistRegistry,
  [PICCA_VOL7_SINTESE_MODULE_ID]: {
    defaultAnswers: defaultPiccaVol7SinteseAnswers,
    Form: PiccaVol7SinteseForm,
  },
  [PICCA_VOL7_MANUAL_MODULE_ID]: {
    defaultAnswers: defaultPiccaVol7ManualReferenceAnswers,
    Form: PiccaVol7ManualReferenceForm,
  },
}
