export type ComportamentoRegisto = {
  antecedente: string
  comportamento: string
  reacao: string
  consequencia: string
}

export type PiccaInteractiveKitComportamentosAnswers = {
  registos: ComportamentoRegisto[]
}

const EMPTY_REGISTO: ComportamentoRegisto = {
  antecedente: '',
  comportamento: '',
  reacao: '',
  consequencia: '',
}

export const KIT_COMPORTAMENTOS_DEFAULT_ROWS = 10

export const defaultPiccaInteractiveKitComportamentosAnswers =
  (): PiccaInteractiveKitComportamentosAnswers => ({
    registos: Array.from({ length: KIT_COMPORTAMENTOS_DEFAULT_ROWS }, () => ({ ...EMPTY_REGISTO })),
  })

export function emptyComportamentoRegisto(): ComportamentoRegisto {
  return { ...EMPTY_REGISTO }
}

export function mergePiccaInteractiveKitComportamentosAnswers(
  raw: Record<string, unknown>,
): PiccaInteractiveKitComportamentosAnswers {
  const defaults = defaultPiccaInteractiveKitComportamentosAnswers()
  const partial = raw as Partial<PiccaInteractiveKitComportamentosAnswers>
  return {
    registos: partial.registos?.length ? partial.registos : defaults.registos,
  }
}
