/**
 * marcela-barcellos.ts — Dados da cliente Marcela Barcellos
 *
 * Psicóloga · Especialista em Neuropsicologia (Albert Einstein)
 * Pedagoga · Psicopedagoga · Ex-oficial FAB · Mãe de dois filhos
 *
 * ✅ Todos os dados confirmados e preenchidos (Sessão 11 — 2026-06-25):
 *   CRP 06/212500 · E-mail · Depoimento Joyce Abreu (GBP 5★)
 *   Localização: online + presencial sob agendamento (sem rua fixa)
 *   Bairros SEO: 6 bairros centrais de SJC (área de atuação)
 */

import type { ClientData } from '../lib/types.ts';

export const marcelaBarcellos: ClientData = {
  // ── Identidade ──────────────────────────────────────────────────
  businessName: 'Marcela Barcellos',
  specialty:    'Psicóloga | Neuropsicologia · TCC',
  credential:   'CRP 06/212500 · Pós-graduada em Neuropsicologia · Albert Einstein · São José dos Campos, SP',
  slug:         'marcela-barcellos',
  siteUrl:      'https://marcelabarcellos.jbdigitalsystem.com',
  mood:         'calm-trust',

  // ── Marca visual ─────────────────────────────────────────────────
  logoSrc:    '/marcela-barcellos/logo.png',
  ogImageSrc: '/marcela-barcellos/og-image.jpg',
  gbpUrl:     'https://www.google.com/maps/place/Marcela+Barcellos+Psicologia/data=!4m2!3m1!1s0x0:0x719f9ba8027de60f',
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
  // Atendimento online + presencial sob agendamento — sem rua fixa publicada
  streetAddress: '',
  postalCode:    '',
  district:      '',
  specialtyNoun: 'psicóloga',

  // ── Contato ──────────────────────────────────────────────────────
  city:         'São José dos Campos',
  state:        'SP',
  phone:        '(12) 98147-0915',
  phoneClean:   '12981470915',
  email:        'psi.marcelabarcellos@gmail.com',
  instagram:    '@psi.marcelabarcellos',
  address:      'Atendimento online e presencial · São José dos Campos – SP',
  lat:          '-23.1895062',
  lng:          '-45.8630127',

  // ── Copy ─────────────────────────────────────────────────────────
  copy: {
    homeTitle:
      'Marcela Barcellos — Psicóloga e Neuropsicóloga em São José dos Campos',
    homeMetaDescription:
      'Psicóloga especialista em Neuropsicologia em São José dos Campos. Avaliação neuropsicológica, TCC e suporte a transtornos de aprendizagem para crianças, adolescentes e adultos. Agende com Marcela Barcellos.',
    businessDescription:
      'Psicóloga e neuropsicóloga dedicada ao desenvolvimento humano em todas as fases da vida, com foco em avaliação neuropsicológica e Terapia Cognitivo-Comportamental baseada em evidências.',
    llmsSummary:
      'Marcela Barcellos é psicóloga (CRP 06/212500) especializada em Neuropsicologia (pós-graduação Albert Einstein). Atende crianças, adolescentes e adultos com avaliação neuropsicológica, TCC, transtornos de aprendizagem e neurodivergências. Formação integrada: Pedagogia + Psicopedagogia + 8 anos como oficial da FAB + Psicologia + Neuropsicologia. Também atende públicos específicos: crianças e adolescentes autistas (TEA) e estudantes/candidatos da área médica (Medicina).',

    heroHeadline:   'Cuidar do desenvolvimento humano em todas as fases da vida.',
    heroSubheadline:
      'Avaliação neuropsicológica e Terapia Cognitivo-Comportamental baseadas em evidências científicas — para crianças, adolescentes e adultos.',
    heroPhotoAlt:   'Marcela Barcellos, psicóloga e neuropsicóloga, sorrindo com postura acolhedora',
    heroPhotoSrc:   '/marcela-barcellos/marcela-hero.webp',
    heroEyebrow:    'Neuropsicologia · Psicologia Clínica',

    painPoints: [
      'Meu filho tem dificuldade na escola e ninguém sabe o porquê — laudos inconclusivos, orientações genéricas, e a sensação de que algo mais profundo está sendo ignorado. A avaliação neuropsicológica revela o que está por trás.',
      'Sinto que minha mente não funciona como deveria, mas nunca investiguei — foco instável, memória falhando, aprendizagem mais lenta que o esperado. Sem um mapeamento preciso, qualquer terapia é um chute no escuro.',
      'Quero uma terapia com base científica, não achismos — protocolos validados, diagnóstico fundamentado e plano personalizado, não uma abordagem genérica que serve para qualquer um.',
    ],

    aboutHeadline:   'Ciência, acolhimento e um olhar completo sobre o ser humano.',
    aboutBody:
      'Sou pedagoga de formação, psicopedagoga especialista e passei oito anos como oficial temporária da Força Aérea Brasileira — exercendo liderança, atuando como pedagoga e dirigindo uma escola militar. Esse percurso me deu uma visão rara: entendo a educação por dentro, da sala de aula à gestão. Em 2024 conclui a graduação em Psicologia. Em 2025, a pós-graduação em Neuropsicologia pelo Albert Einstein. Hoje, esses saberes se integram no consultório: avalio com precisão técnica e cuido com empatia real. Mãe de dois filhos, sei o que significa acompanhar o desenvolvimento de perto.',
    pullQuote:
      '"Avaliar para compreender. Compreender para evoluir."',
    aboutCredential:
      'Pedagoga · Psicopedagoga · Psicóloga CRP 06/212500 · Pós-graduada em Neuropsicologia — Albert Einstein (2025) · Ex-Oficial Temporária da FAB',
    aboutPhotoAlt:  'Marcela Barcellos, psicóloga, em pose profissional e acolhedora',
    aboutPhotoSrc:  '/marcela-barcellos/marcela-sobre.webp',

    servicesHeadline: 'Como posso te ajudar',

    processHeadline: 'O caminho do autoconhecimento ao desenvolvimento',
    processSteps: [
      {
        name:        'Conversa inicial',
        description: 'Entendemos juntos o que te trouxe até aqui — queixas, histórico e o que você espera do processo.',
      },
      {
        name:        'Avaliação neuropsicológica',
        description: 'Aplicação de testes validados que mapeiam memória, atenção, linguagem, funções executivas e aprendizagem.',
      },
      {
        name:        'Devolutiva e relatório',
        description: 'Você recebe uma explicação detalhada dos resultados e um relatório técnico completo — útil para escola, médicos e outros profissionais.',
      },
      {
        name:        'Plano terapêutico',
        description: 'Com base no diagnóstico preciso, iniciamos a TCC ou indicamos o melhor caminho para o seu desenvolvimento.',
      },
    ],

    testimonials: [
      {
        quote:  'Profissional comprometida com os pacientes, altamente capacitada, além de oferecer um atendimento personalizado, humanizado. Meu filho é paciente e simplesmente ama a Marcela por todo cuidado que ela proporciona.',
        author: 'Joyce Abreu · mãe de paciente',
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
          'Atendo crianças a partir dos 3 anos, adolescentes e adultos. Cada faixa etária tem protocolos específicos adaptados ao nível de desenvolvimento.',
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
        question: 'Você atende crianças e adolescentes autistas ou estudantes de Medicina?',
        answer:
          'Sim. Realizo avaliação neuropsicológica e acompanhamento para crianças e adolescentes autistas — com orientação familiar e relatório técnico para a escola e equipe multiprofissional. Também atendo estudantes e candidatos da área médica, trabalhando ansiedade, foco e organização dos estudos sob alta pressão.',
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
    heroCtaText:   'Agendar sessão',
    navCtaText:    'Agendar conversa',
    bairroCtaText: 'Agendar conversa',
    bairroNextSteps:
      'ligue ou envie uma mensagem para agendar sua primeira conversa. 50 minutos, sem compromisso de continuidade se não fizer sentido.',
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
    {
      slug:        'criancas-adolescentes-autistas',
      name:        'Crianças e Adolescentes Autistas',
      tag:         'TEA · Autismo · Neurodivergência',
      description: 'Avaliação neuropsicológica e acompanhamento psicológico para crianças e adolescentes autistas. Identificamos o perfil cognitivo e de desenvolvimento de cada pessoa, orientamos famílias e elaboramos relatórios técnicos para suporte escolar e multiprofissional.',
      schemaType:  'PsychologicalTreatment',
      h1Template:  'Psicóloga para Crianças e Adolescentes Autistas {{PREP}} {{BAIRRO}}',
      metaDescTemplate:
        'Psicóloga para crianças e adolescentes autistas {{PREP}} {{BAIRRO}}. Avaliação neuropsicológica TEA, orientação familiar e relatório técnico. Marcela Barcellos, Neuropsicologia · Albert Einstein. Agende.',
    },
    {
      slug:        'estudantes-medicina',
      name:        'Estudantes e Candidatos de Medicina',
      tag:         'Vestibular · Residência · Alta Performance',
      description: 'Apoio psicológico para estudantes e candidatos da área médica — do vestibular à residência. Trabalho ansiedade, foco, organização dos estudos e regulação emocional sob alta pressão, com TCC e estratégias baseadas em evidências.',
      schemaType:  'PsychologicalTreatment',
      h1Template:  'Psicóloga para Estudantes de Medicina {{PREP}} {{BAIRRO}}',
      metaDescTemplate:
        'Psicóloga para estudantes e candidatos de Medicina {{PREP}} {{BAIRRO}}. Ansiedade, foco e performance nos estudos com TCC. Marcela Barcellos, Neuropsicologia · Albert Einstein. Agende.',
    },
  ],

  // ── Bairros para SEO (área de atuação SJC) ───────────────────────
  neighborhoods: [
    { slug: 'centro',           name: 'Centro',           prep: 'no'  },
    { slug: 'jardim-aquarius',  name: 'Jardim Aquarius',  prep: 'no'  },
    { slug: 'jardim-satelite',  name: 'Jardim Satélite',  prep: 'no'  },
    { slug: 'vila-adyana',      name: 'Vila Adyana',      prep: 'na'  },
    { slug: 'jardim-esplanada', name: 'Jardim Esplanada', prep: 'no'  },
    { slug: 'eugenio-de-melo',  name: 'Eugênio de Melo',  prep: 'em'  },
  ],

  // ── Schema.org ───────────────────────────────────────────────────
  schemaType:    'Psychologist',
  openingHours:  [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
  ],
  priceRange: '$$',
};
