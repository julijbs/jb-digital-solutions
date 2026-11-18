-- Preserve existing Stripe history/subscriptions; new sales use Mercado Pago.
ALTER TABLE public.billing ADD COLUMN IF NOT EXISTS payment_provider text NOT NULL DEFAULT 'stripe';
ALTER TABLE public.billing ADD COLUMN IF NOT EXISTS mercadopago_preference_id text;
ALTER TABLE public.billing ADD COLUMN IF NOT EXISTS mercadopago_payment_id text;
CREATE UNIQUE INDEX IF NOT EXISTS billing_mp_payment_unique ON public.billing (mercadopago_payment_id) WHERE mercadopago_payment_id IS NOT NULL;
ALTER TABLE public.billing DROP CONSTRAINT IF EXISTS billing_product_type_check;
ALTER TABLE public.billing ADD CONSTRAINT billing_product_type_check CHECK (
  product_type IN ('site', 'gbp', 'pacote_completo', 'essencial', 'premium', 'site_novo', 'gestao_google', 'gbp_avulso', 'site_gbp')
);
