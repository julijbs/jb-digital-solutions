/**
 * types.ts — Tipos compartilhados do JB Digital System
 *
 * Importados por todos os arquivos de dados de clientes, pelo resolver de blocos
 * e por activeClient.ts.
 */
import type { Mood } from './blocks.ts';

export type { Mood };

/**
 * Tokens de marca derivados do logotipo do cliente.
 * Substitui a paleta de cor hardcoded por mood — cor agora vem do logo,
 * mood continua definindo apenas estrutura/layout/personalidade tipográfica.
 */
export interface BrandTokens {
  // ── Paleta primária ───────────────────────────────────────────────
  /** Cor principal: headings, nav, links, botões primários */
  primary:       string;
  /** Variação escura: hover, texto pequeno (contraste garantido) */
  primaryDark:   string;
  /** Variação clara: hover states sutis */
  primaryLight:  string;
  /** Destaque / CTA — máx. 2 seções por página */
  accent:        string;
  /** Accent escuro (hover do CTA) */
  accentDark:    string;
  /** Accent claro */
  accentLight:   string;

  // ── Superfícies ───────────────────────────────────────────────────
  /** Background principal da página */
  surface:       string;
  /** Cards e seções levemente tingidas */
  surfaceMuted:  string;
  /** Dividers e bordas sutis */
  surfaceDark:   string;
  /** Background de seções alternadas */
  surfaceAlt:    string;

  // ── Texto ─────────────────────────────────────────────────────────
  /** Texto principal (máx. contraste sobre surface) */
  ink:           string;
  /** Texto secundário, credenciais */
  inkMuted:      string;
  /** Captions, labels (mínimo legível WCAG AA) */
  inkFaint:      string;

  // ── Estrutural ────────────────────────────────────────────────────
  /** Bordas leves */
  border:        string;
  /** Background da seção de destaque escura (depoimentos) */
  breakBg:       string;
  /** Texto sobre breakBg */
  white:         string;

  // ── Tipografia ────────────────────────────────────────────────────
  /** CSS font-family stack para display/serifa: ex. "'Fraunces', Georgia, serif" */
  fontDisplayFamily: string;
  /** CSS font-family stack para corpo/sans: ex. "'Inter', system-ui, sans-serif" */
  fontBodyFamily:    string;
  /** URL completa do Google Fonts cobrindo display + body */
  googleFontsUrl:    string;
}

export interface ClientService {
  /** Slug usado na URL: /[servico]/[bairro] */
  slug: string;
  /** Nome exibido na pillar page e nas páginas de bairro */
  name: string;
  /** Tag curta (Presencial · Online, Especialidade, etc.) */
  tag: string;
  /** Descrição completa para pillar page */
  description: string;
  /** Schema.org @type específico para este serviço */
  schemaType: string;
  /** H1 template para página de bairro — use {{BAIRRO}} e {{PREP}} */
  h1Template: string;
  /** Descrição meta para página de bairro — use {{BAIRRO}} e {{PREP}} */
  metaDescTemplate: string;
  /**
   * Ícone para ServicesGrid (Fresh Clinical).
   * Opcional — ignorado por ServicesTypoList (Calm Trust).
   */
  icon?: 'leaf' | 'heart' | 'chart' | 'baby' | 'apple' | 'dna';
}

export interface ClientNeighborhood {
  /** Slug URL-safe */
  slug: string;
  /** Nome exibido */
  name: string;
  /** Preposição + artigo para "consultar {specialtyNoun} EM/NA bairro" */
  prep: string;
}

export interface ClientData {
  // ── Identidade ──────────────────────────────────────────────────
  businessName: string;
  specialty: string;
  /** Ex.: "CRN 3/12345 · Especialista em Nutrição Clínica · Pinheiros, São Paulo" */
  credential: string;
  slug: string;
  siteUrl: string;
  mood: Mood;

  // ── Marca visual ─────────────────────────────────────────────────
  /**
   * Caminho para o logotipo do cliente (relativo a public/<slug>/).
   * Ex.: "/dra-carolina-odonto/logo.svg"
   * Quando presente: aparece no nav e footer em vez do nome em texto,
   * e é usado como favicon e og:image base.
   * Quando ausente: nav/footer mostram businessName como texto.
   */
  logoSrc?: string;
  /** og:image customizada (caminho relativo a public/, ex: "/slug/og-image.jpg"). Se ausente, usa logoSrc. */
  ogImageSrc?: string;
  /** URL do perfil no Google Business Profile (Google Maps). Usado no widget de avaliações e no schema sameAs. */
  gbpUrl?: string;
  /**
   * Tokens de cor e tipografia derivados do logotipo.
   * Quando ausente, o site usa os defaults do Calm Trust (`:root` em global.css).
   * Use `scripts/extract-brand.ts <logo>` para gerar automaticamente.
   */
  brand?: BrandTokens;

  // ── Endereço físico (usado no Schema.org e na prosa local) ──────
  streetAddress: string;
  postalCode: string;
  /** Bairro do consultório, ex.: "Jardins" | "Pinheiros" */
  district: string;
  /** Substantivo da profissão, ex.: "psicóloga" | "nutricionista" */
  specialtyNoun: string;

  // ── Contato ──────────────────────────────────────────────────────
  city: string;
  state: string;
  phone: string;
  phoneClean: string;
  email: string;
  instagram: string;
  /** Endereço completo formatado, ex.: "Rua X, 123 — Jardins, São Paulo-SP" */
  address: string;
  lat: string;
  lng: string;

  // ── Copy — uma entrada por bloco da pillar page ──────────────────
  copy: {
    /** Title tag da home, ex.: "Psicóloga em São Paulo — Dra. Ana Mello | TCC" */
    homeTitle: string;
    /** Meta description da home */
    homeMetaDescription: string;
    /** Descrição do negócio usada no Schema.org (campo "description") */
    businessDescription: string;
    /** Snippet para llms.txt — 2-3 frases resumindo o negócio */
    llmsSummary: string;

    heroHeadline: string;
    heroSubheadline: string;
    heroPhotoAlt: string;
    heroPhotoSrc?: string;
    /** Rótulo/eyebrow acima do headline do hero (Calm Trust). Default: "Psicologia Clínica". */
    heroEyebrow?: string;

    /**
     * 3 dores/problemas do cliente.
     * Para Fresh Clinical (PainPointsSymptomCards): prefixe cada string com
     * um título curto seguido de " — " para separar título do corpo do card.
     * Ex.: "Energia em colapso — Você acorda cansada..."
     * Para Calm Trust (PainPointsNumbered): string livre, sem separador.
     */
    painPoints: [string, string, string];

    aboutHeadline: string;
    aboutBody: string;
    /** Frase de destaque/pull quote da seção Sobre */
    pullQuote: string;
    aboutCredential: string;
    aboutPhotoAlt: string;
    aboutPhotoSrc?: string;

    servicesHeadline: string;
    processHeadline: string;
    processSteps: { name: string; description: string }[];
    testimonials: { quote: string; author: string }[];
    faqHeadline: string;
    faqs: { question: string; answer: string }[];
    ctaHeadline: string;
    ctaSubtext: string;
    ctaButtonText: string;
  };

  // ── Serviços (SEO programático) ──────────────────────────────────
  services: ClientService[];

  // ── Bairros atendidos (SEO programático) ────────────────────────
  neighborhoods: ClientNeighborhood[];

  // ── Schema.org ───────────────────────────────────────────────────
  schemaType: string;
  openingHours: { days: string[]; opens: string; closes: string }[];
  priceRange: string;
}
