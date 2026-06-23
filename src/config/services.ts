// Configuração central dos serviços — fonte única para labels, fases,
// campos de métricas e CTAs por service_type.

import type { ServiceType } from "@/types/app";

// ---------------------------------------------------------------------------
// Fases por serviço
// ---------------------------------------------------------------------------

export interface ServicePhase {
  key: string;
  label: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Config por service_type
// ---------------------------------------------------------------------------

export interface ServiceConfig {
  label: string;
  shortLabel: string;
  accentClass: string;       // Tailwind: texto do badge/destaque
  bgClass: string;           // Tailwind: fundo do badge
  phases: ServicePhase[];
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
    ctaLabel: "Acessar painel",
    ctaHref: "/dashboard",
  },
};
