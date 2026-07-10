/**
 * pricing.ts — fonte única da oferta.
 *
 * Preços, nomes, CTAs e schema JSON-LD saem daqui. Nada de preço hardcoded
 * em .astro: o Google precisa ver exatamente o que a página mostra.
 *
 * Oferta: um produto (Site Novo + Presença Ativa) e um add-on opcional.
 * O Perfil Google deixou de ser plano e virou add-on.
 */

export interface Plan {
  name: string;
  tagline: string;
  setupPrice: string;
  monthlyPrice: string;
  features: string[];
  cta: string;
  /** valor numérico puro, para o JSON-LD */
  schemaSetup: string;
  schemaMonthly: string;
}

export interface Addon {
  name: string;
  monthlyPrice: string;
  tagline: string;
  features: string[];
  cta: string;
  schemaMonthly: string;
}

export const plan: Plan = {
  name: 'Site Novo',
  tagline: 'O site que faz jus ao que você já construiu.',
  setupPrice: 'R$ 1.497',
  monthlyPrice: 'R$ 149/mês',
  features: [
    'Site programático com páginas por serviço e bairro',
    'Dezenas de páginas otimizadas para buscas locais',
    'Schema de avaliações — estrelas visíveis no Google',
    'Presença estruturada para as IAs (ChatGPT, Gemini, Perplexity)',
    'Hospedagem e manutenção inclusas na Presença Ativa',
    'Relatório mensal de posições no Google',
  ],
  cta: 'Falar agora',
  schemaSetup: '1497',
  schemaMonthly: '149',
};

export const addon: Addon = {
  name: 'Gestão de Google',
  monthlyPrice: 'R$ 97/mês',
  tagline: 'Add-on opcional, para quem quer o Perfil da Empresa cuidado de perto.',
  features: [
    'Perfil Google completo e otimizado',
    'Monitoramento e postagens mensais',
    'Relatório mensal de posicionamento local',
  ],
  cta: 'Quero o add-on',
  schemaMonthly: '97',
};

/** Ofertas para JSON-LD. Derivadas do que está acima — nunca redigite valores. */
export const schemaOffers = [
  {
    '@type': 'Offer',
    name: plan.name,
    price: plan.schemaSetup,
    priceCurrency: 'BRL',
    description: 'Setup único do site programático.',
    availability: 'https://schema.org/InStock',
  },
  {
    '@type': 'Offer',
    name: 'Presença Ativa',
    price: plan.schemaMonthly,
    priceCurrency: 'BRL',
    description: 'Acompanhamento mensal: hospedagem, manutenção e relatório.',
    availability: 'https://schema.org/InStock',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: plan.schemaMonthly,
      priceCurrency: 'BRL',
      unitText: 'month',
    },
  },
  {
    '@type': 'Offer',
    name: addon.name,
    price: addon.schemaMonthly,
    priceCurrency: 'BRL',
    description: 'Add-on opcional: gestão do Perfil da Empresa no Google.',
    availability: 'https://schema.org/InStock',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: addon.schemaMonthly,
      priceCurrency: 'BRL',
      unitText: 'month',
    },
  },
];

/** Atendimento comercial — Thaís. */
export const whatsappUrl = 'https://wa.me/5521980990577';
/** Mesmo número, no formato que o schema.org espera. */
export const salesPhone = '+55-21-98099-0577';
/** Área logada. Não é mais CTA de aquisição — o caminho de entrada é a conversa. */
export const loginUrl = 'https://jbdigitalsystem.com/login';
