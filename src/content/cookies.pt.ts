import { publicAsset } from '../lib/publicAsset'
import { site } from './site.pt'

export const cookiePolicy = {
  title: 'Política de Cookies',
  lastUpdated: '12 de julho de 2026',
  intro:
    'Esta política explica o que são cookies, como são utilizados no website da Daniela Santos Psicologia e quais as suas opções para os gerir.',
  sections: [
    {
      id: 'o-que-sao',
      title: '1. O que são cookies?',
      paragraphs: [
        'Cookies são pequenos ficheiros de texto armazenados no seu dispositivo (computador, telemóvel ou tablet) quando visita um website. Permitem que o site funcione corretamente ou recolham informação sobre a forma como o utiliza.',
        'Este website não utiliza cookies próprios para publicidade ou criação de perfis. Apenas recorre a serviços de terceiros que podem colocar cookies ou tratar dados técnicos quando carrega determinados conteúdos.',
      ],
    },
    {
      id: 'responsavel',
      title: '2. Responsável pelo tratamento',
      paragraphs: [
        `${site.name}`,
        site.address.full,
        `Email: ${site.email}`,
        site.tagline,
      ],
    },
    {
      id: 'cookies-utilizados',
      title: '3. Cookies e tecnologias utilizadas neste website',
      paragraphs: [
        'Na data desta política, o website utiliza os seguintes serviços de terceiros:',
      ],
      list: [
        {
          name: 'Google Fonts',
          purpose:
            'Carregamento dos tipos de letra utilizados no site (Nunito e Caveat), para garantir a apresentação visual correta das páginas.',
          provider: 'Google Ireland Limited',
          cookies: 'Pode envolver o tratamento de endereço IP e dados técnicos pelo fornecedor.',
          moreInfo: 'https://policies.google.com/privacy',
        },
        {
          name: 'Google Maps',
          purpose:
            'Exibição da localização da clínica na secção de contacto. O mapa só é carregado após o seu clique, para evitar cookies antes dessa ação.',
          provider: 'Google Ireland Limited',
          cookies: 'Pode definir cookies quando o mapa é carregado ou quando abre o Google Maps.',
          moreInfo: 'https://policies.google.com/privacy',
        },
      ],
    },
    {
      id: 'finalidade',
      title: '4. Finalidade do tratamento',
      paragraphs: [
        'Os dados tratados através destas tecnologias destinam-se exclusivamente a:',
      ],
      bullets: [
        'Assegurar o funcionamento e a apresentação do website;',
        'Mostrar a morada da clínica através do mapa, quando o solicitar;',
        'Não utilizamos cookies para publicidade, marketing ou criação de perfis de visitantes.',
      ],
    },
    {
      id: 'base-legal',
      title: '5. Base legal',
      paragraphs: [
        'O tratamento de dados associado ao funcionamento do website assenta no interesse legítimo em disponibilizar informação sobre a clínica e os seus serviços (artigo 6.º, n.º 1, alínea f) do RGPD), sem prejuízo do seu direito de se opor quando aplicável.',
        'Quando carrega voluntariamente o mapa do Google Maps, está a solicitar esse conteúdo de terceiros, que pode tratar dados segundo a respetiva política.',
      ],
    },
    {
      id: 'gestao',
      title: '6. Como gerir ou desativar cookies',
      paragraphs: [
        'Pode configurar o seu browser para bloquear ou apagar cookies. Consulte a ajuda do seu navegador:',
      ],
      bullets: [
        'Google Chrome — Definições → Privacidade e segurança → Cookies',
        'Safari — Definições → Privacidade',
        'Firefox — Definições → Privacidade e segurança',
        'Microsoft Edge — Definições → Cookies e permissões do site',
      ],
      afterBullets: [
        'Se desativar cookies, algumas funcionalidades — como o mapa incorporado — podem deixar de funcionar corretamente. Pode sempre consultar a morada da clínica na secção de contacto ou abrir o Google Maps através do link disponível.',
      ],
    },
    {
      id: 'conservacao',
      title: '7. Prazo de conservação',
      paragraphs: [
        'A conservação de cookies de terceiros depende das políticas dos respetivos fornecedores. O seu browser pode eliminar cookies automaticamente ao fechar a sessão ou conforme as definições que escolher.',
        'A preferência de consentimento para cookies neste site (quando aceite o aviso) é guardada localmente no seu dispositivo até a remover.',
      ],
    },
    {
      id: 'direitos',
      title: '8. Os seus direitos',
      paragraphs: [
        'Nos termos do Regulamento Geral sobre a Proteção de Dados (RGPD), pode exercer os direitos de acesso, retificação, apagamento, limitação, oposição e portabilidade, quando aplicáveis.',
        `Para exercer os seus direitos, contacte-nos através de ${site.email}.`,
        'Para mais informação sobre o tratamento de dados na clínica, consulte o documento de consentimento informado e proteção de dados disponível no rodapé do website.',
        'Tem ainda o direito de apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD): www.cnpd.pt',
      ],
    },
    {
      id: 'alteracoes',
      title: '9. Alterações a esta política',
      paragraphs: [
        'Podemos atualizar esta política sempre que alterarmos o website ou os serviços de terceiros utilizados. A data da última atualização é indicada no topo desta página.',
      ],
    },
  ],
  dataProtectionPdf: publicAsset('docs/consentimento-e-protecao-dados-2026.pdf'),
} as const
