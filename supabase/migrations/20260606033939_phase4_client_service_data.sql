-- =============================================================================
-- Fase 4 — JB Digital Solutions: Portal Cliente Multi-Serviço
-- =============================================================================
-- Cria tabelas client-readable para métricas e entregáveis por projeto/serviço.
-- RLS: admin gerencia tudo; cliente lê apenas os próprios (via project→client→user).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- service_metrics: relatórios periódicos por projeto (SEO Local / ARC™)
-- ---------------------------------------------------------------------------
CREATE TABLE public.service_metrics (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  service_type public.service_type NOT NULL,
  period_label text        NOT NULL,           -- ex: "Junho 2026"
  metrics      jsonb       NOT NULL DEFAULT '{}', -- shape varia por serviço
  summary      text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.service_metrics ENABLE ROW LEVEL SECURITY;

-- Admin: gerencia tudo
CREATE POLICY "Admins manage service_metrics"
  ON public.service_metrics FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin_jb'));

-- Cliente: lê apenas os próprios (via project → client → user)
CREATE POLICY "Clients read own service_metrics"
  ON public.service_metrics FOR SELECT TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM public.projects p
      JOIN public.clients c ON c.id = p.client_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE INDEX idx_service_metrics_project_id ON public.service_metrics(project_id);

CREATE TRIGGER update_service_metrics_updated_at
  BEFORE UPDATE ON public.service_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- service_deliverables: entregáveis discretos por projeto (relatórios, links, etc.)
-- ---------------------------------------------------------------------------
CREATE TABLE public.service_deliverables (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  service_type public.service_type NOT NULL,
  title        text        NOT NULL,
  description  text,
  url          text,
  status       text        NOT NULL DEFAULT 'entregue',
  delivered_at timestamptz NOT NULL DEFAULT now(),
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.service_deliverables ENABLE ROW LEVEL SECURITY;

-- Admin: gerencia tudo
CREATE POLICY "Admins manage service_deliverables"
  ON public.service_deliverables FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin_jb'));

-- Cliente: lê apenas os próprios
CREATE POLICY "Clients read own service_deliverables"
  ON public.service_deliverables FOR SELECT TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM public.projects p
      JOIN public.clients c ON c.id = p.client_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE INDEX idx_service_deliverables_project_id ON public.service_deliverables(project_id);
