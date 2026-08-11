import { defineQuestionnaire } from '../helpers.js'

const SCARED_CHILD_ITEMS = [
  'Quando fico com medo, sinto-me com falta de ar.',
  'Tenho dores de cabeça na escola.',
  'Não gosto de estar com pessoas que não conheço bem.',
  'Tenho medo de dormir fora de casa.',
  'Preocupo-me com o que os outros pensam de mim.',
  'Quando fico com medo, sinto que vou desmaiar.',
  'Sou nervoso(a).',
  'Sigo a minha mãe ou pai aonde quer que vão.',
  'As pessoas dizem-me que pareço nervoso(a).',
  'Sinto-me nervoso(a) com pessoas que não conheço bem.',
  'Tenho dores de estômago na escola.',
  'Quando fico com medo, sinto que estou a ficar louco(a).',
  'Preocupo-me em dormir sozinho(a).',
  'Preocupo-me em ser tão bom(a) como as outras crianças.',
  'Quando fico com medo, sinto que as coisas não são reais.',
  'Tenho pesadelos em que algo de mau acontece aos meus pais.',
  'Preocupo-me em ir à escola.',
  'Quando fico com medo, o meu coração bate depressa.',
  'Fico muito trémulo(a).',
  'Tenho pesadelos em que algo de mau me acontece a mim.',
  'Preocupo-me que as coisas corram bem para mim.',
  'Quando fico com medo, suo muito.',
  'Sou uma pessoa preocupada.',
  'Fico com muito medo sem razão.',
  'Tenho medo de ficar sozinho(a) em casa.',
  'É difícil falar com pessoas que não conheço bem.',
  'Quando fico com medo, sinto que estou a engasgar.',
  'As pessoas dizem-me que me preocupo demasiado.',
  'Não gosto de estar longe da família.',
  'Tenho medo de ter ataques de ansiedade ou pânico.',
  'Preocupo-me que algo de mau possa acontecer aos meus pais.',
  'Sinto-me tímido(a) com pessoas que não conheço bem.',
  'Preocupo-me com o que vai acontecer no futuro.',
  'Quando fico com medo, sinto vontade de vomitar.',
  'Preocupo-me em fazer as coisas bem.',
  'Tenho medo de ir à escola.',
  'Preocupo-me com coisas que já aconteceram.',
  'Quando fico com medo, sinto-me tonto(a).',
  'Sinto-me nervoso(a) quando estou com outras crianças ou adultos e tenho de fazer algo enquanto me observam.',
  'Sinto-me nervoso(a) quando vou a festas ou outros lugares onde há pessoas que não conheço bem.',
  'Sou tímido(a).',
]

const SCARED_PARENT_ITEMS = SCARED_CHILD_ITEMS.map((item) =>
  item
    .replace(/^Sou /, 'É ')
    .replace(/^Tenho /, 'Tem ')
    .replace(/^Sinto-me /, 'Sente-se ')
    .replace(/^Preocupo-me /, 'Preocupa-se ')
    .replace(/^Fico /, 'Fica ')
    .replace(/^É difícil /, 'É difícil para ele(a) ')
    .replace(/^Não gosto /, 'Não gosta ')
    .replace(/^As pessoas dizem-me/, 'As pessoas dizem-lhe'),
)

const SCARED_LABELS = [
  'Não é verdade ou raramente é verdade',
  'É um pouco verdade ou às vezes é verdade',
  'É muito verdade ou frequentemente é verdade',
]

export const scaredQuestionnaires = [
  defineQuestionnaire({
    id: 'scared_crianca',
    title: 'SCARED — Criança',
    description: 'Screen for Child Anxiety Related Disorders (versão criança).',
    instructions:
      'Leia cada frase e indique o quanto ela o/a descreve nos últimos 3 meses.',
    respondent: 'Criança ou adolescente',
    responseType: 'frequency0_2',
    responseLabels: SCARED_LABELS,
    items: SCARED_CHILD_ITEMS,
    scoring: { type: 'scared' },
  }),
  defineQuestionnaire({
    id: 'scared_pais',
    title: 'SCARED — Pais',
    description: 'Screen for Child Anxiety Related Disorders (versão pais).',
    instructions:
      'Leia cada frase e indique o quanto ela descreve o seu filho/a nos últimos 3 meses.',
    respondent: 'Pais',
    responseType: 'frequency0_2',
    responseLabels: SCARED_LABELS,
    items: SCARED_PARENT_ITEMS,
    scoring: { type: 'scared' },
  }),
]
