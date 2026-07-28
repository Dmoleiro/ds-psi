import type { Vol6IndicatorGroup } from './piccaVol6Content'

export const PICCA_VOL6_SINTESE_GROUPS: Vol6IndicatorGroup[] = [
  {
    id: 'matriz_transversal',
    title: 'Matriz transversal — indicadores gerais',
    items: [
      {
        id: 'matriz_1',
        label:
          'As dificuldades tiveram início no período do desenvolvimento ou tornaram-se evidentes quando as exigências ultrapassaram as capacidades.',
      },
      {
        id: 'matriz_2',
        label:
          'O padrão é persistente e não se limita a uma fase breve, crise situacional ou alteração aguda.',
      },
      {
        id: 'matriz_3',
        label:
          'Existe discrepância clinicamente relevante face ao esperado para a idade, escolaridade, experiência e contexto sociocultural.',
      },
      {
        id: 'matriz_4',
        label:
          'Há impacto funcional na aprendizagem, comunicação, autonomia, comportamento, relações ou participação social.',
      },
      {
        id: 'matriz_5',
        label:
          'As dificuldades estão presentes em mais de um contexto, quando a natureza do quadro assim o exige.',
      },
      {
        id: 'matriz_6',
        label: 'Foram recolhidos dados de múltiplos informantes e métodos.',
      },
      {
        id: 'matriz_7',
        label:
          'Foram consideradas condições médicas, neurológicas, sensoriais, do sono e efeitos de medicação.',
      },
      {
        id: 'matriz_8',
        label:
          'Foram consideradas experiências adversas, ansiedade, humor, trauma, fatores familiares e qualidade das oportunidades educativas.',
      },
      {
        id: 'matriz_9',
        label:
          'Foram consideradas diferenças linguísticas, culturais e de exposição pedagógica.',
      },
      {
        id: 'matriz_10',
        label: 'O perfil inclui forças, interesses, competências preservadas e fatores protetores.',
      },
    ],
  },
  {
    id: 'decisao_clinica',
    title: 'Decisão e próximos passos',
    items: [
      {
        id: 'decisao_1',
        label: 'A hipótese principal está sustentada por dados de múltiplas fontes.',
      },
      {
        id: 'decisao_2',
        label: 'Os critérios de duração, início, contexto e impacto estão documentados.',
      },
      {
        id: 'decisao_3',
        label: 'As hipóteses diferenciais prioritárias foram avaliadas.',
      },
      { id: 'decisao_4', label: 'As comorbilidades foram consideradas.' },
      {
        id: 'decisao_5',
        label:
          'Foi avaliada a necessidade de referenciação médica, neuropediátrica, pedopsiquiátrica, terapia da fala, terapia ocupacional ou apoio educativo.',
      },
      {
        id: 'decisao_6',
        label: 'Foram identificadas adaptações imediatas para casa e escola.',
      },
      {
        id: 'decisao_7',
        label: 'Foi definido plano de intervenção e monitorização.',
      },
      { id: 'decisao_8', label: 'Foi definida data de reavaliação.' },
    ],
  },
]
