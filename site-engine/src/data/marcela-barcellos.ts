/**
 * marcela-barcellos.ts — Dados da cliente Marcela Barcellos
 *
 * Psicóloga · Especialista em Neuropsicologia (Albert Einstein)
 * Pedagoga · Psicopedagoga · Ex-oficial FAB · Mãe de dois filhos
 *
 * ⚠️  PLACEHOLDERS — preencher antes do deploy:
 *   CRP_NUMERO   → número do CRP (ex.: "06/123456")
 *   ✅ CONFIRMADOS via GBP: cidade, estado, telefone, Instagram, lat/lng
 *   ⚠️  PENDENTES (preencher antes do deploy):
 *   CRP_NUMERO        → número do CRP
 *   RUA               → endereço da rua
 *   BAIRRO_CLI        → bairro do consultório
 *   CEP               → código postal
 *   EMAIL             → email de contato
 *   ENDERECO_COMPLETO → "Rua ..., 123 — Bairro, São José dos Campos-SP"
 *   BAIRRO_1..6       → bairros reais para SEO (próximos ao consultório em SJC)
 *   depoimentos reais → substituir os placeholders por depoimentos com autorização
 */

import type { ClientData } from '../lib/types.ts';

export const marcelaBarcells: ClientData = {
  // ── Identidade ──────────────────────────────────────────────────
  businessName: 'Marcela Barcellos',
  specialty:    'Psicóloga | Neuropsicologia · TCC',
  credential:   'CRP CRP_NUMERO · Pós-graduada em Neuropsicologia · Albert Einstein · São José dos Campos, SP',
  slug:         'marcela-barcellos',
  siteUrl:      'https://marcelabarcells.jbdigitalsystem.com',
  mood:         'calm-trust',

  // ── Marca visual ─────────────────────────────────────────────────
  logoSrc: '/marcela-barcellos/logo.png',
  brand: {
    primary:       '#9A6862',
    primaryDark:   '#835854',
    primaryLight:  '#B38D89',
    accent:        '#C4924A',
    accentDark:    '#8B642D',
    accentLight:   '#D0A66D',
    surface:       '#F6F5F3',
    surfaceMuted:  '#EBE9E5',
    surfaceDark:   '#DFDCD8',
    surfaceAlt:    '#E8E6E3',
    ink:           '#301F1D',
    inkMuted:      '#73605E',
    inkFaint:      '#9B8E8C',
    border:        '#D3CFCA',
    breakBg:       '#4B3230',
    white:         '#FFFFFF',
    fontDisplayFamily: "'Cormorant Garamond', Georgia, serif",
    fontBodyFamily:    "'Lato', system-ui, sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lato:wght@400;700&display=swap',
  },

  // ── Endereço ─────────────────────────────────────────────────────
  streetAddress: 'RUA',
  postalCode:    'CEP',
  district:      'BAIRRO_CLI',
  specialtyNoun: 'psicóloga',

  // ── Contato ──────────────────────────────────────────────────────
  city:         'São José dos Campos',
  state:        'SP',
  phone:        '(12) 98147-0915',
  phoneClean:   '12981470915',
  email:        'EMAIL',
  instagram:    '@psi.marcelabarcellos',
  address:      'ENDERECO_COMPLETO',
  lat:          '-23.1895062',
  lng:          '-45.8630127',

  // ── Copy ─────────────────────────────────────────────────────────
  copy: {
    homeTitle:
      'Marcela Barcellos — Psicóloga e Neuropsicóloga em CIDADE',
    homeMetaDescription:
      'Psicóloga especialista em Neuropsicologia em CIDADE. Avaliação neuropsicológica, TCC e suporte a transtornos de aprendizagem para crianças, adolescentes e adultos. Agende com Marcela Barcellos.',
    businessDescription:
      'Psicóloga e neuropsicóloga dedicada ao desenvolvimento humano em todas as fases da vida, com foco em avaliação neuropsicológica e Terapia Cognitivo-Comportamental baseada em evidências.',
    llmsSummary:
      'Marcela Barcellos é psicóloga (CRP CRP_NUMERO) especializada em Neuropsicologia (pós-graduação Albert Einstein). Atende crianças, adolescentes e adultos com avaliação neuropsicológica, TCC, transtornos de aprendizagem e neurodivergências. Formação integrada: Pedagogia + Psicopedagogia + 8 anos como oficial da FAB + Psicologia + Neuropsicologia.',

    heroHeadline:   'Cuidar do desenvolvimento humano em todas as fases da vida.',
    heroSubheadline:
      'Avaliação neuropsicológica e Terapia Cognitivo-Comportamental baseadas em evidências científicas — para crianças, adolescentes e adultos.',
    heroPhotoAlt:   'Marcela Barcellos, psicóloga e neuropsicóloga, sorrindo com postura acolhedora',
    heroPhotoSrc:   '/marcela-barcellos/marcela-perfil.jpg',

    painPoints: [
      {
        title:       'Meu filho tem dificuldade na escola e ninguém sabe o porquê',
        description: 'Laudos inconclusivos, orientações genéricas e a sensação de que algo mais profundo está sendo ignorado. A avaliação neuropsicológica revela o que está por trás das dificuldades.',
      },
      {
        title:       'Sinto que minha mente não funciona como deveria — mas nunca investiguei',
        description: 'Foco instável, memória falhando, aprendizagem mais lenta que o esperado. Sem um mapeamento preciso, qualquer terapia é um chute no escuro.',
      },
      {
        title:       'Quero uma terapia com base científica, não achismos',
        description: 'Protocolos validados, diagnóstico fundamentado e plano terapêutico personalizado — não uma abordagem genérica que serve para qualquer pessoa.',
      },
    ],

    aboutHeadline:   'Ciência, acolhimento e um olhar completo sobre o ser humano.',
    aboutBody:
      'Sou pedagoga de formação, psicopedagoga especialista e passei oito anos como oficial temporária da Força Aérea Brasileira — exercendo liderança, atuando como pedagoga e dirigindo uma escola militar. Esse percurso me deu uma visão rara: entendo a educação por dentro, da sala de aula à gestão. Em 2024 conclui a graduação em Psicologia. Em 2025, a pós-graduação em Neuropsicologia pelo Albert Einstein. Hoje, esses saberes se integram no consultório: avalio com precisão técnica e cuido com empatia real. Mãe de dois filhos, sei o que significa acompanhar o desenvolvimento de perto.',
    pullQuote:
      '"Avaliar para compreender. Compreender para evoluir."',
    aboutCredential:
      'Pedagoga · Psicopedagoga · Psicóloga CRP CRP_NUMERO · Pós-graduada em Neuropsicologia — Albert Einstein (2025) · Ex-Oficial Temporária da FAB',
    aboutPhotoAlt:  'Marcela Barcellos, psicóloga, em pose profissional e acolhedora',
    aboutPhotoSrc:  '/marcela-barcellos/marcela-perfil.jpg',

    servicesHeadline: 'Como posso te ajudar',

    processHeadline: 'O caminho do autoconhecimento ao desenvolvimento',
    processSteps: [
      {
        title:       'Conversa inicial',
        description: 'Entendemos juntos o que te trouxe até aqui — queixas, histórico e o que você espera do processo.',
      },
      {
        title:       'Avaliação neuropsicológica',
        description: 'Aplicação de testes validados que mapeiam memória, atenção, linguagem, funções executivas e aprendizagem.',
      },
      {
        title:       'Devolutiva e relatório',
        description: 'Você recebe uma explicação detalhada dos resultados e um relatório técnico completo — útil para escola, médicos e outros profissionais.',
      },
      {
        title:       'Plano terapêutico',
        description: 'Com base no diagnóstico preciso, iniciamos a TCC ou indicamos o melhor caminho para o seu desenvolvimento.',
      },
    ],

    testimonials: [
      {
        quote:  'DEPOIMENTO REAL 1 — substituir por depoimento de paciente (com autorização)',
        author: 'Nome e contexto — ex.: "Mãe de paciente de 9 anos"',
      },
      {
        quote:  'DEPOIMENTO REAL 2 — substituir por depoimento de paciente (com autorização)',
        author: 'Nome e contexto — ex.: "Adulto em processo terapêutico"',
      },
    ],

    faqHeadline: 'Perguntas frequentes',
    faqs: [
      {
        question: 'O que é avaliação neuropsicológica?',
        answer:
          'É uma avaliação clínica que mapeia como o seu cérebro funciona: memória, atenção, linguagem, funções executivas e aprendizagem. Por meio de testes validados cientificamente, identificamos pontos fortes e dificuldades — gerando um diagnóstico preciso e um direcionamento claro para a terapia.',
      },
      {
        question: 'A partir de que idade é possível fazer a avaliação?',
        answer:
          'Atendo crianças a partir dos 4 anos, adolescentes e adultos. Cada faixa etária tem protocolos específicos adaptados ao nível de desenvolvimento.',
      },
      {
        question: 'Qual a diferença entre neuropsicologia e psicologia clínica?',
        answer:
          'A psicologia clínica trata emoções, comportamentos e saúde mental de forma ampla. A neuropsicologia vai além: investiga como o funcionamento do cérebro impacta a cognição, a aprendizagem e o comportamento — integrando ciência neurológica à prática clínica.',
      },
      {
        question: 'Você faz visitas à escola?',
        answer:
          'Sim. Quando necessário, realizo visitas escolares para observar o comportamento da criança no ambiente real e alinhar com a equipe pedagógica. Isso enriquece o diagnóstico e fortalece o processo terapêutico.',
      },
      {
        question: 'Atende online?',
        answer:
          'Sim. Ofereço atendimento online para TCC e orientação parental em todo o Brasil. A avaliação neuropsicológica é presencial.',
      },
    ],

    ctaHeadline:   'Dê o primeiro passo no seu desenvolvimento.',
    ctaSubtext:    'Agende uma conversa. Sem compromisso, sem burocracia — só clareza sobre o que o próximo passo pode ser para você ou para o seu filho.',
    ctaButtonText: 'Agendar conversa',
  },

  // ── Serviços (geram páginas SEO /servico/bairro) ─────────────────
  services: [
    {
      slug:        'avaliacao-neuropsicologica',
      name:        'Avaliação Neuropsicológica',
      tag:         'Crianças · Adolescentes · Adultos',
      description: 'Mapeamento completo das funções cognitivas — memória, atenção, linguagem, funções executivas e aprendizagem — para diagnóstico preciso e direcionamento terapêutico fundamentado.',
      schemaType:  'MedicalProcedure',
      h1Template:  'Avaliação Neuropsicológica {{PREP}} {{BAIRRO}}',
      metaDescTemplate:
        'Avaliação neuropsicológica {{PREP}} {{BAIRRO}} com Marcela Barcellos, psicóloga especialista em Neuropsicologia (Albert Einstein). Para crianças, adolescentes e adultos. Agende.',
    },
    {
      slug:        'terapia-cognitivo-comportamental',
      name:        'Terapia Cognitivo-Comportamental',
      tag:         'TCC · Baseada em Evidências',
      description: 'Terapia estruturada e baseada em evidências científicas, com protocolos validados para ansiedade, dificuldades de aprendizagem, comportamento e desenvolvimento emocional.',
      schemaType:  'PsychologicalTreatment',
      h1Template:  'Terapia Cognitivo-Comportamental (TCC) {{PREP}} {{BAIRRO}}',
      metaDescTemplate:
        'Psicóloga com TCC baseada em evidências {{PREP}} {{BAIRRO}}. Marcela Barcellos, pós-graduada em Neuropsicologia. Atende crianças, adolescentes e adultos. Agende.',
    },
    {
      slug:        'transtornos-de-aprendizagem',
      name:        'Transtornos de Aprendizagem',
      tag:         'Dislexia · TDAH · Neurodivergências',
      description: 'Avaliação e acompanhamento de dislexia, TDAH, discalculia e outras neurodivergências, com visitas escolares e relatório técnico para equipe pedagógica e médicos.',
      schemaType:  'PsychologicalTreatment',
      h1Template:  'Psicóloga para Transtornos de Aprendizagem {{PREP}} {{BAIRRO}}',
      metaDescTemplate:
        'Especialista em transtornos de aprendizagem {{PREP}} {{BAIRRO}}. Avaliação e acompanhamento de TDAH, dislexia e neurodivergências. Marcela Barcellos, Neuropsicologia.',
    },
    {
      slug:        'desenvolvimento-infantil',
      name:        'Desenvolvimento Infantil',
      tag:         'Crianças · Família · Escola',
      description: 'Acompanhamento psicológico integrado ao ambiente escolar, apoiando crianças em diferentes fases do desenvolvimento com olhar clínico, pedagógico e familiar.',
      schemaType:  'PsychologicalTreatment',
      h1Template:  'Psicóloga Infantil {{PREP}} {{BAIRRO}}',
      metaDescTemplate:
        'Psicóloga infantil {{PREP}} {{BAIRRO}} especializada em desenvolvimento infantil e aprendizagem. Marcela Barcellos, Neuropsicologia · Albert Einstein. Agende.',
    },
    {
      slug:        'neurodivergencia',
      name:        'Neurodivergência e TDAH',
      tag:         'TDAH · TEA · TOD',
      description: 'Avaliação neuropsicológica e TCC para crianças, adolescentes e adultos com TDAH, TEA, TOD e outras neurodivergências. Visitas escolares e relatório técnico inclusos.',
      schemaType:  'PsychologicalTreatment',
      h1Template:  'Psicóloga para Neurodivergência e TDAH {{PREP}} {{BAIRRO}}',
      metaDescTemplate:
        'Especialista em neurodivergência e TDAH {{PREP}} {{BAIRRO}}. Avaliação neuropsicológica e TCC com Marcela Barcellos, pós-graduada em Neuropsicologia Albert Einstein.',
    },
  ],

  // ── Bairros para SEO ─────────────────────────────────────────────
  // ⚠️  SUBSTITUIR pelos bairros reais próximos ao consultório
  neighborhoods: [
    { slug: 'BAIRRO_1_SLUG', name: 'BAIRRO 1',  prep: 'no' },
    { slug: 'BAIRRO_2_SLUG', name: 'BAIRRO 2',  prep: 'no' },
    { slug: 'BAIRRO_3_SLUG', name: 'BAIRRO 3',  prep: 'no' },
    { slug: 'BAIRRO_4_SLUG', name: 'BAIRRO 4',  prep: 'no' },
    { slug: 'BAIRRO_5_SLUG', name: 'BAIRRO 5',  prep: 'no' },
    { slug: 'BAIRRO_6_SLUG', name: 'BAIRRO 6',  prep: 'no' },
  ],

  // ── Schema.org ───────────────────────────────────────────────────
  schemaType:    'Psychologist',
  openingHours:  [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
  ],
  priceRange: '$$',
};
