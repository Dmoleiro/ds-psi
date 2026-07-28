import { PiccaInteractiveFormKind } from '@prisma/client'

export function isDailyPiccaInteractiveKind(kind: PiccaInteractiveFormKind): boolean {
  return kind === PiccaInteractiveFormKind.daily_sono
}
