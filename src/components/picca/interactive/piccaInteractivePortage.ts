import { PICCA_PORTAGE_DOMAINS } from './portage/piccaPortageContent'

export type PortageResultado = '' | 's' | 'n' | 'av'

export type PortageItemAnswer = {
  resultado: PortageResultado
  observacoes: string
}

export type PiccaInteractivePortageAnswers = {
  nomeEducando: string
  dataNascimento: string
  dataAvaliacao: string
  diagnostico: string
  avaliador: string
  itens: Record<string, PortageItemAnswer>
}

function emptyItemAnswer(): PortageItemAnswer {
  return { resultado: '', observacoes: '' }
}

export function defaultPiccaInteractivePortageAnswers(): PiccaInteractivePortageAnswers {
  const itens: Record<string, PortageItemAnswer> = {}
  for (const domain of PICCA_PORTAGE_DOMAINS) {
    for (const band of domain.ageBands) {
      for (const item of band.items) {
        itens[item.id] = emptyItemAnswer()
      }
    }
  }
  return {
    nomeEducando: '',
    dataNascimento: '',
    dataAvaliacao: '',
    diagnostico: '',
    avaliador: '',
    itens,
  }
}

export function mergePiccaInteractivePortageAnswers(
  raw: Record<string, unknown>,
): PiccaInteractivePortageAnswers {
  const defaults = defaultPiccaInteractivePortageAnswers()
  const partial = raw as Partial<PiccaInteractivePortageAnswers>
  return {
    ...defaults,
    ...partial,
    itens: { ...defaults.itens, ...(partial.itens ?? {}) },
  }
}

export const PICCA_PORTAGE_PERIOD_KEY = 'assessment'
