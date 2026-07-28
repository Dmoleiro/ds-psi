export type PiccaInteractiveFormKind = 'daily_sono' | 'weekly_estrategias' | 'weekly_kit'

export function isDailyPiccaInteractiveKind(kind: PiccaInteractiveFormKind): boolean {
  return kind === 'daily_sono'
}

export function isWeeklyPiccaInteractiveKind(kind: PiccaInteractiveFormKind): boolean {
  return kind === 'weekly_estrategias' || kind === 'weekly_kit'
}

export function piccaInteractiveKindLabel(kind: PiccaInteractiveFormKind): string {
  return isDailyPiccaInteractiveKind(kind) ? 'Registo diário' : 'Registo semanal'
}
