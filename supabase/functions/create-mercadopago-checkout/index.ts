import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { BLACK_FRIDAY, getOneTimeService, getSiteOffer } from '../_shared/site-offer.ts';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const respond = (body: object, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST') return respond({ error: 'Método não permitido' }, 405);
  const requestId = crypto.randomUUID();
  try {
    const token = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!token || !Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET')) return respond({ error: 'Mercado Pago ainda não configurado.' }, 503);
    const url = Deno.env.get('SUPABASE_URL')!;
    const authorization = req.headers.get('Authorization') ?? '';
    const userDb = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authorization } } });
    const { data: { user } } = await userDb.auth.getUser(authorization.replace(/^Bearer /, ''));
    if (!user?.email) return respond({ error: 'Entre na sua conta para continuar para o pagamento.' }, 401);
    const { tier, project_id: requestedProjectId, mode } = await req.json();
    const now = Date.now();
    const offer = getOneTimeService(tier, now);
    if (!offer) return respond({ error: 'Serviço inválido.' }, 400);
    const db = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const clientResult = await db.from('clients').select('id').eq('user_id', user.id).maybeSingle();
    if (clientResult.error) throw new Error('client_lookup');
    let client = clientResult.data;
    if (!client) {
      const created = await db.from('clients').upsert({ user_id: user.id, business_name: user.user_metadata?.full_name || 'Novo cliente' }, { onConflict: 'user_id', ignoreDuplicates: true }).select('id').maybeSingle();
      if (created.error) throw new Error('client_create');
      client = created.data;
      if (!client) client = (await db.from('clients').select('id').eq('user_id', user.id).single()).data;
      if (!client) throw new Error('client_unavailable');
    }
    let projectId: string | undefined = requestedProjectId;
    if (projectId) {
      const { data: project } = await db.from('projects').select('id,plan').eq('id', projectId).eq('client_id', client.id).maybeSingle();
      if (!project || project.plan !== tier) return respond({ error: 'Este projeto não corresponde ao serviço escolhido.' }, 403);
    } else {
      const { data: candidates, error } = await db.from('projects').select('id,billing(status)').eq('client_id', client.id).eq('plan', tier).in('status', ['intake', 'onboarding_in_progress', 'content_ready']).order('created_at', { ascending: false }).limit(20);
      if (error) throw new Error('project_lookup');
      projectId = candidates?.find(p => !p.billing?.some((b: { status: string }) => b.status === 'paid'))?.id;
      if (!projectId) {
        const { data: created, error } = await db.from('projects').insert({ client_id: client.id, name: offer.name, plan: tier, status: 'intake' }).select('id').single();
        if (error || !created) throw new Error('project_create');
        projectId = created.id;
      }
    }
    const { data: paid, error: paidError } = await db.from('billing').select('id').eq('project_id', projectId).eq('product_type', tier).eq('status', 'paid').limit(1).maybeSingle();
    if (paidError) throw new Error('payment_lookup');
    if (paid) return respond({ paid: true, project_id: projectId });
    const billingId = crypto.randomUUID();
    // Short validity plus the campaign deadline prevents old discounted checkouts remaining payable.
    const expiresAt = new Date(Math.min(now + 3600000, tier === 'site_novo' && getSiteOffer(now).active ? Date.parse(BLACK_FRIDAY.endsAt) : Infinity)).toISOString();
    const { error: insertError } = await db.from('billing').insert({ id: billingId, project_id: projectId, client_id: client.id, product_type: tier, amount: offer.cents, currency: 'brl', status: 'pending', payment_provider: 'mercadopago' });
    if (insertError) throw new Error('billing_create');
    if (mode === 'embedded') return respond({ billing_id: billingId, project_id: projectId, amount: offer.cents / 100, expires_at: expiresAt });
    const origin = Deno.env.get('PUBLIC_SITE_URL') || 'https://jbdigitalsystem.com';
    const returnUrl = `${origin}/checkout?provider=mercadopago&plan=${encodeURIComponent(tier)}&project_id=${projectId}`;
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ id: tier, title: `${offer.name} — pagamento único`, quantity: 1, currency_id: 'BRL', unit_price: offer.cents / 100 }],
        external_reference: billingId,
        back_urls: { success: returnUrl, pending: returnUrl, failure: returnUrl },
        auto_return: 'approved',
        notification_url: `${url}/functions/v1/mercadopago-webhook?source_news=webhooks`,
        expires: true,
        expiration_date_from: new Date(now).toISOString(),
        expiration_date_to: expiresAt,
      }),
    });
    const preference = await response.json();
    if (!response.ok || !preference.init_point || !preference.id) {
      await db.from('billing').update({ status: 'failed' }).eq('id', billingId);
      console.error(JSON.stringify({ requestId, stage: 'preference_create', providerStatus: response.status, providerCode: preference.error || 'invalid_response' }));
      return respond({ error: `O Mercado Pago não abriu a cobrança. Tente novamente ou informe o código ${requestId.slice(0, 8)} ao suporte.` }, 502);
    }
    const { error: updateError } = await db.from('billing').update({ mercadopago_preference_id: preference.id }).eq('id', billingId);
    if (updateError) throw new Error('preference_save');
    return respond({ url: preference.init_point, project_id: projectId });
  } catch (error) {
    console.error(JSON.stringify({ requestId, stage: error instanceof Error ? error.message : 'unknown' }));
    return respond({ error: `Não foi possível preparar o pagamento. Tente novamente. Código: ${requestId.slice(0, 8)}.` }, 500);
  }
});
