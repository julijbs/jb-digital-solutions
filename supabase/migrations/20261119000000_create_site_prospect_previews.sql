CREATE TABLE public.site_prospect_previews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  instagram_username TEXT NOT NULL,
  instagram_url TEXT NOT NULL,
  profile_snapshot JSONB NOT NULL,
  site_content JSONB NOT NULL,
  html TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX site_prospect_previews_created_at_idx
  ON public.site_prospect_previews (created_at DESC);

ALTER TABLE public.site_prospect_previews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage site prospect previews"
  ON public.site_prospect_previews
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin_jb'))
  WITH CHECK (public.has_role(auth.uid(), 'admin_jb'));

CREATE TRIGGER update_site_prospect_previews_updated_at
  BEFORE UPDATE ON public.site_prospect_previews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

REVOKE ALL ON public.site_prospect_previews FROM anon;
