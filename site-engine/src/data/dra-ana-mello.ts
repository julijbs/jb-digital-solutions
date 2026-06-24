/**
 * dra-ana-mello.ts — Dados do cliente Dra. Ana Mello (persona de spike)
 *
 * Padrão JB Digital System: um arquivo por cliente.
 * Inclui: dados de contato, copy de cada bloco, serviços e bairros
 * para geração das páginas Serviço × Bairro via getStaticPaths().
 */
import type { ClientData } from '../lib/types.ts';

export const draAnaMello: ClientData = {
  // ── Identidade ──────────────────────────────────────────────────
  businessName: 'Dra. Ana Mello',
  specialty: 'Psicóloga | TCC e Terapia de Casal',
  credential: 'CRP 06/123456 · Pós-graduada em TCC · Jardins, São Paulo',
  slug: 'dra-ana-mello',
  siteUrl: 'https://anamello.jbdigitalsystem.com',
  mood: 'calm-trust',

  // ── Endereço ─────────────────────────────────────────────────────
  streetAddress: 'Rua Haddock Lobo, 595',
  postalCode: '01414-001',
  district: 'Jardins',
  specialtyNoun: 'psicóloga',

  // ── Contato ──────────────────────────────────────────────────────
  city: 'São Paulo',
  state: 'SP',
  phone: '(11) 91234-5678',
  phoneClean: '11912345678',
  email: 'contato@dranamello.com.br',
  instagram: '@dranamello.psi',
  address: 'Rua Haddock Lobo, 595 — Jardins, São Paulo-SP',
  lat: '-23.558',
  lng: '-46.661',

  // ── Copy ─────────────────────────────────────────────────────────
  copy: {
    homeTitle: 'Psicóloga em São Paulo — Dra. Ana Mello | TCC e Terapia de Casal',
    homeMetaDescription:
      'Psicóloga clínica em Jardins, São Paulo. Especialista em TCC, ansiedade, burnout e terapia de casal. Atendimento presencial e online. CRP 06/123456.',
    businessDescription:
      'Psicóloga especialista em TCC e terapia de casal. Atende ansiedade, depressão, burnout e questões de relacionamento. Consultório em Jardins, São Paulo, e atendimento online para todo o Brasil.',
    llmsSummary:
      'Dra. Ana Mello é psicóloga clínica especialista em TCC, com 8 anos de experiência no tratamento de ansiedade, depressão, burnout e terapia de casal. Atende presencialmente no consultório em Jardins, São Paulo, e oferece sessões online para todo o Brasil.',

    heroHeadline: 'Viver com menos ansiedade é possível — com o suporte certo.',
    heroSubheadline:
      'Psicóloga especialista em TCC e terapia de casal. Consultório em Jardins, São Paulo, e atendimento online para todo o Brasil.',
    heroPhotoAlt: 'Dra. Ana Mello, psicóloga em São Paulo',

    painPoints: [
      'Você acorda já cansada, com a mente acelerada e sem conseguir desligar — mesmo nos momentos em que deveria descansar.',
      'Os mesmos conflitos se repetem no relacionamento, e cada tentativa de conversa termina da mesma forma, sem resolução.',
      'O trabalho consome tudo, mas por dentro você sente que está operando no limite — e não sabe bem como chegou até aqui.',
    ],

    aboutHeadline: 'Uma psicóloga que acredita no poder das perguntas certas.',
    aboutBody:
      'Me formei em Psicologia pela USP e me especializei em Terapia Cognitivo-Comportamental porque acredito que entender como pensamos é o primeiro passo para mudar como nos sentimos. Ao longo de 8 anos de clínica, trabalhei com pessoas que chegaram com ansiedade paralisante, relacionamentos desgastados e esgotamento profissional — e que encontraram, no processo terapêutico, ferramentas reais para retomar o controle das próprias vidas. Não acredito em respostas prontas. Acredito em escuta atenta, em perguntas que abrem possibilidades e em um espaço onde você pode ser honesta — consigo mesma e com o que está vivendo. Atendo adultos individualmente e casais, presencialmente em Jardins ou por videochamada.',
    pullQuote:
      'A terapia não muda o que aconteceu. Muda o que você faz com isso a partir de agora.',
    aboutCredential:
      'CRP 06/123456 · Pós-graduada em TCC (PUC-SP) · Membro do CFP · 8 anos de experiência clínica',
    aboutPhotoAlt: 'Dra. Ana Mello em seu consultório em Jardins, São Paulo',

    servicesHeadline: 'Caminhos que ofereço.',
    processHeadline: 'Como começa o nosso trabalho.',
    processSteps: [
      {
        name: 'Primeira conversa',
        description:
          'Uma sessão de 50 minutos para você me contar o que está vivendo. Sem julgamento, sem pressa. Avalio juntos com você se faz sentido seguirmos.',
      },
      {
        name: 'Definimos o foco',
        description:
          'A partir do que emergiu na primeira sessão, alinhamos um contrato terapêutico: o que queremos trabalhar, em que ritmo e com qual abordagem.',
      },
      {
        name: 'Sessões semanais',
        description:
          'Encontros de 50 minutos, no dia e horário que combinamos. O processo é colaborativo — você traz o que viveu; trabalhamos juntos no que significa.',
      },
    ],
    testimonials: [
      {
        quote:
          'Eu cheguei com crises de ansiedade que me impediam de trabalhar. Em quatro meses de TCC com a Ana, aprendi a identificar o que disparava esses episódios e a agir antes de entrar em colapso. Não foi mágica — foi processo. Mas foi real.',
        author: 'Marina T. · Engenheira · Paciente desde 2023',
      },
      {
        quote:
          'Buscamos a terapia de casal quando já estávamos quase desistindo. O que mudou foi simples: aprendemos a nos ouvir de verdade. A Ana cria um espaço onde os dois conseguem falar sem o outro entrar na defensiva.',
        author: 'Rafael e Camila · São Paulo',
      },
    ],
    faqHeadline: 'O que você talvez queira saber antes de agendar.',
    faqs: [
      {
        question: 'Quanto custa uma sessão de psicologia em São Paulo?',
        answer:
          'O valor das sessões é alinhado na primeira conversa, de acordo com o formato (individual ou casal) e a frequência. Entre em contato para saber os valores atuais — também avaliamos possibilidades de plano de saúde para reembolso.',
      },
      {
        question: 'Psicólogo online funciona igual ao presencial?',
        answer:
          'Sim. Pesquisas clínicas mostram eficácia equivalente para a maioria das queixas, incluindo ansiedade, depressão e burnout. A diferença é apenas logística — você pode ser atendida do lugar que preferir, inclusive de outra cidade ou país.',
      },
      {
        question: 'Qual a diferença entre psicólogo e psiquiatra?',
        answer:
          'O psicólogo realiza acompanhamento psicoterápico — trabalha com comportamentos, pensamentos e emoções através da conversa. O psiquiatra é médico e pode prescrever medicação quando necessário. Nos casos que exigem os dois, trabalho em comunicação com o psiquiatra do paciente.',
      },
      {
        question: 'Em quanto tempo a terapia começa a fazer diferença?',
        answer:
          'Na TCC, resultados iniciais costumam aparecer entre a 6ª e a 12ª sessão — quando padrões de pensamento mais rígidos começam a ceder e estratégias práticas já estão em uso. O processo mais profundo varia de pessoa para pessoa.',
      },
      {
        question: 'Preciso de encaminhamento médico para agendar?',
        answer:
          'Não. Qualquer pessoa pode marcar diretamente, sem encaminhamento. Se você já tem acompanhamento psiquiátrico, ótimo — trabalharemos em conjunto. Se não tem, avaliamos juntos se faz sentido buscar essa complementaridade.',
      },
    ],
    ctaHeadline: 'Quando você estiver pronta, estarei aqui.',
    ctaSubtext:
      'Agende uma primeira conversa. Cinquenta minutos para entendermos o que está acontecendo — sem compromisso de continuidade se não fizer sentido.',
    ctaButtonText: 'Agendar primeira sessão',
  },

  // ── Serviços (SEO programático) ───────────────────────────────────
  services: [
    {
      slug: 'terapia-individual',
      name: 'Terapia Individual',
      tag: 'Presencial · Online',
      description:
        'Sessões semanais com foco em ansiedade, depressão, burnout e autoconhecimento. Usamos a TCC para identificar padrões de pensamento e construir estratégias práticas de mudança.',
      schemaType: 'ProfessionalService',
      h1Template: 'Psicóloga para terapia individual {{PREP}} {{BAIRRO}} — Dra. Ana Mello',
      metaDescTemplate:
        'Terapia individual com abordagem TCC {{PREP}} {{BAIRRO}}, São Paulo. Ansiedade, depressão, burnout e autoconhecimento. Atendimento presencial e online. CRP 06/123456.',
    },
    {
      slug: 'terapia-casal',
      name: 'Terapia de Casal',
      tag: 'Presencial · Online',
      description:
        'Espaço estruturado para que dois parceiros consigam se ouvir, entender o que está travando a comunicação e reconstruir a conexão — sem que nenhum precise "ganhar" a discussão.',
      schemaType: 'ProfessionalService',
      h1Template: 'Psicóloga para terapia de casal {{PREP}} {{BAIRRO}} — Dra. Ana Mello',
      metaDescTemplate:
        'Terapia de casal {{PREP}} {{BAIRRO}}, São Paulo. Comunicação, reconexão e gestão de conflitos com abordagem TCC. Presencial e online. CRP 06/123456.',
    },
    {
      slug: 'orientacao-burnout',
      name: 'Orientação para Burnout',
      tag: 'Especialidade',
      description:
        'Para quem está no limite com o trabalho: identificamos os gatilhos, ajustamos expectativas e construímos um plano de recuperação que respeita o seu ritmo, sem romantizar o "descanso forçado".',
      schemaType: 'ProfessionalService',
      h1Template: 'Psicóloga especialista em burnout {{PREP}} {{BAIRRO}} — Dra. Ana Mello',
      metaDescTemplate:
        'Orientação psicológica para burnout {{PREP}} {{BAIRRO}}, São Paulo. Recuperação respeitando o seu ritmo, sem soluções genéricas. Presencial e online. CRP 06/123456.',
    },
  ],

  // ── Bairros (SEO programático) ────────────────────────────────────
  neighborhoods: [
    { slug: 'jardins',       name: 'Jardins',       prep: 'nos'  },
    { slug: 'itaim-bibi',   name: 'Itaim Bibi',    prep: 'no'   },
    { slug: 'pinheiros',    name: 'Pinheiros',      prep: 'em'   },
    { slug: 'vila-madalena', name: 'Vila Madalena', prep: 'na'   },
    { slug: 'moema',        name: 'Moema',          prep: 'em'   },
    { slug: 'brooklin',     name: 'Brooklin',       prep: 'no'   },
  ],

  // ── Schema.org ────────────────────────────────────────────────────
  schemaType: 'ProfessionalService',
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '19:00' },
  ],
  priceRange: '$$',
};
