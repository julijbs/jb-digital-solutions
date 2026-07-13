/**
 * pet-vet-e-cia.ts — Dados do cliente Pet Vet & Cia Animal Center (spec-site / prévia)
 *
 * Gerado pela estratégia Spec-Site-Primeiro (lead nota 8: 528 avaliações, PSI 39/100).
 * Conteúdo extraído do site atual (petvetecia.com) + Google.
 * NÃO é pronto-atendimento 24h — clínica Seg-Sáb com serviço de internação 24h.
 * Sem depoimentos com autor no site — deixados vazios (não fabricados).
 */
import type { ClientData } from '../lib/types.ts';

export const petVetECia: ClientData = {
  // ── Identidade ──────────────────────────────────────────────────
  businessName: 'Pet Vet & Cia',
  specialty: 'Clínica Veterinária, Internação 24h e Petshop',
  credential: 'Clínica veterinária completa · Internação 24h, especialidades e petshop · Cambuci, São Paulo',
  slug: 'pet-vet-e-cia',
  siteUrl: 'https://pet-vet-e-cia.jbdigitalsystem.com',
  mood: 'fresh-clinical',

  // ── Endereço ─────────────────────────────────────────────────────
  streetAddress: 'Avenida Lacerda Franco, 92',
  postalCode: '01536-000',
  district: 'Cambuci',
  specialtyNoun: 'veterinário',

  // ── Contato ──────────────────────────────────────────────────────
  city: 'São Paulo',
  state: 'SP',
  phone: '(11) 95113-8979',
  phoneClean: '11951138979',
  email: '',
  instagram: '@petvet.cia',
  address: 'Avenida Lacerda Franco, 92 — Cambuci, São Paulo-SP',
  lat: '-23.5634',
  lng: '-46.6225',

  // ── Copy ─────────────────────────────────────────────────────────
  copy: {
    homeTitle: 'Clínica Veterinária e Petshop no Cambuci, São Paulo — Pet Vet & Cia',
    homeMetaDescription:
      'Clínica veterinária completa no Cambuci, São Paulo: consultas, exames, cirurgias, internação 24h, especialidades, homeopatia, acupuntura, táxi pet e petshop. Tudo em um só lugar.',
    businessDescription:
      'Clínica veterinária completa no Cambuci, São Paulo, com internação 24h. Consultas, vacinação, exames, cirurgias eletivas e de emergência, especialidades, homeopatia e acupuntura — além de banho e tosa, petshop, farmácia, microchipagem e serviço de transporte de animais (táxi pet). Tudo o que o seu pet precisa em um só lugar.',
    llmsSummary:
      'Pet Vet & Cia é uma clínica veterinária completa no Cambuci, São Paulo, com serviço de internação 24h. Oferece consultas, vacinação, exames, cirurgias eletivas e de emergência, especialidades, homeopatia e acupuntura, além de banho e tosa, petshop com delivery, farmácia, microchipagem e transporte de animais (Pet Móvel). Atende convênios como Dr. Pet e Petlove.',

    heroHeadline: 'Tudo o que o seu pet precisa, em um só lugar.',
    heroSubheadline:
      'Clínica veterinária completa no Cambuci: consultas, exames, cirurgias, internação 24h, especialidades, homeopatia e acupuntura — além de banho e tosa, petshop e até táxi pet.',
    heroPhotoAlt: 'Equipe da Pet Vet & Cia em atendimento veterinário no Cambuci',
    heroEyebrow: 'Clínica Veterinária e Petshop',

    painPoints: [
      'Um serviço em cada lugar — Veterinário numa esquina, petshop em outra, farmácia numa terceira. Cuidar do pet vira uma maratona pela cidade.',
      'Sem tempo de levar — Rotina corrida, trânsito, e o pet precisando de banho, vacina ou consulta. Nem sempre dá pra parar tudo e levar.',
      'E se precisar internar? — Uma clínica que atende de dia é ótima, mas e quando o caso exige acompanhamento durante a noite?',
    ],

    aboutHeadline: 'Uma clínica completa — que também vai até você.',
    aboutBody:
      'A Pet Vet & Cia nasceu de uma ideia simples: reunir, num único lugar, tudo o que o seu pet precisa. Somos uma clínica veterinária completa no Cambuci, com consultas, vacinação, exames, cirurgias eletivas e de emergência, especialidades, homeopatia e acupuntura — e com serviço de internação 24h para os casos que pedem acompanhamento durante a noite. Além do cuidado clínico, cuidamos do dia a dia: banho e tosa, petshop com loja online e delivery, farmácia e microchipagem. E quando levar fica difícil, a gente vai até você com o nosso serviço de transporte de animais, o Pet Móvel. Atendemos convênios como Dr. Pet e Petlove e ainda mantemos o programa Ecopatas de reciclagem — porque cuidar bem também é cuidar do entorno.',
    pullQuote:
      'Do banho à internação, da vacina à cirurgia — tudo o que o seu pet precisa, no mesmo lugar.',
    aboutCredential:
      'Clínica veterinária completa · Internação 24h, especialidades, homeopatia e acupuntura · Petshop e táxi pet · Cambuci, São Paulo',
    aboutPhotoAlt: 'Estrutura da Pet Vet & Cia, clínica veterinária e petshop no Cambuci',

    servicesHeadline: 'Tudo que o seu pet precisa, no mesmo lugar.',
    processHeadline: 'Como funciona o atendimento.',
    processSteps: [
      {
        name: 'Consulta e diagnóstico',
        description:
          'Consultas com equipe experiente e exames para chegar rápido ao diagnóstico. Se preferir, o Pet Móvel busca e leva o seu pet — sem você precisar parar a rotina.',
      },
      {
        name: 'Tratamento sob medida',
        description:
          'Cirurgias, especialidades e também opções integrativas como homeopatia e acupuntura. Para os casos que pedem, internação com acompanhamento 24h.',
      },
      {
        name: 'Cuidado do dia a dia',
        description:
          'Banho e tosa, vacinas, farmácia, microchip e petshop com delivery — o cuidado contínuo do seu pet resolvido no mesmo lugar de confiança.',
      },
    ],
    testimonials: [],
    faqHeadline: 'Perguntas que todo tutor faz.',
    faqs: [
      {
        question: 'Qual o horário de funcionamento?',
        answer:
          'Atendemos de segunda a sexta, das 7h às 22h, e aos sábados, das 7h às 18h. O serviço de internação funciona 24 horas, com acompanhamento durante a noite para os casos que precisam.',
      },
      {
        question: 'Vocês têm serviço de transporte para o pet?',
        answer:
          'Sim. Com o Pet Móvel (táxi pet), buscamos e levamos o seu pet com segurança — ideal para quem tem a rotina corrida ou dificuldade de locomoção.',
      },
      {
        question: 'Vocês atendem convênios?',
        answer:
          'Sim. Atendemos convênios como Dr. Pet e Petlove. Fale com a gente para confirmar a cobertura do seu plano.',
      },
      {
        question: 'Qual o endereço da clínica?',
        answer:
          'Avenida Lacerda Franco, 92 — Cambuci, São Paulo-SP. Região central e de fácil acesso, pertinho da Liberdade, Aclimação e Vila Mariana.',
      },
      {
        question: 'Vocês fazem cirurgias e internação?',
        answer:
          'Sim. Realizamos cirurgias eletivas e de emergência e contamos com serviço de internação 24h, além de especialidades, homeopatia e acupuntura.',
      },
    ],
    ctaHeadline: 'Resolva tudo do seu pet em um só lugar.',
    ctaSubtext:
      'Consulta, banho, vacina, exame ou internação — e até transporte até você. Fale com a gente para agendar ou tirar suas dúvidas.',
    ctaButtonText: 'Falar agora',
    heroCtaText: 'Falar agora',
    heroCtaSecondaryText: 'Ver serviços',
    navCtaText: 'Falar no WhatsApp',
    bairroCtaText: 'Falar agora',
    bairroIntroLead: 'Se você procura uma clínica veterinária',
    bairroLocationLine:
      'a Pet Vet & Cia fica a poucos minutos — na Avenida Lacerda Franco, 92, Cambuci. Clínica completa, internação 24h e petshop, com serviço de transporte até você.',
    bairroNextSteps:
      'ligue ou chame no WhatsApp para agendar. Atendemos de segunda a sábado — e o Pet Móvel pode buscar o seu pet.',
  },

  // ── Serviços (SEO programático) ───────────────────────────────────
  services: [
    {
      slug: 'clinica-consultas',
      name: 'Consultas e Vacinação',
      tag: 'Cuidado de rotina',
      description:
        'Consultas com equipe experiente, vacinação e microchipagem para manter a saúde e a segurança do seu pet em dia — com a comodidade de resolver tudo no mesmo lugar.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Clínica veterinária {{PREP}} {{BAIRRO}} — Pet Vet & Cia',
      metaDescTemplate:
        'Clínica veterinária {{PREP}} {{BAIRRO}}, São Paulo. Consultas, vacinação e microchip. Pet Vet & Cia, Cambuci.',
      icon: 'heart',
    },
    {
      slug: 'internacao-24h',
      name: 'Internação 24h',
      tag: 'Acompanhamento noturno',
      description:
        'Serviço de internação com acompanhamento 24 horas para os casos que exigem cuidado contínuo, inclusive durante a noite. Comunicação clara com o tutor em cada etapa.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Internação veterinária 24h {{PREP}} {{BAIRRO}} — Pet Vet & Cia',
      metaDescTemplate:
        'Internação veterinária 24h {{PREP}} {{BAIRRO}}, São Paulo. Acompanhamento contínuo, inclusive à noite. Pet Vet & Cia, Cambuci.',
      icon: 'heart',
    },
    {
      slug: 'cirurgia',
      name: 'Cirurgias e Emergência',
      tag: 'Eletiva e de emergência',
      description:
        'Cirurgias eletivas e de emergência, com pré e pós-operatório acompanhados pelo mesmo time. Estrutura para resolver dentro da própria clínica.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Cirurgia veterinária {{PREP}} {{BAIRRO}} — Pet Vet & Cia',
      metaDescTemplate:
        'Cirurgia veterinária {{PREP}} {{BAIRRO}}, São Paulo, eletiva e de emergência. Pet Vet & Cia, Cambuci.',
      icon: 'dna',
    },
    {
      slug: 'especialidades-integrativas',
      name: 'Especialidades, Homeopatia e Acupuntura',
      tag: 'Cuidado integrativo',
      description:
        'Consultas com especialistas e opções integrativas como homeopatia e acupuntura — para tratamentos mais completos e adaptados ao seu pet.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Veterinário especialista {{PREP}} {{BAIRRO}} — Pet Vet & Cia',
      metaDescTemplate:
        'Especialidades, homeopatia e acupuntura veterinária {{PREP}} {{BAIRRO}}, São Paulo. Pet Vet & Cia, Cambuci.',
      icon: 'heart',
    },
    {
      slug: 'banho-tosa-petshop',
      name: 'Banho, Tosa e Petshop',
      tag: 'Dia a dia',
      description:
        'Banho terapêutico, tosa, trimming e cuidados de higiene, além de petshop com loja online, delivery e farmácia. Todo o cuidado do dia a dia no mesmo lugar de confiança.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Banho e tosa {{PREP}} {{BAIRRO}} — Pet Vet & Cia',
      metaDescTemplate:
        'Banho, tosa e petshop {{PREP}} {{BAIRRO}}, São Paulo, com delivery e farmácia. Pet Vet & Cia, Cambuci.',
      icon: 'apple',
    },
    {
      slug: 'taxi-pet',
      name: 'Táxi Pet (Pet Móvel)',
      tag: 'Vamos até você',
      description:
        'Serviço de transporte de animais que busca e leva o seu pet com segurança — ideal para quem tem a rotina corrida ou dificuldade de locomoção.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Táxi pet e transporte de animais {{PREP}} {{BAIRRO}} — Pet Vet & Cia',
      metaDescTemplate:
        'Táxi pet / transporte de animais {{PREP}} {{BAIRRO}}, São Paulo. Buscamos e levamos o seu pet. Pet Vet & Cia, Cambuci.',
      icon: 'chart',
    },
  ],

  // ── Bairros (SEO programático) ────────────────────────────────────
  neighborhoods: [
    { slug: 'cambuci',      name: 'Cambuci',      prep: 'no' },
    { slug: 'liberdade',    name: 'Liberdade',    prep: 'na' },
    { slug: 'aclimacao',    name: 'Aclimação',    prep: 'na' },
    { slug: 'ipiranga',     name: 'Ipiranga',     prep: 'no' },
    { slug: 'vila-mariana', name: 'Vila Mariana', prep: 'na' },
    { slug: 'glicerio',     name: 'Glicério',     prep: 'no' },
    { slug: 'bela-vista',   name: 'Bela Vista',   prep: 'na' },
    { slug: 'mooca',        name: 'Mooca',        prep: 'na' },
  ],

  // ── Schema.org ────────────────────────────────────────────────────
  schemaType: 'VeterinaryCare',
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '22:00' },
    { days: ['Saturday'], opens: '07:00', closes: '18:00' },
  ],
  priceRange: '$$',
};
