
-- Email log table to track all sent emails
CREATE TABLE public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  to_email TEXT NOT NULL,
  template TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'bounced')),
  resend_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email_logs"
ON public.email_logs FOR ALL
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin_jb'));

-- NPS and feedback table
CREATE TABLE public.client_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('nps', 'feedback', 'testimonial')),
  nps_score INTEGER CHECK (nps_score >= 0 AND nps_score <= 10),
  comment TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.client_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage feedback"
ON public.client_feedback FOR ALL
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin_jb'));

CREATE POLICY "Clients can insert own feedback"
ON public.client_feedback FOR INSERT
WITH CHECK (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

CREATE POLICY "Clients can view own feedback"
ON public.client_feedback FOR SELECT
USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- Maintenance subscriptions tracking table
CREATE TABLE public.maintenance_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  canceled_at TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.maintenance_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage subscriptions"
ON public.maintenance_subscriptions FOR ALL
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin_jb'));

CREATE POLICY "Clients can view own subscriptions"
ON public.maintenance_subscriptions FOR SELECT
USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

CREATE TRIGGER update_maintenance_subscriptions_updated_at
BEFORE UPDATE ON public.maintenance_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
