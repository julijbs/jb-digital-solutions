
-- Create billing table for tracking payments
CREATE TABLE public.billing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  product_type TEXT NOT NULL CHECK (product_type IN ('site', 'gbp', 'pacote_completo')),
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'brl',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.billing ENABLE ROW LEVEL SECURITY;

-- Admin can see all billing records
CREATE POLICY "Admins can manage all billing"
ON public.billing
FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin_jb')
);

-- Clients can view their own billing
CREATE POLICY "Clients can view own billing"
ON public.billing
FOR SELECT
USING (
  client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
);

-- Trigger for updated_at
CREATE TRIGGER update_billing_updated_at
BEFORE UPDATE ON public.billing
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
