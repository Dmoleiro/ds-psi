import type { QuestionnaireItem } from '../types.js'
import { defineQuestionnaire } from '../helpers.js'

const FREQ4 = ['Nunca', 'Poucas vezes', 'Muitas vezes', 'Sempre'] as const
const YES_NO = ['Não', 'Sim'] as const

function freqItem(id: string, text: string): QuestionnaireItem {
  return { id, text, options: [...FREQ4] }
}

function yesNoItem(id: string, text: string): QuestionnaireItem {
  return { id, text, options: [...YES_NO] }
}

function textItem(id: string, text: string, inputType: 'text' | 'textarea' = 'text'): QuestionnaireItem {
  return { id, text, inputType }
}

const PSVC_ITEMS: QuestionnaireItem[] = [
  textItem('q1_school_bedtime', 'Habitualmente, a que horas se deita o seu filho(a)? (dias de escola)'),
  textItem('q1_weekend_bedtime', 'Habitualmente, a que horas se deita o seu filho(a)? (fins-de-semana)'),
  {
    id: 'q2_bedtime_reason',
    text: 'O seu filho(a) deita-se a uma determinada hora porque (indique só uma resposta):',
    options: [
      'Está de acordo com a rotina familiar',
      'Tem sono na altura',
      'É quando o seu programa de televisão acaba',
      'É quando os seus irmãos se deitam',
      'Tem de dormir o “suficiente” para as actividades do dia seguinte',
      'Outra',
    ],
  },
  {
    id: 'q3_sleep_onset',
    text: 'Habitualmente, quanto tempo leva o seu filho(a) para adormecer?',
    options: ['menos de 10 min', '10-30 min', 'mais de 30 min'],
  },
  freqItem('q4a', 'Adormece sozinho na própria cama?'),
  freqItem('q4b', 'Adormece na cama dos pais?'),
  freqItem(
    'q4c',
    'Precisa de uma coisa especial para adormecer (chuchar o dedo, boneca, fralda, etc.)?',
  ),
  freqItem('q4d', 'Precisa de luz para adormecer?'),
  freqItem('q4e', 'Precisa da presença dos pais, no quarto, para adormecer?'),
  freqItem('q4f', 'Está disposto a ir para a cama na hora de deitar?'),
  freqItem(
    'q4g',
    'Não quer ir para a cama na hora de deitar (chora, grita, inventa desculpas, etc.)?',
  ),
  textItem(
    'q5_school_sleep_hours',
    'Em média, quantas horas dorme o seu filho(a) durante a noite? (dias de escola)',
  ),
  textItem(
    'q5_weekend_sleep_hours',
    'Em média, quantas horas dorme o seu filho(a) durante a noite? (fins-de-semana)',
  ),
  {
    id: 'q5_1_night_wakes',
    text: 'Habitualmente, quantas vezes o seu filho(a) acorda durante a noite?',
    options: ['0 vezes', '1 vez', '2 vezes', '3 vezes', 'mais que 3 vezes'],
  },
  freqItem(
    'q5_2',
    'Quando o seu filho(a) acorda durante a noite, habitualmente consegue voltar a adormecer sozinho?',
  ),
  freqItem('q6a', 'Ressona alto?'),
  freqItem('q6b', 'Faz xixi na cama?'),
  freqItem('q6c', 'Tem pesadelos (sonhos maus)?'),
  freqItem('q6d', 'Levanta-se e anda enquanto está a dormir?'),
  freqItem('q6e', 'Fala enquanto está a dormir?'),
  freqItem(
    'q6f',
    'Começa de repente a gritar como se estivesse muito aflito, não se lembrando de nada quando acorda?',
  ),
  freqItem('q6g', 'Range os dentes enquanto está a dormir?'),
  freqItem('q6h', 'Tem medo de dormir no escuro?'),
  textItem('q7_school_wake', 'Habitualmente, a que horas o seu filho(a) acorda? (dias de escola)'),
  textItem('q7_weekend_wake', 'Habitualmente, a que horas o seu filho(a) acorda? (fins-de-semana)'),
  {
    id: 'q8_wake_reason',
    text: 'Habitualmente, o que acorda o seu filho(a) de manhã? (indique só uma resposta)',
    options: [
      'Despertador',
      'Um dos pais ou outro membro da família',
      'Barulho',
      'Vontade de ir ao quarto de banho',
      'Acorda por si',
      'Outra',
    ],
  },
  freqItem('q9', 'O seu filho costuma dormir a sesta?'),
  freqItem('q10', 'Habitualmente, o seu filho(a) tem sono durante o dia?'),
  freqItem('q11', 'Habitualmente, o seu filho(a) parece cansado durante o dia?'),
  freqItem('q12', 'Habitualmente, o seu filho(a) anda irritado durante o dia?'),
  yesNoItem('q13', 'Acha que o seu filho(a) tem algum problema em dormir?'),
  yesNoItem(
    'q14',
    'Já alguma vez procurou um médico ou um psicólogo por causa de um problema de sono do seu filho(a)?',
  ),
  yesNoItem('q15', 'O seu filho(a) toma medicamentos para o ajudar a dormir?'),
  textItem('q15_medication_name', 'Se toma medicamentos para dormir, indique o nome:'),
  yesNoItem('q16_epilepsy', 'O seu filho(a) tem epilepsia?'),
  yesNoItem('q16_asthma', 'O seu filho(a) tem asma?'),
  yesNoItem('q16_bronchitis', 'O seu filho(a) tem bronquite?'),
  yesNoItem('q16_cerebral_palsy', 'O seu filho(a) tem paralisia cerebral?'),
  yesNoItem('q16_diabetes', 'O seu filho(a) tem diabetes?'),
  yesNoItem('q16_intellectual_delay', 'O seu filho(a) tem atraso mental?'),
  yesNoItem('q16_autism', 'O seu filho(a) tem autismo infantil?'),
  yesNoItem('q16_asperger', 'O seu filho(a) tem síndroma de Asperger?'),
  textItem(
    'q16_other_conditions',
    'Se o seu filho(a) sofre de outros problemas de saúde, indique quais:',
    'textarea',
  ),
]

export const psvcQuestionnaire = defineQuestionnaire({
  id: 'psvc',
  title: 'PSVC — Questionário do Padrão Sono-Vigília de Crianças',
  description:
    'Avaliação de hábitos, comportamentos e problemas de sono em crianças (Clemente et al., 1997).',
  instructions:
    'Responda a todas as questões tendo em conta os últimos 6 meses. Para horários e durações, indique horas e minutos quando aplicável.',
  respondent: 'Pais',
  responseType: 'forced_choice',
  items: PSVC_ITEMS,
  scoring: { type: 'custom', compute: () => ({}) },
})
