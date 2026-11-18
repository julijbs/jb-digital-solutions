import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { BLACK_FRIDAY, getOneTimeService, getSiteOffer } from '../_shared/site-offer.ts';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const respond = (body: object, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST') return respond({ error: 'Método não permitido' }, 405);
  try {
    const token = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!token || !Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET')) return respond({ error: 'Mercado Pago ainda não configurado.' }, 503);
    const url = Deno.env.get('SUPABASE_URL')!;
    const authorization = req.headers.get('Authorization') ?? '';
    const userDb = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authorization } } });
    const { data: { user } } = await userDb.auth.getUser(authorization.replace(/^Bearer /, ''));
    if (!user?.email) return respond({ error: 'Autenticação necessária.' }, 401);
    const { tier, client_id, project_id } = await req.json();
    const now = Date.now();
    const offer = getOneTimeService(tier, now);
    if (!offer) return respond({ error: 'Serviço inválido.' }, 400);
    const { data: client } = await userDb.from('clients').select('id').eq('id', client_id).eq('user_id', user.id).maybeSingle();
    const { data: project } = await userDb.from('projects').select('id').eq('id', project_id).eq('client_id', client_id).maybeSingle();
    if (!client || !project) return respond({ error: 'Projeto não autorizado.' }, 403);
    const db = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const billingId = crypto.randomUUID();
    const expiresAt = tier === 'site_novo' && getSiteOffer(now).active ? BLACK_FRIDAY.endsAt : new Date(now + 86400000).toISOString();
    const { error: insertError } = await db.from('billing').insert({ id: billingId, project_id, client_id, product_type: tier, amount: offer.cents, currency: 'brl', status: 'pending', payment_provider: 'mercadopago' });
    if (insertError) throw new Error('Não foi possível registrar a cobrança.');
    const origin = Deno.env.get('PUBLIC_SITE_URL') || 'https://jbdigitalsystem.com';
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ id: tier, title: `${offer.name} — pagamento único`, quantity: 1, currency_id: 'BRL', unit_price: offer.cents / 100 }],
        payer: { email: user.email },
        external_reference: billingId,
        back_urls: { success: `${origin}/dashboard/billing?provider=mercadopago`, pending: `${origin}/dashboard/billing?provider=mercadopago`, failure: `${origin}/dashboard/billing?provider=mercadopago` },
        auto_return: 'approved',
        notification_url: `${url}/functions/v1/mercadopago-webhook?source_news=webhooks`,
        expires: true,
        expiration_date_to: expiresAt,
      }),
    });
    const preference = await response.json();
    if (!response.ok || !preference.init_point || !preference.id) {
      await db.from('billing').update({ status: 'failed' }).eq('id', billingId);
      throw new Error('Não foi possível abrir o Mercado Pago. Tente novamente.');
    }
    const { error: updateError } = await db.from('billing').update({ mercadopago_preference_id: preference.id }).eq('id', billingId);
    if (updateError) throw new Error('Não foi possível vincular o checkout.');
    return respond({ url: preference.init_point });
  } catch {
    return respond({ error: 'Falha ao iniciar o checkout. Tente novamente.' }, 500);
  }
});
