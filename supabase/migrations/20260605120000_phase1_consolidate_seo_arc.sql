
-- =============================================================================
-- Fase 1 — JB Digital Solutions: Consolidação SEO Local + ARC™
-- =============================================================================
-- Adiciona service_type enum + coluna em projects.
-- Cria tabelas namespaced seo_leads, seo_lead_history, arc_prospects, arc_clients.
-- RLS admin-only em todas (reusa has_role + update_updated_at_column existentes).
-- =============================================================================

-- service_type enum
CREATE TYPE public.service_type AS ENUM ('site_gbp', 'seo_local', 'arc_backend');

-- Marca projetos existentes como site_gbp (produto original do core)
ALTER TABLE public.projects
  ADD COLUMN service_type public.service_type NOT NULL DEFAULT 'site_gbp';

-- ---------------------------------------------------------------------------
-- SEO LOCAL: seo_leads (origem: local-seo-navigator `leads`)
-- ---------------------------------------------------------------------------
CREATE TABLE public.seo_leads (
  id          uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa     text      NOT NULL,
  nicho       text      NOT NULL,
  cidade      text,
  url         text,
  email       text,
  telefone    text,
  whatsapp    text,
  status      text      NOT NULL DEFAULT 'prospect_identificado',
  prioridade  text,
  diagnostico text,
  pontos_abordagem text[],
  frase_perda      text,
  sugestao_abordagem text,
  proximo_passo    text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage seo_leads"
  ON public.seo_leads FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin_jb'));

CREATE TRIGGER update_seo_leads_updated_at
  BEFORE UPDATE ON public.seo_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- SEO LOCAL: seo_lead_history (origem: local-seo-navigator `lead_history`)
-- ---------------------------------------------------------------------------
CREATE TABLE public.seo_lead_history (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.seo_leads(id) ON DELETE CASCADE,
  acao    text NOT NULL,
  descricao text,
  data    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_lead_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage seo_lead_history"
  ON public.seo_lead_history FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin_jb'));

-- ---------------------------------------------------------------------------
-- ARC™: arc_prospects (origem: arc-blueprint `prospects`)
-- ---------------------------------------------------------------------------
CREATE TABLE public.arc_prospects (
  id             uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  nome           text    NOT NULL,
  produto        text    NOT NULL,
  instagram      text,
  site           text,
  seguidores     text,
  nicho          text,
  checks         jsonb   NOT NULL DEFAULT '[]'::jsonb,
  score          integer NOT NULL DEFAULT 0,
  status_direct  text    NOT NULL DEFAULT 'nao_enviado',
  notas_gerais   text,
  data_auditoria timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.arc_prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage arc_prospects"
  ON public.arc_prospects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin_jb'));

-- ---------------------------------------------------------------------------
-- ARC™: arc_clients (origem: arc-blueprint `clients` — renomeada p/ evitar
--        colisão com public.clients do core)
-- ---------------------------------------------------------------------------
CREATE TABLE public.arc_clients (
  id                   uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at           timestamptz NOT NULL DEFAULT now(),
  nome                 text    NOT NULL,
  empresa              text    NOT NULL,
  email                text,
  whatsapp             text,
  nicho                text,
  ferramenta_email     text,
  tamanho_lista        text,
  data_inicio          date    NOT NULL DEFAULT current_date,
  status               text    NOT NULL DEFAULT 'ativo',
  comissao_percentual  integer NOT NULL DEFAULT 20,
  notas                text,
  checklist            jsonb   NOT NULL DEFAULT '[]'::jsonb,
  metricas             jsonb   NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE public.arc_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage arc_clients"
  ON public.arc_clients FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin_jb'));
