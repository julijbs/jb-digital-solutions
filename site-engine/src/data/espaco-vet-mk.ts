/**
 * espaco-vet-mk.ts — Dados do cliente Espaço Vet MK (spec-site / prévia)
 *
 * Gerado pela estratégia Spec-Site-Primeiro (lead nota 8: 825 avaliações, PSI 38/100).
 * Conteúdo extraído do site atual (espacovetmk.com.br) + Google.
 * NÃO é hospital 24h — clínica + estética + venda de filhotes + petshop.
 * ⚠️ HORÁRIO ESTIMADO (o site não publica horários): confirmar com o cliente antes do envio.
 * Sem depoimentos publicados no site — deixados vazios (não fabricados).
 */
import type { ClientData } from '../lib/types.ts';

export const espacoVetMk: ClientData = {
  // ── Identidade ──────────────────────────────────────────────────
  businessName: 'Espaço Vet MK',
  specialty: 'Clínica Veterinária, Estética e Petshop',
  credential: 'Clínica veterinária, estética animal e venda de filhotes · Há mais de 10 anos · Mercês, Curitiba',
  slug: 'espaco-vet-mk',
  siteUrl: 'https://espaco-vet-mk.jbdigitalsystem.com',
  mood: 'fresh-clinical',

  // ── Endereço ─────────────────────────────────────────────────────
  streetAddress: 'Rua Padre Anchieta, 1276',
  postalCode: '80410-020',
  district: 'Mercês',
  specialtyNoun: 'veterinário',

  // ── Contato ──────────────────────────────────────────────────────
  city: 'Curitiba',
  state: 'PR',
  phone: '(41) 99525-9266',
  phoneClean: '41995259266',
  email: 'contato@espacovetmk.com.br',
  instagram: '@espacovetmk_',
  address: 'Rua Padre Anchieta, 1276 — Mercês, Curitiba-PR',
  lat: '-25.4300',
  lng: '-49.2920',

  // ── Copy ─────────────────────────────────────────────────────────
  copy: {
    homeTitle: 'Clínica Veterinária, Estética e Petshop nas Mercês, Curitiba — Espaço Vet MK',
    homeMetaDescription:
      'Clínica veterinária, estética animal e venda de filhotes nas Mercês, Curitiba. Há mais de 10 anos, com mais de 30 mil clientes atendidos. Consultas, vacinas, cirurgias, banho e tosa e petshop.',
    businessDescription:
      'Clínica veterinária, estética animal e petshop nas Mercês, Curitiba. Consultório veterinário (exames de rotina, vacinação, tratamentos e cirurgias), estética (banho, tosa e cuidados de pele e unhas), venda de filhotes com acompanhamento veterinário, microchipagem e petshop. Há mais de 10 anos cuidando de quem é da família, com mais de 30 mil clientes atendidos.',
    llmsSummary:
      'Espaço Vet MK é uma clínica veterinária, estética animal e petshop nas Mercês, Curitiba, em atuação desde 2012. Oferece consultório veterinário (exames, vacinação, tratamentos e cirurgias), estética (banho, tosa, cuidados de pele e unhas), venda de filhotes com acompanhamento veterinário e entrega, microchipagem e petshop. Soma mais de 30 mil clientes atendidos e mais de 10 mil filhotes vendidos.',

    heroHeadline: 'O cuidado completo do seu pet — da saúde ao carinho do dia a dia.',
    heroSubheadline:
      'Clínica veterinária, estética e petshop nas Mercês, Curitiba. Há mais de 10 anos e com mais de 30 mil clientes: consultas, vacinas, cirurgias, banho e tosa, e filhotes com acompanhamento veterinário.',
    heroPhotoAlt: 'Equipe do Espaço Vet MK em atendimento veterinário em Curitiba',
    heroEyebrow: 'Clínica Veterinária e Estética',

    painPoints: [
      'Um lugar pra cada coisa — Consulta no veterinário, banho no petshop, ração em outra loja. Cuidar do pet vira uma maratona pela cidade.',
      'Filhote sem acompanhamento — Muita gente leva um filhote pra casa sem qualquer suporte veterinário — e as dúvidas aparecem logo na primeira semana.',
      'Confiança leva tempo — Achar um veterinário que você confia de verdade, que conhece o seu pet e está por perto, não é fácil.',
    ],

    aboutHeadline: 'Há mais de 10 anos, o cuidado completo do seu pet nas Mercês.',
    aboutBody:
      'Desde 2012, o Espaço Vet MK cuida dos pets de Curitiba reunindo, num só lugar, tudo o que eles precisam. Somos clínica veterinária — com consultas, exames de rotina, vacinação, tratamentos e cirurgias —, estética animal — banho, tosa e cuidados de pele e unhas — e petshop. Também trabalhamos com a venda de filhotes de diversas raças, sempre com acompanhamento veterinário completo, entrega segura e suporte pós-venda, para que o começo dessa história seja tranquilo. Em mais de dez anos, já atendemos mais de 30 mil clientes e ajudamos mais de 10 mil filhotes a encontrarem seus lares. Tudo isso num ambiente confiável e amoroso, com uma equipe que conhece o seu pet pelo nome.',
    pullQuote:
      'Mais de 30 mil clientes em mais de 10 anos — um ambiente confiável e amoroso para quem é da família.',
    aboutCredential:
      'Clínica veterinária, estética e petshop · Há mais de 10 anos · +30 mil clientes atendidos · Mercês, Curitiba',
    aboutPhotoAlt: 'Estrutura do Espaço Vet MK, clínica veterinária e estética em Curitiba',

    servicesHeadline: 'Tudo que o seu pet precisa, no mesmo lugar.',
    processHeadline: 'Como funciona o atendimento.',
    processSteps: [
      {
        name: 'Consulta e prevenção',
        description:
          'Consultas, exames de rotina, vacinação e vermifugação com uma equipe que acompanha a saúde do seu pet de perto — prevenir para evitar problemas maiores lá na frente.',
      },
      {
        name: 'Tratamento e cirurgia',
        description:
          'Tratamentos e cirurgias realizados na própria clínica, com acompanhamento cuidadoso em cada etapa e comunicação clara com você.',
      },
      {
        name: 'Estética e dia a dia',
        description:
          'Banho, tosa e cuidados de pele e unhas, além de petshop para o dia a dia — o cuidado contínuo do seu pet resolvido no mesmo lugar de confiança.',
      },
    ],
    testimonials: [],
    faqHeadline: 'Perguntas que todo tutor faz.',
    faqs: [
      {
        question: 'O que o Espaço Vet MK oferece?',
        answer:
          'Somos clínica veterinária (consultas, exames, vacinação, tratamentos e cirurgias), estética animal (banho, tosa e cuidados de pele e unhas), petshop e também trabalhamos com a venda de filhotes com acompanhamento veterinário.',
      },
      {
        question: 'Como funciona a venda de filhotes?',
        answer:
          'Trabalhamos com filhotes de diversas raças, sempre com acompanhamento veterinário completo, entrega segura e suporte pós-venda — para que o começo dessa história seja tranquilo e saudável.',
      },
      {
        question: 'Há quanto tempo vocês existem?',
        answer:
          'Atuamos desde 2012, há mais de 10 anos, com mais de 30 mil clientes atendidos e mais de 10 mil filhotes que já encontraram seus lares.',
      },
      {
        question: 'Qual o endereço da clínica?',
        answer:
          'Rua Padre Anchieta, 1276 — Mercês, Curitiba-PR. Fale com a gente pelo WhatsApp para confirmar horários e agendar.',
      },
      {
        question: 'Vocês fazem cirurgias e microchipagem?',
        answer:
          'Sim. Realizamos cirurgias na própria clínica e também fazemos microchipagem, além de vacinação e vermifugação.',
      },
    ],
    ctaHeadline: 'Cuide do seu pet num lugar de confiança.',
    ctaSubtext:
      'Consulta, banho, vacina ou um novo filhote com acompanhamento — fale com a gente para agendar ou tirar suas dúvidas.',
    ctaButtonText: 'Falar agora',
    heroCtaText: 'Falar agora',
    heroCtaSecondaryText: 'Ver serviços',
    navCtaText: 'Falar no WhatsApp',
    bairroCtaText: 'Falar agora',
    bairroIntroLead: 'Se você procura uma clínica veterinária',
    bairroLocationLine:
      'o Espaço Vet MK fica a poucos minutos — na Rua Padre Anchieta, 1276, Mercês. Clínica, estética e petshop, há mais de 10 anos cuidando dos pets da região.',
    bairroNextSteps:
      'ligue ou chame no WhatsApp para agendar e confirmar horários. Uma equipe que conhece o seu pet pelo nome.',
  },

  // ── Serviços (SEO programático) ───────────────────────────────────
  services: [
    {
      slug: 'clinica-consultas',
      name: 'Consultas e Vacinação',
      tag: 'Saúde em dia',
      description:
        'Consultas, exames de rotina, vacinação e vermifugação com uma equipe que acompanha a saúde do seu pet de perto. Prevenir é o melhor caminho para evitar problemas maiores.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Clínica veterinária {{PREP}} {{BAIRRO}} — Espaço Vet MK',
      metaDescTemplate:
        'Clínica veterinária {{PREP}} {{BAIRRO}}, Curitiba. Consultas, vacinação e vermifugação. Espaço Vet MK, Mercês.',
      icon: 'heart',
    },
    {
      slug: 'cirurgia',
      name: 'Cirurgias e Tratamentos',
      tag: 'Na própria clínica',
      description:
        'Tratamentos e cirurgias realizados na própria clínica, com acompanhamento cuidadoso em cada etapa e comunicação clara com o tutor.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Cirurgia veterinária {{PREP}} {{BAIRRO}} — Espaço Vet MK',
      metaDescTemplate:
        'Cirurgia e tratamentos veterinários {{PREP}} {{BAIRRO}}, Curitiba, na própria clínica. Espaço Vet MK, Mercês.',
      icon: 'dna',
    },
    {
      slug: 'estetica-banho-tosa',
      name: 'Estética, Banho e Tosa',
      tag: 'Cuidado do dia a dia',
      description:
        'Banho, tosa e cuidados de pele e unhas para o bem-estar e a beleza do seu pet, com produtos adequados e uma equipe carinhosa.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Banho e tosa {{PREP}} {{BAIRRO}} — Espaço Vet MK',
      metaDescTemplate:
        'Banho, tosa e estética animal {{PREP}} {{BAIRRO}}, Curitiba. Espaço Vet MK, Mercês.',
      icon: 'apple',
    },
    {
      slug: 'venda-de-filhotes',
      name: 'Filhotes com Acompanhamento',
      tag: 'Começo tranquilo',
      description:
        'Filhotes de diversas raças com acompanhamento veterinário completo, entrega segura e suporte pós-venda — para que o começo dessa história seja saudável e tranquilo.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Filhotes com acompanhamento veterinário {{PREP}} {{BAIRRO}} — Espaço Vet MK',
      metaDescTemplate:
        'Filhotes com acompanhamento veterinário {{PREP}} {{BAIRRO}}, Curitiba, com entrega segura e suporte. Espaço Vet MK.',
      icon: 'heart',
    },
    {
      slug: 'microchip-petshop',
      name: 'Microchipagem e Petshop',
      tag: 'Segurança e comodidade',
      description:
        'Microchipagem para a segurança do seu pet e petshop com o que ele precisa no dia a dia — tudo no mesmo lugar de confiança.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Microchipagem e petshop {{PREP}} {{BAIRRO}} — Espaço Vet MK',
      metaDescTemplate:
        'Microchipagem e petshop {{PREP}} {{BAIRRO}}, Curitiba. Espaço Vet MK, Mercês.',
      icon: 'chart',
    },
  ],

  // ── Bairros (SEO programático) ────────────────────────────────────
  neighborhoods: [
    { slug: 'merces',       name: 'Mercês',       prep: 'nas' },
    { slug: 'bigorrilho',   name: 'Bigorrilho',   prep: 'no' },
    { slug: 'sao-francisco', name: 'São Francisco', prep: 'no' },
    { slug: 'centro',       name: 'Centro',       prep: 'no' },
    { slug: 'vista-alegre', name: 'Vista Alegre', prep: 'na' },
    { slug: 'bom-retiro',   name: 'Bom Retiro',   prep: 'no' },
    { slug: 'cascatinha',   name: 'Cascatinha',   prep: 'na' },
    { slug: 'ahu',          name: 'Ahú',          prep: 'no' },
  ],

  // ── Schema.org ────────────────────────────────────────────────────
  schemaType: 'VeterinaryCare',
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '18:00' },
  ],
  priceRange: '$$',
};
