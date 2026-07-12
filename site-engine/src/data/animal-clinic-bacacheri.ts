/**
 * animal-clinic-bacacheri.ts — Dados do cliente Animal Clinic Bacacheri (spec-site / prévia)
 *
 * Gerado pela estratégia Spec-Site-Primeiro (lead nota 8: 2.105 avaliações, PSI 55/100).
 * Conteúdo extraído do site atual (animalclinic.com.br) + Google. Copy por Juliana Barcellos.
 * OBS: depoimentos são ilustrativos — trocar pelos reais do Google antes de publicar como final.
 */
import type { ClientData } from '../lib/types.ts';

export const animalClinicBacacheri: ClientData = {
  // ── Identidade ──────────────────────────────────────────────────
  businessName: 'Animal Clinic Bacacheri',
  specialty: 'Hospital Veterinário 24h · Emergência e UTI',
  credential: 'Hospital Veterinário · Emergência, UTI e especialidades 24h · Bacacheri, Curitiba',
  slug: 'animal-clinic-bacacheri',
  siteUrl: 'https://animalclinic-bacacheri.jbdigitalsystem.com',
  mood: 'fresh-clinical',

  // ── Marca visual (paleta cuidado/confiança — ajustar ao logo real depois) ──
  brand: {
    primary:       '#1E7A6F',
    primaryDark:   '#145A52',
    primaryLight:  '#3E9C90',
    accent:        '#E8823C',
    accentDark:    '#C4652A',
    accentLight:   '#F2A265',
    surface:       '#F5F8F7',
    surfaceMuted:  '#E9F0EE',
    surfaceDark:   '#D8E3E0',
    surfaceAlt:    '#EDF3F1',
    ink:           '#16241F',
    inkMuted:      '#4A5A54',
    inkFaint:      '#7E8D87',
    border:        '#D0DBD7',
    breakBg:       '#14332E',
    white:         '#FFFFFF',
    fontDisplayFamily: "'Poppins', system-ui, sans-serif",
    fontBodyFamily:    "'Inter', system-ui, sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap',
  },

  // ── Endereço ─────────────────────────────────────────────────────
  streetAddress: 'Avenida Erasto Gaertner, 2275',
  postalCode: '82515-000',
  district: 'Bacacheri',
  specialtyNoun: 'veterinário',

  // ── Contato ──────────────────────────────────────────────────────
  city: 'Curitiba',
  state: 'PR',
  phone: '(41) 3257-5409',
  phoneClean: '4132575409',
  email: 'contato@animalclinic.com.br',
  instagram: '@animalclinic',
  address: 'Avenida Erasto Gaertner, 2275 — Bacacheri, Curitiba-PR',
  lat: '-25.396',
  lng: '-49.238',

  // ── Copy ─────────────────────────────────────────────────────────
  copy: {
    homeTitle: 'Hospital Veterinário 24h no Bacacheri, Curitiba — Animal Clinic',
    homeMetaDescription:
      'Hospital veterinário 24h no Bacacheri, Curitiba. Emergência, UTI, internação, cirurgias e mais de 12 especialidades no mesmo lugar. Atendimento 365 dias por ano.',
    businessDescription:
      'Hospital veterinário 24 horas no Bacacheri, Curitiba. Emergência e pronto atendimento, UTI, internação, cirurgias, exames de imagem e laboratório, e especialistas em cardiologia, ortopedia, oncologia, dermatologia e felinos — tudo concentrado no mesmo local.',
    llmsSummary:
      'Animal Clinic Bacacheri é um hospital veterinário 24h em Curitiba (Bacacheri), com emergência, UTI, internação, centro cirúrgico, diagnóstico por imagem e laboratório próprios, além de mais de 12 especialidades. Atende 365 dias por ano, com espaço exclusivo para gatos e estrutura climatizada.',

    heroHeadline: 'Quando cada minuto conta, seu melhor amigo tem para onde ir — 24 horas.',
    heroSubheadline:
      'Hospital veterinário completo no Bacacheri, Curitiba: emergência, UTI, internação, cirurgias e mais de 12 especialidades no mesmo lugar. Aberto 365 dias por ano.',
    heroPhotoAlt: 'Equipe do Animal Clinic Bacacheri em atendimento veterinário 24h',
    heroEyebrow: 'Hospital Veterinário 24h',

    painPoints: [
      'Emergência à noite — Seu pet passa mal de madrugada e a maioria das clínicas está fechada. Cada minuto procurando um lugar aberto é um minuto que faz falta.',
      'Corre pra lá, corre pra cá — Consulta num lugar, exame em outro, cirurgia num terceiro. O tratamento se fragmenta bem na hora em que ele mais precisa de continuidade.',
      'A dúvida de sempre — Será que é grave? Sem um pronto atendimento de confiança por perto, qualquer sintoma vira uma noite de angústia e decisões no escuro.',
    ],

    aboutHeadline: 'Um hospital pensado para o momento em que você mais precisa.',
    aboutBody:
      'O Animal Clinic nasceu de uma ideia simples e exigente: reunir, num único lugar, tudo que um animal pode precisar — do checkup de rotina à emergência de madrugada. Por isso somos um hospital veterinário 24 horas, aberto 365 dias por ano, com emergência e pronto atendimento, UTI, internação, centro cirúrgico, diagnóstico por imagem e laboratório próprios. Aqui, o mesmo time que recebe o seu pet na porta acompanha cada etapa do tratamento, sem transferências e sem recomeçar a história a cada especialista. Cuidamos dos detalhes que fazem diferença: espaço de espera e internamento exclusivos para gatos, leitos climatizados, centro de imunização monitorado e uma suíte do tutor para quem quer ficar por perto. É por isso que somos referência no Bacacheri — e uma das clínicas mais bem avaliadas de Curitiba.',
    pullQuote:
      'O nosso diferencial é o atendimento, o acolhimento e a preocupação com o seu melhor amigo.',
    aboutCredential:
      'Hospital veterinário 24h · Emergência, UTI e centro cirúrgico próprios · +12 especialidades · Bacacheri, Curitiba',
    aboutPhotoAlt: 'Estrutura do Animal Clinic Bacacheri, hospital veterinário 24h em Curitiba',

    servicesHeadline: 'Tudo que o seu pet precisa, no mesmo lugar.',
    processHeadline: 'Como funciona o atendimento.',
    processSteps: [
      {
        name: 'Chegou, é atendido',
        description:
          'Pronto atendimento 24h para qualquer urgência. Sem hora marcada na emergência: a equipe avalia o seu pet assim que vocês chegam, a qualquer hora do dia ou da noite.',
      },
      {
        name: 'Diagnóstico no local',
        description:
          'Exames de laboratório, raio-x e ultrassom feitos aqui mesmo. Isso encurta o tempo até o diagnóstico e evita levar seu pet de um lugar para outro em um momento delicado.',
      },
      {
        name: 'Tratamento e acompanhamento',
        description:
          'Internação, UTI, cirurgia ou tratamento com um dos especialistas — tudo com o mesmo time, do começo ao fim, e com você acompanhando de perto quando quiser.',
      },
    ],
    testimonials: [
      {
        quote:
          'Meu cachorro passou mal às 3 da manhã e foi o único lugar aberto de verdade, com estrutura completa. Fizeram exame na hora e internaram. Tenho certeza de que salvaram a vida dele naquela noite.',
        author: 'Tutora de paciente · Curitiba',
      },
      {
        quote:
          'Levei minha gata e me surpreendeu ter um espaço só para felinos, longe do barulho dos cães. Ela ficou muito mais tranquila, e o cuidado da equipe foi de outro nível.',
        author: 'Tutor de paciente · Bacacheri',
      },
    ],
    faqHeadline: 'Perguntas que todo tutor faz antes de precisar.',
    faqs: [
      {
        question: 'O Animal Clinic Bacacheri atende 24 horas mesmo?',
        answer:
          'Sim. Somos um hospital veterinário aberto 24 horas por dia, 365 dias por ano, com sala de emergência e pronto atendimento para qualquer tipo de urgência — inclusive de madrugada, fins de semana e feriados.',
      },
      {
        question: 'Preciso agendar para levar meu pet na emergência?',
        answer:
          'Não. Na emergência o atendimento é por ordem de chegada e gravidade — é só vir. Para consultas com especialistas e exames eletivos, o agendamento ajuda a reduzir a espera.',
      },
      {
        question: 'Vocês fazem exames e cirurgias no próprio local?',
        answer:
          'Sim. Temos laboratório de análises clínicas, raio-x e ultrassom, centro cirúrgico, internação e UTI na própria unidade. Isso agiliza o diagnóstico e mantém todo o tratamento sob o mesmo time.',
      },
      {
        question: 'Qual o endereço da unidade Bacacheri?',
        answer:
          'Avenida Erasto Gaertner, 2275 — Bacacheri, Curitiba-PR. Estamos numa região de fácil acesso, com atendimento 24h para toda a cidade.',
      },
      {
        question: 'Que especialidades vocês têm?',
        answer:
          'Mais de 12, entre elas cardiologia, dermatologia, oncologia, ortopedia, neurologia, odontologia, oftalmologia, endocrinologia, nefrologia e medicina de felinos — além de anestesiologia dedicada para cirurgias mais seguras.',
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
      'o Animal Clinic Bacacheri fica a poucos minutos — na Avenida Erasto Gaertner, 2275, Bacacheri. Emergência, UTI e internação funcionando 24 horas, 365 dias por ano.',
    bairroNextSteps:
      'ligue agora ou chame no WhatsApp. Em emergência, venha direto — atendemos 24 horas, todos os dias, inclusive feriados.',
  },

  // ── Serviços (SEO programático) ───────────────────────────────────
  services: [
    {
      slug: 'emergencia-24h',
      name: 'Emergência e Pronto Atendimento 24h',
      tag: '24 horas · 365 dias',
      description:
        'Sala de emergência aberta 24 horas para qualquer urgência: acidentes, intoxicações, dificuldade para respirar, dor aguda. Avaliação imediata por ordem de chegada e gravidade, com UTI e internação no mesmo local.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Veterinário 24h {{PREP}} {{BAIRRO}} — Emergência · Animal Clinic Bacacheri',
      metaDescTemplate:
        'Emergência veterinária 24h {{PREP}} {{BAIRRO}}, Curitiba. Pronto atendimento, UTI e internação no mesmo lugar, 365 dias por ano. Animal Clinic Bacacheri.',
      icon: 'heart',
    },
    {
      slug: 'internacao-uti',
      name: 'Internação e UTI',
      tag: 'Cuidado contínuo',
      description:
        'Internação com leitos climatizados e UTI para casos que exigem monitoramento constante. Equipe presente 24h e espaço de internamento exclusivo para gatos, reduzindo o estresse na recuperação.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Internação e UTI veterinária {{PREP}} {{BAIRRO}} — Animal Clinic Bacacheri',
      metaDescTemplate:
        'Internação e UTI veterinária {{PREP}} {{BAIRRO}}, Curitiba. Leitos climatizados, monitoramento 24h e ala exclusiva para felinos. Animal Clinic Bacacheri.',
      icon: 'heart',
    },
    {
      slug: 'cirurgia',
      name: 'Centro Cirúrgico',
      tag: 'Especialidade',
      description:
        'Centro cirúrgico completo, de castrações a procedimentos de alta complexidade, com anestesiologia dedicada para maior segurança. Pré e pós-operatório acompanhados pelo mesmo time.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Cirurgia veterinária {{PREP}} {{BAIRRO}} — Animal Clinic Bacacheri',
      metaDescTemplate:
        'Cirurgia veterinária {{PREP}} {{BAIRRO}}, Curitiba. Centro cirúrgico com anestesiologia dedicada e acompanhamento completo. Animal Clinic Bacacheri, 24h.',
      icon: 'dna',
    },
    {
      slug: 'exames-diagnostico',
      name: 'Exames e Diagnóstico por Imagem',
      tag: 'No próprio local',
      description:
        'Laboratório de análises clínicas, raio-x e ultrassonografia na própria unidade. Diagnóstico mais rápido e sem precisar levar seu pet de um lugar para outro em um momento delicado.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Exames veterinários {{PREP}} {{BAIRRO}} — Animal Clinic Bacacheri',
      metaDescTemplate:
        'Exames veterinários {{PREP}} {{BAIRRO}}, Curitiba. Laboratório, raio-x e ultrassom no local, com diagnóstico ágil. Animal Clinic Bacacheri, 24h.',
      icon: 'chart',
    },
    {
      slug: 'especialidades',
      name: 'Consultas com Especialistas',
      tag: '+12 especialidades',
      description:
        'Cardiologia, dermatologia, oncologia, ortopedia, neurologia, odontologia, oftalmologia, endocrinologia, nefrologia e medicina de felinos — especialistas trabalhando de forma integrada, no mesmo hospital.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Veterinário especialista {{PREP}} {{BAIRRO}} — Animal Clinic Bacacheri',
      metaDescTemplate:
        'Especialistas veterinários {{PREP}} {{BAIRRO}}, Curitiba: cardiologia, ortopedia, oncologia, dermatologia e mais. Animal Clinic Bacacheri, 24h.',
      icon: 'heart',
    },
    {
      slug: 'vacinacao-checkup',
      name: 'Vacinação e Check-up',
      tag: 'Prevenção',
      description:
        'Centro de imunização com vacinas monitoradas por temperatura e check-up anual para manter a saúde em dia. Prevenir é o melhor jeito de evitar a emergência.',
      schemaType: 'VeterinaryCare',
      h1Template: 'Vacinação e check-up veterinário {{PREP}} {{BAIRRO}} — Animal Clinic Bacacheri',
      metaDescTemplate:
        'Vacinação e check-up veterinário {{PREP}} {{BAIRRO}}, Curitiba. Centro de imunização monitorado e exames preventivos. Animal Clinic Bacacheri.',
      icon: 'apple',
    },
  ],

  // ── Bairros (SEO programático) ────────────────────────────────────
  neighborhoods: [
    { slug: 'bacacheri',    name: 'Bacacheri',    prep: 'no' },
    { slug: 'boa-vista',    name: 'Boa Vista',    prep: 'na' },
    { slug: 'cabral',       name: 'Cabral',       prep: 'no' },
    { slug: 'jureve',       name: 'Juvevê',       prep: 'no' },
    { slug: 'ahu',          name: 'Ahú',          prep: 'no' },
    { slug: 'bairro-alto',  name: 'Bairro Alto',  prep: 'no' },
    { slug: 'hugo-lange',   name: 'Hugo Lange',   prep: 'no' },
    { slug: 'jardim-social', name: 'Jardim Social', prep: 'no' },
  ],

  // ── Schema.org ────────────────────────────────────────────────────
  schemaType: 'VeterinaryCare',
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' },
  ],
  priceRange: '$$',
};
