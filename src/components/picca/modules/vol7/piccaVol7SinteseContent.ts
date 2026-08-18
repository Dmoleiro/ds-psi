import type { Vol7IndicatorGroup } from './piccaVol7Content'

export const PICCA_VOL7_SINTESE_MODULE_ID = 'picca-vol7-mod34' as const
export const PICCA_VOL7_SINTESE_NUMBER = 34

export const PICCA_VOL7_SINTESE_TEXT_FIELDS = [
  'Motivo da avaliação',
  'História desenvolvimental e contexto familiar',
  'Integração dos resultados dos checklists DC:0–5',
  'Hipóteses clínicas e fatores predisponentes, precipitantes, perpetuantes e protetores',
  'Objetivos terapêuticos e recomendações',
  'Devolução aos pais/cuidadores em linguagem acessível',
  'Recomendações para a escola',
] as const

export const PICCA_VOL7_SINTESE_GROUPS: Vol7IndicatorGroup[] = [
  {
    id: 'capitulos',
    title: 'Capítulos DC:0–5 explorados',
    items: [
      { id: 'capitulos_1', label: 'Cap. 1 — Perturbações do neurodesenvolvimento' },
      { id: 'capitulos_2', label: 'Cap. 2 — Perturbações de ansiedade' },
      { id: 'capitulos_3', label: 'Cap. 3 — Sono, alimentação e choro' },
      { id: 'capitulos_4', label: 'Cap. 4 — Perturbações do humor' },
      { id: 'capitulos_5', label: 'Cap. 5 — POC e perturbações relacionadas' },
      { id: 'capitulos_6', label: 'Checklist de observação sistemática (Manual Clínico)' },
    ],
  },
  {
    id: 'matriz',
    title: 'Matriz transversal — critérios clínicos gerais',
    items: [
      {
        id: 'matriz_1',
        label:
          'As dificuldades tiveram início no período do desenvolvimento (0–5 anos) ou tornaram-se evidentes quando as exigências ultrapassaram as capacidades.',
      },
      {
        id: 'matriz_2',
        label:
          'O padrão é persistente e não se limita a uma fase breve, crise situacional ou alteração aguda.',
      },
      {
        id: 'matriz_3',
        label:
          'Existe discrepância clinicamente relevante face ao esperado para a idade, exposição e contexto sociocultural.',
      },
      {
        id: 'matriz_4',
        label:
          'Há impacto funcional na comunicação, autorregulação, sono, alimentação, relações, brincadeira ou participação familiar/escolar.',
      },
      {
        id: 'matriz_5',
        label:
          'As dificuldades estão presentes em mais de um contexto, quando a natureza do quadro assim o exige.',
      },
      { id: 'matriz_6', label: 'Foram recolhidos dados de múltiplos informantes e métodos.' },
      {
        id: 'matriz_7',
        label:
          'Foram consideradas condições médicas, neurológicas, sensoriais, do sono, alimentares e efeitos de medicação.',
      },
      {
        id: 'matriz_8',
        label:
          'Foram consideradas experiências adversas, qualidade da vinculação, fatores familiares e oportunidades educativas.',
      },
      {
        id: 'matriz_9',
        label: 'O perfil inclui forças, interesses, competências preservadas e fatores protetores.',
      },
    ],
  },
  {
    id: 'decisao',
    title: 'Decisão clínica e próximos passos',
    items: [
      { id: 'decisao_1', label: 'A hipótese principal está sustentada por dados convergentes.' },
      { id: 'decisao_2', label: 'Os critérios de duração, início, contexto e impacto estão documentados.' },
      { id: 'decisao_3', label: 'As hipóteses diferenciais prioritárias foram avaliadas.' },
      { id: 'decisao_4', label: 'As comorbilidades entre capítulos DC:0–5 foram consideradas.' },
      {
        id: 'decisao_5',
        label:
          'Foi avaliada a necessidade de referenciação médica, neuropediátrica, pedopsiquiátrica, terapia da fala, terapia ocupacional ou apoio educativo.',
      },
      { id: 'decisao_6', label: 'Foram identificadas adaptações imediatas para casa e escola.' },
      { id: 'decisao_7', label: 'Foi definido plano de intervenção e monitorização.' },
      { id: 'decisao_8', label: 'Foi definida data de reavaliação.' },
    ],
  },
]
