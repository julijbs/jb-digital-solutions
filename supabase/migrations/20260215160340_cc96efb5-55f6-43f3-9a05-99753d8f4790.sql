
-- Table to store AI-generated client health analysis
CREATE TABLE public.client_health_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  risk_level text NOT NULL DEFAULT 'low', -- low, medium, high, critical
  risk_score integer NOT NULL DEFAULT 0, -- 0-100
  factors jsonb NOT NULL DEFAULT '[]'::jsonb, -- array of risk factors
  recommended_actions jsonb NOT NULL DEFAULT '[]'::jsonb, -- array of recommended actions
  ai_summary text, -- AI-generated summary
  analyzed_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(client_id, project_id)
);

ALTER TABLE public.client_health_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage health scores"
ON public.client_health_scores
FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin_jb'::app_role
));

CREATE TRIGGER update_client_health_scores_updated_at
BEFORE UPDATE ON public.client_health_scores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
