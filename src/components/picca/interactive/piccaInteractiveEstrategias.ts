export const WEEKDAY_KEYS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'] as const
export type WeekdayKey = (typeof WEEKDAY_KEYS)[number]

export const WEEKDAY_LABELS: Record<WeekdayKey, string> = {
  seg: 'Seg',
  ter: 'Ter',
  qua: 'Qua',
  qui: 'Qui',
  sex: 'Sex',
  sab: 'Sáb',
  dom: 'Dom',
}

export type ResponsavelCell = { pai: boolean; mae: boolean }
export type ObjetivoCell = { pai: boolean; mae: boolean; crianca: boolean; outro: boolean }

export type ResponsabilidadeRoutine = {
  id: string
  label: string
  weekdays: WeekdayKey[]
}

export type ObjetivoRoutine = {
  id: string
  label: string
  objetivo: string
}

export const RESPONSABILIDADE_ROUTINES: ResponsabilidadeRoutine[] = [
  { id: 'acordarHigiene', label: 'Acordar e higiene', weekdays: [...WEEKDAY_KEYS] },
  { id: 'vestir', label: 'Vestir', weekdays: [...WEEKDAY_KEYS] },
  { id: 'pequenoAlmoco', label: 'Pequeno-almoço', weekdays: [...WEEKDAY_KEYS] },
  { id: 'levarEscola', label: 'Levar à escola', weekdays: ['seg', 'ter', 'qua', 'qui', 'sex'] },
  { id: 'irBuscarEscola', label: 'Ir buscar à escola', weekdays: ['seg', 'ter', 'qua', 'qui', 'sex'] },
  { id: 'almoco', label: 'Almoço', weekdays: [...WEEKDAY_KEYS] },
  { id: 'lanche', label: 'Lanche', weekdays: [...WEEKDAY_KEYS] },
  { id: 'brincadeiraParque', label: 'Brincadeira/Parque', weekdays: [...WEEKDAY_KEYS] },
  { id: 'banho', label: 'Banho', weekdays: [...WEEKDAY_KEYS] },
  { id: 'jantar', label: 'Jantar', weekdays: [...WEEKDAY_KEYS] },
  { id: 'historiaDeitar', label: 'História e deitar', weekdays: [...WEEKDAY_KEYS] },
  { id: 'adormecer', label: 'Adormecer', weekdays: [...WEEKDAY_KEYS] },
  { id: 'deitarCama', label: 'Deitar na cama', weekdays: [...WEEKDAY_KEYS] },
  { id: 'arrumarBrinquedos', label: 'Arrumar/Organizar os brinquedos a pedido', weekdays: [...WEEKDAY_KEYS] },
  { id: 'arrumarQuarto', label: 'Arrumar o quarto', weekdays: [...WEEKDAY_KEYS] },
  { id: 'doarBrinquedos', label: 'Escolher os brinquedos que já não usa e doar', weekdays: [...WEEKDAY_KEYS] },
  { id: 'doarRoupa', label: 'Escolher a roupa que já não usa e doar', weekdays: [...WEEKDAY_KEYS] },
  { id: 'escolherRoupaDia', label: 'Escolher a própria roupa para o dia', weekdays: [...WEEKDAY_KEYS] },
  { id: 'aceitarSugestoes', label: 'Aceitar as sugestões e as regras dos adultos', weekdays: [...WEEKDAY_KEYS] },
  { id: 'tarefasAutonomas', label: 'Realizar as tarefas de forma mais autónoma', weekdays: [...WEEKDAY_KEYS] },
]

export const OBJETIVO_ROUTINES: ObjetivoRoutine[] = [
  { id: 'acordarBonsDias', label: 'Acordar e dar os bons dias', objetivo: 'Promover segurança com ambos os cuidadores' },
  { id: 'vestir', label: 'Vestir', objetivo: 'Aumentar autonomia e flexibilidade' },
  { id: 'pequenoAlmoco', label: 'Pequeno-almoço', objetivo: 'Criar momentos positivos de interação' },
  { id: 'levarEscola', label: 'Levar à escola', objetivo: 'Facilitar separações da mãe' },
  { id: 'irBuscarEscola', label: 'Ir buscar à escola', objetivo: 'Reforçar a relação com o pai' },
  { id: 'brincadeiraExclusiva', label: 'Brincadeira exclusiva (15–20 min)', objetivo: 'Fortalecer a vinculação' },
  { id: 'banho', label: 'Banho', objetivo: 'Tornar o pai uma figura de conforto' },
  { id: 'jantar', label: 'Jantar', objetivo: 'Promover previsibilidade' },
  { id: 'historia', label: 'História', objetivo: 'Desenvolver uma rotina de vinculação segura' },
  { id: 'adormecer', label: 'Adormecer', objetivo: 'Reduzir a necessidade exclusiva da mãe' },
  { id: 'deitarCama', label: 'Deitar na cama', objetivo: 'Criar uma vinculação mais segura e próxima com o Pai' },
  { id: 'arrumarBrinquedos', label: 'Arrumar/Organizar os brinquedos a pedido', objetivo: 'Criar mais autonomia e autoestima pessoal' },
  { id: 'arrumarQuarto', label: 'Arrumar o quarto', objetivo: 'Criar mais autonomia e autoestima pessoal' },
  { id: 'doarBrinquedos', label: 'Escolher os brinquedos que já não usa e doar', objetivo: 'Trabalhar a autonomia pessoal' },
  { id: 'doarRoupa', label: 'Escolher a roupa que já não usa e doar', objetivo: 'Trabalhar a autonomia pessoal' },
  { id: 'escolherRoupaDia', label: 'Escolher a própria roupa para o dia', objetivo: 'Criar mais autonomia e autoestima pessoal' },
  { id: 'aceitarSugestoes', label: 'Aceitar as sugestões e as regras dos adultos', objetivo: 'Organização da autonomia' },
  { id: 'tarefasAutonomas', label: 'Realizar as tarefas de forma mais autónoma', objetivo: 'Criar estratégias de autoconfiança e desenvolvimento emocional/independência' },
]

export type PiccaInteractiveEstrategiasAnswers = {
  responsabilidade: Record<string, Record<WeekdayKey, ResponsavelCell>>
  objetivos: Record<string, ObjetivoCell>
}

function emptyResponsavelCell(): ResponsavelCell {
  return { pai: false, mae: false }
}

function emptyObjetivoCell(): ObjetivoCell {
  return { pai: false, mae: false, crianca: false, outro: false }
}

export const defaultPiccaInteractiveEstrategiasAnswers = (): PiccaInteractiveEstrategiasAnswers => {
  const responsabilidade: PiccaInteractiveEstrategiasAnswers['responsabilidade'] = {}
  for (const routine of RESPONSABILIDADE_ROUTINES) {
    responsabilidade[routine.id] = {} as Record<WeekdayKey, ResponsavelCell>
    for (const day of WEEKDAY_KEYS) {
      responsabilidade[routine.id][day] = emptyResponsavelCell()
    }
  }

  const objetivos: PiccaInteractiveEstrategiasAnswers['objetivos'] = {}
  for (const routine of OBJETIVO_ROUTINES) {
    objetivos[routine.id] = emptyObjetivoCell()
  }

  return { responsabilidade, objetivos }
}
