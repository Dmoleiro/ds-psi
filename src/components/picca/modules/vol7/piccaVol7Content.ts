// Auto-generated from PICCA Volume VII DC:0-5 checklist docx sources

export type Vol7IndicatorAnswer = {
  resposta: '' | 'sim' | 'nao' | 'nao_observado'
  observacoes: string
}

export type Vol7IndicatorItem = { id: string; label: string }
export type Vol7IndicatorGroup = { id: string; title: string; items: Vol7IndicatorItem[] }

export type Vol7FooterSection = { id: string; title: string; hint: string }

export type Vol7DisorderDefinition = {
  moduleId: string
  number: number
  title: string
  chapter: string
  chapterLabel: string
  guidance: string
  threeColumn: boolean
  groups: Vol7IndicatorGroup[]
  footerSections: Vol7FooterSection[]
}

export const PICCA_VOL7_DISORDERS: Vol7DisorderDefinition[] = [
  {
    moduleId: "picca-vol7-mod1",
    number: 1,
    title: "Perturbação do Espetro do Autismo",
    chapter: "cap1",
    chapterLabel: "Cap. 1 — Neurodesenvolvimento",
    guidance: "",
    threeColumn: true,
    groups: [
      {
        id: "perturba_o_do_espetro_do_autis_g1",
        title: "Indicadores clínicos",
        items: [
          { id: "perturba_o_do_espetro_do_autis_g1_i1", label: "Apresenta dificuldades persistentes na reciprocidade socioemocional" },
          { id: "perturba_o_do_espetro_do_autis_g1_i2", label: "Mostra reduzida iniciativa para iniciar interação social" },
          { id: "perturba_o_do_espetro_do_autis_g1_i3", label: "Responde de forma limitada às iniciativas sociais dos outros" },
          { id: "perturba_o_do_espetro_do_autis_g1_i4", label: "O contacto ocular é reduzido, pouco integrado ou pouco funcional" },
          { id: "perturba_o_do_espetro_do_autis_g1_i5", label: "Utiliza poucos gestos comunicativos" },
          { id: "perturba_o_do_espetro_do_autis_g1_i6", label: "Integra pouco o olhar, os gestos, a expressão facial e a linguagem" },
          { id: "perturba_o_do_espetro_do_autis_g1_i7", label: "Apresenta dificuldade na atenção conjunta" },
          { id: "perturba_o_do_espetro_do_autis_g1_i8", label: "Mostra dificuldade em partilhar interesses ou prazer com outras pessoas" },
          { id: "perturba_o_do_espetro_do_autis_g1_i9", label: "Apresenta dificuldade em compreender ou utilizar sinais sociais" },
          { id: "perturba_o_do_espetro_do_autis_g1_i10", label: "A interação com pares encontra-se abaixo do esperado para a idade" },
          { id: "perturba_o_do_espetro_do_autis_g1_i11", label: "A brincadeira social é limitada" },
          { id: "perturba_o_do_espetro_do_autis_g1_i12", label: "A brincadeira simbólica é reduzida, repetitiva ou pouco espontânea" },
          { id: "perturba_o_do_espetro_do_autis_g1_i13", label: "Apresenta comportamentos motores repetitivos" },
          { id: "perturba_o_do_espetro_do_autis_g1_i14", label: "Utiliza objetos de forma repetitiva ou pouco funcional" },
          { id: "perturba_o_do_espetro_do_autis_g1_i15", label: "Apresenta fala repetitiva, ecolalia ou linguagem estereotipada" },
          { id: "perturba_o_do_espetro_do_autis_g1_i16", label: "Demonstra necessidade significativa de rotina ou previsibilidade" },
          { id: "perturba_o_do_espetro_do_autis_g1_i17", label: "Reage intensamente a alterações inesperadas" },
          { id: "perturba_o_do_espetro_do_autis_g1_i18", label: "Apresenta interesses muito restritos ou intensos" },
          { id: "perturba_o_do_espetro_do_autis_g1_i19", label: "Demonstra hiper ou hiporreatividade sensorial" },
          { id: "perturba_o_do_espetro_do_autis_g1_i20", label: "Procura estímulos sensoriais de forma invulgar ou repetitiva" },
          { id: "perturba_o_do_espetro_do_autis_g1_i21", label: "As manifestações surgem no período inicial do desenvolvimento" },
          { id: "perturba_o_do_espetro_do_autis_g1_i22", label: "Existe impacto significativo no funcionamento familiar, social ou escolar" },
        ],
      },
    ],
    footerSections: [
      {
        id: "perturba_o_do_espetro_do_autis_f1",
        title: "Áreas que requerem exploração complementar",
        hint: "• Comunicação social:☐ adequada☐ dificuldade ligeira☐ dificuldade moderada☐ dificuldade marcada\n• Comportamentos restritos/repetitivos:☐ ausentes☐ ocasionais☐ frequentes☐ muito frequentes\n• Processamento sensorial:☐ aparentemente adequado☐ hiperreatividade☐ hiporreatividade☐ procura sensorial☐ perfil misto",
      },
      {
        id: "perturba_o_do_espetro_do_autis_f2",
        title: "Diagnóstico diferencial a considerar",
        hint: "• Perturbação do Desenvolvimento da Linguagem\n• Atraso Global do Desenvolvimento\n• Deficiência intelectual\n• Ansiedade social\n• Mutismo seletivo\n• Perturbações da vinculação\n• Dificuldades sensoriais\n• Défice auditivo",
      },
      {
        id: "perturba_o_do_espetro_do_autis_f3",
        title: "Instrumentos que podem complementar a avaliação",
        hint: "• ADOS-2\n• CARS-2\n• M-CHAT-R/F\n• Vineland\n• Griffiths III\n• avaliação da linguagem\n• avaliação do processamento sensorial",
      },
      {
        id: "perturba_o_do_espetro_do_autis_f4",
        title: "Síntese clínica",
        hint: "• Número de indicadores assinalados: ______\n• Impacto funcional:☐ reduzido☐ moderado☐ significativo\n• Hipótese clínica: ______________________________________\n• Necessita avaliação específica de PEA: ☐ Sim ☐ Não",
      },
    ],
  },
  {
    moduleId: "picca-vol7-mod2",
    number: 2,
    title: "Perturbação do Espetro do Autismo Atípica Precoce",
    chapter: "cap1",
    chapterLabel: "Cap. 1 — Neurodesenvolvimento",
    guidance: "",
    threeColumn: true,
    groups: [
      {
        id: "perturba_o_do_espetro_do_autis_g1",
        title: "Esta categoria do DC:0–5 permite considerar crianças muito pequenas que apresentam alterações relevantes relacionadas com o espetro do autismo, mas cujo perfil ainda não se apresenta suficientemente consolidado para uma classificação típica de PEA.",
        items: [
          { id: "perturba_o_do_espetro_do_autis_g1_i1", label: "Existem dificuldades significativas na reciprocidade social" },
          { id: "perturba_o_do_espetro_do_autis_g1_i2", label: "O contacto ocular apresenta qualidade atípica" },
          { id: "perturba_o_do_espetro_do_autis_g1_i3", label: "A atenção conjunta é inconsistente ou reduzida" },
          { id: "perturba_o_do_espetro_do_autis_g1_i4", label: "A criança partilha pouco interesses ou experiências" },
          { id: "perturba_o_do_espetro_do_autis_g1_i5", label: "A comunicação não verbal apresenta alterações" },
          { id: "perturba_o_do_espetro_do_autis_g1_i6", label: "Existem comportamentos repetitivos" },
          { id: "perturba_o_do_espetro_do_autis_g1_i7", label: "Existem interesses restritos" },
          { id: "perturba_o_do_espetro_do_autis_g1_i8", label: "Apresenta alterações sensoriais relevantes" },
          { id: "perturba_o_do_espetro_do_autis_g1_i9", label: "Existe rigidez comportamental" },
          { id: "perturba_o_do_espetro_do_autis_g1_i10", label: "O jogo simbólico está abaixo do esperado" },
          { id: "perturba_o_do_espetro_do_autis_g1_i11", label: "Os sinais são clinicamente relevantes, embora ainda incompletos ou pouco consistentes" },
          { id: "perturba_o_do_espetro_do_autis_g1_i12", label: "Existe impacto funcional" },
        ],
      },
    ],
    footerSections: [
    ],
  },
  {
    moduleId: "picca-vol7-mod3",
    number: 3,
    title: "Perturbação de Hiperatividade e Défice de Atenção – PHDA",
    chapter: "cap1",
    chapterLabel: "Cap. 1 — Neurodesenvolvimento",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_de_hiperatividade_e_g1",
        title: "Domínio da desatenção",
        items: [
          { id: "perturba_o_de_hiperatividade_e_g1_i1", label: "Mantém a atenção durante períodos claramente inferiores ao esperado para a idade" },
          { id: "perturba_o_de_hiperatividade_e_g1_i2", label: "Perde rapidamente o interesse nas tarefas" },
          { id: "perturba_o_de_hiperatividade_e_g1_i3", label: "Abandona atividades antes de as concluir" },
          { id: "perturba_o_de_hiperatividade_e_g1_i4", label: "Necessita de redirecionamento frequente pelo adulto" },
          { id: "perturba_o_de_hiperatividade_e_g1_i5", label: "Parece não ouvir quando lhe falam diretamente" },
          { id: "perturba_o_de_hiperatividade_e_g1_i6", label: "Distrai-se facilmente com estímulos externos" },
          { id: "perturba_o_de_hiperatividade_e_g1_i7", label: "Muda frequentemente de atividade" },
          { id: "perturba_o_de_hiperatividade_e_g1_i8", label: "Tem dificuldade em seguir instruções sequenciais" },
          { id: "perturba_o_de_hiperatividade_e_g1_i9", label: "Esquece o que lhe foi pedido" },
          { id: "perturba_o_de_hiperatividade_e_g1_i10", label: "Demonstra dificuldade em organizar atividades" },
          { id: "perturba_o_de_hiperatividade_e_g1_i11", label: "Evita tarefas que exigem esforço mental sustentado" },
        ],
      },
      {
        id: "perturba_o_de_hiperatividade_e_g2",
        title: "Domínio da hiperatividade",
        items: [
          { id: "perturba_o_de_hiperatividade_e_g2_i1", label: "Apresenta atividade motora excessiva para o contexto" },
          { id: "perturba_o_de_hiperatividade_e_g2_i2", label: "Levanta-se repetidamente quando se espera que permaneça sentado" },
          { id: "perturba_o_de_hiperatividade_e_g2_i3", label: "Corre ou trepa em situações inadequadas" },
          { id: "perturba_o_de_hiperatividade_e_g2_i4", label: "Mexe continuamente mãos, pés ou objetos" },
          { id: "perturba_o_de_hiperatividade_e_g2_i5", label: "Parece estar constantemente em movimento" },
          { id: "perturba_o_de_hiperatividade_e_g2_i6", label: "Apresenta dificuldade em realizar atividades tranquilas" },
          { id: "perturba_o_de_hiperatividade_e_g2_i7", label: "Fala excessivamente" },
        ],
      },
      {
        id: "perturba_o_de_hiperatividade_e_g3",
        title: "Domínio da impulsividade",
        items: [
          { id: "perturba_o_de_hiperatividade_e_g3_i1", label: "Responde antes de a pergunta terminar" },
          { id: "perturba_o_de_hiperatividade_e_g3_i2", label: "Apresenta dificuldade em esperar pela sua vez" },
          { id: "perturba_o_de_hiperatividade_e_g3_i3", label: "Interrompe frequentemente adultos ou outras crianças" },
          { id: "perturba_o_de_hiperatividade_e_g3_i4", label: "Age antes de avaliar consequências" },
          { id: "perturba_o_de_hiperatividade_e_g3_i5", label: "Toca ou manipula objetos apesar das instruções para não o fazer" },
          { id: "perturba_o_de_hiperatividade_e_g3_i6", label: "Apresenta dificuldade em inibir respostas imediatas" },
          { id: "perturba_o_de_hiperatividade_e_g3_i7", label: "Os comportamentos são superiores ao esperado para a idade desenvolvimental" },
          { id: "perturba_o_de_hiperatividade_e_g3_i8", label: "O padrão é persistente" },
          { id: "perturba_o_de_hiperatividade_e_g3_i9", label: "O comportamento ocorre em mais do que um contexto" },
          { id: "perturba_o_de_hiperatividade_e_g3_i10", label: "Existe impacto no funcionamento familiar" },
          { id: "perturba_o_de_hiperatividade_e_g3_i11", label: "Existe impacto no contexto educativo" },
          { id: "perturba_o_de_hiperatividade_e_g3_i12", label: "Existem dificuldades nas relações com pares" },
          { id: "perturba_o_de_hiperatividade_e_g3_i13", label: "As manifestações não são melhor explicadas por outro quadro clínico" },
        ],
      },
    ],
    footerSections: [
      {
        id: "perturba_o_de_hiperatividade_e_f1",
        title: "Diagnóstico diferencial",
        hint: "• desenvolvimento normativo/temperamento ativo\n• atraso global do desenvolvimento\n• perturbação da linguagem\n• PEA\n• ansiedade\n• alterações do sono\n• trauma\n• dificuldades de regulação emocional\n• alterações sensoriais\n• condições médicas.",
      },
    ],
  },
  {
    moduleId: "picca-vol7-mod4",
    number: 4,
    title: "Perturbação de Hiperatividade da Primeira Infância",
    chapter: "cap1",
    chapterLabel: "Cap. 1 — Neurodesenvolvimento",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_de_hiperatividade_d_g1",
        title: "Overactivity Disorder of Toddlerhood",
        items: [
        ],
      },
      {
        id: "perturba_o_de_hiperatividade_d_g2",
        title: "O DC:0–5 inclui uma categoria desenvolvimental destinada a crianças mais pequenas que apresentam níveis clinicamente significativos de hiperatividade e impulsividade antes de ser apropriado estabelecer uma PHDA típica.",
        items: [
          { id: "perturba_o_de_hiperatividade_d_g2_i1", label: "Atividade motora claramente excessiva para a idade" },
          { id: "perturba_o_de_hiperatividade_d_g2_i2", label: "Dificuldade extrema em permanecer parado" },
          { id: "perturba_o_de_hiperatividade_d_g2_i3", label: "Corre, sobe ou explora continuamente o ambiente" },
          { id: "perturba_o_de_hiperatividade_d_g2_i4", label: "Necessita de supervisão muito superior ao esperado" },
          { id: "perturba_o_de_hiperatividade_d_g2_i5", label: "Passa rapidamente de uma atividade para outra" },
          { id: "perturba_o_de_hiperatividade_d_g2_i6", label: "Tem dificuldade em brincar tranquilamente" },
          { id: "perturba_o_de_hiperatividade_d_g2_i7", label: "Apresenta impulsividade significativa" },
          { id: "perturba_o_de_hiperatividade_d_g2_i8", label: "Mostra dificuldade marcada em esperar" },
          { id: "perturba_o_de_hiperatividade_d_g2_i9", label: "Age frequentemente sem considerar risco" },
          { id: "perturba_o_de_hiperatividade_d_g2_i10", label: "Os cuidadores referem dificuldade importante na gestão do comportamento" },
          { id: "perturba_o_de_hiperatividade_d_g2_i11", label: "As manifestações excedem claramente a variabilidade normal da idade" },
          { id: "perturba_o_de_hiperatividade_d_g2_i12", label: "Existe prejuízo funcional" },
        ],
      },
    ],
    footerSections: [
    ],
  },
  {
    moduleId: "picca-vol7-mod5",
    number: 5,
    title: "Atraso Global do Desenvolvimento",
    chapter: "cap1",
    chapterLabel: "Cap. 1 — Neurodesenvolvimento",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "atraso_global_do_desenvolvimen_g1",
        title: "Desenvolvimento cognitivo",
        items: [
          { id: "atraso_global_do_desenvolvimen_g1_i1", label: "Resolução de problemas abaixo do esperado" },
          { id: "atraso_global_do_desenvolvimen_g1_i2", label: "Aquisição lenta de novos conceitos" },
          { id: "atraso_global_do_desenvolvimen_g1_i3", label: "Dificuldade na aprendizagem por imitação" },
          { id: "atraso_global_do_desenvolvimen_g1_i4", label: "Brincadeira abaixo do nível esperado" },
        ],
      },
      {
        id: "atraso_global_do_desenvolvimen_g2",
        title: "Linguagem",
        items: [
          { id: "atraso_global_do_desenvolvimen_g2_i1", label: "Linguagem expressiva atrasada" },
          { id: "atraso_global_do_desenvolvimen_g2_i2", label: "Linguagem compreensiva atrasada" },
          { id: "atraso_global_do_desenvolvimen_g2_i3", label: "Vocabulário inferior ao esperado" },
          { id: "atraso_global_do_desenvolvimen_g2_i4", label: "Comunicação funcional limitada" },
        ],
      },
      {
        id: "atraso_global_do_desenvolvimen_g3",
        title: "Motricidade",
        items: [
          { id: "atraso_global_do_desenvolvimen_g3_i1", label: "Atraso da motricidade global" },
          { id: "atraso_global_do_desenvolvimen_g3_i2", label: "Atraso da motricidade fina" },
          { id: "atraso_global_do_desenvolvimen_g3_i3", label: "Dificuldades de equilíbrio/coordenação" },
          { id: "atraso_global_do_desenvolvimen_g3_i4", label: "Aquisição tardia de marcos motores" },
        ],
      },
      {
        id: "atraso_global_do_desenvolvimen_g4",
        title: "Desenvolvimento social e adaptativo",
        items: [
          { id: "atraso_global_do_desenvolvimen_g4_i1", label: "Autonomia inferior ao esperado" },
          { id: "atraso_global_do_desenvolvimen_g4_i2", label: "Competências sociais imaturas" },
          { id: "atraso_global_do_desenvolvimen_g4_i3", label: "Necessita de ajuda significativa nas atividades quotidianas" },
          { id: "atraso_global_do_desenvolvimen_g4_i4", label: "Adaptação funcional abaixo da idade cronológica" },
        ],
      },
    ],
    footerSections: [
    ],
  },
  {
    moduleId: "picca-vol7-mod6",
    number: 6,
    title: "Perturbação do Desenvolvimento da Linguagem",
    chapter: "cap1",
    chapterLabel: "Cap. 1 — Neurodesenvolvimento",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_do_desenvolvimento_g1",
        title: "Linguagem recetiva",
        items: [
          { id: "perturba_o_do_desenvolvimento_g1_i1", label: "Apresenta dificuldade na compreensão de vocabulário" },
          { id: "perturba_o_do_desenvolvimento_g1_i2", label: "Apresenta dificuldade na compreensão de frases" },
          { id: "perturba_o_do_desenvolvimento_g1_i3", label: "Não compreende instruções esperadas para a idade" },
          { id: "perturba_o_do_desenvolvimento_g1_i4", label: "Necessita frequentemente de repetição" },
          { id: "perturba_o_do_desenvolvimento_g1_i5", label: "Tem dificuldade em compreender perguntas" },
          { id: "perturba_o_do_desenvolvimento_g1_i6", label: "Demonstra dificuldade em conceitos espaciais, temporais ou quantitativos" },
        ],
      },
      {
        id: "perturba_o_do_desenvolvimento_g2",
        title: "Linguagem expressiva",
        items: [
          { id: "perturba_o_do_desenvolvimento_g2_i1", label: "Vocabulário reduzido" },
          { id: "perturba_o_do_desenvolvimento_g2_i2", label: "Frases mais simples do que o esperado" },
          { id: "perturba_o_do_desenvolvimento_g2_i3", label: "Erros morfossintáticos persistentes" },
          { id: "perturba_o_do_desenvolvimento_g2_i4", label: "Dificuldade em organizar discurso" },
          { id: "perturba_o_do_desenvolvimento_g2_i5", label: "Dificuldade em narrar acontecimentos" },
          { id: "perturba_o_do_desenvolvimento_g2_i6", label: "Dificuldade em encontrar palavras" },
        ],
      },
      {
        id: "perturba_o_do_desenvolvimento_g3",
        title: "Funcionamento",
        items: [
          { id: "perturba_o_do_desenvolvimento_g3_i1", label: "As dificuldades interferem na comunicação quotidiana" },
          { id: "perturba_o_do_desenvolvimento_g3_i2", label: "Interferem na relação com pares" },
          { id: "perturba_o_do_desenvolvimento_g3_i3", label: "Interferem na aprendizagem" },
          { id: "perturba_o_do_desenvolvimento_g3_i4", label: "Não são explicadas apenas por reduzida exposição linguística" },
          { id: "perturba_o_do_desenvolvimento_g3_i5", label: "É necessário excluir alterações auditivas" },
        ],
      },
    ],
    footerSections: [
      {
        id: "perturba_o_do_desenvolvimento_f1",
        title: "Diagnóstico diferencial",
        hint: "• défice auditivo\n• PEA\n• atraso global do desenvolvimento\n• deficiência intelectual\n• perturbação dos sons da fala\n• dificuldades de comunicação social\n• exposição insuficiente à língua.",
      },
    ],
  },
  {
    moduleId: "picca-vol7-mod7",
    number: 7,
    title: "Perturbação de Hiper-reatividade Sensorial",
    chapter: "cap1",
    chapterLabel: "Cap. 1 — Neurodesenvolvimento",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_de_hiper_reatividad_g1",
        title: "Indicadores clínicos",
        items: [
          { id: "perturba_o_de_hiper_reatividad_g1_i1", label: "Reage excessivamente a sons" },
          { id: "perturba_o_de_hiper_reatividad_g1_i2", label: "Evita determinados tecidos ou texturas" },
          { id: "perturba_o_de_hiper_reatividad_g1_i3", label: "Reage intensamente ao toque" },
          { id: "perturba_o_de_hiper_reatividad_g1_i4", label: "Demonstra desconforto com higiene ou cuidados pessoais" },
          { id: "perturba_o_de_hiper_reatividad_g1_i5", label: "Reage intensamente a determinados cheiros" },
          { id: "perturba_o_de_hiper_reatividad_g1_i6", label: "Apresenta seletividade alimentar associada a características sensoriais" },
          { id: "perturba_o_de_hiper_reatividad_g1_i7", label: "Evita ambientes visualmente intensos" },
          { id: "perturba_o_de_hiper_reatividad_g1_i8", label: "Reage excessivamente ao movimento" },
          { id: "perturba_o_de_hiper_reatividad_g1_i9", label: "O comportamento interfere nas rotinas" },
          { id: "perturba_o_de_hiper_reatividad_g1_i10", label: "Existe sofrimento ou prejuízo funcional" },
        ],
      },
    ],
    footerSections: [
    ],
  },
  {
    moduleId: "picca-vol7-mod8",
    number: 8,
    title: "Perturbação de Hipo-reatividade Sensorial",
    chapter: "cap1",
    chapterLabel: "Cap. 1 — Neurodesenvolvimento",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_de_hipo_reatividade_g1",
        title: "Indicadores clínicos",
        items: [
          { id: "perturba_o_de_hipo_reatividade_g1_i1", label: "Responde pouco ao toque" },
          { id: "perturba_o_de_hipo_reatividade_g1_i2", label: "Parece não reagir adequadamente a sons" },
          { id: "perturba_o_de_hipo_reatividade_g1_i3", label: "Demonstra pouca consciência de estímulos ambientais" },
          { id: "perturba_o_de_hipo_reatividade_g1_i4", label: "Reage de forma lenta a estímulos" },
          { id: "perturba_o_de_hipo_reatividade_g1_i5", label: "Parece necessitar de estímulos mais intensos para responder" },
          { id: "perturba_o_de_hipo_reatividade_g1_i6", label: "Demonstra pouca resposta a dor ou temperatura" },
          { id: "perturba_o_de_hipo_reatividade_g1_i7", label: "O comportamento interfere na exploração ou aprendizagem" },
        ],
      },
    ],
    footerSections: [
    ],
  },
  {
    moduleId: "picca-vol7-mod9",
    number: 9,
    title: "Outra Perturbação do Processamento Sensorial",
    chapter: "cap1",
    chapterLabel: "Cap. 1 — Neurodesenvolvimento",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "outra_perturba_o_do_processame_g1",
        title: "Assinalar os sistemas envolvidos:",
        items: [
        ],
      },
      {
        id: "outra_perturba_o_do_processame_g2",
        title: "Padrão predominante:",
        items: [
        ],
      },
      {
        id: "outra_perturba_o_do_processame_g3",
        title: "Indicadores funcionais",
        items: [
          { id: "outra_perturba_o_do_processame_g3_i1", label: "Interfere na alimentação" },
          { id: "outra_perturba_o_do_processame_g3_i2", label: "Interfere no sono" },
          { id: "outra_perturba_o_do_processame_g3_i3", label: "Interfere na higiene" },
          { id: "outra_perturba_o_do_processame_g3_i4", label: "Interfere na participação escolar" },
          { id: "outra_perturba_o_do_processame_g3_i5", label: "Interfere na brincadeira" },
          { id: "outra_perturba_o_do_processame_g3_i6", label: "Interfere na interação social" },
          { id: "outra_perturba_o_do_processame_g3_i7", label: "Provoca desregulação emocional ou comportamental" },
          { id: "outra_perturba_o_do_processame_g3_i8", label: "Comunicação social" },
          { id: "outra_perturba_o_do_processame_g3_i9", label: "Linguagem" },
          { id: "outra_perturba_o_do_processame_g3_i10", label: "Cognição" },
          { id: "outra_perturba_o_do_processame_g3_i11", label: "Atenção" },
          { id: "outra_perturba_o_do_processame_g3_i12", label: "Hiperatividade" },
          { id: "outra_perturba_o_do_processame_g3_i13", label: "Impulsividade" },
          { id: "outra_perturba_o_do_processame_g3_i14", label: "Motricidade" },
          { id: "outra_perturba_o_do_processame_g3_i15", label: "Processamento sensorial" },
          { id: "outra_perturba_o_do_processame_g3_i16", label: "Autonomia" },
          { id: "outra_perturba_o_do_processame_g3_i17", label: "Regulação emocional" },
        ],
      },
    ],
    footerSections: [
    ],
  },
  {
    moduleId: "picca-vol7-mod10",
    number: 10,
    title: "Perturbação de Ansiedade de Separação",
    chapter: "cap2",
    chapterLabel: "Cap. 2 — Ansiedade",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_de_ansiedade_de_sep_g1",
        title: "Reação à separação",
        items: [
          { id: "perturba_o_de_ansiedade_de_sep_g1_i1", label: "Demonstra sofrimento intenso quando se separa da principal figura de referência" },
          { id: "perturba_o_de_ansiedade_de_sep_g1_i2", label: "Antecipar a separação provoca ansiedade significativa" },
          { id: "perturba_o_de_ansiedade_de_sep_g1_i3", label: "Chora de forma intensa perante separações habituais" },
          { id: "perturba_o_de_ansiedade_de_sep_g1_i4", label: "Procura constantemente confirmar onde está o cuidador" },
          { id: "perturba_o_de_ansiedade_de_sep_g1_i5", label: "Tem dificuldade em permanecer na escola sem o cuidador" },
          { id: "perturba_o_de_ansiedade_de_sep_g1_i6", label: "Necessita frequentemente da presença física do cuidador para se acalmar" },
        ],
      },
      {
        id: "perturba_o_de_ansiedade_de_sep_g2",
        title: "Preocupações",
        items: [
          { id: "perturba_o_de_ansiedade_de_sep_g2_i1", label: "Demonstra receio persistente de perder os pais ou cuidadores" },
          { id: "perturba_o_de_ansiedade_de_sep_g2_i2", label: "Manifesta preocupação exagerada com acidentes ou doenças dos cuidadores" },
          { id: "perturba_o_de_ansiedade_de_sep_g2_i3", label: "Evita situações que impliquem afastamento" },
        ],
      },
      {
        id: "perturba_o_de_ansiedade_de_sep_g3",
        title: "Funcionamento",
        items: [
          { id: "perturba_o_de_ansiedade_de_sep_g3_i1", label: "O comportamento interfere na adaptação escolar" },
          { id: "perturba_o_de_ansiedade_de_sep_g3_i2", label: "Interfere na participação em atividades sociais" },
          { id: "perturba_o_de_ansiedade_de_sep_g3_i3", label: "Limita a autonomia esperada para a idade" },
          { id: "perturba_o_de_ansiedade_de_sep_g3_i4", label: "O impacto mantém-se ao longo do tempo" },
        ],
      },
    ],
    footerSections: [
      {
        id: "perturba_o_de_ansiedade_de_sep_f1",
        title: "Diagnóstico diferencial",
        hint: "• adaptação escolar inicial\n• ansiedade normativa do desenvolvimento\n• perturbações da vinculação\n• trauma\n• PEA\n• condições médicas.",
      },
    ],
  },
  {
    moduleId: "picca-vol7-mod11",
    number: 11,
    title: "Perturbação de Ansiedade Social",
    chapter: "cap2",
    chapterLabel: "Cap. 2 — Ansiedade",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_de_ansiedade_social_g1",
        title: "Interação com adultos",
        items: [
          { id: "perturba_o_de_ansiedade_social_g1_i1", label: "Evita interagir com adultos desconhecidos" },
          { id: "perturba_o_de_ansiedade_social_g1_i2", label: "Necessita de muito tempo para estabelecer contacto" },
          { id: "perturba_o_de_ansiedade_social_g1_i3", label: "Mantém-se constantemente junto do cuidador" },
        ],
      },
      {
        id: "perturba_o_de_ansiedade_social_g2",
        title: "Interação com pares",
        items: [
          { id: "perturba_o_de_ansiedade_social_g2_i1", label: "Evita brincar com outras crianças" },
          { id: "perturba_o_de_ansiedade_social_g2_i2", label: "Participa pouco em atividades de grupo" },
          { id: "perturba_o_de_ansiedade_social_g2_i3", label: "Observa os pares sem se envolver" },
          { id: "perturba_o_de_ansiedade_social_g2_i4", label: "Evita iniciar contacto social" },
        ],
      },
      {
        id: "perturba_o_de_ansiedade_social_g3",
        title: "Respostas emocionais",
        items: [
          { id: "perturba_o_de_ansiedade_social_g3_i1", label: "Demonstra vergonha intensa em situações sociais" },
          { id: "perturba_o_de_ansiedade_social_g3_i2", label: "Chora ou bloqueia perante pessoas pouco familiares" },
          { id: "perturba_o_de_ansiedade_social_g3_i3", label: "Evita falar quando existem outras pessoas presentes" },
          { id: "perturba_o_de_ansiedade_social_g3_i4", label: "Mostra sinais físicos de ansiedade (tensão, rigidez, tremor)" },
        ],
      },
      {
        id: "perturba_o_de_ansiedade_social_g4",
        title: "Funcionamento",
        items: [
          { id: "perturba_o_de_ansiedade_social_g4_i1", label: "As dificuldades limitam a participação social" },
          { id: "perturba_o_de_ansiedade_social_g4_i2", label: "Existe impacto no contexto pré-escolar" },
          { id: "perturba_o_de_ansiedade_social_g4_i3", label: "O comportamento é observado em diferentes contextos" },
        ],
      },
    ],
    footerSections: [
      {
        id: "perturba_o_de_ansiedade_social_f1",
        title: "Diagnóstico diferencial",
        hint: "• timidez normativa\n• mutismo seletivo\n• PEA\n• perturbação da linguagem\n• perturbações da vinculação.",
      },
    ],
  },
  {
    moduleId: "picca-vol7-mod12",
    number: 12,
    title: "Perturbação de Ansiedade Generalizada",
    chapter: "cap2",
    chapterLabel: "Cap. 2 — Ansiedade",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_de_ansiedade_genera_g1",
        title: "Preocupação excessiva",
        items: [
          { id: "perturba_o_de_ansiedade_genera_g1_i1", label: "Demonstra preocupação frequente relativamente a várias situações" },
          { id: "perturba_o_de_ansiedade_genera_g1_i2", label: "Procura constantemente confirmação dos adultos" },
          { id: "perturba_o_de_ansiedade_genera_g1_i3", label: "Faz perguntas repetidas sobre acontecimentos futuros" },
          { id: "perturba_o_de_ansiedade_genera_g1_i4", label: "Tem dificuldade em tolerar a incerteza" },
        ],
      },
      {
        id: "perturba_o_de_ansiedade_genera_g2",
        title: "Sintomas associados",
        items: [
          { id: "perturba_o_de_ansiedade_genera_g2_i1", label: "Irritabilidade frequente" },
          { id: "perturba_o_de_ansiedade_genera_g2_i2", label: "Inquietação motora" },
          { id: "perturba_o_de_ansiedade_genera_g2_i3", label: "Dificuldade em relaxar" },
          { id: "perturba_o_de_ansiedade_genera_g2_i4", label: "Dificuldade em adormecer" },
          { id: "perturba_o_de_ansiedade_genera_g2_i5", label: "Queixas físicas recorrentes sem causa médica identificada" },
          { id: "perturba_o_de_ansiedade_genera_g2_i6", label: "Cansaço fácil" },
        ],
      },
      {
        id: "perturba_o_de_ansiedade_genera_g3",
        title: "Funcionamento",
        items: [
          { id: "perturba_o_de_ansiedade_genera_g3_i1", label: "As preocupações interferem nas rotinas diárias" },
          { id: "perturba_o_de_ansiedade_genera_g3_i2", label: "Existe impacto na aprendizagem" },
          { id: "perturba_o_de_ansiedade_genera_g3_i3", label: "Existe impacto nas relações familiares" },
        ],
      },
    ],
    footerSections: [
      {
        id: "perturba_o_de_ansiedade_genera_f1",
        title: "Diagnóstico diferencial",
        hint: "• ansiedade normativa\n• trauma\n• perturbações do sono\n• PHDA\n• perturbações médicas.",
      },
    ],
  },
  {
    moduleId: "picca-vol7-mod13",
    number: 13,
    title: "Mutismo Seletivo",
    chapter: "cap2",
    chapterLabel: "Cap. 2 — Ansiedade",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "mutismo_seletivo_g1",
        title: "Comunicação",
        items: [
          { id: "mutismo_seletivo_g1_i1", label: "Comunica normalmente em casa" },
          { id: "mutismo_seletivo_g1_i2", label: "Não comunica verbalmente na escola" },
          { id: "mutismo_seletivo_g1_i3", label: "Comunica apenas com pessoas específicas" },
          { id: "mutismo_seletivo_g1_i4", label: "Utiliza gestos em substituição da linguagem verbal" },
          { id: "mutismo_seletivo_g1_i5", label: "Evita responder quando lhe dirigem perguntas" },
        ],
      },
      {
        id: "mutismo_seletivo_g2",
        title: "Contexto",
        items: [
          { id: "mutismo_seletivo_g2_i1", label: "O comportamento ocorre apenas em determinados contextos" },
          { id: "mutismo_seletivo_g2_i2", label: "Existe sofrimento associado" },
          { id: "mutismo_seletivo_g2_i3", label: "Existe impacto na aprendizagem" },
          { id: "mutismo_seletivo_g2_i4", label: "Existe impacto nas relações sociais" },
        ],
      },
    ],
    footerSections: [
      {
        id: "mutismo_seletivo_f1",
        title: "Aspetos a excluir",
        hint: "• ☐ Alterações importantes da linguagem\n• ☐ Défice auditivo\n• ☐ PEA\n• ☐ Desconhecimento da língua utilizada",
      },
    ],
  },
  {
    moduleId: "picca-vol7-mod14",
    number: 14,
    title: "Perturbação de Inibição perante a Novidade",
    chapter: "cap2",
    chapterLabel: "Cap. 2 — Ansiedade",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_de_inibi_o_perante_g1",
        title: "Esta categoria é específica do DC:0–5 e destina-se a crianças muito pequenas que apresentam uma resposta persistentemente intensa de inibição perante pessoas, ambientes ou situações novas, para além do esperado para a idade.",
        items: [
          { id: "perturba_o_de_inibi_o_perante_g1_i1", label: "Evita explorar ambientes desconhecidos" },
          { id: "perturba_o_de_inibi_o_perante_g1_i2", label: "Mantém-se muito próximo do cuidador" },
          { id: "perturba_o_de_inibi_o_perante_g1_i3", label: "Demora excessivamente a adaptar-se a novos contextos" },
          { id: "perturba_o_de_inibi_o_perante_g1_i4", label: "Evita aproximar-se de pessoas desconhecidas" },
          { id: "perturba_o_de_inibi_o_perante_g1_i5", label: "Demonstra intensa hesitação perante novidades" },
          { id: "perturba_o_de_inibi_o_perante_g1_i6", label: "Necessita constantemente de confirmação do adulto" },
          { id: "perturba_o_de_inibi_o_perante_g1_i7", label: "Resiste à mudança de rotinas" },
          { id: "perturba_o_de_inibi_o_perante_g1_i8", label: "A resposta interfere na participação em atividades adequadas à idade" },
        ],
      },
    ],
    footerSections: [
      {
        id: "perturba_o_de_inibi_o_perante_f1",
        title: "Diagnóstico diferencial",
        hint: "• temperamento inibido\n• ansiedade social\n• ansiedade de separação\n• PEA\n• perturbações da vinculação.",
      },
    ],
  },
  {
    moduleId: "picca-vol7-mod15",
    number: 15,
    title: "Outra Perturbação de Ansiedade da Primeira Infância",
    chapter: "cap2",
    chapterLabel: "Cap. 2 — Ansiedade",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "outra_perturba_o_de_ansiedade_g1",
        title: "Utilizar quando existe um quadro de ansiedade clinicamente significativo que não corresponde de forma adequada às categorias anteriores.",
        items: [
          { id: "outra_perturba_o_de_ansiedade_g1_i1", label: "Existe sofrimento emocional significativo" },
          { id: "outra_perturba_o_de_ansiedade_g1_i2", label: "Existe evitamento persistente" },
          { id: "outra_perturba_o_de_ansiedade_g1_i3", label: "Existe prejuízo funcional" },
          { id: "outra_perturba_o_de_ansiedade_g1_i4", label: "Os sintomas mantêm-se ao longo do tempo" },
          { id: "outra_perturba_o_de_ansiedade_g1_i5", label: "Não são melhor explicados por outra perturbação" },
        ],
      },
    ],
    footerSections: [
      {
        id: "outra_perturba_o_de_ansiedade_f1",
        title: "Instrumentos que podem complementar a avaliação",
        hint: "• ☐ Entrevista clínica aos cuidadores\n• ☐ Observação direta\n• ☐ Observação em contexto educativo\n• ☐ CBCL / ASEBA\n• ☐ SDQ\n• ☐ SCARED (quando apropriado à idade)\n• ☐ Escalas de vinculação\n• ☐ Avaliação do desenvolvimento\n• ☐ Avaliação da linguagem\n• ☐ Outra: ____________________\n• SÍNTESE CLÍNICA\n• Área predominante\n• ☐ Separação\n• ☐ Ansiedade social\n• ☐ Preocupação generalizada\n• ☐ Comunicação seletiva\n• ☐ Inibição perante novidade\n• ☐ Outra\n• Hipótese clínica principal\n• Hipóteses diferenciais\n• Necessidade de referenciação\n• ☐ Psicologia\n• ☐ Pedopsiquiatria\n• ☐ Pediatria do Desenvolvimento\n• ☐ Terapia da Fala\n• ☐ Outra: _______________________\n• Observações clínicas\n• Nota de interpretação\n• Na primeira infância, manifestações de ansiedade podem fazer parte do desenvolvimento típico. A interpretação clínica deve integrar sempre a idade desenvolvimental, a persistência, a intensidade, a generalização entre contextos, o impacto funcional e a informação recolhida junto dos cuidadores, educadores e através da observação direta.",
      },
    ],
  },
  {
    moduleId: "picca-vol7-mod16",
    number: 16,
    title: "Perturbação do Início do Sono",
    chapter: "cap3",
    chapterLabel: "Cap. 3 — Sono, Alimentação e Choro",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_do_in_cio_do_sono_g1",
        title: "Indicadores clínicos",
        items: [
          { id: "perturba_o_do_in_cio_do_sono_g1_i1", label: "Demora muito tempo a adormecer de forma consistente" },
          { id: "perturba_o_do_in_cio_do_sono_g1_i2", label: "Necessita sempre da presença do cuidador para iniciar o sono" },
          { id: "perturba_o_do_in_cio_do_sono_g1_i3", label: "Apenas adormece através de embalo, colo ou amamentação" },
          { id: "perturba_o_do_in_cio_do_sono_g1_i4", label: "Resiste intensamente à hora de deitar" },
          { id: "perturba_o_do_in_cio_do_sono_g1_i5", label: "Chora frequentemente quando é colocado na cama" },
          { id: "perturba_o_do_in_cio_do_sono_g1_i6", label: "Sai repetidamente da cama ou chama os pais" },
          { id: "perturba_o_do_in_cio_do_sono_g1_i7", label: "O comportamento ocorre de forma persistente" },
          { id: "perturba_o_do_in_cio_do_sono_g1_i8", label: "Existe impacto no descanso da criança ou da família" },
        ],
      },
    ],
    footerSections: [
      {
        id: "perturba_o_do_in_cio_do_sono_f1",
        title: "Aspetos a excluir",
        hint: "• ☐ Dor\n• ☐ Refluxo\n• ☐ Apneia\n• ☐ Alterações neurológicas\n• ☐ Medicação\n• ☐ Ambiente inadequado",
      },
    ],
  },
  {
    moduleId: "picca-vol7-mod17",
    number: 17,
    title: "Perturbação dos Despertares Noturnos",
    chapter: "cap3",
    chapterLabel: "Cap. 3 — Sono, Alimentação e Choro",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_dos_despertares_not_g1",
        title: "Indicadores clínicos",
        items: [
          { id: "perturba_o_dos_despertares_not_g1_i1", label: "Acorda repetidamente durante a noite" },
          { id: "perturba_o_dos_despertares_not_g1_i2", label: "Necessita da intervenção do adulto para voltar a dormir" },
          { id: "perturba_o_dos_despertares_not_g1_i3", label: "Não consegue readormecer autonomamente" },
          { id: "perturba_o_dos_despertares_not_g1_i4", label: "O sono é muito fragmentado" },
          { id: "perturba_o_dos_despertares_not_g1_i5", label: "O padrão mantém-se ao longo do tempo" },
          { id: "perturba_o_dos_despertares_not_g1_i6", label: "Existe fadiga diurna" },
          { id: "perturba_o_dos_despertares_not_g1_i7", label: "Existe impacto familiar significativo" },
        ],
      },
    ],
    footerSections: [
    ],
  },
  {
    moduleId: "picca-vol7-mod18",
    number: 18,
    title: "Perturbação Parcial do Despertar",
    chapter: "cap3",
    chapterLabel: "Cap. 3 — Sono, Alimentação e Choro",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_parcial_do_desperta_g1",
        title: "Indicadores clínicos",
        items: [
          { id: "perturba_o_parcial_do_desperta_g1_i1", label: "Episódios de despertar parcial" },
          { id: "perturba_o_parcial_do_desperta_g1_i2", label: "Choro intenso durante o episódio" },
          { id: "perturba_o_parcial_do_desperta_g1_i3", label: "Confusão marcada" },
          { id: "perturba_o_parcial_do_desperta_g1_i4", label: "Difícil de consolar" },
          { id: "perturba_o_parcial_do_desperta_g1_i5", label: "Pouca consciência do ambiente" },
          { id: "perturba_o_parcial_do_desperta_g1_i6", label: "Não se recorda do episódio posteriormente (quando aplicável)" },
        ],
      },
    ],
    footerSections: [
    ],
  },
  {
    moduleId: "picca-vol7-mod19",
    number: 19,
    title: "Perturbação de Pesadelos da Primeira Infância",
    chapter: "cap3",
    chapterLabel: "Cap. 3 — Sono, Alimentação e Choro",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_de_pesadelos_da_pri_g1",
        title: "Indicadores clínicos",
        items: [
          { id: "perturba_o_de_pesadelos_da_pri_g1_i1", label: "Acorda assustado após sonhos perturbadores" },
          { id: "perturba_o_de_pesadelos_da_pri_g1_i2", label: "Demonstra medo de voltar a dormir" },
          { id: "perturba_o_de_pesadelos_da_pri_g1_i3", label: "Procura intensamente o cuidador" },
          { id: "perturba_o_de_pesadelos_da_pri_g1_i4", label: "O episódio interfere no descanso" },
          { id: "perturba_o_de_pesadelos_da_pri_g1_i5", label: "O padrão é recorrente" },
        ],
      },
    ],
    footerSections: [
      {
        id: "perturba_o_de_pesadelos_da_pri_f1",
        title: "IMPACTO FUNCIONAL DO SONO",
        hint: "• ☐ Irritabilidade\n• ☐ Sonolência diurna\n• ☐ Dificuldades de atenção\n• ☐ Alterações do comportamento\n• ☐ Conflitos familiares\n• ☐ Prejuízo no desenvolvimento\n• II. PERTURBAÇÕES DA ALIMENTAÇÃO",
      },
    ],
  },
  {
    moduleId: "picca-vol7-mod20",
    number: 20,
    title: "Perturbação de Subalimentação",
    chapter: "cap3",
    chapterLabel: "Cap. 3 — Sono, Alimentação e Choro",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_de_subalimenta_o_g1",
        title: "Indicadores clínicos",
        items: [
          { id: "perturba_o_de_subalimenta_o_g1_i1", label: "Ingestão insuficiente para a idade" },
          { id: "perturba_o_de_subalimenta_o_g1_i2", label: "Baixo interesse pela alimentação" },
          { id: "perturba_o_de_subalimenta_o_g1_i3", label: "Refeições muito prolongadas" },
          { id: "perturba_o_de_subalimenta_o_g1_i4", label: "Recusa persistente da alimentação" },
          { id: "perturba_o_de_subalimenta_o_g1_i5", label: "Crescimento ou ganho ponderal comprometido" },
          { id: "perturba_o_de_subalimenta_o_g1_i6", label: "Necessidade frequente de distrações para comer" },
          { id: "perturba_o_de_subalimenta_o_g1_i7", label: "Impacto no funcionamento familiar" },
        ],
      },
    ],
    footerSections: [
    ],
  },
  {
    moduleId: "picca-vol7-mod21",
    number: 21,
    title: "Perturbação de Sobrealimentação",
    chapter: "cap3",
    chapterLabel: "Cap. 3 — Sono, Alimentação e Choro",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_de_sobrealimenta_o_g1",
        title: "Indicadores clínicos",
        items: [
          { id: "perturba_o_de_sobrealimenta_o_g1_i1", label: "Procura constante de comida" },
          { id: "perturba_o_de_sobrealimenta_o_g1_i2", label: "Come rapidamente" },
          { id: "perturba_o_de_sobrealimenta_o_g1_i3", label: "Dificuldade em interromper a refeição" },
          { id: "perturba_o_de_sobrealimenta_o_g1_i4", label: "Come para além da saciedade" },
          { id: "perturba_o_de_sobrealimenta_o_g1_i5", label: "Procura alimentos repetidamente durante o dia" },
          { id: "perturba_o_de_sobrealimenta_o_g1_i6", label: "O comportamento interfere na rotina familiar" },
        ],
      },
    ],
    footerSections: [
    ],
  },
  {
    moduleId: "picca-vol7-mod22",
    number: 22,
    title: "Perturbação Alimentar Atípica",
    chapter: "cap3",
    chapterLabel: "Cap. 3 — Sono, Alimentação e Choro",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_alimentar_at_pica_g1",
        title: "Indicadores clínicos",
        items: [
          { id: "perturba_o_alimentar_at_pica_g1_i1", label: "Seletividade alimentar extrema" },
          { id: "perturba_o_alimentar_at_pica_g1_i2", label: "Recusa grupos completos de alimentos" },
          { id: "perturba_o_alimentar_at_pica_g1_i3", label: "Aceita apenas determinadas texturas" },
          { id: "perturba_o_alimentar_at_pica_g1_i4", label: "Rejeita alimentos pela cor, cheiro ou temperatura" },
          { id: "perturba_o_alimentar_at_pica_g1_i5", label: "Reações emocionais intensas perante novos alimentos" },
          { id: "perturba_o_alimentar_at_pica_g1_i6", label: "O comportamento compromete a variedade alimentar" },
          { id: "perturba_o_alimentar_at_pica_g1_i7", label: "Existe impacto nutricional ou familiar" },
        ],
      },
    ],
    footerSections: [
    ],
  },
  {
    moduleId: "picca-vol7-mod23",
    number: 23,
    title: "Pica",
    chapter: "cap3",
    chapterLabel: "Cap. 3 — Sono, Alimentação e Choro",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "pica_g1",
        title: "Indicadores clínicos",
        items: [
          { id: "pica_g1_i1", label: "Ingere substâncias não alimentares" },
          { id: "pica_g1_i2", label: "O comportamento é repetitivo" },
          { id: "pica_g1_i3", label: "Não corresponde ao esperado para a idade" },
          { id: "pica_g1_i4", label: "Existe risco médico associado" },
        ],
      },
    ],
    footerSections: [
    ],
  },
  {
    moduleId: "picca-vol7-mod24",
    number: 24,
    title: "Ruminação",
    chapter: "cap3",
    chapterLabel: "Cap. 3 — Sono, Alimentação e Choro",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "rumina_o_g1",
        title: "Indicadores clínicos",
        items: [
          { id: "rumina_o_g1_i1", label: "Regurgitação repetida dos alimentos" },
          { id: "rumina_o_g1_i2", label: "Remastigação dos alimentos" },
          { id: "rumina_o_g1_i3", label: "O comportamento não é explicado por doença gastrointestinal" },
          { id: "rumina_o_g1_i4", label: "Existe impacto nutricional" },
        ],
      },
    ],
    footerSections: [
    ],
  },
  {
    moduleId: "picca-vol7-mod25",
    number: 25,
    title: "Perturbação do Choro Excessivo",
    chapter: "cap3",
    chapterLabel: "Cap. 3 — Sono, Alimentação e Choro",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_do_choro_excessivo_g1",
        title: "Frequência",
        items: [
          { id: "perturba_o_do_choro_excessivo_g1_i1", label: "Chora durante grande parte do dia" },
          { id: "perturba_o_do_choro_excessivo_g1_i2", label: "O choro é difícil de interromper" },
          { id: "perturba_o_do_choro_excessivo_g1_i3", label: "Ocorre sem desencadeante evidente" },
          { id: "perturba_o_do_choro_excessivo_g1_i4", label: "Surge repetidamente ao longo do dia" },
        ],
      },
      {
        id: "perturba_o_do_choro_excessivo_g2",
        title: "Consolação",
        items: [
          { id: "perturba_o_do_choro_excessivo_g2_i1", label: "Não acalma facilmente com estratégias habituais" },
          { id: "perturba_o_do_choro_excessivo_g2_i2", label: "Necessita de longos períodos para recuperar" },
          { id: "perturba_o_do_choro_excessivo_g2_i3", label: "O cuidador refere sentir-se incapaz de o consolar" },
        ],
      },
      {
        id: "perturba_o_do_choro_excessivo_g3",
        title: "Funcionamento",
        items: [
          { id: "perturba_o_do_choro_excessivo_g3_i1", label: "Interfere significativamente nas rotinas familiares" },
          { id: "perturba_o_do_choro_excessivo_g3_i2", label: "Provoca elevada sobrecarga parental" },
          { id: "perturba_o_do_choro_excessivo_g3_i3", label: "Interfere no sono" },
          { id: "perturba_o_do_choro_excessivo_g3_i4", label: "Interfere na alimentação" },
        ],
      },
    ],
    footerSections: [
    ],
  },
  {
    moduleId: "picca-vol7-mod26",
    number: 26,
    title: "Perturbação Depressiva da Primeira Infância",
    chapter: "cap4",
    chapterLabel: "Cap. 4 — Humor",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_depressiva_da_prime_g1",
        title: "A. Humor e Afeto",
        items: [
          { id: "perturba_o_depressiva_da_prime_g1_i1", label: "Apresenta humor persistentemente triste ou abatido" },
          { id: "perturba_o_depressiva_da_prime_g1_i2", label: "Demonstra pouca expressão de alegria" },
          { id: "perturba_o_depressiva_da_prime_g1_i3", label: "Sorri ou ri menos do que o esperado para a idade" },
          { id: "perturba_o_depressiva_da_prime_g1_i4", label: "Parece emocionalmente desligado do ambiente" },
          { id: "perturba_o_depressiva_da_prime_g1_i5", label: "Mostra reduzida reatividade emocional a acontecimentos positivos" },
        ],
      },
      {
        id: "perturba_o_depressiva_da_prime_g2",
        title: "B. Interesse e Brincadeira",
        items: [
          { id: "perturba_o_depressiva_da_prime_g2_i1", label: "Perde interesse por brincadeiras anteriormente apreciadas" },
          { id: "perturba_o_depressiva_da_prime_g2_i2", label: "Participa pouco em atividades espontâneas" },
          { id: "perturba_o_depressiva_da_prime_g2_i3", label: "Necessita de grande incentivo para brincar" },
          { id: "perturba_o_depressiva_da_prime_g2_i4", label: "Demonstra pouca curiosidade pelo ambiente" },
        ],
      },
      {
        id: "perturba_o_depressiva_da_prime_g3",
        title: "C. Regulação Emocional",
        items: [
          { id: "perturba_o_depressiva_da_prime_g3_i1", label: "Chora facilmente" },
          { id: "perturba_o_depressiva_da_prime_g3_i2", label: "Apresenta irritabilidade frequente" },
          { id: "perturba_o_depressiva_da_prime_g3_i3", label: "Recupera lentamente após frustração" },
          { id: "perturba_o_depressiva_da_prime_g3_i4", label: "Demonstra pouca capacidade de autoconsolo" },
        ],
      },
      {
        id: "perturba_o_depressiva_da_prime_g4",
        title: "D. Funcionamento Diário",
        items: [
          { id: "perturba_o_depressiva_da_prime_g4_i1", label: "Alterações do sono" },
          { id: "perturba_o_depressiva_da_prime_g4_i2", label: "Alterações do apetite" },
          { id: "perturba_o_depressiva_da_prime_g4_i3", label: "Diminuição da energia" },
          { id: "perturba_o_depressiva_da_prime_g4_i4", label: "Menor participação social" },
          { id: "perturba_o_depressiva_da_prime_g4_i5", label: "Redução da autonomia habitual" },
        ],
      },
      {
        id: "perturba_o_depressiva_da_prime_g5",
        title: "E. Relações",
        items: [
          { id: "perturba_o_depressiva_da_prime_g5_i1", label: "Procura menos a interação com cuidadores" },
          { id: "perturba_o_depressiva_da_prime_g5_i2", label: "Demonstra menor envolvimento com pares" },
          { id: "perturba_o_depressiva_da_prime_g5_i3", label: "Apresenta menor reciprocidade social" },
        ],
      },
    ],
    footerSections: [
      {
        id: "perturba_o_depressiva_da_prime_f1",
        title: "Diagnóstico diferencial",
        hint: "• ☐ Reação de adaptação\n• ☐ Luto\n• ☐ Trauma\n• ☐ Perturbação da vinculação\n• ☐ Atraso global do desenvolvimento\n• ☐ Perturbação do espetro do autismo\n• ☐ Condição médica\n• ☐ Outro: __________________",
      },
    ],
  },
  {
    moduleId: "picca-vol7-mod27",
    number: 27,
    title: "Perturbação Mista da Expressão Emocional",
    chapter: "cap4",
    chapterLabel: "Cap. 4 — Humor",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_mista_da_express_o_g1",
        title: "Indicadores clínicos",
        items: [
          { id: "perturba_o_mista_da_express_o_g1_i1", label: "Alterna rapidamente entre tristeza, irritabilidade e ansiedade" },
          { id: "perturba_o_mista_da_express_o_g1_i2", label: "As emoções parecem desproporcionadas ao contexto" },
          { id: "perturba_o_mista_da_express_o_g1_i3", label: "Demonstra dificuldade em identificar ou expressar emoções" },
          { id: "perturba_o_mista_da_express_o_g1_i4", label: "Apresenta reações emocionais imprevisíveis" },
          { id: "perturba_o_mista_da_express_o_g1_i5", label: "O humor varia significativamente ao longo do dia" },
          { id: "perturba_o_mista_da_express_o_g1_i6", label: "Existe dificuldade persistente de autorregulação" },
          { id: "perturba_o_mista_da_express_o_g1_i7", label: "O funcionamento familiar é afetado" },
          { id: "perturba_o_mista_da_express_o_g1_i8", label: "Existe impacto na adaptação escolar" },
        ],
      },
    ],
    footerSections: [
      {
        id: "perturba_o_mista_da_express_o_f1",
        title: "Diagnóstico diferencial",
        hint: "• ☐ Ansiedade\n• ☐ Trauma\n• ☐ Perturbações da vinculação\n• ☐ Alterações sensoriais\n• ☐ PHDA\n• ☐ PEA\n• ☐ Outro: ___________________",
      },
    ],
  },
  {
    moduleId: "picca-vol7-mod28",
    number: 28,
    title: "Outra Perturbação do Humor da Primeira Infância",
    chapter: "cap4",
    chapterLabel: "Cap. 4 — Humor",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "outra_perturba_o_do_humor_da_p_g1",
        title: "Indicadores clínicos",
        items: [
          { id: "outra_perturba_o_do_humor_da_p_g1_i1", label: "Existe alteração persistente do humor" },
          { id: "outra_perturba_o_do_humor_da_p_g1_i2", label: "O padrão difere claramente do funcionamento habitual da criança" },
          { id: "outra_perturba_o_do_humor_da_p_g1_i3", label: "As alterações provocam sofrimento" },
          { id: "outra_perturba_o_do_humor_da_p_g1_i4", label: "Existe prejuízo funcional" },
          { id: "outra_perturba_o_do_humor_da_p_g1_i5", label: "Não é melhor explicado por outra condição clínica" },
        ],
      },
    ],
    footerSections: [
    ],
  },
  {
    moduleId: "picca-vol7-mod29",
    number: 29,
    title: "Irritabilidade Persistente",
    chapter: "cap4",
    chapterLabel: "Cap. 4 — Humor",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "irritabilidade_persistente_g1",
        title: "Embora a irritabilidade possa ocorrer em diversas perturbações, a sua avaliação sistemática é fundamental na primeira infância.",
        items: [
          { id: "irritabilidade_persistente_g1_i1", label: "Irritabilidade presente na maior parte dos dias" },
          { id: "irritabilidade_persistente_g1_i2", label: "Birras muito intensas para a idade" },
          { id: "irritabilidade_persistente_g1_i3", label: "Reações explosivas perante pequenas frustrações" },
          { id: "irritabilidade_persistente_g1_i4", label: "Recuperação lenta após episódios emocionais" },
          { id: "irritabilidade_persistente_g1_i5", label: "Humor irritável entre episódios" },
          { id: "irritabilidade_persistente_g1_i6", label: "Dificuldade persistente em aceitar limites" },
          { id: "irritabilidade_persistente_g1_i7", label: "As manifestações ocorrem em diferentes contextos" },
          { id: "irritabilidade_persistente_g1_i8", label: "Existe impacto familiar significativo" },
        ],
      },
    ],
    footerSections: [
      {
        id: "irritabilidade_persistente_f1",
        title: "Instrumentos que podem complementar a avaliação",
        hint: "• ☐ ASEBA (CBCL/C-TRF)\n• ☐ SDQ\n• ☐ Escalas de desenvolvimento\n• ☐ Avaliação da vinculação\n• ☐ Avaliação do funcionamento familiar\n• ☐ Avaliação do desenvolvimento cognitivo\n• ☐ Avaliação da linguagem\n• SÍNTESE CLÍNICA\n• Área predominante\n• ☐ Humor deprimido\n• ☐ Irritabilidade\n• ☐ Oscilação emocional\n• ☐ Redução do interesse\n• ☐ Outra\n• Hipótese clínica principal\n• Hipóteses diferenciais\n• Necessidade de referenciação\n• ☐ Psicologia\n• ☐ Pedopsiquiatria\n• ☐ Pediatria do Desenvolvimento\n• ☐ Outra: _______________________\n• Observações clínicas\n• Nota de interpretação clínica\n• Na primeira infância, alterações do humor devem ser interpretadas considerando a etapa do desenvolvimento, a duração e a intensidade das manifestações, a sua presença em diferentes contextos e o impacto no funcionamento global da criança. É igualmente importante excluir condições médicas, alterações do neurodesenvolvimento, experiências traumáticas e dificuldades relacionais que possam explicar ou contribuir para o quadro observado.",
      },
    ],
  },
  {
    moduleId: "picca-vol7-mod30",
    number: 30,
    title: "Perturbação Obsessivo-compulsiva",
    chapter: "cap5",
    chapterLabel: "Cap. 5 — POC",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "perturba_o_obsessivo_compulsiv_g1",
        title: "A. Pensamentos e preocupações persistentes",
        items: [
          { id: "perturba_o_obsessivo_compulsiv_g1_i1", label: "Demonstra preocupação intensa e repetitiva com um mesmo tema" },
          { id: "perturba_o_obsessivo_compulsiv_g1_i2", label: "Procura constantemente confirmação dos adultos" },
          { id: "perturba_o_obsessivo_compulsiv_g1_i3", label: "Mostra dificuldade em interromper determinadas ideias ou perguntas" },
          { id: "perturba_o_obsessivo_compulsiv_g1_i4", label: "Fica muito perturbado quando não obtém resposta ou segurança" },
          { id: "perturba_o_obsessivo_compulsiv_g1_i5", label: "As preocupações interferem na brincadeira ou nas rotinas" },
        ],
      },
      {
        id: "perturba_o_obsessivo_compulsiv_g2",
        title: "B. Comportamentos repetitivos",
        items: [
          { id: "perturba_o_obsessivo_compulsiv_g2_i1", label: "Repete ações de forma rígida ou ritualizada" },
          { id: "perturba_o_obsessivo_compulsiv_g2_i2", label: "Insiste em realizar determinadas sequências sempre da mesma forma" },
          { id: "perturba_o_obsessivo_compulsiv_g2_i3", label: "Repete verificações ou confirmações" },
          { id: "perturba_o_obsessivo_compulsiv_g2_i4", label: "Demonstra necessidade de alinhar, organizar ou ordenar objetos repetidamente" },
          { id: "perturba_o_obsessivo_compulsiv_g2_i5", label: "Fica muito angustiado quando os rituais são interrompidos" },
          { id: "perturba_o_obsessivo_compulsiv_g2_i6", label: "Os comportamentos ocupam uma parte importante das rotinas diárias" },
        ],
      },
      {
        id: "perturba_o_obsessivo_compulsiv_g3",
        title: "C. Impacto funcional",
        items: [
          { id: "perturba_o_obsessivo_compulsiv_g3_i1", label: "Interfere na participação em atividades diárias" },
          { id: "perturba_o_obsessivo_compulsiv_g3_i2", label: "Interfere na adaptação ao contexto educativo" },
          { id: "perturba_o_obsessivo_compulsiv_g3_i3", label: "Provoca sofrimento significativo à criança" },
          { id: "perturba_o_obsessivo_compulsiv_g3_i4", label: "Aumenta o stress familiar" },
          { id: "perturba_o_obsessivo_compulsiv_g3_i5", label: "Limita a interação com pares" },
        ],
      },
    ],
    footerSections: [
      {
        id: "perturba_o_obsessivo_compulsiv_f1",
        title: "Diagnóstico diferencial",
        hint: "• ☐ Comportamentos repetitivos normativos do desenvolvimento\n• ☐ Perturbação do Espetro do Autismo\n• ☐ Perturbações de ansiedade\n• ☐ Perturbações da vinculação\n• ☐ Alterações sensoriais\n• ☐ PHDA\n• ☐ Outra condição médica ou neurológica",
      },
    ],
  },
  {
    moduleId: "picca-vol7-mod31",
    number: 31,
    title: "Comportamentos Repetitivos Centrados no Corpo",
    chapter: "cap5",
    chapterLabel: "Cap. 5 — POC",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "comportamentos_repetitivos_cen_g1",
        title: "A. Manipulação corporal repetitiva",
        items: [
          { id: "comportamentos_repetitivos_cen_g1_i1", label: "Arranca cabelos de forma repetitiva" },
          { id: "comportamentos_repetitivos_cen_g1_i2", label: "Morde unhas de forma intensa e persistente" },
          { id: "comportamentos_repetitivos_cen_g1_i3", label: "Manipula ou fere repetidamente a pele" },
          { id: "comportamentos_repetitivos_cen_g1_i4", label: "Morde lábios ou bochechas de forma repetitiva" },
          { id: "comportamentos_repetitivos_cen_g1_i5", label: "Repete estes comportamentos em momentos de tensão ou aborrecimento" },
        ],
      },
      {
        id: "comportamentos_repetitivos_cen_g2",
        title: "B. Consequências",
        items: [
          { id: "comportamentos_repetitivos_cen_g2_i1", label: "Existem lesões físicas associadas" },
          { id: "comportamentos_repetitivos_cen_g2_i2", label: "Existe sofrimento da criança" },
          { id: "comportamentos_repetitivos_cen_g2_i3", label: "Os cuidadores necessitam de intervir frequentemente" },
          { id: "comportamentos_repetitivos_cen_g2_i4", label: "O comportamento interfere nas atividades diárias" },
        ],
      },
    ],
    footerSections: [
      {
        id: "comportamentos_repetitivos_cen_f1",
        title: "Diagnóstico diferencial",
        hint: "• ☐ Comportamentos exploratórios próprios da idade\n• ☐ Tiques\n• ☐ Estereotipias motoras\n• ☐ Alterações sensoriais\n• ☐ PEA\n• ☐ Condição dermatológica",
      },
    ],
  },
  {
    moduleId: "picca-vol7-mod32",
    number: 32,
    title: "Outra Perturbação Obsessivo-compulsiva e Relacionada",
    chapter: "cap5",
    chapterLabel: "Cap. 5 — POC",
    guidance: "",
    threeColumn: false,
    groups: [
      {
        id: "outra_perturba_o_obsessivo_com_g1",
        title: "Indicadores clínicos",
        items: [
          { id: "outra_perturba_o_obsessivo_com_g1_i1", label: "Existem comportamentos repetitivos clinicamente relevantes" },
          { id: "outra_perturba_o_obsessivo_com_g1_i2", label: "Existe sofrimento ou desconforto significativo" },
          { id: "outra_perturba_o_obsessivo_com_g1_i3", label: "O comportamento interfere no funcionamento diário" },
          { id: "outra_perturba_o_obsessivo_com_g1_i4", label: "O padrão mantém-se ao longo do tempo" },
          { id: "outra_perturba_o_obsessivo_com_g1_i5", label: "Não é melhor explicado por outra perturbação" },
        ],
      },
    ],
    footerSections: [
      {
        id: "outra_perturba_o_obsessivo_com_f1",
        title: "Instrumentos que podem complementar a avaliação",
        hint: "• ☐ Entrevista clínica estruturada\n• ☐ ASEBA (CBCL/C-TRF)\n• ☐ SDQ\n• ☐ Escalas de ansiedade\n• ☐ Avaliação do desenvolvimento\n• ☐ Avaliação neuropsicológica\n• ☐ Outra: ______________________\n• SÍNTESE CLÍNICA\n• Área predominante\n• ☐ Preocupações persistentes\n• ☐ Rituais repetitivos\n• ☐ Comportamentos centrados no corpo\n• ☐ Rigidez comportamental\n• ☐ Outra\n• Hipótese clínica principal\n• Hipóteses diferenciais\n• Necessidade de referenciação\n• ☐ Psicologia\n• ☐ Pedopsiquiatria\n• ☐ Pediatria do Desenvolvimento\n• ☐ Neuropediatria\n• ☐ Outra: _______________________\n• Observações clínicas\n• Nota de interpretação clínica\n• Na idade pré-escolar é importante distinguir comportamentos repetitivos esperados do desenvolvimento (por exemplo, preferência por rotinas ou repetição durante a brincadeira) de padrões persistentes que provocam sofrimento, rigidez marcada ou interferência no funcionamento diário. A formulação clínica deve integrar a intensidade, a frequência, a duração, o contexto e o impacto funcional, bem como excluir outras perturbações do neurodesenvolvimento, da ansiedade ou condições médicas que possam explicar melhor o quadro observado.",
      },
    ],
  },
  {
    moduleId: "picca-vol7-mod33",
    number: 33,
    title: "Checklist Clínica de Observação Sistemática",
    chapter: "manual",
    chapterLabel: "manual",
    guidance: "Extraído do Manual Clínico de Diagnóstico em Idade Pré-Escolar (PICCA). Registar observação sistemática durante a avaliação clínica.",
    threeColumn: false,
    groups: [
      {
        id: "checklist_cl_nica_de_observa_o_g1",
        title: "Domínios de observação",
        items: [
          { id: "checklist_cl_nica_de_observa_o_g1_i1", label: "Contacto ocular" },
          { id: "checklist_cl_nica_de_observa_o_g1_i2", label: "Comunicação verbal" },
          { id: "checklist_cl_nica_de_observa_o_g1_i3", label: "Comunicação não verbal" },
          { id: "checklist_cl_nica_de_observa_o_g1_i4", label: "Atenção conjunta" },
          { id: "checklist_cl_nica_de_observa_o_g1_i5", label: "Jogo simbólico" },
          { id: "checklist_cl_nica_de_observa_o_g1_i6", label: "Reciprocidade social" },
          { id: "checklist_cl_nica_de_observa_o_g1_i7", label: "Expressão emocional" },
          { id: "checklist_cl_nica_de_observa_o_g1_i8", label: "Autorregulação" },
          { id: "checklist_cl_nica_de_observa_o_g1_i9", label: "Comportamento adaptativo" },
          { id: "checklist_cl_nica_de_observa_o_g1_i10", label: "Funções executivas" },
          { id: "checklist_cl_nica_de_observa_o_g1_i11", label: "Processamento sensorial" },
          { id: "checklist_cl_nica_de_observa_o_g1_i12", label: "Motricidade" },
          { id: "checklist_cl_nica_de_observa_o_g1_i13", label: "Autonomia" },
          { id: "checklist_cl_nica_de_observa_o_g1_i14", label: "Interação com os cuidadores" },
        ],
      },
    ],
    footerSections: [
    ],
  },
]

export const PICCA_VOL7_BY_NUMBER: Record<number, Vol7DisorderDefinition> = Object.fromEntries(
  PICCA_VOL7_DISORDERS.map((disorder) => [disorder.number, disorder]),
)

export const PICCA_VOL7_BY_ID: Record<string, Vol7DisorderDefinition> = Object.fromEntries(
  PICCA_VOL7_DISORDERS.map((disorder) => [disorder.moduleId, disorder]),
)
