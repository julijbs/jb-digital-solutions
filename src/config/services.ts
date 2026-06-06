// Configuração central dos serviços — fonte única para labels, fases,
// campos de métricas e CTAs por service_type.

import type { ServiceType } from "@/types/app";
import type { SeoPhase, ArcPhase } from "@/types/services";
import { WHATSAPP_URL } from "./contact";

// ---------------------------------------------------------------------------
// Fases por serviço
// ---------------------------------------------------------------------------

export interface ServicePhase {
  key: string;
  label: string;
  description: string;
}

export const SEO_PHASES: ServicePhase[] = [
  { key: "seo_diagnostico",      label: "Diagnóstico",     description: "Análise do negócio e mapa de palavras-chave locais" },
  { key: "seo_otimizacao",       label: "Otimização",      description: "Ajustes no site, GBP e citações locais" },
  { key: "seo_indexacao",        label: "Indexação",       description: "Google processando as mudanças" },
  { key: "seo_ranqueando",       label: "Ranqueando",      description: "Posições melhorando nas buscas locais" },
  { key: "seo_monitoramento",    label: "Monitoramento",   description: "Acompanhamento e ajustes contínuos" },
];

export const ARC_PHASES: ServicePhase[] = [
  { key: "arc_setup",             label: "Setup",           description: "Configuração da ferramenta e da estratégia inicial" },
  { key: "arc_primeira_campanha", label: "1ª Campanha",     description: "Primeira sequência ativa para a base" },
  { key: "arc_otimizacao",        label: "Otimização",      description: "Ajuste de copy, segmentação e cadência" },
  { key: "arc_performance",       label: "Performance",     description: "Receita recorrente em operação" },
];

// ---------------------------------------------------------------------------
// Campos de métricas por serviço (chaves jsonb esperadas)
// ---------------------------------------------------------------------------

export interface MetricField {
  key: string;       // chave em metrics jsonb
  label: string;
  unit?: string;     // ex: "%", "R$"
}

export const SEO_METRIC_FIELDS: MetricField[] = [
  { key: "posicao_local",       label: "Posição local (média)" },
  { key: "palavras_top10",      label: "Palavras no Top 10" },
  { key: "visualizacoes_gbp",   label: "Visualizações GBP" },
  { key: "cliques_site",        label: "Cliques no site" },
  { key: "ligacoes",            label: "Ligações geradas" },
];

export const ARC_METRIC_FIELDS: MetricField[] = [
  { key: "receita_gerada",      label: "Receita gerada",     unit: "R$" },
  { key: "emails_enviados",     label: "E-mails enviados" },
  { key: "taxa_abertura",       label: "Taxa de abertura",   unit: "%" },
  { key: "taxa_clique",         label: "Taxa de clique",     unit: "%" },
  { key: "conversoes",          label: "Conversões" },
  { key: "comissao",            label: "Comissão JB",        unit: "R$" },
];

// ---------------------------------------------------------------------------
// Config por service_type
// ---------------------------------------------------------------------------

export interface ServiceConfig {
  label: string;
  shortLabel: string;
  accentClass: string;       // Tailwind: texto do badge/destaque
  bgClass: string;           // Tailwind: fundo do badge
  phases: ServicePhase[];
  metricFields: MetricField[];
  ctaLabel: string;
  ctaHref: string;
}

export const SERVICE_CONFIG: Record<ServiceType, ServiceConfig> = {
  site_gbp: {
    label: "Site + Google Business Profile",
    shortLabel: "Site + GBP",
    accentClass: "text-primary",
    bgClass: "bg-primary/10",
    phases: [],            // usa clientStages de ProjectTimeline
    metricFields: [],      // sem service_metrics (usa fluxo de deploy existente)
    ctaLabel: "Acessar painel",
    ctaHref: "/dashboard",
  },
  seo_local: {
    label: "SEO Local",
    shortLabel: "SEO",
    accentClass: "text-emerald-400",
    bgClass: "bg-emerald-500/10",
    phases: SEO_PHASES,
    metricFields: SEO_METRIC_FIELDS,
    ctaLabel: "Falar com a equipe",
    ctaHref: WHATSAPP_URL,
  },
  arc_backend: {
    label: "ARC™ — Ativação de Receita Contínua",
    shortLabel: "ARC™",
    accentClass: "text-amber-400",
    bgClass: "bg-amber-500/10",
    phases: ARC_PHASES,
    metricFields: ARC_METRIC_FIELDS,
    ctaLabel: "Falar com a equipe",
    ctaHref: WHATSAPP_URL,
  },
};
