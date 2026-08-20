import type { ComponentType } from 'react'
import type { PiccaModuleRendererProps } from '../../moduleRegistry'
import { defaultPiccaVol2ManualReferenceAnswers } from './piccaVol2ManualAnswers'
import { PICCA_VOL2_MANUAL_MODULE_ID } from './piccaVol2ManualAnswers'
import { PiccaVol2ManualReferenceForm } from './PiccaVol2ManualReferenceForm'

type Vol2ModuleDefinition = {
  defaultAnswers: () => Record<string, unknown>
  Form: ComponentType<PiccaModuleRendererProps>
}

export const piccaVol2ModuleRegistry: Record<string, Vol2ModuleDefinition> = {
  [PICCA_VOL2_MANUAL_MODULE_ID]: {
    defaultAnswers: defaultPiccaVol2ManualReferenceAnswers,
    Form: PiccaVol2ManualReferenceForm,
  },
}
