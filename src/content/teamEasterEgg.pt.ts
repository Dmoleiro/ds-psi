import { publicAsset } from '../lib/publicAsset'
import type { TeamMember } from './team.pt'

export const hiddenTeamMember = {
  id: 'daniel-ferreira',
  name: 'Daniel Ferreira',
  role: 'Homem dos 7 ofícios & Engenheiro de Software',
  tagline: 'Se a diretora clínica imagina e sonha, eu faço acontecer.',
  intro:
    'Sócio honorário, marido e responsável por tudo o que acontece nos bastidores da clínica — da manutenção à programação, das finanças à gestão de pacientes e cotações de provas, do arranque do PICCA às ferramentas de avaliação.',
  availabilityNote: 'Função crítica nos bastidores',
  easterEgg: true,
  portrait: {
    src: publicAsset('images/team/daniel-ferreira.png'),
    alt: 'Daniel Ferreira — homem dos 7 ofícios da clínica',
    align: {
      layer: true,
      layerFrame: {
        width: '161.76%',
        height: '221.76%',
        transform: 'translate(calc(-70%), calc(-31%))',
      },
    },
  },
  practiceAreas: [
    {
      title: 'Manutenção da clínica',
      description:
        'Eletricidade, reparações, «isto ainda aguenta?» e intervenções de última hora antes da consulta das 9h',
    },
    {
      title: 'Tecnologia',
      description: 'Site público, backoffice, bases de dados e botões que por vezes funcionam à primeira',
    },
    {
      title: 'Finanças e arranque',
      description: 'Apoio financeiro, burocracia e sonhos de negócio no arranque da clínica',
    },
    {
      title: 'PICCA e avaliações',
      description: 'Programação e apoio técnico no arranque das ferramentas clínicas de avaliação',
    },
    {
      title: 'Gestão operacional',
      description:
        'Gestão de pacientes, cotações de provas e apoio à diretora clínica no dia a dia da clínica',
    },
    {
      title: 'Moral e snacks',
      description: 'Fornecedor ocasional de café, paciência e encorajamento à diretora clínica',
    },
  ],
  approach: [
    'Google antes de chamar um profissional',
    '«Já está quase» como filosofia de vida',
    'Ler o manual quando existe',
    'Amor incondicional pela diretora clínica',
    'Compromisso sério com tudo o que não é consulta',
  ],
  approachTitle: 'A minha abordagem (não clínica)',
  closing:
    'Se não for terapia, provavelmente fui eu. A clínica funciona porque há quem cuide do que não se vê no site.',
} satisfies TeamMember & { easterEgg: true }
