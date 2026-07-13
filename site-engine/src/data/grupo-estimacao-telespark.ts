/**
 * grupo-estimacao-telespark.ts — Dados do cliente Grupo Estimação Telespark (spec-site / prévia)
 *
 * Gerado pela estratégia Spec-Site-Primeiro (lead nota 8: 685 avaliações, PSI 36/100).
 * Conteúdo extraído do site atual (grupoestimacaosjc.com.br/telespark) + Google.
 * NÃO é hospital 24h — é clínica multidisciplinar da rede Grupo EstimaCão (Seg-Sáb 9-18h).
 * Sem depoimentos: os do site são da rede, não da unidade — deixados vazios (não fabricados).
 */
import type { ClientData } from '../lib/types.ts';

export const grupoEstimacaoTelespark: ClientData = {
  // ── Identidade ──────────────────────────────────────────────────
  businessName: 'Grupo Estimação Telespark',
  specialty: 'Clínica Veterinária Multidisciplinar · Rede Grupo EstimaCão',
  credential: 'Clínica veterinária multidisciplinar · Especialistas e suporte de rede hospitalar · Vila Dirce, São José dos Campos',
  slug: 'grupo-estimacao-telespark',
  siteUrl: 'https://grupo-estimacao-telespark.jbdigitalsystem.com',
  mood: 'fresh-clinical',

  // ── Endereço ─────────────────────────────────────────────────────
  streetAddress: 'Rua Vicente Leporace, 11',
  postalCode: '12213-010',
  district: 'Vila Dirce',
  specialtyNoun: 'veterinário',

  // ── Contato ──────────────────────────────────────────────────────
  city: 'São José dos Campos',
  state: 'SP',
  phone: '(12) 99211-9058',
  phoneClean: '12992119058',
  email: '',
  instagram: '@_grupoestimacaosjc',
  address: 'Rua Vicente Leporace, 11 — Vila Dirce, São José dos Campos-SP',
  lat: '-23.1589',
  lng: '-45.9121',

  // ── Copy ─────────────────────────────────────────────────────────
  copy: {
    homeTitle: 'Clínica Veterinária na Vila Dirce, SJC — Grupo Estimação Telespark',
    homeMetaDescription:
      'Clínica veterinária multidisciplinar na Vila Dirce, São José dos Campos. Consultas, cirurgia, exames e especialistas, com o suporte de toda a rede Grupo EstimaCão.',
    businessDescription:
      'Clínica veterinária multidisciplinar na Vila Dirce, São José dos Campos. Consultas, cirurgia, anestesiologia, diagnóstico por imagem, exames laboratoriais e especialistas em ortopedia, cardiologia, dermatologia, oftalmologia, oncologia, nutrição e gastroenterologia — com o respaldo de internação e centro cirúrgico de toda a rede Grupo EstimaCão.',
    llmsSummary:
      'Grupo Estimação Telespark é uma clínica veterinária multidisciplinar em São José dos Campos (Vila Dirce), parte da Rede Veterinária Integrada Grupo EstimaCão. Oferece consultas, cirurgia, anestesiologia, diagnóstico por imagem, exames laboratoriais e especialistas (ortopedia, cardiologia, dermatologia, oftalmologia, oncologia, nutrição, gastroenterologia, medicina interna), com acesso a internação e centro cirúrgico de toda a rede e mais de 25 profissionais atuando em equipe.',

    heroHeadline: 'Uma clínica completa — com uma rede veterinária inteira por trás.',
    heroSubheadline:
      'Consultas, cirurgia, exames e especialistas na Vila Dirce, São José dos Campos — com o suporte de internação e centro cirúrgico de toda a rede Grupo EstimaCão.',
    heroPhotoAlt: 'Equipe da Grupo Estimação Telespark em atendimento veterinário',
    heroEyebrow: 'Clínica Veterinária Multidisciplinar',

    painPoints: [
      'Encaminhado pra longe — Você acha um clínico de confiança, mas na hora do exame ou da cirurgia é mandado pra outro lugar, com outra equipe que não conhece a história do seu pet.',
      'Especialista é sempre em outra cidade — Ortopedia, cardiologia, oncologia… quando precisa de um especialista, parece que ninguém por perto tem.',
      'Diagnóstico que demora — Cada exame num lugar diferente atrasa o diagnóstico bem na hora em que rapidez faria diferença.',
    ],

    aboutHeadline: 'Perto de você, com a força de uma rede inteira.',
    aboutBody:
      'A unidade Telespark é uma clínica veterinária multidisciplinar projetada para oferecer atendimento de excelência com total proximidade com os tutores. Aqui você encontra consultas, cirurgia, anestesiologia, diagnóstico por imagem, exames laboratoriais e uma equipe de especialistas em ortopedia, cardiologia, dermatologia, oftalmologia, oncologia, nutrição, gastroenterologia e medicina interna. E o que faz a diferença: fazemos parte da Rede Veterinária Integrada Grupo EstimaCão. Isso significa que, quando o seu pet precisa de um exame mais avançado, de um especialista específico ou de internação e centro cirúrgico, ele tem acesso à estrutura e aos mais de 25 profissionais de toda a rede — sem recomeçar a história a cada encaminhamento. É o cuidado de um clínico próximo, com o respaldo de um hospital inteiro.',
    pullQuote:
      'O cuidado de um clínico próximo, com o respaldo de uma rede veterinária inteira.',
    aboutCredential:
      'Clínica veterinária multidisciplinar · Especialistas e suporte hospitalar de rede · Vila Dirce, São José dos Campos',
    aboutPhotoAlt: 'Estrutura da Grupo Estimação Telespark, clínica veterinária em São José dos Campos',

    servicesHeadline: 'Cuidado completo, do consultório ao centro cirúrgico.',
    processHeadline: 'Como funciona o atendimento.',
    processSteps: [
      {
        name: 'Consulta com quem acompanha',
        description:
          'O atendimento começa com uma equipe que conhece a história do seu pet e acompanha cada passo — do primeiro sintoma ao plano de tratamento.',
      },
      {
        name: 'Exames e especialistas integrados',
        description:
          'Diagnóstico por imagem, exames laboratoriais e especialistas na própria clínica ou dentro da rede, sem você precisar recomeçar a história a cada encaminhamento.',
      },
      {
        name: 'Cirurgia e internação com respaldo de rede',
        description:
          'Quando é preciso ir além, o seu pet tem acesso a centro cirúrgico e internação de toda a rede Grupo EstimaCão — com o mesmo cuidado e a mesma equipe por trás.',
      },
    ],
    testimonials: [],
    faqHeadline: 'Perguntas que todo tutor faz.',
    faqs: [
      {
        question: 'Qual o horário de funcionamento?',
        answer:
          'Atendemos de segunda a sábado, das 9h às 18h. Para exames, cirurgias e consultas com especialistas, o agendamento ajuda a organizar o melhor horário para você e o seu pet.',
      },
      {
        question: 'O que significa fazer parte da rede Grupo EstimaCão?',
        answer:
          'Significa que a clínica Telespark tem acesso à estrutura, aos exames avançados, aos especialistas e ao suporte hospitalar (internação e centro cirúrgico) de toda a rede. Na prática, você resolve mais no mesmo grupo, sem recomeçar o tratamento a cada encaminhamento.',
      },
      {
        question: 'Vocês fazem cirurgias e exames?',
        answer:
          'Sim. Realizamos consultas, cirurgia, anestesiologia, diagnóstico por imagem e exames laboratoriais, com apoio de internação e centro cirúrgico da rede quando o caso exige.',
      },
      {
        question: 'Qual o endereço da unidade Telespark?',
        answer:
          'Rua Vicente Leporace, 11 — Vila Dirce, São José dos Campos-SP. Região de fácil acesso, com atendimento por agendamento.',
      },
      {
        question: 'Que especialidades vocês têm?',
        answer:
          'Ortopedia, cardiologia, dermatologia, oftalmologia, oncologia, nutrição, gastroenterologia e medicina interna, entre outras — com equipe integrada dentro da rede.',
      },
    ],
    ctaHeadline: 'Marque a primeira consulta do seu pet.',
    ctaSubtext:
      'Uma clínica próxima, com uma rede veterinária inteira por trás. Fale com a gente para agendar ou tirar suas dúvidas.',
    ctaButtonText: 'Falar agora',
    heroCtaText: 'Falar agora',
    heroCtaSecondaryText: 'Ver especialidades',
    navCtaText: 'Falar no WhatsApp',
    bairroCtaText: 'Falar agora',
    bairroIntroLead: 'Se você procura uma clínica veterinária',
    bairroLocationLine:
      'a Grupo Estimação Telespark fica a poucos minutos — na Rua Vicente Leporace, 11, Vila Dirce. Consultas, exames e especialistas, com o suporte de toda a rede.',
    bairroNextSteps:
      'ligue ou chame no WhatsApp para agendar. Atendemos de segunda a sábado, das 9h às 18h.',
  },

  // ── Serviços (SEO programático) ───────────────────────────────────
  services: [
    {
      slug: 'consultas',
      name: 'Consultas e Clínica Geral',
      tag: 'Acompanhamento próximo',
      description:
        'Consultas com uma equipe que conhece a história do seu pet e acompanha cada etapa — do primeiro sintoma ao plano de tratamento, com total proximidade com o tutor.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Clínica veterinária {{PREP}} {{BAIRRO}} — Grupo Estimação Telespark',
      metaDescTemplate:
        'Clínica veterinária {{PREP}} {{BAIRRO}}, São José dos Campos. Consultas e acompanhamento próximo, com suporte de rede. Grupo Estimação Telespark.',
      icon: 'heart',
    },
    {
      slug: 'especialidades',
      name: 'Consultas com Especialistas',
      tag: 'Equipe integrada',
      description:
        'Ortopedia, cardiologia, dermatologia, oftalmologia, oncologia, nutrição, gastroenterologia e medicina interna — especialistas na própria clínica ou dentro da rede Grupo EstimaCão.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Veterinário especialista {{PREP}} {{BAIRRO}} — Grupo Estimação Telespark',
      metaDescTemplate:
        'Especialistas veterinários {{PREP}} {{BAIRRO}}, São José dos Campos: ortopedia, cardiologia, oncologia e mais. Grupo Estimação Telespark.',
      icon: 'heart',
    },
    {
      slug: 'cirurgia',
      name: 'Cirurgia e Anestesiologia',
      tag: 'Suporte de rede',
      description:
        'Cirurgias com anestesiologia dedicada, com acesso a centro cirúrgico e internação de toda a rede Grupo EstimaCão quando o caso exige. Pré e pós-operatório acompanhados de perto.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Cirurgia veterinária {{PREP}} {{BAIRRO}} — Grupo Estimação Telespark',
      metaDescTemplate:
        'Cirurgia veterinária {{PREP}} {{BAIRRO}}, São José dos Campos, com anestesiologia e suporte de rede. Grupo Estimação Telespark.',
      icon: 'dna',
    },
    {
      slug: 'exames-diagnostico',
      name: 'Exames e Diagnóstico por Imagem',
      tag: 'Diagnóstico ágil',
      description:
        'Diagnóstico por imagem e exames laboratoriais, com acesso a exames mais avançados dentro da rede. Diagnóstico mais rápido, sem recomeçar a história a cada encaminhamento.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Exames veterinários {{PREP}} {{BAIRRO}} — Grupo Estimação Telespark',
      metaDescTemplate:
        'Exames veterinários {{PREP}} {{BAIRRO}}, São José dos Campos. Imagem e laboratório com suporte de rede. Grupo Estimação Telespark.',
      icon: 'chart',
    },
    {
      slug: 'vacinacao',
      name: 'Vacinação e Prevenção',
      tag: 'Prevenção',
      description:
        'Vacinação e cuidados preventivos para manter a saúde do seu pet em dia. Prevenir é o caminho mais simples — e mais barato — para evitar problemas maiores.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Vacinação veterinária {{PREP}} {{BAIRRO}} — Grupo Estimação Telespark',
      metaDescTemplate:
        'Vacinação veterinária {{PREP}} {{BAIRRO}}, São José dos Campos, com equipe integrada. Grupo Estimação Telespark.',
      icon: 'apple',
    },
  ],

  // ── Bairros (SEO programático) ────────────────────────────────────
  neighborhoods: [
    { slug: 'vila-dirce',          name: 'Vila Dirce',          prep: 'na' },
    { slug: 'vila-veneziani',      name: 'Vila Veneziani',      prep: 'na' },
    { slug: 'jardim-anchieta',     name: 'Jardim Anchieta',     prep: 'no' },
    { slug: 'recanto-caete',       name: 'Recanto Caeté',       prep: 'no' },
    { slug: 'jardim-altos-de-santana', name: 'Jardim Altos de Santana', prep: 'no' },
    { slug: 'vila-sinha',          name: 'Vila Sinhá',          prep: 'na' },
    { slug: 'centro',              name: 'Centro',              prep: 'no' },
    { slug: 'santana',             name: 'Santana',             prep: 'no' },
  ],

  // ── Schema.org ────────────────────────────────────────────────────
  schemaType: 'VeterinaryCare',
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '18:00' },
  ],
  priceRange: '$$',
};
