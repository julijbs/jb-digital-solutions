import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { buildEmbeddedPayment } from '../_shared/embedded-payment.ts';
import { matchesApprovedPayment } from '../_shared/mercado-pago.ts';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const respond = (body: object, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST') return respond({ error: 'Método inválido' }, 405);
  const requestId = crypto.randomUUID();
  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const token = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!token) return respond({ error: 'Pagamento temporariamente indisponível.' }, 503);
    const authorization = req.headers.get('Authorization') ?? '';
    const userDb = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authorization } } });
    const { data: { user } } = await userDb.auth.getUser(authorization.replace(/^Bearer /, ''));
    if (!user) return respond({ error: 'Entre na sua conta para pagar.' }, 401);
    const { billing_id, form_data } = await req.json();
    const { data: billing } = await userDb.from('billing').select('id,client_id,project_id,status,amount,product_type,created_at,mercadopago_payment_id,mercadopago_preference_id').eq('id', billing_id).eq('payment_provider', 'mercadopago').maybeSingle();
    const { data: client } = await userDb.from('clients').select('id').eq('user_id', user.id).eq('id', billing?.client_id ?? '').maybeSingle();
    if (!billing || !client) return respond({ error: 'Cobrança não autorizada.' }, 403);
    if (billing.status === 'paid') return respond({ paid: true, project_id: billing.project_id });
    const { data: existingPaid, error: paidLookupError } = await userDb.from('billing').select('id').eq('project_id', billing.project_id).eq('product_type', billing.product_type).eq('status', 'paid').limit(1).maybeSingle();
    if (paidLookupError) throw new Error('paid_lookup');
    if (existingPaid) return respond({ paid: true, project_id: billing.project_id });
    if (billing.status !== 'pending' || billing.mercadopago_preference_id) return respond({ error: 'Abra um novo pagamento para continuar.' }, 409);
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    let payment;
    if (billing.mercadopago_payment_id) {
      const lookup = await fetch(`https://api.mercadopago.com/v1/payments/${billing.mercadopago_payment_id}`, { headers });
      if (!lookup.ok) throw new Error('payment_lookup');
      payment = await lookup.json();
    } else {
      let payload;
      try { payload = buildEmbeddedPayment(form_data ?? {}, billing); }
      catch { return respond({ error: 'Pagamento expirado ou dados inválidos. Abra um novo pagamento e confira seus dados.' }, 400); }
      if (payload.payment_method_id !== 'pix') {
        const methods = await fetch('https://api.mercadopago.com/v1/payment_methods', { headers });
        if (!methods.ok) throw new Error('method_lookup');
        const available = await methods.json();
        if (!available.some((m: { id: string; payment_type_id: string }) => m.id === payload.payment_method_id && ['credit_card', 'debit_card', 'prepaid_card'].includes(m.payment_type_id))) return respond({ error: 'Escolha Pix ou cartão.' }, 400);
      }
      const created = await fetch('https://api.mercadopago.com/v1/payments', { method: 'POST', headers: { ...headers, 'X-Idempotency-Key': billing.id }, body: JSON.stringify({ ...payload, notification_url: `${url}/functions/v1/mercadopago-webhook?source_news=webhooks` }) });
      payment = await created.json();
      if (!created.ok || !payment.id) {
        console.error(JSON.stringify({ requestId, stage: 'payment_create', httpStatus: created.status }));
        return respond({ error: 'O Mercado Pago não processou o pagamento. Confira os dados ou escolha outro meio.' }, 422);
      }
    }
    const db = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const paid = matchesApprovedPayment(payment, billing);
    const { error } = await db.from('billing').update({ mercadopago_payment_id: String(payment.id), ...(paid ? { status: 'paid', paid_at: payment.date_approved || new Date().toISOString() } : {}) }).eq('id', billing.id).eq('status', 'pending');
    if (error) throw new Error('payment_save');
    return respond({ paid, project_id: billing.project_id, payment_id: String(payment.id), status: payment.status, status_detail: payment.status_detail, ...(payment.three_ds_info ? { three_ds_info: payment.three_ds_info } : {}) });
  } catch {
    console.error(JSON.stringify({ requestId, stage: 'embedded_payment' }));
    return respond({ error: 'Não foi possível consultar o pagamento. Tente verificar a confirmação antes de pagar novamente.' }, 500);
  }
});
