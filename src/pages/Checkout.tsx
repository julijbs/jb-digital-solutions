import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Check, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { OFFERS } from '@/config/pricing';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import EmbeddedPayment, { RecoveredPaymentStatus, type EmbeddedSession } from '@/components/EmbeddedPayment';
import { getSiteOffer } from '../../supabase/functions/_shared/site-offer';

export default function Checkout() {
  const [params, setParams] = useSearchParams();
  const [session, setSession] = useState<EmbeddedSession | null>(null);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const offer = OFFERS.find(o => o.key === params.get('plan'));
  const projectId = params.get('project_id');
  const paymentId = params.get('payment_id') || params.get('collection_id');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [price, setPrice] = useState(getSiteOffer());
  useEffect(() => { const t = setInterval(() => setPrice(previous => { const next = getSiteOffer(); return previous.setupPrice === next.setupPrice ? previous : next; }), 1000); return () => clearInterval(t); }, []);

  const confirmPayment = useCallback(async () => {
    if (!user || !projectId) return;
    setError('');
    if (paymentId) {
      const { error: verifyError } = await supabase.functions.invoke('verify-mercadopago-payment', { body: { payment_id: paymentId } });
      if (verifyError) { setMessage('Ainda não foi possível consultar o Mercado Pago. Verificando a confirmação do servidor…'); }
    }
    const { data, error: queryError } = await supabase.from('billing').select('id').eq('project_id', projectId).eq('status', 'paid').eq('product_type', offer?.key ?? '').limit(1).maybeSingle();
    if (queryError) { setError('Não foi possível verificar o pagamento. Tente novamente.'); return; }
    if (data) navigate(`/dashboard/onboarding/${projectId}`, { replace: true });
    else setMessage('Pagamento ainda não confirmado. O onboarding será liberado após a aprovação.');
  }, [user, projectId, paymentId, navigate, offer?.key]);

  useEffect(() => {
    if (!user || !projectId) return;
    void confirmPayment();
    if (params.get('provider') !== 'mercadopago') return;
    const t = setInterval(() => { void confirmPayment(); }, 5000);
    return () => clearInterval(t);
  }, [user, projectId, confirmPayment, params]);

  async function pay() {
    if (!offer || !user || busy) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const { data, error: checkoutError } = await supabase.functions.invoke('create-mercadopago-checkout', { body: { mode: 'embedded', tier: offer.key, ...(projectId ? { project_id: projectId } : {}) } });
      if (checkoutError) {
        let detail = 'Não foi possível abrir o pagamento. Tente novamente.';
        if (checkoutError.context instanceof Response) { const body = await checkoutError.context.json().catch(() => null); if (body?.error) detail = body.error; }
        throw new Error(detail);
      }
      if (data?.paid && data?.project_id) { navigate(`/dashboard/onboarding/${data.project_id}`, { replace: true }); return; }
      if (!data?.billing_id) throw new Error(data?.error || 'Não foi possível preparar o formulário de pagamento.');
      setSession(data);
      setParams({ plan: offer.key, project_id: data.project_id }, { replace: true });
    } catch (e) { setError(e instanceof Error ? e.message : 'Falha ao abrir o pagamento.'); }
    finally { setBusy(false); }
  }

  if (!offer) return <main className="container py-28"><h1 className="font-serif text-3xl">Escolha um serviço para continuar</h1><Link className="text-primary" to="/#planos">Ver serviços</Link></main>;
  const setupPrice = offer.key === 'site_novo' ? price.setupPrice : offer.setupPrice;
  return <main className="min-h-screen bg-background px-5 py-12"><Helmet><title>Pagamento | JB Digital System</title><meta name="robots" content="noindex" /></Helmet><div className="mx-auto max-w-lg">
    <Link to="/#planos" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft size={15} /> Voltar aos serviços</Link>
    <div className="mt-8 rounded-xl border border-border bg-card p-7 md:p-9">
      <p className="text-sm text-primary">Pagamento seguro pelo Mercado Pago</p><h1 className="mt-3 font-serif text-3xl">{offer.name}</h1>
      <p className="mt-4 text-4xl font-semibold">{setupPrice}</p><p className="mt-1 text-sm text-muted-foreground">Pagamento único. Sem mensalidade.</p>
      <ul className="my-6 space-y-3">{offer.features.map(f => <li key={f} className="flex gap-2 text-sm text-muted-foreground"><Check className="shrink-0 text-primary" size={16} />{f}</li>)}</ul>
      <p className="mb-6 border-t border-border pt-5 text-sm text-muted-foreground">Primeiro você paga. Após a confirmação, liberamos o formulário com as informações do seu negócio.</p>
      {message && <p role="status" className="mb-5 text-sm text-primary">{message}</p>}
      {error && <p role="alert" className="mb-5 text-sm text-destructive">{error}</p>}
      {authLoading ? <Loader2 className="animate-spin" aria-label="Carregando" /> : !user ? <div className="space-y-3"><Button variant="hero" className="w-full" asChild><Link to={`/signup?plan=${offer.key}`}>Criar conta e continuar para pagamento</Link></Button><p className="text-center text-sm text-muted-foreground">Já tem conta? <Link className="text-primary" to={`/login?plan=${offer.key}`}>Entrar para pagar</Link></p></div> : <div className="space-y-3">{!session && !paymentId && <Button variant="hero" className="w-full" disabled={busy} onClick={pay}>{busy ? <><Loader2 size={16} className="mr-2 animate-spin" />Abrindo pagamento…</> : `Pagar ${setupPrice} com Pix ou cartão`}</Button>}{projectId && <Button variant="outline" className="w-full" onClick={() => { void confirmPayment(); }}>Já paguei: verificar confirmação</Button>}</div>}
      {user && paymentId && !session && <RecoveredPaymentStatus paymentId={paymentId} retryUrl={`${window.location.origin}/checkout?plan=${offer.key}&project_id=${projectId}`} />}
      {user && session && <EmbeddedPayment key={session.billing_id} session={session} email={user.email ?? ''} onRetry={() => setSession(null)} onPayment={result => {
        if (result.paid) { navigate(`/dashboard/onboarding/${result.project_id}`, { replace: true }); return; }
        setParams({ plan: offer.key, project_id: result.project_id, provider: 'mercadopago', payment_id: result.payment_id }, { replace: true });
      }} />}
      <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck size={14} /> Seus dados de pagamento ficam no Mercado Pago.</p>
    </div></div></main>;
}
