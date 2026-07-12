/**
 * pet-care-tatuape.ts — Dados do cliente Pet Care Tatuapé (spec-site / prévia)
 *
 * Gerado pela estratégia Spec-Site-Primeiro (lead nota 8: 1.015 avaliações, PSI 66/100).
 * Conteúdo extraído do site atual (petcare.com.br/unidades/sao-paulo/tatuape) + Google.
 * Sem depoimentos: o site traz relatos de casos, não citações de tutores — deixados vazios.
 */
import type { ClientData } from '../lib/types.ts';

export const petCareTatuape: ClientData = {
  // ── Identidade ──────────────────────────────────────────────────
  businessName: 'Pet Care Tatuapé',
  specialty: 'Hospital Veterinário 24h · Certificado Cat Friendly',
  credential: 'Hospital veterinário 24h · Emergência, internação e área exclusiva para felinos · Tatuapé, São Paulo',
  slug: 'pet-care-tatuape',
  siteUrl: 'https://pet-care-tatuape.jbdigitalsystem.com',
  mood: 'fresh-clinical',

  // ── Endereço ─────────────────────────────────────────────────────
  streetAddress: 'Rua Serra de Japi, 965',
  postalCode: '03309-000',
  district: 'Tatuapé',
  specialtyNoun: 'veterinário',

  // ── Contato ──────────────────────────────────────────────────────
  city: 'São Paulo',
  state: 'SP',
  phone: '(11) 94242-0894',
  phoneClean: '11942420894',
  email: '',
  instagram: '@hv_petcare',
  address: 'Rua Serra de Japi, 965 — Tatuapé, São Paulo-SP',
  lat: '-23.5478',
  lng: '-46.5682',

  // ── Copy ─────────────────────────────────────────────────────────
  copy: {
    homeTitle: 'Hospital Veterinário 24h no Tatuapé, São Paulo — Pet Care',
    homeMetaDescription:
      'Hospital veterinário 24h no Tatuapé, São Paulo. Emergência, internação, UTI, cirurgias e área exclusiva para felinos (certificação Cat Friendly). Atendimento todos os dias.',
    businessDescription:
      'Hospital veterinário 24 horas no Tatuapé, São Paulo. Emergência e pronto atendimento, internação para cães e gatos, UTI, centro cirúrgico, exames laboratoriais e de imagem, fisioterapia com hidroterapia e consultas com especialistas — com certificação Cat Friendly e área exclusiva para felinos.',
    llmsSummary:
      'Pet Care Tatuapé é um hospital veterinário 24h em São Paulo (Tatuapé), fundado em 2014, parte da rede Pet Care. Oferece emergência, internação, UTI, centro cirúrgico, exames laboratoriais e de imagem, fisioterapia com hidroterapia e consultas com especialistas. Tem certificação Cat Friendly, com sala de espera, consultórios e internação exclusivos para felinos, além de isolamento para doenças infectocontagiosas e estacionamento próprio.',

    heroHeadline: 'Quando cada minuto conta, seu melhor amigo tem para onde ir — 24 horas.',
    heroSubheadline:
      'Hospital veterinário completo no Tatuapé: emergência, internação, UTI e cirurgias no mesmo lugar — com certificação Cat Friendly e área exclusiva para felinos. Aberto todos os dias.',
    heroPhotoAlt: 'Equipe do Pet Care Tatuapé em atendimento veterinário 24h',
    heroEyebrow: 'Hospital Veterinário 24h',

    painPoints: [
      'Emergência à noite — Seu pet passa mal de madrugada e a maioria das clínicas está fechada. Cada minuto procurando um lugar aberto é um minuto que faz falta.',
      'Gato estressado na clínica — Sala de espera cheia de cães, barulho, cheiro. Para um felino, isso transforma qualquer visita num pesadelo — e atrapalha até o diagnóstico.',
      'Corre pra lá, corre pra cá — Consulta num lugar, exame em outro, internação num terceiro. O tratamento se fragmenta bem na hora em que ele mais precisa de continuidade.',
    ],

    aboutHeadline: 'Um hospital 24h — e um espaço pensado também para os gatos.',
    aboutBody:
      'Fundado em 2014, o Pet Care Tatuapé é um hospital veterinário 24 horas que reúne, num único lugar, tudo que um animal pode precisar: emergência e pronto atendimento, internação para cães e gatos, UTI, centro cirúrgico, exames laboratoriais e de imagem, fisioterapia com hidroterapia e consultas com especialistas. O que o torna diferente é o cuidado com quem costuma sofrer mais numa clínica comum: temos certificação Cat Friendly, com sala de espera, consultórios e internação exclusivos para felinos — longe do barulho dos cães. Contamos ainda com isolamento para doenças infectocontagiosas e estacionamento próprio, para que a sua chegada, mesmo numa emergência, seja o mais tranquila possível. Aqui, o mesmo time acompanha cada etapa do tratamento, do acolhimento à alta.',
    pullQuote:
      'Infraestrutura de qualidade e tecnologia de ponta — com um cuidado especial para quem tem medo de clínica.',
    aboutCredential:
      'Hospital veterinário 24h · Emergência, UTI e centro cirúrgico · Certificação Cat Friendly · Tatuapé, São Paulo',
    aboutPhotoAlt: 'Estrutura do Pet Care Tatuapé, hospital veterinário 24h em São Paulo',

    servicesHeadline: 'Tudo que o seu pet precisa, no mesmo lugar.',
    processHeadline: 'Como funciona o atendimento.',
    processSteps: [
      {
        name: 'Chegou, é atendido',
        description:
          'Pronto atendimento 24h para qualquer urgência, com estacionamento próprio. A equipe avalia o seu pet assim que vocês chegam — e, se for um gato, num ambiente pensado para reduzir o estresse.',
      },
      {
        name: 'Diagnóstico no local',
        description:
          'Exames laboratoriais e de imagem feitos aqui mesmo. Isso encurta o tempo até o diagnóstico e evita levar seu pet de um lugar para outro em um momento delicado.',
      },
      {
        name: 'Tratamento e acompanhamento',
        description:
          'Internação (com área exclusiva para felinos e isolamento infeccioso), UTI, cirurgia ou tratamento com um dos especialistas — tudo com o mesmo time, do começo ao fim.',
      },
    ],
    testimonials: [],
    faqHeadline: 'Perguntas que todo tutor faz antes de precisar.',
    faqs: [
      {
        question: 'O Pet Care Tatuapé atende 24 horas mesmo?',
        answer:
          'Sim. Somos um hospital veterinário aberto 24 horas, com plantão e pronto atendimento para qualquer urgência — inclusive de madrugada, fins de semana e feriados. As consultas regulares seguem horário estendido todos os dias.',
      },
      {
        question: 'O que é a certificação Cat Friendly?',
        answer:
          'É um reconhecimento para clínicas que adaptam estrutura e atendimento às necessidades dos gatos. Na prática, temos sala de espera, consultórios e internação exclusivos para felinos, longe do barulho dos cães — o que deixa a visita muito menos estressante.',
      },
      {
        question: 'Preciso agendar para levar meu pet na emergência?',
        answer:
          'Não. Na emergência o atendimento é por ordem de chegada e gravidade — é só vir. Para consultas com especialistas e exames eletivos, o agendamento ajuda a reduzir a espera.',
      },
      {
        question: 'Qual o endereço da unidade Tatuapé?',
        answer:
          'Rua Serra de Japi, 965 — Tatuapé, São Paulo-SP, ao lado da praça Nossa Senhora do Bom Parto. Contamos com estacionamento próprio e atendimento 24h.',
      },
      {
        question: 'Vocês fazem exames e cirurgias no próprio local?',
        answer:
          'Sim. Temos laboratório, exames de imagem, centro cirúrgico, internação, UTI e isolamento para doenças infectocontagiosas na própria unidade — além de fisioterapia com hidroterapia.',
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
      'o Pet Care Tatuapé fica a poucos minutos — na Rua Serra de Japi, 965, Tatuapé. Emergência, internação e UTI funcionando 24 horas, com área exclusiva para felinos.',
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
      h1Template: 'Veterinário 24h {{PREP}} {{BAIRRO}} — Emergência · Pet Care Tatuapé',
      metaDescTemplate:
        'Emergência veterinária 24h {{PREP}} {{BAIRRO}}, São Paulo. Pronto atendimento, internação e UTI no mesmo lugar. Pet Care Tatuapé.',
      icon: 'heart',
    },
    {
      slug: 'felinos-cat-friendly',
      name: 'Atendimento Felino (Cat Friendly)',
      tag: 'Área exclusiva',
      description:
        'Sala de espera, consultórios e internação exclusivos para gatos, com certificação Cat Friendly. Um ambiente longe do barulho dos cães, que reduz o estresse e ajuda até no diagnóstico.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Veterinário para gatos {{PREP}} {{BAIRRO}} — Pet Care Tatuapé',
      metaDescTemplate:
        'Atendimento felino Cat Friendly {{PREP}} {{BAIRRO}}, São Paulo. Área exclusiva para gatos, sem estresse. Pet Care Tatuapé, 24h.',
      icon: 'heart',
    },
    {
      slug: 'internacao-uti',
      name: 'Internação e UTI',
      tag: 'Cuidado contínuo',
      description:
        'Internação para cães e gatos e UTI para casos que exigem monitoramento constante, com isolamento para doenças infectocontagiosas e equipe presente 24h.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Internação e UTI veterinária {{PREP}} {{BAIRRO}} — Pet Care Tatuapé',
      metaDescTemplate:
        'Internação e UTI veterinária {{PREP}} {{BAIRRO}}, São Paulo. Monitoramento 24h e isolamento infeccioso. Pet Care Tatuapé.',
      icon: 'heart',
    },
    {
      slug: 'cirurgia',
      name: 'Centro Cirúrgico',
      tag: 'Especialidade',
      description:
        'Centro cirúrgico completo, de procedimentos de rotina a cirurgias de maior complexidade, com acompanhamento pré e pós-operatório pelo mesmo time.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Cirurgia veterinária {{PREP}} {{BAIRRO}} — Pet Care Tatuapé',
      metaDescTemplate:
        'Cirurgia veterinária {{PREP}} {{BAIRRO}}, São Paulo. Centro cirúrgico com acompanhamento completo. Pet Care Tatuapé, 24h.',
      icon: 'dna',
    },
    {
      slug: 'exames-diagnostico',
      name: 'Exames e Diagnóstico por Imagem',
      tag: 'No próprio local',
      description:
        'Laboratório de análises clínicas e exames de imagem na própria unidade, além de fisioterapia com esteira de hidroterapia. Diagnóstico mais rápido, sem levar seu pet de um lugar para outro.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Exames veterinários {{PREP}} {{BAIRRO}} — Pet Care Tatuapé',
      metaDescTemplate:
        'Exames veterinários {{PREP}} {{BAIRRO}}, São Paulo. Laboratório, imagem e fisioterapia no local. Pet Care Tatuapé, 24h.',
      icon: 'chart',
    },
    {
      slug: 'especialidades',
      name: 'Consultas com Especialistas',
      tag: 'Equipe integrada',
      description:
        'Consultas clínicas e com especialistas em diversas áreas, com equipe integrada e a estrutura completa de um hospital 24h por trás de cada atendimento.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Veterinário especialista {{PREP}} {{BAIRRO}} — Pet Care Tatuapé',
      metaDescTemplate:
        'Especialistas veterinários {{PREP}} {{BAIRRO}}, São Paulo, com estrutura de hospital 24h. Pet Care Tatuapé.',
      icon: 'heart',
    },
  ],

  // ── Bairros (SEO programático) ────────────────────────────────────
  neighborhoods: [
    { slug: 'tatuape',            name: 'Tatuapé',            prep: 'no' },
    { slug: 'vila-gomes-cardim',  name: 'Vila Gomes Cardim',  prep: 'na' },
    { slug: 'vila-formosa',       name: 'Vila Formosa',       prep: 'na' },
    { slug: 'mooca',              name: 'Mooca',              prep: 'na' },
    { slug: 'vila-carrao',        name: 'Vila Carrão',        prep: 'no' },
    { slug: 'vila-matilde',       name: 'Vila Matilde',       prep: 'na' },
    { slug: 'analia-franco',      name: 'Anália Franco',      prep: 'no' },
    { slug: 'agua-rasa',          name: 'Água Rasa',          prep: 'na' },
  ],

  // ── Schema.org ────────────────────────────────────────────────────
  schemaType: 'VeterinaryCare',
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' },
  ],
  priceRange: '$$',
};
