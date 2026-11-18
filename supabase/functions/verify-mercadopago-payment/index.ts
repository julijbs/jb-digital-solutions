import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { matchesApprovedPayment, type MercadoPayment } from '../_shared/mercado-pago.ts';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const respond = (body: object, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST') return respond({ error: 'Método inválido' }, 405);
  try {
    const authorization = req.headers.get('Authorization') ?? '';
    const userDb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authorization } } });
    const { data: { user } } = await userDb.auth.getUser(authorization.replace(/^Bearer /, ''));
    if (!user) return respond({ error: 'Autenticação necessária' }, 401);
    const { payment_id } = await req.json();
    if (!/^\d+$/.test(String(payment_id))) return respond({ error: 'Pagamento inválido' }, 400);
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, { headers: { Authorization: `Bearer ${Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')}` } });
    if (!response.ok) throw new Error('Payment lookup failed');
    const payment: MercadoPayment = await response.json();
    const { data: billing } = await userDb.from('billing').select('id, amount, status, client_id').eq('id', payment.external_reference).eq('payment_provider', 'mercadopago').maybeSingle();
    const { data: client } = await userDb.from('clients').select('id').eq('user_id', user.id).eq('id', billing?.client_id ?? '').maybeSingle();
    if (!billing || !client) return respond({ error: 'Pagamento não autorizado' }, 403);
    if (matchesApprovedPayment(payment, billing)) {
      const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
      const { error } = await db.from('billing').update({ status: 'paid', mercadopago_payment_id: String(payment.id), paid_at: payment.date_approved || new Date().toISOString() }).eq('id', billing.id).eq('status', 'pending');
      if (error) throw new Error('Payment persistence failed');
      return respond({ status: billing.status === 'refunded' ? 'refunded' : 'paid' });
    }
    return respond({ status: 'pending' });
  } catch {
    return respond({ error: 'Não foi possível confirmar o pagamento.' }, 500);
  }
});
