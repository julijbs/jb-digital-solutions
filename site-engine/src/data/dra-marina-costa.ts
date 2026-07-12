/**
 * dra-marina-costa.ts — Dados do cliente Dra. Marina Costa (demo Fresh Clinical)
 *
 * Nutricionista clínica e esportiva · mood: fresh-clinical
 * Padrão JB Digital System: um arquivo por cliente.
 */
import type { ClientData } from '../lib/types.ts';

export const draMarinaCosta: ClientData = {
  // ── Identidade ──────────────────────────────────────────────────
  businessName: 'Dra. Marina Costa',
  specialty: 'Nutricionista | Nutrição Clínica e Esportiva',
  credential: 'CRN 3/45678 · Especialista em Nutrição Funcional · Pinheiros, São Paulo',
  slug: 'dra-marina-costa',
  siteUrl: 'https://marinacosta.jbdigitalsystem.com',
  mood: 'fresh-clinical',

  // ── Marca visual ─────────────────────────────────────────────────
  brand: {
    primary:       '#2D6A4F',
    primaryDark:   '#1B4332',
    primaryLight:  '#3ea06a',
    accent:        '#52B788',
    accentDark:    '#3ea06a',
    accentLight:   '#81c9a4',
    surface:       '#F7F9F7',
    surfaceMuted:  '#EAF2EE',
    surfaceDark:   '#C8DDD1',
    surfaceAlt:    '#EAF2EE',
    ink:           '#1A2318',
    inkMuted:      '#4A6358',
    inkFaint:      '#7a9d8f',
    border:        '#C8DDD1',
    breakBg:       '#1B4332',
    white:         '#FFFFFF',
    fontDisplayFamily: "'DM Serif Display', Georgia, serif",
    fontBodyFamily:    "'DM Sans', system-ui, sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap',
  },

  // ── Endereço ─────────────────────────────────────────────────────
  streetAddress: 'Rua dos Pinheiros, 820',
  postalCode: '05422-001',
  district: 'Pinheiros',
  specialtyNoun: 'nutricionista',

  // ── Contato ──────────────────────────────────────────────────────
  city: 'São Paulo',
  state: 'SP',
  phone: '(11) 93456-7890',
  phoneClean: '11934567890',
  email: 'contato@drmarinacosta.com.br',
  instagram: '@dramarinacosta.nutri',
  address: 'Rua dos Pinheiros, 820 — Pinheiros, São Paulo-SP',
  lat: '-23.5636',
  lng: '-46.6818',

  // ── Copy ─────────────────────────────────────────────────────────
  copy: {
    homeTitle: 'Nutricionista em São Paulo — Dra. Marina Costa | Nutrição Clínica e Esportiva',
    homeMetaDescription:
      'Nutricionista clínica e esportiva em Pinheiros, São Paulo. Especialista em emagrecimento saudável, nutrição funcional e reeducação alimentar. Atendimento presencial e online. CRN 3/45678.',
    businessDescription:
      'Nutricionista especialista em nutrição clínica e esportiva. Atende emagrecimento saudável, performance atlética e reeducação alimentar. Consultório em Pinheiros, São Paulo, e atendimento online para todo o Brasil.',
    llmsSummary:
      'Dra. Marina Costa é nutricionista clínica e esportiva com 7 anos de experiência, especialista em emagrecimento saudável, nutrição funcional e performance atlética. Atende presencialmente em Pinheiros, São Paulo, e oferece consultas online para todo o Brasil.',

    heroHeadline: 'Comer bem não é sobre restrição — é sobre encontrar o que funciona para o seu corpo.',
    heroSubheadline:
      'Nutricionista especialista em nutrição clínica e esportiva. Consultório em Pinheiros, São Paulo, e atendimento online para todo o Brasil.',
    heroPhotoAlt: 'Dra. Marina Costa, nutricionista em São Paulo',

    // Formato para Fresh Clinical (PainPointsSymptomCards): "Título — corpo do card"
    painPoints: [
      'Energia em colapso — Você acorda cansada mesmo depois de dormir, sente aquela fadiga que não passa e não consegue atravessar o dia sem colapsar às 15h.',
      'Ciclo sem fim — Você já tentou várias dietas, perdeu e recuperou peso mais de uma vez, e está exausta de começar do zero sem entender o que está errado.',
      'Corpo que não responde — Você malha, se esforça e segue o que dizem nas redes sociais, mas os resultados não vêm — e ninguém te explica por quê.',
    ],

    aboutHeadline: 'Uma nutricionista que olha para o todo, não só para o prato.',
    aboutBody:
      'Me formei em Nutrição pela USP e me especializei em Nutrição Funcional e Esportiva porque acredito que o corpo humano é um sistema integrado — o que você come afeta diretamente sua energia, humor, sono e performance. Ao longo de 7 anos de clínica, trabalhei com mulheres que vinham com fadiga crônica, dificuldade para emagrecer e uma relação desgastada com a comida — e que encontraram, com acompanhamento individualizado, um caminho que faz sentido para a realidade delas. Não trabalho com fórmulas prontas. Trabalho com pessoas. Cada plano é construído do zero, levando em conta sua rotina, seu histórico e o que você quer conquistar — não o que uma calculadora de calorias manda.',
    pullQuote:
      'Não existe dieta certa. Existe o plano que funciona para você, agora, na sua vida real.',
    aboutCredential:
      'CRN 3/45678 · Especialista em Nutrição Funcional (GANEP) · Pós-graduada em Nutrição Esportiva (Faculdade Einstein) · 7 anos de experiência',
    aboutPhotoAlt: 'Dra. Marina Costa em seu consultório em Pinheiros, São Paulo',

    servicesHeadline: 'Como posso ajudar você.',
    processHeadline: 'Como é a nossa primeira consulta.',
    processSteps: [
      {
        name: 'Anamnese completa',
        description:
          'Primeira consulta de 60 minutos: histórico alimentar, exames, rotina, objetivos e relação com a comida. Você sai com uma direção clara — sem diagnóstico genérico.',
      },
      {
        name: 'Plano personalizado',
        description:
          'Com base na anamnese, monto um plano alimentar que cabe na sua rotina real. Não tem cardápio milagroso — tem estratégia desenhada para você.',
      },
      {
        name: 'Acompanhamento contínuo',
        description:
          'Consultas de retorno quinzenais ou mensais para ajustar o plano conforme seu corpo responde. O processo é vivo — evolui com você.',
      },
    ],
    testimonials: [
      {
        quote:
          'Tentei emagrecer com outras nutricionistas e sempre voltava ao peso. Com a Marina foi diferente: ela entendeu minha rotina, não me deu uma dieta impossível e em 5 meses perdi 12kg sem contar calorias obsessivamente.',
        author: 'Fernanda L. · Designer · Paciente desde 2023',
      },
      {
        quote:
          'Treino há 4 anos e nunca tinha tido evolução real até ajustar minha alimentação com a Marina. Ela entende de performance de verdade — não é só "coma mais proteína".',
        author: 'Carlos M. · Corredor amador · São Paulo',
      },
    ],
    faqHeadline: 'O que você talvez queira saber antes de agendar.',
    faqs: [
      {
        question: 'Quanto custa uma consulta de nutrição em São Paulo?',
        answer:
          'O valor das consultas é informado no contato inicial. Ofereço primeira consulta e retornos com preço diferenciado. Alguns planos de saúde reembolsam consultas nutricionais — verifique com o seu plano.',
      },
      {
        question: 'Consulta de nutrição online funciona tão bem quanto presencial?',
        answer:
          'Sim. A maioria das ferramentas que uso na consulta — questionários, análise de exames, montagem do plano alimentar — funciona perfeitamente por videochamada. Muitas pacientes preferem o formato online pela flexibilidade.',
      },
      {
        question: 'Em quanto tempo vejo resultados com acompanhamento nutricional?',
        answer:
          'Depende do objetivo. Para emagrecimento sustentável, as primeiras mudanças costumam aparecer em 4 a 6 semanas — melhora de energia, menos inchaço, sono mais regulado. A perda de peso consistente costuma se consolidar a partir do segundo mês.',
      },
      {
        question: 'Preciso de exames para começar as consultas?',
        answer:
          'Não é obrigatório, mas exames recentes (hemograma, glicemia, TSH, ferro) enriquecem muito a primeira consulta. Se você não tiver exames, podemos começar e solicitar no decorrer do acompanhamento.',
      },
      {
        question: 'Nutricionista pode tratar intolerância à lactose e glúten?',
        answer:
          'Sim. A conduta nutricional para intolerâncias alimentares é parte da nutrição clínica. Trabalho com protocolos de exclusão e reintrodução para identificar gatilhos alimentares e montar um plano que elimine os sintomas sem comprometer a variedade da dieta.',
      },
    ],
    ctaHeadline: 'Pronta para parar de tentar e começar a ter resultado?',
    ctaSubtext:
      'Agende uma primeira consulta de 60 minutos. Vamos entender o que está acontecendo com o seu corpo e traçar um caminho que faz sentido para a sua rotina.',
    ctaButtonText: 'Agendar primeira consulta',
    heroEyebrow: 'Nutricionista',
    heroCtaText: 'Agendar consulta',
    heroCtaSecondaryText: 'Ver como funciona',
    navCtaText: 'Agendar conversa',
    bairroCtaText: 'Agendar conversa',
    bairroNextSteps:
      'ligue ou envie uma mensagem para agendar sua primeira conversa. 50 minutos, sem compromisso de continuidade se não fizer sentido.',
  },

  // ── Serviços (SEO programático) ───────────────────────────────────
  services: [
    {
      slug: 'emagrecimento',
      name: 'Emagrecimento Saudável',
      tag: 'Presencial · Online',
      description:
        'Estratégia individualizada para perda de peso sustentável — sem dietas restritivas, sem contar calorias obsessivamente. Foco em hábitos que cabem na sua rotina e resultados que não voltam.',
      schemaType: 'ProfessionalService',
      icon: 'chart',
      h1Template: 'Nutricionista para emagrecimento {{PREP}} {{BAIRRO}} — Dra. Marina Costa',
      metaDescTemplate:
        'Nutricionista especialista em emagrecimento saudável {{PREP}} {{BAIRRO}}, São Paulo. Plano individualizado, sem dietas restritivas. Presencial e online. CRN 3/45678.',
    },
    {
      slug: 'nutricao-esportiva',
      name: 'Nutrição Esportiva',
      tag: 'Presencial · Online',
      description:
        'Otimização alimentar para corredores, ciclistas, atletas amadores e praticantes de musculação. Aumenta performance, acelera recuperação e previne lesões por déficit nutricional.',
      schemaType: 'ProfessionalService',
      icon: 'heart',
      h1Template: 'Nutricionista esportiva {{PREP}} {{BAIRRO}} — Dra. Marina Costa',
      metaDescTemplate:
        'Nutrição esportiva {{PREP}} {{BAIRRO}}, São Paulo. Plano alimentar para performance, recuperação e composição corporal. Presencial e online. CRN 3/45678.',
    },
    {
      slug: 'reeducacao-alimentar',
      name: 'Reeducação Alimentar',
      tag: 'Especialidade',
      description:
        'Para quem quer transformar a relação com a comida de forma definitiva: identificamos padrões alimentares problemáticos, trabalhamos a mentalidade e construímos hábitos que durem.',
      schemaType: 'ProfessionalService',
      icon: 'leaf',
      h1Template: 'Nutricionista para reeducação alimentar {{PREP}} {{BAIRRO}} — Dra. Marina Costa',
      metaDescTemplate:
        'Reeducação alimentar com nutricionista {{PREP}} {{BAIRRO}}, São Paulo. Transforme sua relação com a comida com acompanhamento individualizado. CRN 3/45678.',
    },
  ],

  // ── Bairros (SEO programático) ────────────────────────────────────
  neighborhoods: [
    { slug: 'pinheiros',     name: 'Pinheiros',     prep: 'em'   },
    { slug: 'vila-madalena', name: 'Vila Madalena',  prep: 'na'   },
    { slug: 'jardins',       name: 'Jardins',        prep: 'nos'  },
    { slug: 'itaim-bibi',   name: 'Itaim Bibi',     prep: 'no'   },
    { slug: 'moema',         name: 'Moema',          prep: 'em'   },
    { slug: 'brooklin',      name: 'Brooklin',       prep: 'no'   },
  ],

  // ── Schema.org ────────────────────────────────────────────────────
  schemaType: 'ProfessionalService',
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
    { days: ['Saturday'], opens: '09:00', closes: '13:00' },
  ],
  priceRange: '$$',
};
