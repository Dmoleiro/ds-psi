import type { FuncionouLevel, PaiMaeAmbosCell } from './piccaInteractiveShared'
import { emptyPaiMaeAmbos } from './piccaInteractiveShared'

export const KIT_BIRRAS_ESTRATEGIAS = [
  { id: 'antecipacao', label: 'Antecipação da mudança' },
  { id: 'escolha', label: 'Escolha limitada entre duas opções' },
  { id: 'validacao', label: 'Validação emocional' },
  { id: 'linguagem', label: 'Redução da linguagem' },
  { id: 'pausa', label: 'Pausa num local calmo' },
  { id: 'respiracao', label: 'Respiração ou estratégia sensorial' },
  { id: 'limite', label: 'Manutenção do limite' },
  { id: 'reforco', label: 'Reforço após recuperação' },
] as const

export type BirrasEpisodio = {
  data: string
  hora: string
  local: string
  duracao: string
  adulto: PaiMaeAmbosCell
  intensidade: string
  antecedente: string
  comportamento: string
  consequencia: string
  estrategias: Record<string, { pai: boolean; mae: boolean; funcionou: FuncionouLevel; observacoes: string }>
  tempoRecuperar: string
  retomouAtividade: string
  reparouComportamento: string
  ajudaDe: PaiMaeAmbosCell
}

function emptyEpisodio(): BirrasEpisodio {
  const estrategias: BirrasEpisodio['estrategias'] = {}
  for (const e of KIT_BIRRAS_ESTRATEGIAS) {
    estrategias[e.id] = { pai: false, mae: false, funcionou: '', observacoes: '' }
  }
  return {
    data: '',
    hora: '',
    local: '',
    duracao: '',
    adulto: emptyPaiMaeAmbos(),
    intensidade: '',
    antecedente: '',
    comportamento: '',
    consequencia: '',
    estrategias,
    tempoRecuperar: '',
    retomouAtividade: '',
    reparouComportamento: '',
    ajudaDe: emptyPaiMaeAmbos(),
  }
}

export type PiccaInteractiveKitBirrasAnswers = {
  episodios: BirrasEpisodio[]
}

export const defaultPiccaInteractiveKitBirrasAnswers = (): PiccaInteractiveKitBirrasAnswers => ({
  episodios: [emptyEpisodio()],
})

export function mergePiccaInteractiveKitBirrasAnswers(
  raw: Record<string, unknown>,
): PiccaInteractiveKitBirrasAnswers {
  const defaults = defaultPiccaInteractiveKitBirrasAnswers()
  const partial = raw as Partial<PiccaInteractiveKitBirrasAnswers>
  return {
    episodios: partial.episodios?.length ? partial.episodios : defaults.episodios,
  }
}
