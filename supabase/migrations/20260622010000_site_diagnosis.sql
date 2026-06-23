-- B1: Site Diagnosis — add columns to client_intake
-- existing_site_url: the client's current website URL (captured in Onboarding)
-- site_diagnosis: JSONB result from PageSpeed Insights analysis

ALTER TABLE public.client_intake
  ADD COLUMN IF NOT EXISTS existing_site_url TEXT,
  ADD COLUMN IF NOT EXISTS site_diagnosis JSONB;
