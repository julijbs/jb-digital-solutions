import { BLACK_FRIDAY, getOneTimeService, getSiteOffer } from './site-offer.ts';

// Allow only tokenized cards and Pix. Wallet payments require a Mercado Pago login.
export function buildEmbeddedPayment(form: Record<string, any>, billing: { id: string; amount: number; product_type: string; created_at: string }, now = Date.now()) {
  const offer = getOneTimeService(billing.product_type, now);
  if (!offer || billing.amount !== offer.cents || !Number.isFinite(Date.parse(billing.created_at)) || now - Date.parse(billing.created_at) > 3600000) throw new Error('expired_checkout');
  if (!form.payer?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.payer.email)) throw new Error('invalid_payer');
  const method = String(form.payment_method_id ?? '');
  const pix = method === 'pix';
  if (!pix && (!/^[a-z0-9_]+$/i.test(method) || typeof form.token !== 'string' || !form.token)) throw new Error('invalid_method');
  const installments = Number(form.installments ?? 1);
  if (!pix && (!Number.isInteger(installments) || installments < 1 || installments > 12)) throw new Error('invalid_installments');
  return {
    transaction_amount: billing.amount / 100,
    description: `${offer.name} — pagamento único`,
    external_reference: billing.id,
    payment_method_id: method,
    payer: { email: form.payer.email, ...(form.payer.identification ? { identification: { type: form.payer.identification.type, number: form.payer.identification.number } } : {}), ...(form.payer.first_name ? { first_name: form.payer.first_name } : {}), ...(form.payer.last_name ? { last_name: form.payer.last_name } : {}) },
    ...(pix ? { date_of_expiration: new Date(Math.min(now + 1800000, Date.parse(billing.created_at) + 3600000, billing.product_type === 'site_novo' && getSiteOffer(now).active ? Date.parse(BLACK_FRIDAY.endsAt) : Infinity)).toISOString() } : { token: form.token, installments, ...(form.issuer_id ? { issuer_id: String(form.issuer_id) } : {}), three_d_secure_mode: 'optional' }),
  };
}
