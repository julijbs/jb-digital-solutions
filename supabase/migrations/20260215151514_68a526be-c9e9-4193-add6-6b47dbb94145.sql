
-- Create storage bucket for generated site HTML files
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated-sites', 'generated-sites', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read published sites (public bucket)
CREATE POLICY "Public can read generated sites"
ON storage.objects FOR SELECT
USING (bucket_id = 'generated-sites');

-- Only admins can upload/manage site files
CREATE POLICY "Admins can upload generated sites"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'generated-sites'
  AND public.has_role(auth.uid(), 'admin_jb')
);

CREATE POLICY "Admins can update generated sites"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'generated-sites'
  AND public.has_role(auth.uid(), 'admin_jb')
);

CREATE POLICY "Admins can delete generated sites"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'generated-sites'
  AND public.has_role(auth.uid(), 'admin_jb')
);

-- Add site_html_path column to projects for tracking stored file
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS site_html_path text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS published_url text;
