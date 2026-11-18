import { getSiteOffer } from "../../supabase/functions/_shared/site-offer";
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

/** Sistema Completo: site + criação/otimização do GBP e integração. */
export const SITE_NOVO: Offer = {
  key: "site_novo",
  name: "Sistema Completo",
  tag: "Site + criação ou otimização do GBP + integração",
  get setupPrice() { return getSiteOffer().setupPrice; },
  monthlyPrice: "Sem mensalidade",
  get setupValue() { return getSiteOffer().setupCents; },
  monthlyValue: 0,
  featured: true,
  features: [
    "Página profissional com seus serviços e informações",
    "Layout adaptado a celulares e computadores",
    "Botão de contato pelo WhatsApp",
    "Estrutura preparada para buscas locais",
    "Criação ou otimização do Perfil da Empresa no Google",
    "Integração do Perfil Google ao site",
    "Revisão e aprovação antes da entrega",
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

export const GBP_AVULSO: Offer = {
  key: "gbp_avulso", name: "GBP avulso", tag: "Criação ou otimização · entrega pontual",
  setupPrice: "R$ 297", monthlyPrice: "Sem mensalidade", setupValue: 29700, monthlyValue: 0,
  features: ["Criação ou otimização do Perfil da Empresa", "Informações, categorias e serviços do negócio", "Verificação e aprovação sujeitas ao Google"], featured: false,
};

/** O que é oferecido hoje. */
export const OFFERS: Offer[] = [SITE_NOVO, GBP_AVULSO];

/**
 * Rótulos para exibição. Inclui os planos aposentados em 2026-07-10,
 * porque a tabela `billing` guarda `product_type` histórico e os projetos
 * antigos guardam `projects.plan` — sem estas chaves, faturas e cards de
 * clientes legados apareceriam com a string crua.
 */
export const PRODUCT_LABELS: Record<string, string> = {
  site_novo: "Sistema Completo (Site + GBP)",
  gbp_avulso: "Criação do Perfil Google",
  site_gbp: "Site + Perfil Google",
  gestao_google: "Gestão de Google (add-on)",
  // legado — não oferecer, apenas rotular
  essencial: "JB Digital Essencial (legado)",
  premium: "JB Digital Premium (legado)",
};

/** Planos legados. Nenhum cliente novo entra aqui. */
export const LEGACY_PLAN_KEYS = ["essencial", "premium"] as const;

/** Um projeto ganha páginas de SEO por bairro? Premium legado também ganhava. */
export const hasNeighborhoodSeo = (plan: string): boolean =>
  plan === SITE_NOVO.key || plan === "site_gbp" || plan === "premium";
