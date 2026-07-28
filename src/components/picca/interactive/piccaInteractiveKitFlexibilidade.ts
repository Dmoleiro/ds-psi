export const KIT_FLEXIBILIDADE_DESAFIOS = [
  { id: 'escolher_roupa', label: 'Aceitar escolher entre duas peças de roupa' },
  { id: 'vestir_tshirt', label: 'Aceitar vestir t-shirt' },
  { id: 'vestir_calcoes', label: 'Aceitar vestir calções ou calças curtas' },
  { id: 'experimentar_peca', label: 'Experimentar uma peça diferente' },
  { id: 'emprestar', label: 'Emprestar um brinquedo' },
  { id: 'partilhar', label: 'Partilhar um brinquedo quando solicitado' },
  { id: 'trocar_brinquedo', label: 'Trocar um brinquedo por outro' },
  { id: 'terminar_brincadeira', label: 'Terminar uma brincadeira' },
  { id: 'esperar_vez', label: 'Esperar pela sua vez' },
  { id: 'alteracao_rotina', label: 'Aceitar uma pequena alteração da rotina' },
  { id: 'decisao_adulto', label: 'Aceitar uma decisão do adulto' },
  { id: 'recuperar_frustracao', label: 'Recuperar após frustração' },
] as const

export type FlexibilidadeDesafioRow = {
  conseguiu: boolean
  comAjuda: boolean
  recusou: boolean
  pai: boolean
  mae: boolean
}

export type FlexibilidadeEscada = Record<string, string>

export type FlexibilidadeSituacao = {
  situacao: string
  antecipacao: boolean
  escolhas: string
  resposta: string
  pai: boolean
  mae: boolean
  resultado: string
}

export type PiccaInteractiveKitFlexibilidadeAnswers = {
  desafios: Record<string, FlexibilidadeDesafioRow>
  escada: FlexibilidadeEscada
  situacao: FlexibilidadeSituacao
}

export const KIT_FLEXIBILIDADE_ESCADA = [
  { id: 'nivel1', label: '1 — Observa ou tolera a situação por pouco tempo' },
  { id: 'nivel2', label: '2 — Experimenta com apoio do adulto' },
  { id: 'nivel3', label: '3 — Realiza com protesto ligeiro, mas recupera' },
  { id: 'nivel4', label: '4 — Realiza com autonomia e pouca resistência' },
  { id: 'nivel5', label: '5 — Generaliza a competência a novas situações' },
] as const

export const defaultPiccaInteractiveKitFlexibilidadeAnswers =
  (): PiccaInteractiveKitFlexibilidadeAnswers => {
    const desafios: PiccaInteractiveKitFlexibilidadeAnswers['desafios'] = {}
    for (const d of KIT_FLEXIBILIDADE_DESAFIOS) {
      desafios[d.id] = { conseguiu: false, comAjuda: false, recusou: false, pai: false, mae: false }
    }
    return {
      desafios,
      escada: {},
      situacao: {
        situacao: '',
        antecipacao: false,
        escolhas: '',
        resposta: '',
        pai: false,
        mae: false,
        resultado: '',
      },
    }
  }

export function mergePiccaInteractiveKitFlexibilidadeAnswers(
  raw: Record<string, unknown>,
): PiccaInteractiveKitFlexibilidadeAnswers {
  const defaults = defaultPiccaInteractiveKitFlexibilidadeAnswers()
  const partial = raw as Partial<PiccaInteractiveKitFlexibilidadeAnswers>
  return {
    ...defaults,
    ...partial,
    desafios: { ...defaults.desafios, ...partial.desafios },
    escada: { ...defaults.escada, ...partial.escada },
    situacao: { ...defaults.situacao, ...partial.situacao },
  }
}
