import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { matchesApprovedPayment, verifyMercadoSignature, type MercadoPayment } from '../_shared/mercado-pago.ts';
Deno.serve(async req => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('data.id') ?? '';
    const secret = Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET') ?? '';
    const valid = await verifyMercadoSignature(secret, id, req.headers.get('x-request-id') ?? '', req.headers.get('x-signature') ?? '');
    if (!valid) return new Response('Invalid signature', { status: 401 });
    const event = await req.json();
    if (event.type !== 'payment') return new Response('OK');
    if (String(event.data?.id) !== id || !/^\d+$/.test(id)) return new Response('Invalid payment', { status: 400 });
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, { headers: { Authorization: `Bearer ${Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')}` } });
    if (!response.ok) throw new Error('Payment lookup failed');
    const payment: MercadoPayment = await response.json();
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: billing, error } = await db.from('billing').select('id, amount, status').eq('id', payment.external_reference).eq('payment_provider', 'mercadopago').maybeSingle();
    if (error || !billing) throw new Error('Billing not found');
    if (matchesApprovedPayment(payment, billing)) {
      const { error: updateError } = await db.from('billing').update({ status: 'paid', mercadopago_payment_id: String(payment.id), paid_at: payment.date_approved || new Date().toISOString() }).eq('id', billing.id).eq('status', 'pending');
      if (updateError) throw new Error('Payment persistence failed');
    }
    return new Response('OK');
  } catch {
    return new Response('Retry later', { status: 500 });
  }
});
