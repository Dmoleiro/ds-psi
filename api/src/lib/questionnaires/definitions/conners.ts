import { defineQuestionnaire } from '../helpers.js'

const CONNERS_0_3 = ['Nunca', 'Um pouco', 'Frequentemente', 'Muito frequente']

const CONNERS_PAIS_ITEMS = [
  'Desatento, distrai-se facilmente',
  'Furioso (zanga-se com facilidade) e ressentido',
  'Dificuldade em fazer ou acabar os trabalhos de casa',
  'Está sempre a movimentar-se ou age como «tendo as pilhas carregadas»',
  'Atenta por curtos períodos de tempo',
  'Discute/argumenta com os adultos',
  'Mexe muito os pés e as mãos e mexe-se ainda que sentado no lugar',
  'Não consegue completar o que começa',
  'Difícil de controlar em centros comerciais ou sítios públicos',
  'Desarrumado ou desorganizado em casa ou na escola',
  'Perde o controlo',
  'Precisa de acompanhamento para executar as suas tarefas',
  'Só presta atenção quando é uma coisa que lhe interessa',
  'Corre e trepa em situações inapropriadas',
  'Distraído e com tempo de atenção curto',
  'Irritável',
  'Evita ou tem dificuldade em tarefas que exigem esforço continuado',
  'Irrequieto, «tem bicho carpinteiro»',
  'Distrai-se quando lhe dão instruções',
  'Provocador ou recusa pedidos de adulto',
  'Tem problemas em concentrar-se nas aulas',
  'Tem dificuldade em manter-se numa fila ou esperar a sua vez',
  'Levanta-se na sala quando deveria ficar sentado',
  'Deliberadamente faz coisas para irritar os outros',
  'Não segue instruções e não acaba trabalhos',
  'Tem dificuldade em brincar ou trabalhar calmamente',
  'Fica frustrado quando não consegue fazer algo',
]

const CONNERS_PROF_ITEMS = [
  'Desatento, distrai-se facilmente',
  'Comportamento de desafio face ao adulto',
  'Inquieto, «tem bichos carpinteiros» (mexe o corpo sem sair do lugar)',
  'Esquece-se de coisas que já aprendeu',
  'Perturba as outras crianças',
  'Desafia o adulto e não colabora com os pedidos',
  'Mexe-se muito como se estivesse sempre ligado a um motor',
  'Soletra de forma pobre',
  'Não consegue manter-se sossegado(a)',
  'Vingativo(a) ou «maldoso(a)»',
  'Levanta-se do lugar na sala de aula ou noutras situações em que deveria ficar sentado(a)',
  'Mexe os pés e as mãos e está irrequieto(a) no seu lugar',
  'Capacidades de leitura abaixo do esperado',
  'Tem um tempo curto de atenção',
  'Argumenta com os adultos',
  'Dá apenas atenção a coisas em que está realmente interessado(a)',
  'Tem dificuldade em esperar a sua vez',
  'Não se interessa pelo trabalho escolar',
  'Distraído(a) ou com curto tempo de atenção',
  'Tem um temperamento explosivo e imprevisível',
  'Corre ou trepa de forma excessiva em situações inadequadas',
  'Interrompe e intromete-se',
  'Tem dificuldade em envolver-se em jogos ou atividades de forma sossegada',
  'Não segue instruções e não termina o trabalho escolar',
  'Inquieto(a), sempre a levantar-se e a movimentar-se pelo espaço',
]

function connersScoring(count: number) {
  return {
    type: 'sum_subscales' as const,
    subscales: [{ id: 'total', label: 'Total Conners', itemIds: Array.from({ length: count }, (_, i) => `q${i + 1}`) }],
  }
}

export const connersQuestionnaires = [
  defineQuestionnaire({
    id: 'conners_pais',
    title: 'Conners — Pais',
    description: 'Escala de Conners para pais (versão reduzida).',
    instructions:
      'Avalie o comportamento da criança durante o último mês. 0 = Nunca, 3 = Muito frequente.',
    respondent: 'Pais',
    responseType: 'frequency0_3',
    responseLabels: CONNERS_0_3,
    items: CONNERS_PAIS_ITEMS,
    scoring: connersScoring(CONNERS_PAIS_ITEMS.length),
  }),
  defineQuestionnaire({
    id: 'conners_professores',
    title: 'Conners — Professores',
    description: 'Escala de Conners para professores (versão reduzida).',
    instructions:
      'Avalie o comportamento da criança durante o último mês. 0 = Nunca, 3 = Muito frequente.',
    respondent: 'Professores',
    responseType: 'frequency0_3',
    responseLabels: CONNERS_0_3,
    items: CONNERS_PROF_ITEMS,
    scoring: connersScoring(CONNERS_PROF_ITEMS.length),
  }),
  defineQuestionnaire({
    id: 'conners_pre_escolar',
    title: 'Conners — Idade Pré-escolar',
    description: 'Conners para idade pré-escolar (pais/educadores).',
    instructions:
      'Avalie o comportamento durante o último mês. 0 = Nunca, 3 = Muito frequente.',
    respondent: 'Pais ou educadores',
    responseType: 'frequency0_3',
    responseLabels: CONNERS_0_3,
    items: CONNERS_PAIS_ITEMS.slice(0, 22),
    scoring: connersScoring(22),
  }),
  defineQuestionnaire({
    id: 'conners_idade_escolar_pais',
    title: 'Conners — Idade Escolar (Pais)',
    description: 'Conners para idade escolar — versão pais.',
    instructions:
      'Avalie o comportamento durante o último mês. 0 = Nunca, 3 = Muito frequente.',
    respondent: 'Pais',
    responseType: 'frequency0_3',
    responseLabels: CONNERS_0_3,
    items: CONNERS_PAIS_ITEMS,
    scoring: connersScoring(CONNERS_PAIS_ITEMS.length),
  }),
]
