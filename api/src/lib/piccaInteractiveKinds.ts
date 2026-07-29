import { PiccaInteractiveFormKind } from '@prisma/client'

export function isDailyPiccaInteractiveKind(kind: PiccaInteractiveFormKind): boolean {
  return kind === PiccaInteractiveFormKind.daily_sono
}

export function isPortageAssessmentKind(kind: PiccaInteractiveFormKind): boolean {
  return kind === PiccaInteractiveFormKind.portage_assessment
}
