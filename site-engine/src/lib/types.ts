/**
 * types.ts — Tipos compartilhados do JB Digital System
 *
 * Importados por todos os arquivos de dados de clientes, pelo resolver de blocos
 * e por activeClient.ts.
 */
import type { Mood } from './blocks.ts';

export type { Mood };

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
