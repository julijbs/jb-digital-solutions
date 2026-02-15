
-- Add domain fields to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS custom_domain TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS domain_status TEXT DEFAULT 'not_configured';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS cloudflare_zone_id TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS domain_registrar TEXT DEFAULT 'cloudflare';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS domain_ownership TEXT DEFAULT 'client';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS domain_payment_id TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS domain_renewal_date DATE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS domain_auto_renew BOOLEAN DEFAULT true;

-- Create domain_transactions table
CREATE TABLE public.domain_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'renewal')),
  amount DECIMAL(10,2) NOT NULL,
  payment_provider TEXT NOT NULL DEFAULT 'stripe',
  payment_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.domain_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all domain transactions"
ON public.domain_transactions FOR ALL
USING (has_role(auth.uid(), 'admin_jb'::app_role));

CREATE POLICY "Clients can view own domain transactions"
ON public.domain_transactions FOR SELECT
USING (get_project_user_id(project_id) = auth.uid());

CREATE INDEX idx_domain_transactions_project ON public.domain_transactions(project_id);
CREATE INDEX idx_domain_transactions_status ON public.domain_transactions(status);

CREATE TRIGGER update_domain_transactions_updated_at
BEFORE UPDATE ON public.domain_transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create domain_renewals table
CREATE TABLE public.domain_renewals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  renewal_date DATE NOT NULL,
  notified BOOLEAN DEFAULT false,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.domain_renewals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all domain renewals"
ON public.domain_renewals FOR ALL
USING (has_role(auth.uid(), 'admin_jb'::app_role));

CREATE POLICY "Clients can view own domain renewals"
ON public.domain_renewals FOR SELECT
USING (get_project_user_id(project_id) = auth.uid());

CREATE INDEX idx_domain_renewals_date ON public.domain_renewals(renewal_date);
CREATE INDEX idx_domain_renewals_project ON public.domain_renewals(project_id);
