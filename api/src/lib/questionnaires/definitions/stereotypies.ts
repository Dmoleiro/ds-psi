import { defineQuestionnaire } from '../helpers.js'

const STEREOTYPIA_ITEMS = [
  'Balança o corpo para a frente e para trás.',
  'Abana as mãos ou os braços repetidamente.',
  'Bate com objectos ou com as mãos.',
  'Gira ou roda objectos repetidamente.',
  'Caminha na ponta dos pés.',
  'Faz movimentos repetitivos com os dedos.',
  'Bate a cabeça contra objectos ou superfícies.',
  'Mexe-se de forma rítmica ou repetitiva.',
  'Faz sons ou vocalizações repetitivas.',
  'Alinha ou organiza objectos de forma repetitiva.',
  'Bate os lábios ou a língua repetidamente.',
  'Estala os dedos repetidamente.',
  'Roda sobre si mesmo.',
  'Faz caretas ou expressões faciais repetitivas.',
  'Mexe-se de um lado para o outro repetidamente.',
  'Bate os pés no chão repetidamente.',
  'Observa objectos de perto de forma repetitiva.',
  'Toca superfícies ou texturas repetidamente.',
  'Repete palavras ou frases sem contexto.',
  'Faz movimentos corporais quando excitado(a) ou ansioso(a).',
]

export const stereotypiesQuestionnaire = defineQuestionnaire({
  id: 'inventario_estereotipias',
  title: 'Inventário de Estereotipias',
  description: 'Registo de comportamentos estereotipados e repetitivos.',
  instructions:
    'Indique a frequência de cada comportamento: 0 = Nunca, 1 = Às vezes, 2 = Frequentemente, 3 = Muito frequentemente.',
  respondent: 'Pais ou observadores',
  responseType: 'frequency0_3',
  responseLabels: ['Nunca', 'Às vezes', 'Frequentemente', 'Muito frequentemente'],
  items: STEREOTYPIA_ITEMS,
  scoring: {
    type: 'sum_subscales',
    subscales: [
      { id: 'total', label: 'Total estereotipias', itemIds: STEREOTYPIA_ITEMS.map((_, i) => `q${i + 1}`) },
    ],
  },
})
