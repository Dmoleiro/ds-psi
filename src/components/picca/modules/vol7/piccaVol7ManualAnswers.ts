export const PICCA_VOL7_MANUAL_MODULE_ID = 'picca-vol7-mod35' as const

export type PiccaVol7ManualReferenceAnswers = {
  notasClinicas: string
}

export function defaultPiccaVol7ManualReferenceAnswers(): PiccaVol7ManualReferenceAnswers {
  return { notasClinicas: '' }
}

export function mergePiccaVol7ManualReferenceAnswers(
  raw: Record<string, unknown>,
): PiccaVol7ManualReferenceAnswers {
  const defaults = defaultPiccaVol7ManualReferenceAnswers()
  const partial = raw as Partial<PiccaVol7ManualReferenceAnswers>
  return { ...defaults, ...partial }
}
