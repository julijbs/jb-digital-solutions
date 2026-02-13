
-- Remove the overly permissive INSERT policy
DROP POLICY "Service role can insert notifications" ON public.notifications;

-- Only admins can insert notifications (service role bypasses RLS anyway)
CREATE POLICY "Admins can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin_jb'::app_role));
