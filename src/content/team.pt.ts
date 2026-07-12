import { publicAsset } from '../lib/publicAsset'
import type { PortraitImage } from '../lib/portraitAlign'

export interface TeamAudience {
  title: string
  items: string[]
}

export interface TeamPracticeArea {
  title: string
  description: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  tagline?: string
  intro: string
  portrait: PortraitImage
  audiences?: TeamAudience[]
  credentials?: string[]
  practiceAreas?: TeamPracticeArea[]
  approach: string[]
  closing?: string
}

export const teamPage = {
  title: 'Equipa',
  intro:
    'Além da direção clínica, a clínica conta com profissionais especializados em psicologia clínica e terapia da fala, em colaboração estreita com famílias e escolas.',
  members: [
    {
      id: 'carolina-carmo',
      name: 'Carolina Carmo',
      role: 'Psicóloga Clínica',
      tagline: 'Apoiar hoje, para construir um amanhã mais leve e feliz.',
      intro:
        'A psicoterapia é um espaço seguro onde crianças e adolescentes podem compreender-se melhor, desenvolver competências e crescer com confiança.',
      portrait: {
        src: publicAsset('images/team/carolina-carmo.png'),
        alt: 'Carolina Carmo — Psicóloga Clínica',
        align: { scale: 1.35, x: 1, y: 13 },
      },
      audiences: [
        {
          title: 'Crianças',
          items: [
            'Dificuldades emocionais e comportamentais',
            'Ansiedade e medos',
            'Baixa autoestima',
            'Dificuldades escolares e de aprendizagem',
            'Alterações de humor e irritabilidade',
            'Desenvolvimento da autonomia',
            'Promoção do bem-estar e das competências socioemocionais',
          ],
        },
        {
          title: 'Adolescentes',
          items: [
            'Ansiedade, stress e ataques de pânico',
            'Baixa autoestima e insegurança',
            'Dificuldades na gestão das emoções',
            'Conflitos familiares e sociais',
            'Dificuldades escolares e orientação vocacional',
            'Identidade, autoestima e confiança',
            'Apoio em fases de mudança e tomada de decisão',
          ],
        },
      ],
      approach: [
        'Acolhimento e empatia',
        'Confidencialidade e ética profissional',
        'Escuta ativa e sem julgamentos',
        'Estratégias práticas e personalizadas',
      ],
      closing:
        'A psicologia é o caminho para mais equilíbrio, autoconhecimento e bem-estar.',
    },
    {
      id: 'tania-sanches',
      name: 'Tânia Sanches',
      role: 'Psicóloga Clínica',
      tagline: 'Cuidar da sua saúde mental é investir em si.',
      intro:
        'A psicoterapia é um espaço seguro, de acolhimento e confiança, onde pode compreender-se melhor, superar desafios e construir uma vida mais equilibrada e feliz.',
      portrait: {
        src: publicAsset('images/team/tania-sanches.png'),
        alt: 'Tânia Sanches — Psicóloga Clínica',
        align: { scale: 1.12, x: 2, y: 1 },
      },
      audiences: [
        {
          title: 'Crianças',
          items: [
            'Dificuldades emocionais',
            'Ansiedade e stress',
            'Baixa autoestima',
            'Dificuldades escolares',
            'Problemas de comportamento',
            'Promoção do bem-estar e desenvolvimento emocional',
          ],
        },
        {
          title: 'Adolescentes',
          items: [
            'Ansiedade, stress e humor',
            'Autoestima e identidade',
            'Dificuldades nas relações',
            'Gestão emocional',
            'Conflitos familiares',
            'Apoio em fases de mudança e tomada de decisão',
          ],
        },
        {
          title: 'Adultos',
          items: [
            'Ansiedade, stress e burnout',
            'Depressão e alterações de humor',
            'Baixa autoestima',
            'Dificuldades nos relacionamentos',
            'Gestão de emoções',
            'Desenvolvimento pessoal e qualidade de vida',
          ],
        },
      ],
      approach: [
        'Acolhimento e empatia',
        'Confidencialidade e ética profissional',
        'Escuta ativa e sem julgamentos',
        'Estratégias práticas e personalizadas',
      ],
      closing:
        'Cuidar de si é o primeiro passo para uma vida com mais equilíbrio e bem-estar.',
    },
    {
      id: 'vera-cordeiro',
      name: 'Vera Cordeiro',
      role: 'Terapeuta da Fala',
      tagline: 'Comunicar é mais do que falar, é conectar com o mundo.',
      intro:
        'A Terapia da Fala promove o desenvolvimento da comunicação, da linguagem e das competências essenciais para uma vida com mais autonomia e confiança.',
      portrait: {
        src: publicAsset('images/team/vera-cordeiro.png'),
        alt: 'Vera Cordeiro — Terapeuta da Fala',
        align: { scale: 1.8, x: 9, y: 20 },
      },
      credentials: [
        'Licenciada pela Escola Superior de Saúde do Alcoitão desde 2012',
        'Mestre em Motricidade Orofacial e Deglutição',
        'Doutoranda em Ciências da Cognição e da Linguagem',
        'Vasta experiência com crianças e adultos',
        'Abordagem centrada na pessoa e no seu processo de desenvolvimento individual',
      ],
      practiceAreas: [
        {
          title: 'Linguagem',
          description: 'Compreensão e expressão oral e escrita',
        },
        {
          title: 'Fala',
          description: 'Articulação e clareza da fala',
        },
        {
          title: 'Motricidade Orofacial',
          description: 'Funções orofaciais e respiração oral',
        },
        {
          title: 'Deglutição',
          description: 'Avaliação e intervenção em disfagias',
        },
        {
          title: 'Leitura e Escrita',
          description: 'Dificuldades de aprendizagem e compreensão',
        },
        {
          title: 'Perturbações do Desenvolvimento',
          description:
            'Apoio em perturbações do espetro do autismo e outras condições',
        },
      ],
      approach: [
        'Avaliação personalizada',
        'Intervenção baseada na evidência',
        'Acompanhamento próximo e contínuo',
        'Envolvimento da família',
        'Foco na autonomia e na qualidade de vida',
      ],
      closing: 'Cada palavra conta. Cada conquista transforma.',
    },
  ] satisfies TeamMember[],
} as const
