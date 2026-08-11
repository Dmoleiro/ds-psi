import type { QuestionnaireDefinition, QuestionnaireItem, ResponseType, ScoringSubscale } from './types.js'

export function itemsFromTexts(texts: string[]): QuestionnaireItem[] {
  return texts.map((text, index) => ({ id: `q${index + 1}`, text }))
}

export function defineQuestionnaire(params: {
  id: string
  title: string
  description: string
  instructions: string
  respondent?: string
  responseType: ResponseType
  responseLabels?: string[]
  items: QuestionnaireItem[] | string[]
  scoring?: QuestionnaireDefinition['scoring']
  meta?: Record<string, unknown>
}): QuestionnaireDefinition {
  const items = Array.isArray(params.items)
    ? typeof params.items[0] === 'string'
      ? itemsFromTexts(params.items as string[])
      : (params.items as QuestionnaireItem[])
    : params.items

  return {
    id: params.id,
    title: params.title,
    description: params.description,
    instructions: params.instructions,
    respondent: params.respondent,
    responseType: params.responseType,
    responseLabels: params.responseLabels,
    items,
    scoring: params.scoring,
    meta: params.meta,
  }
}

export function sdqScoring(): {
  type: 'sum_subscales'
  subscales: ScoringSubscale[]
  totalLabel: string
  totalExcludeSubscaleIds: string[]
} {
  return {
    type: 'sum_subscales',
    subscales: [
      { id: 'emotional', label: 'Sintomas emocionais', itemIds: ['q3', 'q8', 'q13', 'q16', 'q24'] },
      { id: 'conduct', label: 'Problemas de conduta', itemIds: ['q5', 'q7', 'q12', 'q18', 'q22'] },
      { id: 'hyperactivity', label: 'Hiperatividade', itemIds: ['q2', 'q10', 'q15', 'q21', 'q25'] },
      { id: 'peer', label: 'Problemas com pares', itemIds: ['q6', 'q11', 'q14', 'q19', 'q23'] },
      { id: 'prosocial', label: 'Comportamento pró-social', itemIds: ['q1', 'q4', 'q9', 'q17', 'q20'], reverseItemIds: ['q1', 'q4', 'q9', 'q17', 'q20'] },
    ],
    totalLabel: 'Total de dificuldades',
    totalExcludeSubscaleIds: ['prosocial'],
  }
}

export const SDQ_4_17_ITEMS = [
  'É sensível aos sentimentos dos outros',
  'É irrequieto/a, muito mexido/a, nunca para quieto/a',
  'Queixa-se frequentemente de dores de cabeça, dores de barriga ou vómitos',
  'Partilha facilmente com as outras crianças (guloseimas, brinquedos, lápis, etc.)',
  'Enerva-se muito facilmente e faz muitas birras',
  'Tem tendência a isolar-se, gosta mais de brincar sozinho/a',
  'Obedece com facilidade, faz habitualmente o que os adultos lhe mandam',
  'Tem muitas preocupações, parece sempre preocupado/a',
  'Gosta de ajudar se alguém está magoado, aborrecido ou doente',
  'Não sossega. Está sempre a mexer as pernas ou as mãos',
  'Tem pelo menos um bom amigo/uma boa amiga',
  'Luta frequentemente com as outras crianças, ameaça-as ou intimida-as',
  'Anda muitas vezes triste, desanimado/a ou choroso/a',
  'Em geral as outras crianças gostam dele/a',
  'Distrai-se com facilidade, está sempre com a cabeça no ar',
  'Em situações novas é receoso/a, muito agarrado/a e pouco seguro/a',
  'É simpático/a e amável com crianças mais pequenas',
  'Mente frequentemente ou engana',
  'As outras crianças metem-se com ele/a, ameaçam-no/a ou intimidam-no/a',
  'Sempre pronto/a a ajudar os outros (pais, professores ou outras crianças)',
  'Pensa nas coisas antes de as fazer',
  'Rouba em casa, na escola ou em outros sítios',
  'Dá-se melhor com adultos do que com outras crianças',
  'Tem muitos medos, assusta-se com facilidade',
  'Geralmente acaba o que começa, tem uma boa atenção',
]
