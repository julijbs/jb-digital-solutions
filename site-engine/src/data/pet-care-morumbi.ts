/**
 * pet-care-morumbi.ts — Dados do cliente Pet Care Morumbi (spec-site / prévia)
 *
 * Gerado pela estratégia Spec-Site-Primeiro (lead nota 8: 1.257 avaliações, PSI 54/100).
 * Conteúdo extraído do site atual (petcare.com.br, unidade Morumbi) + Google.
 * Depoimentos: endossos profissionais reais publicados no site da rede (não fabricados).
 */
import type { ClientData } from '../lib/types.ts';

export const petCareMorumbi: ClientData = {
  // ── Identidade ──────────────────────────────────────────────────
  businessName: 'Pet Care Morumbi',
  specialty: 'Hospital Veterinário 24h · Centro de Especialidades',
  credential: 'Hospital veterinário 24h · Emergência, internação e centro de especialidades · Morumbi, São Paulo',
  slug: 'pet-care-morumbi',
  siteUrl: 'https://pet-care-morumbi.jbdigitalsystem.com',
  mood: 'fresh-clinical',

  // ── Endereço ─────────────────────────────────────────────────────
  streetAddress: 'Avenida Giovanni Gronchi, 3001',
  postalCode: '05651-001',
  district: 'Morumbi',
  specialtyNoun: 'veterinário',

  // ── Contato ──────────────────────────────────────────────────────
  city: 'São Paulo',
  state: 'SP',
  phone: '(11) 94242-0894',
  phoneClean: '11942420894',
  email: '',
  instagram: '@hv_petcare',
  address: 'Avenida Giovanni Gronchi, 3001 — Morumbi, São Paulo-SP',
  lat: '-23.5993',
  lng: '-46.7114',

  // ── Copy ─────────────────────────────────────────────────────────
  copy: {
    homeTitle: 'Hospital Veterinário 24h no Morumbi, São Paulo — Pet Care',
    homeMetaDescription:
      'Hospital veterinário 24h no Morumbi, São Paulo. Emergência, internação, UTI, centro cirúrgico e especialistas em cardiologia, oncologia, neurologia e mais. Quase 30 anos de história.',
    businessDescription:
      'Hospital veterinário 24 horas no Morumbi, São Paulo. Emergência e pronto atendimento, internação e UTI, centro cirúrgico, exames laboratoriais e de imagem, fisioterapia com hidroterapia e especialistas em cardiologia, oncologia, neurologia, oftalmologia, dermatologia e endocrinologia — a primeira unidade da rede Pet Care, com quase 30 anos.',
    llmsSummary:
      'Pet Care Morumbi é um hospital veterinário 24h em São Paulo (Morumbi), a primeira unidade da rede Pet Care (fundada em 1991, hoje parte da VCA). Oferece emergência, internação, UTI, centro cirúrgico, exames laboratoriais e de imagem, fisioterapia com hidroterapia, cirurgias cardíacas minimamente invasivas e um centro de especialidades. É a única unidade da rede com banho/tosa e hotel, com estacionamento próprio e manobrista.',

    heroHeadline: 'Quando cada minuto conta, seu melhor amigo tem para onde ir — 24 horas.',
    heroSubheadline:
      'Hospital veterinário completo no Morumbi: emergência, internação, UTI, centro cirúrgico e especialistas no mesmo lugar. A primeira unidade Pet Care, com quase 30 anos de história.',
    heroPhotoAlt: 'Equipe do Pet Care Morumbi em atendimento veterinário 24h',
    heroEyebrow: 'Hospital Veterinário 24h',

    painPoints: [
      'Emergência à noite — Seu pet passa mal de madrugada e a maioria das clínicas está fechada. Cada minuto procurando um lugar aberto é um minuto que faz falta.',
      'Corre pra lá, corre pra cá — Consulta num lugar, exame em outro, especialista num terceiro. O tratamento se fragmenta bem na hora em que ele mais precisa de continuidade.',
      'A dúvida de sempre — Será que é grave? Sem um pronto atendimento de confiança por perto, qualquer sintoma vira uma noite de angústia e decisões no escuro.',
    ],

    aboutHeadline: 'Quase 30 anos cuidando de quem é da família.',
    aboutBody:
      'O Pet Care Morumbi foi a primeira unidade da rede Pet Care, fundada em 1991 — e desde então virou referência em medicina veterinária em São Paulo. É um hospital 24 horas que reúne, num único lugar, tudo que um animal pode precisar: emergência e pronto atendimento, internação e UTI, centro cirúrgico, exames laboratoriais e de imagem, fisioterapia com esteira de hidroterapia e um centro de especialidades com cardiologia, oncologia, neurologia, oftalmologia, dermatologia, endocrinologia e gastroenterologia. Aqui há tecnologia de ponta — de cirurgias cardíacas minimamente invasivas a tratamentos com células-tronco — sem abrir mão do acolhimento. E, por ser a unidade mais completa da rede, é também a única com banho e tosa e hotel para pets, com estacionamento próprio e manobrista para facilitar a sua chegada.',
    pullQuote:
      'Infraestrutura de qualidade, tecnologia de ponta e excelentes profissionais — no mesmo hospital, 24 horas.',
    aboutCredential:
      'Hospital veterinário 24h · Emergência, UTI e centro cirúrgico · Centro de especialidades · Morumbi, São Paulo',
    aboutPhotoAlt: 'Estrutura do Pet Care Morumbi, hospital veterinário 24h em São Paulo',

    servicesHeadline: 'Tudo que o seu pet precisa, no mesmo lugar.',
    processHeadline: 'Como funciona o atendimento.',
    processSteps: [
      {
        name: 'Chegou, é atendido',
        description:
          'Pronto atendimento 24h para qualquer urgência. Na emergência a equipe avalia o seu pet assim que vocês chegam, a qualquer hora do dia ou da noite — com estacionamento próprio e manobrista para facilitar.',
      },
      {
        name: 'Diagnóstico no local',
        description:
          'Exames laboratoriais e de imagem feitos aqui mesmo. Isso encurta o tempo até o diagnóstico e evita levar seu pet de um lugar para outro em um momento delicado.',
      },
      {
        name: 'Tratamento e acompanhamento',
        description:
          'Internação, UTI, cirurgia, fisioterapia ou tratamento com um dos especialistas — tudo com o mesmo time, do começo ao fim, e com você acompanhando de perto.',
      },
    ],
    testimonials: [
      {
        quote:
          'A rede Pet Care é um dos locais que elejo como dos mais adequados e preparados.',
        author: 'Profa. Dra. Marcia Jericó · referência em endocrinologia veterinária',
      },
      {
        quote:
          'Uma equipe muito bacana, atendimento excelente — me deixa tranquila e segura.',
        author: 'Dra. Janaína Reis · médica-veterinária',
      },
    ],
    faqHeadline: 'Perguntas que todo tutor faz antes de precisar.',
    faqs: [
      {
        question: 'O Pet Care Morumbi atende 24 horas mesmo?',
        answer:
          'Sim. Somos um hospital veterinário aberto 24 horas, com plantão e pronto atendimento para qualquer urgência — inclusive de madrugada, fins de semana e feriados. As consultas clínicas regulares seguem horário estendido todos os dias.',
      },
      {
        question: 'Preciso agendar para levar meu pet na emergência?',
        answer:
          'Não. Na emergência o atendimento é por ordem de chegada e gravidade — é só vir. Para consultas com especialistas e exames eletivos, o agendamento ajuda a reduzir a espera.',
      },
      {
        question: 'Vocês fazem exames e cirurgias no próprio local?',
        answer:
          'Sim. Temos laboratório, exames de imagem, centro cirúrgico, internação e UTI na própria unidade — além de fisioterapia com hidroterapia e cirurgias de alta complexidade, como as cardíacas minimamente invasivas.',
      },
      {
        question: 'Qual o endereço da unidade Morumbi?',
        answer:
          'Avenida Giovanni Gronchi, 3001 — Morumbi, São Paulo-SP. Contamos com estacionamento próprio e manobrista, e atendimento 24h para toda a região.',
      },
      {
        question: 'Que especialidades vocês têm?',
        answer:
          'Cardiologia, oncologia, neurologia, oftalmologia, dermatologia, endocrinologia e gastroenterologia, entre outras — com equipe integrada e tecnologia de ponta, inclusive tratamentos com células-tronco.',
      },
    ],
    ctaHeadline: 'Salve nosso contato antes de precisar dele.',
    ctaSubtext:
      'Emergência não avisa. Ter um hospital 24h de confiança já salvo no celular é o que faz diferença na hora certa. Fale com a gente ou venha conhecer a estrutura.',
    ctaButtonText: 'Falar agora',
    heroCtaText: 'Falar agora',
    heroCtaSecondaryText: 'Ver especialidades',
    navCtaText: 'Falar no WhatsApp',
    bairroCtaText: 'Falar agora',
    bairroIntroLead: 'Se você procura um hospital veterinário',
    bairroLocationLine:
      'o Pet Care Morumbi fica a poucos minutos — na Avenida Giovanni Gronchi, 3001, Morumbi. Emergência, internação e UTI funcionando 24 horas, com estacionamento próprio.',
    bairroNextSteps:
      'ligue agora ou chame no WhatsApp. Em emergência, venha direto — atendemos 24 horas, todos os dias, inclusive feriados.',
  },

  // ── Serviços (SEO programático) ───────────────────────────────────
  services: [
    {
      slug: 'emergencia-24h',
      name: 'Emergência e Pronto Atendimento 24h',
      tag: '24 horas',
      description:
        'Plantão e pronto atendimento abertos 24 horas para qualquer urgência: acidentes, intoxicações, dificuldade para respirar, dor aguda. Avaliação imediata por ordem de chegada e gravidade, com internação e UTI no mesmo local.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Veterinário 24h {{PREP}} {{BAIRRO}} — Emergência · Pet Care Morumbi',
      metaDescTemplate:
        'Emergência veterinária 24h {{PREP}} {{BAIRRO}}, São Paulo. Pronto atendimento, internação e UTI no mesmo lugar. Pet Care Morumbi, quase 30 anos.',
      icon: 'heart',
    },
    {
      slug: 'internacao-uti',
      name: 'Internação e UTI',
      tag: 'Cuidado contínuo',
      description:
        'Internação e UTI para casos que exigem monitoramento constante, com equipe presente 24h. Acompanhamento próximo e comunicação clara com o tutor durante toda a recuperação.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Internação e UTI veterinária {{PREP}} {{BAIRRO}} — Pet Care Morumbi',
      metaDescTemplate:
        'Internação e UTI veterinária {{PREP}} {{BAIRRO}}, São Paulo. Monitoramento 24h e acompanhamento próximo. Pet Care Morumbi.',
      icon: 'heart',
    },
    {
      slug: 'cirurgia',
      name: 'Centro Cirúrgico',
      tag: 'Alta complexidade',
      description:
        'Centro cirúrgico completo, de procedimentos de rotina a cirurgias de alta complexidade — incluindo cardíacas minimamente invasivas e oftalmológicas (catarata). Pré e pós-operatório acompanhados pelo mesmo time.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Cirurgia veterinária {{PREP}} {{BAIRRO}} — Pet Care Morumbi',
      metaDescTemplate:
        'Cirurgia veterinária {{PREP}} {{BAIRRO}}, São Paulo. Centro cirúrgico de alta complexidade, inclusive cardíacas. Pet Care Morumbi, 24h.',
      icon: 'dna',
    },
    {
      slug: 'exames-diagnostico',
      name: 'Exames e Diagnóstico por Imagem',
      tag: 'No próprio local',
      description:
        'Laboratório de análises clínicas e exames de imagem na própria unidade, além de fisioterapia com esteira de hidroterapia. Diagnóstico mais rápido, sem precisar levar seu pet de um lugar para outro.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Exames veterinários {{PREP}} {{BAIRRO}} — Pet Care Morumbi',
      metaDescTemplate:
        'Exames veterinários {{PREP}} {{BAIRRO}}, São Paulo. Laboratório, imagem e fisioterapia no local. Pet Care Morumbi, 24h.',
      icon: 'chart',
    },
    {
      slug: 'especialidades',
      name: 'Centro de Especialidades',
      tag: 'Equipe integrada',
      description:
        'Cardiologia, oncologia, neurologia, oftalmologia, dermatologia, endocrinologia e gastroenterologia — especialistas trabalhando de forma integrada, com tecnologia de ponta, inclusive tratamentos com células-tronco.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Veterinário especialista {{PREP}} {{BAIRRO}} — Pet Care Morumbi',
      metaDescTemplate:
        'Especialistas veterinários {{PREP}} {{BAIRRO}}, São Paulo: cardiologia, oncologia, neurologia e mais. Pet Care Morumbi, 24h.',
      icon: 'heart',
    },
    {
      slug: 'banho-tosa-hotel',
      name: 'Banho, Tosa e Hotel',
      tag: 'Exclusivo desta unidade',
      description:
        'A unidade Morumbi é a única da rede com banho e tosa e hotel para pets — o cuidado do dia a dia e o descanso do seu pet com a tranquilidade de estar dentro de um hospital 24h.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Banho, tosa e hotel para pet {{PREP}} {{BAIRRO}} — Pet Care Morumbi',
      metaDescTemplate:
        'Banho, tosa e hotel para pets {{PREP}} {{BAIRRO}}, São Paulo, dentro de um hospital 24h. Pet Care Morumbi.',
      icon: 'apple',
    },
  ],

  // ── Bairros (SEO programático) ────────────────────────────────────
  neighborhoods: [
    { slug: 'morumbi',        name: 'Morumbi',        prep: 'no' },
    { slug: 'cidade-jardim',  name: 'Cidade Jardim',  prep: 'no' },
    { slug: 'panamby',        name: 'Panamby',        prep: 'no' },
    { slug: 'real-parque',    name: 'Real Parque',    prep: 'no' },
    { slug: 'vila-andrade',   name: 'Vila Andrade',   prep: 'na' },
    { slug: 'brooklin',       name: 'Brooklin',       prep: 'no' },
    { slug: 'jardim-guedala', name: 'Jardim Guedala', prep: 'no' },
    { slug: 'vila-suzana',    name: 'Vila Suzana',    prep: 'na' },
  ],

  // ── Schema.org ────────────────────────────────────────────────────
  schemaType: 'VeterinaryCare',
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' },
  ],
  priceRange: '$$',
};
