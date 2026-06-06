// Tipos de domínio — Portal Cliente Multi-Serviço (Fase 4)

import type { ServiceType } from "./app";

export type SeoPhase =
  | "seo_diagnostico"
  | "seo_otimizacao"
  | "seo_indexacao"
  | "seo_ranqueando"
  | "seo_monitoramento";

export type ArcPhase =
  | "arc_setup"
  | "arc_primeira_campanha"
  | "arc_otimizacao"
  | "arc_performance";

export interface ServiceMetric {
  id: string;
  project_id: string;
  service_type: ServiceType;
  period_label: string;
  metrics: Record<string, unknown>;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceDeliverable {
  id: string;
  project_id: string;
  service_type: ServiceType;
  title: string;
  description: string | null;
  url: string | null;
  status: string;
  delivered_at: string;
  created_at: string;
}
