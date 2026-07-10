/**
 * pricing.ts — fonte única da oferta no app logado.
 *
 * Antes, preços e nomes de plano viviam duplicados em ClientBilling.tsx,
 * NewProject.tsx, components/landing/PricingSection.tsx e na edge function
 * create-billing-checkout — com valores que já haviam divergido entre si.
 *
 * As chaves aqui (`key`) são o `tier` enviado para a edge function
 * `create-billing-checkout` e o `product_type` gravado na tabela `billing`.
 * Mudar uma delas quebra o checkout e a rotulagem do histórico. Não renomeie.
 *
 * Os Stripe price IDs correspondentes ficam na edge function, nunca no frontend.
 */

export interface Offer {
  /** tier enviado à edge function · product_type no banco */
  key: string;
  name: string;
  tag: string;
  setupPrice: string | null;
  monthlyPrice: string;
  setupValue: number; // centavos
  monthlyValue: number; // centavos
  features: string[];
  featured: boolean;
}

/** Oferta principal: um setup + uma mensalidade. */
export const SITE_NOVO: Offer = {
  key: "site_novo",
  name: "Site Novo",
  tag: "Site programático + Presença Ativa mensal",
  setupPrice: "R$ 1.497",
  monthlyPrice: "R$ 149/mês",
  setupValue: 149700,
  monthlyValue: 14900,
  featured: true,
  features: [
    "Site programático com páginas por serviço e bairro",
    "Dezenas de páginas otimizadas para buscas locais",
    "Schema de avaliações — estrelas visíveis no Google",
    "Presença estruturada para as IAs (ChatGPT, Gemini, Perplexity)",
    "Hospedagem e manutenção inclusas na Presença Ativa",
    "Relatório mensal de posições no Google",
  ],
};

/** Add-on opcional. Só mensalidade, sem setup. */
export const GESTAO_GOOGLE: Offer = {
  key: "gestao_google",
  name: "Gestão de Google",
  tag: "Add-on opcional — Perfil da Empresa cuidado de perto",
  setupPrice: null,
  monthlyPrice: "R$ 97/mês",
  setupValue: 0,
  monthlyValue: 9700,
  featured: false,
  features: [
    "Perfil Google completo e otimizado",
    "Monitoramento e postagens mensais",
    "Relatório mensal de posicionamento local",
  ],
};

/** O que é oferecido hoje. */
export const OFFERS: Offer[] = [SITE_NOVO, GESTAO_GOOGLE];

/**
 * Rótulos para exibição. Inclui os planos aposentados em 2026-07-10,
 * porque a tabela `billing` guarda `product_type` histórico e os projetos
 * antigos guardam `projects.plan` — sem estas chaves, faturas e cards de
 * clientes legados apareceriam com a string crua.
 */
export const PRODUCT_LABELS: Record<string, string> = {
  site_novo: "Site Novo + Presença Ativa",
  gestao_google: "Gestão de Google (add-on)",
  // legado — não oferecer, apenas rotular
  essencial: "JB Digital Essencial (legado)",
  premium: "JB Digital Premium (legado)",
};

/** Planos legados. Nenhum cliente novo entra aqui. */
export const LEGACY_PLAN_KEYS = ["essencial", "premium"] as const;

/** Um projeto ganha páginas de SEO por bairro? Premium legado também ganhava. */
export const hasNeighborhoodSeo = (plan: string): boolean =>
  plan === SITE_NOVO.key || plan === "premium";
