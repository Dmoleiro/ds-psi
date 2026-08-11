import { defineQuestionnaire } from '../helpers.js'

const CARS_DOMAINS = [
  'I — Relação com pessoas',
  'II — Imitação',
  'III — Resposta emocional',
  'IV — Uso corporal',
  'V — Uso de objectos',
  'VI — Adaptação à mudança',
  'VII — Resposta visual',
  'VIII — Resposta auditiva',
  'IX — Resposta ao paladar, olfacto e tacto',
  'X — Medo ou ansiedade',
  'XI — Comunicação verbal',
  'XII — Comunicação não verbal',
  'XIII — Nível de actividade',
  'XIV — Nível e consistência da resposta intelectual',
  'XV — Impressão global',
]

export const carsQuestionnaire = defineQuestionnaire({
  id: 'cars',
  title: 'CARS',
  description: 'Childhood Autism Rating Scale — escala de cotação comportamental.',
  instructions:
    'Para cada domínio, assinale a pontuação de 1 a 4 conforme a gravidade observada (1 = sem anomalia, 4 = severamente anormal).',
  respondent: 'Clínico',
  responseType: 'rating4',
  responseLabels: ['1 — Normal', '2 — Ligeiramente anormal', '3 — Moderadamente anormal', '4 — Severamente anormal'],
  items: CARS_DOMAINS,
  scoring: { type: 'cars_total' },
})
