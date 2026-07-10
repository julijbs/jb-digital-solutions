export interface PortfolioItem {
  name: string;
  url: string;
  specialty: string;
  city: string;
}

export interface Vertical {
  slug: 'psicologos' | 'dentistas' | 'nutricionistas' | 'fisioterapeutas';
  professionPlural: string;
  professionSingular: string;
  professionArticle: string;   // "o psicólogo" / "a nutricionista"
  metaTitle: string;           // ≤ 60 chars
  metaDescription: string;     // ≤ 160 chars
  hero: {
    headline: string;
    sub: string;
  };
  painPoints: {
    icon: string;              // emoji icon
    title: string;
    body: string;
  }[];
  howItWorks: {
    step: number;
    title: string;
    body: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
  portfolio: PortfolioItem[];
  whatsappText: string;        // prefilled wa.me message
  serviceSchema: string;       // JSON-LD @type
}

const sharedPortfolio: PortfolioItem[] = [
  {
    name: 'Dra. Ana Mello',
    url: 'https://anamello.jbdigitalsystem.com',
    specialty: 'Psicóloga Clínica — TCC e Terapia de Casal',
    city: 'São Paulo, SP',
  },
  {
    name: 'Dra. Marina Costa',
    url: 'https://marinacosta.jbdigitalsystem.com',
    specialty: 'Nutricionista Clínica e Esportiva',
    city: 'São Paulo, SP',
  },
  {
    name: 'Marcela Barcellos',
    url: 'https://marcelabarcellos.jbdigitalsystem.com',
    specialty: 'Neuropsicóloga',
    city: 'São Paulo, SP',
  },
];

export const verticals: Vertical[] = [
  // ─────────────────────────────────────────
  // 1. PSICÓLOGOS
  // ─────────────────────────────────────────
  {
    slug: 'psicologos',
    professionPlural: 'Psicólogos',
    professionSingular: 'psicólogo',
    professionArticle: 'o psicólogo',
    metaTitle: 'Site + Google para Psicólogos | JB Digital System',
    metaDescription: 'Sistema de posicionamento online para psicólogos: site, Perfil Google otimizado e presença em IA. Atraia mais pacientes organicamente. Setup em 7 dias.',
    hero: {
      headline: 'Seus próximos pacientes estão buscando psicólogo agora. Você vai aparecer?',
      sub: 'O JB Digital System constrói o posicionamento online completo para psicólogos — site programático, Perfil Google e presença nas IAs — para que pacientes te encontrem todo dia, sem depender de indicação.',
    },
    painPoints: [
      {
        icon: '🔍',
        title: '"Alguém buscou psicólogo no meu bairro — e não me achou"',
        body: 'Você tem formação, resultado real com seus pacientes e avaliações incríveis. Mas quando alguém abre o Google e digita "psicólogo em [cidade]", aparece o concorrente — não você.',
      },
      {
        icon: '📅',
        title: '"Minha agenda ainda depende de indicação"',
        body: 'Indicação é ótima, mas ela seca quando você menos espera. Você precisa de uma fonte orgânica e previsível de novos pacientes — que funcione enquanto você está em sessão.',
      },
      {
        icon: '🤖',
        title: '"Pacientes perguntam ao ChatGPT — e você não aparece como sugestão"',
        body: 'Hoje seus pacientes não buscam só no Google. Eles perguntam para IAs: "Indique um bom psicólogo em São Paulo". Sem AEO (Answer Engine Optimization), você é invisível para esses algoritmos.',
      },
    ],
    howItWorks: [
      { step: 1, title: 'Você responde um formulário simples', body: 'Nos conta sobre sua especialidade, onde atende, e como prefere ser encontrado. Sem complicação técnica.' },
      { step: 2, title: 'Construímos todo o seu sistema em até 7 dias', body: 'Site, Perfil Google completo, páginas por especialidade e bairro, estrutura para as IAs — tudo configurado e integrado.' },
      { step: 3, title: 'Você aprova antes de publicar', body: 'Revisamos juntos em etapas. Só publicamos quando você estiver 100% satisfeito com o resultado.' },
      { step: 4, title: 'Seu sistema entra no ar e começa a trabalhar', body: 'Site publicado, Google ativo, presença nas IAs estruturada — sua presença digital trabalhando 24h por dia.' },
      { step: 5, title: 'Acompanhamento mensal para manter o crescimento', body: 'Monitoramos sua posição todo mês, ajustamos o que precisa e reportamos os resultados — sem você precisar entender de tecnologia.' },
    ],
    faqs: [
      {
        q: 'Como o sistema respeita as diretrizes do CFP?',
        a: 'Trabalhamos com total respeito ao Código de Ética do Conselho Federal de Psicologia. Não usamos promessas de resultados terapêuticos, não publicamos cases de pacientes sem autorização e todo o conteúdo segue as normas de publicidade do CFP.',
      },
      {
        q: 'Preciso ter site para contratar?',
        a: 'Não — o site é justamente o que entregamos: um site programático completo, construído do zero, com páginas por especialidade e por bairro. Se você já tem site e quer apenas o Perfil da Empresa no Google cuidado de perto, isso é o add-on Gestão de Google.',
      },
      {
        q: 'Quanto tempo leva para aparecer no Google?',
        a: 'O setup técnico fica pronto em até 7 dias. O ranqueamento orgânico cresce com o tempo — os primeiros resultados aparecem tipicamente entre 60 e 90 dias. Acompanhamos mensalmente e ajustamos a estratégia.',
      },
      {
        q: 'O que é AEO e por que importa para psicólogos?',
        a: 'AEO (Answer Engine Optimization) é a técnica que prepara sua presença para ser recomendada por IAs como ChatGPT, Gemini e Perplexity. Quando alguém pergunta "Indique um bom psicólogo em São Paulo", você precisa aparecer como sugestão.',
      },
      {
        q: 'Posso usar meu próprio domínio (ex: draanacardoso.com.br)?',
        a: 'Sim! Você pode adquirir seu domínio personalizado e nós configuramos tudo. Há um custo adicional de R$ 100 (taxa única de configuração do domínio).',
      },
      {
        q: 'E se eu não gostar do resultado?',
        a: 'Trabalhamos com processo de aprovação em etapas: você aprova layout, conteúdo e site final antes de publicar. Só publicamos quando você estiver 100% satisfeito. Revisões estão incluídas no processo.',
      },
    ],
    portfolio: sharedPortfolio,
    whatsappText: 'Olá! Tenho interesse no sistema de posicionamento online para psicólogos. Pode me contar mais?',
    serviceSchema: 'ProfessionalService',
  },

  // ─────────────────────────────────────────
  // 2. DENTISTAS
  // ─────────────────────────────────────────
  {
    slug: 'dentistas',
    professionPlural: 'Dentistas',
    professionSingular: 'dentista',
    professionArticle: 'o dentista',
    metaTitle: 'Site + Google para Dentistas | JB Digital System',
    metaDescription: 'Sistema de posicionamento online para dentistas: site programático, Perfil Google e presença em IA. Atraia mais pacientes organicamente. Setup em 7 dias.',
    hero: {
      headline: 'Pacientes buscam dentista perto deles todo dia. Você vai aparecer na busca?',
      sub: 'O JB Digital System constrói o posicionamento online completo para dentistas — site com páginas por procedimento e bairro, Perfil Google e presença nas IAs — para que novos pacientes te encontrem organicamente.',
    },
    painPoints: [
      {
        icon: '🔍',
        title: '"Paciente buscou dentista no meu bairro e foi para o concorrente"',
        body: 'Você tem equipamentos modernos, atendimento de qualidade e avaliações excelentes. Mas quando alguém abre o Google e digita "dentista em [bairro]", aparece o concorrente — não você.',
      },
      {
        icon: '📅',
        title: '"Minha agenda tem lacunas que dependem de indicação para fechar"',
        body: 'Indicação é boa, mas imprevisível. Nos períodos de baixa, você precisa de um sistema que traga pacientes de forma constante e orgânica — independente de posts nas redes sociais.',
      },
      {
        icon: '⭐',
        title: '"Tenho avaliações 5 estrelas que ninguém encontra"',
        body: 'Seus pacientes te elogiam e te recomendam. Mas essas avaliações não aparecem com destaque nas buscas — ou pior, o Perfil Google da sua clínica está desatualizado ou incompleto.',
      },
    ],
    howItWorks: [
      { step: 1, title: 'Você responde um formulário simples', body: 'Nos conta sobre seus procedimentos, onde atende, e que tipo de paciente você quer atrair. Sem jargão técnico.' },
      { step: 2, title: 'Construímos seu sistema em até 7 dias', body: 'Site com páginas por procedimento (implante, clareamento, ortodontia...) e por bairro, Perfil Google completo e estrutura AEO para as IAs.' },
      { step: 3, title: 'Você aprova antes de publicar', body: 'Revisamos juntos em etapas. Só publicamos quando você estiver 100% satisfeito.' },
      { step: 4, title: 'Seu sistema entra no ar', body: 'Site publicado, Google ativo, presença nas IAs estruturada — trabalhando para atrair pacientes 24h por dia.' },
      { step: 5, title: 'Acompanhamento mensal', body: 'Monitoramos sua posição no Google todo mês, ajustamos o que precisa e enviamos relatório de posicionamento.' },
    ],
    faqs: [
      {
        q: 'Como o sistema respeita as normas do CFO?',
        a: 'Trabalhamos com total respeito às normas de publicidade do Conselho Federal de Odontologia. Não fazemos promessas de resultados estéticos garantidos, não publicamos antes/depois sem autorização e todo conteúdo segue o Código de Ética Odontológico.',
      },
      {
        q: 'Quais procedimentos podem ter páginas específicas?',
        a: 'Qualquer procedimento que você ofereça: implante dentário, clareamento, ortodontia, prótese, endodontia, odontopediatria, harmonização orofacial e mais. Cada procedimento gera páginas otimizadas por serviço + bairro.',
      },
      {
        q: 'Quanto tempo leva para aparecer no Google?',
        a: 'Setup técnico: até 7 dias. Primeiros resultados orgânicos: 60–90 dias. O Perfil Google tende a gerar resultados mais rápidos (buscas locais e Google Maps). Acompanhamos mensalmente.',
      },
      {
        q: 'Funciona para clínica com mais de um profissional?',
        a: 'Sim. Configuramos o Perfil Google e o site para a clínica como um todo. Se quiser perfis individuais para cada dentista, é possível — avaliamos na conversa inicial.',
      },
      {
        q: 'O que é AEO e como ajuda a minha clínica?',
        a: 'AEO (Answer Engine Optimization) faz sua clínica aparecer quando pacientes perguntam para IAs: "Indique um bom dentista em Pinheiros" ou "Qual clínica odontológica aceita convênio em São Paulo". Estruturamos seus dados para que as IAs te recomendem.',
      },
      {
        q: 'E se eu não gostar do resultado?',
        a: 'Trabalhamos com aprovação em etapas: layout, conteúdo e site final. Só publicamos quando você estiver 100% satisfeito. Revisões incluídas no processo.',
      },
    ],
    portfolio: sharedPortfolio,
    whatsappText: 'Olá! Tenho interesse no sistema de posicionamento online para dentistas. Pode me contar mais?',
    serviceSchema: 'Dentist',
  },

  // ─────────────────────────────────────────
  // 3. NUTRICIONISTAS
  // ─────────────────────────────────────────
  {
    slug: 'nutricionistas',
    professionPlural: 'Nutricionistas',
    professionSingular: 'nutricionista',
    professionArticle: 'a nutricionista',
    metaTitle: 'Site + Google para Nutricionistas | JB Digital System',
    metaDescription: 'Sistema de posicionamento online para nutricionistas: site, Perfil Google e presença em IA. Atraia mais pacientes organicamente. Setup em 7 dias, R$149/mês.',
    hero: {
      headline: 'Pacientes buscam nutricionista todo dia. Você é encontrado nessas buscas?',
      sub: 'O JB Digital System constrói o posicionamento digital completo para nutricionistas — site com páginas por especialidade e região, Perfil Google e presença nas IAs — para que novos pacientes te encontrem organicamente.',
    },
    painPoints: [
      {
        icon: '🔍',
        title: '"Alguém buscou nutricionista esportivo na minha cidade — e não me encontrou"',
        body: 'Você tem especialização, atendimento personalizado e histórico de resultados com seus pacientes. Mas sua presença digital não reflete isso — e o concorrente aparece na frente.',
      },
      {
        icon: '📱',
        title: '"Fico postando nas redes, mas novos pacientes não chegam consistentemente"',
        body: 'Redes sociais exigem constância e energia. E o alcance orgânico cai a cada atualização de algoritmo. Você precisa de uma fonte de pacientes que funcione independente de post.',
      },
      {
        icon: '🏆',
        title: '"Meu CRN, minhas especializações e minha experiência ficam escondidos online"',
        body: 'Pacientes que buscam nutricionista online não sabem distinguir quem tem formação sólida de quem não tem. Um posicionamento digital bem estruturado comunica sua autoridade antes mesmo do primeiro contato.',
      },
    ],
    howItWorks: [
      { step: 1, title: 'Você responde um formulário simples', body: 'Especialidade, onde atende, tipos de paciente e objetivos. Sem complicação técnica.' },
      { step: 2, title: 'Construímos seu sistema em até 7 dias', body: 'Site com páginas por especialidade (nutrição esportiva, emagrecimento, nutrição clínica...) e por bairro, Perfil Google e estrutura AEO.' },
      { step: 3, title: 'Você aprova antes de publicar', body: 'Revisamos juntos em etapas. Só publicamos quando você estiver 100% satisfeito.' },
      { step: 4, title: 'Seu sistema entra no ar', body: 'Site publicado, Google ativo, presença nas IAs estruturada — tudo rodando para atrair pacientes organicamente.' },
      { step: 5, title: 'Acompanhamento mensal', body: 'Monitoramos, ajustamos e reportamos — você foca nos seus pacientes.' },
    ],
    faqs: [
      {
        q: 'Como o sistema respeita as normas do CFN?',
        a: 'Trabalhamos com total respeito às normas de publicidade do Conselho Federal de Nutricionistas. Não fazemos promessas de perda de peso garantida, não publicamos dados de pacientes sem autorização e todo conteúdo segue o Código de Ética.',
      },
      {
        q: 'Posso ter páginas para diferentes especialidades?',
        a: 'Sim. Criamos páginas específicas para cada especialidade: nutrição esportiva, nutrição materno-infantil, nutrição clínica, emagrecimento, hipertrofia, nutrição oncológica e outras. Cada página é otimizada para a busca específica.',
      },
      {
        q: 'Quanto tempo leva para aparecer no Google?',
        a: 'Setup técnico: até 7 dias. Primeiros resultados orgânicos: 60–90 dias. O Perfil Google (Google Maps e buscas locais) costuma gerar resultados mais rápidos. Acompanhamos mensalmente.',
      },
      {
        q: 'Funciona para atendimento online também?',
        a: 'Sim. Podemos configurar seu posicionamento para atrair pacientes de todo o Brasil para atendimento online, além dos pacientes presenciais da sua cidade.',
      },
      {
        q: 'O que é AEO?',
        a: 'AEO (Answer Engine Optimization) estrutura sua presença para ser recomendada por IAs. Quando alguém pergunta ao ChatGPT "Indique uma boa nutricionista esportiva em São Paulo", queremos que você apareça como sugestão.',
      },
      {
        q: 'E se eu não gostar do resultado?',
        a: 'Trabalhamos com aprovação em etapas: layout, conteúdo e site final. Só publicamos quando você estiver 100% satisfeito. Revisões incluídas no processo.',
      },
    ],
    portfolio: sharedPortfolio,
    whatsappText: 'Olá! Tenho interesse no sistema de posicionamento online para nutricionistas. Pode me contar mais?',
    serviceSchema: 'DietNutrition',
  },

  // ─────────────────────────────────────────
  // 4. FISIOTERAPEUTAS
  // ─────────────────────────────────────────
  {
    slug: 'fisioterapeutas',
    professionPlural: 'Fisioterapeutas',
    professionSingular: 'fisioterapeuta',
    professionArticle: 'o fisioterapeuta',
    metaTitle: 'Site + Google para Fisioterapeutas | JB Digital System',
    metaDescription: 'Sistema de posicionamento online para fisioterapeutas: site, Perfil Google e presença em IA. Atraia mais pacientes organicamente. Setup em 7 dias, R$149/mês.',
    hero: {
      headline: 'Pacientes buscam fisioterapeuta próximo todos os dias. Você está visível nessas buscas?',
      sub: 'O JB Digital System constrói o posicionamento digital completo para fisioterapeutas — site com páginas por especialidade e região, Perfil Google e presença nas IAs — para que novos pacientes te encontrem organicamente.',
    },
    painPoints: [
      {
        icon: '🔍',
        title: '"Paciente buscou fisioterapeuta pós-operatório na minha região — e não me encontrou"',
        body: 'Você tem expertise, técnicas especializadas e resultado comprovado. Mas sua presença digital não reflete isso — e o concorrente com menos experiência aparece na frente no Google.',
      },
      {
        icon: '🏥',
        title: '"Minha captação ainda depende de indicação de médicos e hospitais"',
        body: 'Indicação médica é valiosa, mas limitante. Um fluxo orgânico de pacientes que buscam ativamente por você no Google e nas IAs complementa e diversifica sua captação.',
      },
      {
        icon: '⭐',
        title: '"Meu CREFITO, especialidades e diferenciais não aparecem nas buscas"',
        body: 'Pacientes não sabem diferenciar fisioterapeutas pela especialidade quando buscam online. Um site estruturado e Perfil Google completo comunicam sua especialização antes do primeiro contato.',
      },
    ],
    howItWorks: [
      { step: 1, title: 'Você responde um formulário simples', body: 'Especialidade, localização, público-alvo e diferenciais. Rápido e sem jargão técnico.' },
      { step: 2, title: 'Construímos seu sistema em até 7 dias', body: 'Site com páginas por especialidade (RPG, pilates, pós-operatório, neurológica...) e por região, Perfil Google e estrutura AEO para as IAs.' },
      { step: 3, title: 'Você aprova antes de publicar', body: 'Revisamos juntos. Só publicamos quando você estiver 100% satisfeito.' },
      { step: 4, title: 'Seu sistema entra no ar', body: 'Site publicado, Google ativo, presença nas IAs estruturada — trabalhando por você enquanto você está em atendimento.' },
      { step: 5, title: 'Acompanhamento mensal', body: 'Monitoramos sua posição, ajustamos a estratégia e reportamos os resultados mensalmente.' },
    ],
    faqs: [
      {
        q: 'Posso ter páginas para diferentes especialidades fisioterapêuticas?',
        a: 'Sim. Criamos páginas específicas para cada especialidade: fisioterapia esportiva, neurológica, pediátrica, ortopédica, pós-operatória, RPG, pilates clínico e outras. Cada página é otimizada para a busca específica.',
      },
      {
        q: 'Funciona para clínica com mais de um fisioterapeuta?',
        a: 'Sim. Configuramos o Perfil Google e o site para a clínica como um todo, destacando as especialidades disponíveis. Se quiser perfis individuais para cada profissional, também é possível.',
      },
      {
        q: 'Quanto tempo leva para aparecer no Google?',
        a: 'Setup técnico: até 7 dias. Primeiros resultados orgânicos: 60–90 dias. Buscas locais e Google Maps tendem a ser mais rápidas. Acompanhamos mensalmente.',
      },
      {
        q: 'O que é AEO e como ajuda fisioterapeutas?',
        a: 'AEO (Answer Engine Optimization) estrutura sua presença para ser recomendada por IAs. Quando alguém pergunta "Indique um bom fisioterapeuta esportivo em São Paulo", queremos que você apareça como sugestão.',
      },
      {
        q: 'Aceita convênio? Isso afeta o sistema?',
        a: 'Informar os convênios aceitos é parte do setup. Muitas buscas incluem "fisioterapeuta que aceita [convênio]" — ter essas informações bem estruturadas aumenta sua visibilidade para esse perfil de paciente.',
      },
      {
        q: 'E se eu não gostar do resultado?',
        a: 'Trabalhamos com aprovação em etapas: layout, conteúdo e site final. Só publicamos quando você estiver 100% satisfeito. Revisões incluídas no processo.',
      },
    ],
    portfolio: sharedPortfolio,
    whatsappText: 'Olá! Tenho interesse no sistema de posicionamento online para fisioterapeutas. Pode me contar mais?',
    serviceSchema: 'MedicalBusiness',
  },
];
