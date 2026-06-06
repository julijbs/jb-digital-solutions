// Tipos de domínio — ARC™ (consolidação arc-blueprint → jb-digital-os)

export type ArcStatusDirect =
  | "nao_enviado"
  | "enviado"
  | "respondido"
  | "qualificado"
  | "descartado";

export type ArcClientStatus = "ativo" | "pausado" | "encerrado";

export interface ArcProspect {
  id: string;
  created_at: string;
  nome: string;
  produto: string;
  instagram: string | null;
  site: string | null;
  seguidores: string | null;
  nicho: string | null;
  checks: unknown[]; // jsonb
  score: number;
  status_direct: string;
  notas_gerais: string | null;
  data_auditoria: string;
}

export interface ArcClient {
  id: string;
  created_at: string;
  nome: string;
  empresa: string;
  email: string | null;
  whatsapp: string | null;
  nicho: string | null;
  ferramenta_email: string | null;
  tamanho_lista: string | null;
  data_inicio: string;
  status: string;
  comissao_percentual: number;
  notas: string | null;
  checklist: unknown[]; // jsonb
  metricas: Record<string, unknown>; // jsonb
}
