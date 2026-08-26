import { z } from 'zod'
import { buildQuestionnaireSchema } from '../schema.js'
import { defineQuestionnaire } from '../helpers.js'
import type { QuestionnaireDefinition } from '../types.js'

const CONNERS_0_3 = ['Nunca', 'Um pouco', 'Frequentemente', 'Muito frequente']

export const CONNERS_FORM_IDS = [
  'conners_pais',
  'conners_professores',
  'conners_idade_escolar_pais',
] as const

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

export function buildConnersSchema(definition: QuestionnaireDefinition) {
  return buildQuestionnaireSchema(definition).extend({
    conners_sexo: z.union([z.literal(0), z.literal(1)]).optional(),
    conners_idade: z.union([z.number(), z.string()]).optional(),
  })
}

export const connersQuestionnaires = [
  defineQuestionnaire({
    id: 'conners_pais',
    title: 'Conners — Pais',
    description: 'Escala de Conners para pais (versão reduzida).',
    instructions:
      'Avalie o comportamento da criança durante o último mês. 0 = Nunca, 3 = Muito frequente. Para cotação normativa, indique sexo e idade (6–10 anos).',
    respondent: 'Pais',
    responseType: 'frequency0_3',
    responseLabels: CONNERS_0_3,
    items: CONNERS_PAIS_ITEMS,
    scoring: { type: 'conners', variant: 'pais' },
  }),
  defineQuestionnaire({
    id: 'conners_professores',
    title: 'Conners — Professores',
    description: 'Escala de Conners para professores (versão reduzida).',
    instructions:
      'Avalie o comportamento da criança durante o último mês. 0 = Nunca, 3 = Muito frequente. Para cotação normativa, indique sexo e idade (6–10 anos).',
    respondent: 'Professores',
    responseType: 'frequency0_3',
    responseLabels: CONNERS_0_3,
    items: CONNERS_PROF_ITEMS,
    scoring: { type: 'conners', variant: 'professores' },
  }),
  defineQuestionnaire({
    id: 'conners_idade_escolar_pais',
    title: 'Conners — Idade Escolar (Pais)',
    description: 'Conners para idade escolar — versão pais.',
    instructions:
      'Avalie o comportamento durante o último mês. 0 = Nunca, 3 = Muito frequente. Para cotação normativa, indique sexo e idade (6–10 anos).',
    respondent: 'Pais',
    responseType: 'frequency0_3',
    responseLabels: CONNERS_0_3,
    items: CONNERS_PAIS_ITEMS,
    scoring: { type: 'conners', variant: 'pais' },
  }),
]
