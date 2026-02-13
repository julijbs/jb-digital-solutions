-- Create storage bucket for client photos
INSERT INTO storage.buckets (id, name, public) VALUES ('client-photos', 'client-photos', true);

-- Allow authenticated users to upload their own photos
CREATE POLICY "Users can upload own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'client-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to view their own photos
CREATE POLICY "Users can view own photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'client-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own photos
CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'client-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow admins full access to client photos
CREATE POLICY "Admins can manage all photos"
ON storage.objects FOR ALL
USING (bucket_id = 'client-photos' AND has_role(auth.uid(), 'admin_jb'::app_role));

-- Public read access for client photos (they'll be used on the site)
CREATE POLICY "Public can view client photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'client-photos');