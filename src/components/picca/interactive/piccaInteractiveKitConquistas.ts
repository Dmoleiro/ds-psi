import { emptyPaiMae, WEEKDAY_KEYS, type PaiMaeCell, type WeekdayKey } from './piccaInteractiveShared'

export const KIT_CONQUISTAS_COMPORTAMENTOS_DEFAULT = [
  'Seguir a instrução à primeira',
  'Usar palavras em vez de gritar',
  'Partilhar um brinquedo',
  'Arrumar os brinquedos',
  'Esperar pela sua vez',
  'Colaborar na rotina',
  'Aceitar um "não"',
  'Mostrar afeto à família',
] as const

export type ConquistaDiaCell = PaiMaeCell & { autocolantes: string }

export type ConquistaComportamentoRow = {
  label: string
  dias: Record<WeekdayKey, ConquistaDiaCell>
}

export type ConquistaMissao = {
  descricao: string
  data: string
  concluida: boolean
  pai: boolean
  mae: boolean
}

export type ConquistaRecompensa = {
  objetivo: string
  recompensa: string
  atingida: boolean
}

export type PiccaInteractiveKitConquistasAnswers = {
  comportamentos: ConquistaComportamentoRow[]
  missoesEspeciais: ConquistaMissao[]
  recompensas: ConquistaRecompensa[]
  registoPais: {
    observacoes: string
    celebracao: string
    dificuldades: string
  }
}

function emptyDiaCell(): ConquistaDiaCell {
  return { ...emptyPaiMae(), autocolantes: '' }
}

function emptyComportamentoRow(label: string): ConquistaComportamentoRow {
  const dias = {} as Record<WeekdayKey, ConquistaDiaCell>
  for (const day of WEEKDAY_KEYS) {
    dias[day] = emptyDiaCell()
  }
  return { label, dias }
}

function emptyMissao(): ConquistaMissao {
  return { descricao: '', data: '', concluida: false, pai: false, mae: false }
}

function emptyRecompensa(): ConquistaRecompensa {
  return { objetivo: '', recompensa: '', atingida: false }
}

export const defaultPiccaInteractiveKitConquistasAnswers = (): PiccaInteractiveKitConquistasAnswers => ({
  comportamentos: KIT_CONQUISTAS_COMPORTAMENTOS_DEFAULT.map((label) => emptyComportamentoRow(label)),
  missoesEspeciais: [emptyMissao()],
  recompensas: [emptyRecompensa(), emptyRecompensa()],
  registoPais: { observacoes: '', celebracao: '', dificuldades: '' },
})

export function mergePiccaInteractiveKitConquistasAnswers(
  raw: Record<string, unknown>,
): PiccaInteractiveKitConquistasAnswers {
  const defaults = defaultPiccaInteractiveKitConquistasAnswers()
  const partial = raw as Partial<PiccaInteractiveKitConquistasAnswers>
  return {
    ...defaults,
    ...partial,
    comportamentos: partial.comportamentos?.length ? partial.comportamentos : defaults.comportamentos,
    missoesEspeciais: partial.missoesEspeciais?.length
      ? partial.missoesEspeciais
      : defaults.missoesEspeciais,
    recompensas: partial.recompensas?.length ? partial.recompensas : defaults.recompensas,
    registoPais: { ...defaults.registoPais, ...partial.registoPais },
  }
}
