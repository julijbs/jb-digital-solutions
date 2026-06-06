// Tipos de domínio — SEO Local (consolidação local-seo-navigator → jb-digital-os)

export type SeoLeadStatus =
  | "prospect_identificado"
  | "contato_enviado"
  | "em_negociacao"
  | "proposta_enviada"
  | "fechado"
  | "perdido"
  | "inativo";

export interface SeoLead {
  id: string;
  empresa: string;
  nicho: string;
  cidade: string | null;
  url: string | null;
  email: string | null;
  telefone: string | null;
  whatsapp: string | null;
  status: string;
  prioridade: string | null;
  diagnostico: string | null;
  pontos_abordagem: string[] | null;
  frase_perda: string | null;
  sugestao_abordagem: string | null;
  proximo_passo: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeoLeadHistory {
  id: string;
  lead_id: string | null;
  acao: string;
  descricao: string | null;
  data: string;
}
