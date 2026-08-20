export const PICCA_VOL2_MANUAL_MODULE_ID = 'picca-vol2-mod1' as const

export type PiccaVol2ManualReferenceAnswers = {
  notasClinicas: string
}

export function defaultPiccaVol2ManualReferenceAnswers(): PiccaVol2ManualReferenceAnswers {
  return { notasClinicas: '' }
}

export function mergePiccaVol2ManualReferenceAnswers(
  raw: Record<string, unknown>,
): PiccaVol2ManualReferenceAnswers {
  const defaults = defaultPiccaVol2ManualReferenceAnswers()
  const partial = raw as Partial<PiccaVol2ManualReferenceAnswers>
  return { ...defaults, ...partial }
}
