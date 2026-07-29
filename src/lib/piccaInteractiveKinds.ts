export type PiccaInteractiveFormKind =
  | 'daily_sono'
  | 'weekly_estrategias'
  | 'weekly_kit'
  | 'portage_assessment'

export function isDailyPiccaInteractiveKind(kind: PiccaInteractiveFormKind): boolean {
  return kind === 'daily_sono'
}

export function isPortageAssessmentKind(kind: PiccaInteractiveFormKind): boolean {
  return kind === 'portage_assessment'
}

export function isWeeklyPiccaInteractiveKind(kind: PiccaInteractiveFormKind): boolean {
  return kind === 'weekly_estrategias' || kind === 'weekly_kit'
}

export function piccaInteractiveKindLabel(kind: PiccaInteractiveFormKind): string {
  if (isDailyPiccaInteractiveKind(kind)) return 'Registo diário'
  if (isPortageAssessmentKind(kind)) return 'Avaliação Portage'
  return 'Registo semanal'
}
