import { useCallback, useMemo, useRef, useState } from 'react';
import { initMercadoPago, Payment, StatusScreen } from '@mercadopago/sdk-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

// Publishable browser key, never the private Access Token.
initMercadoPago('APP_USR-d1109819-0326-4425-ac4d-120302c8a844', { locale: 'pt-BR' });
export interface EmbeddedSession { billing_id: string; project_id: string; amount: number; expires_at: string }
interface PaymentResult { paid?: boolean; project_id: string; payment_id: string; status: string; three_ds_info?: { external_resource_url: string; creq: string } }
export default function EmbeddedPayment({ session, email, onPayment, onRetry }: { session: EmbeddedSession; email: string; onPayment: (result: PaymentResult) => void; onRetry: () => void }) {
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState('');
  const [canRetry, setCanRetry] = useState(false);
  const initialization = useMemo(() => ({ amount: session.amount, payer: { email } }), [session.amount, email]);
  const customization = useMemo(() => ({ paymentMethods: { creditCard: 'all' as const, debitCard: 'all' as const, bankTransfer: ['pix'], maxInstallments: 12 }, visual: { style: { theme: 'dark' as const } } }), []);
  const statusInitialization = useMemo(() => result ? ({ paymentId: result.payment_id, ...(result.three_ds_info ? { additionalInfo: { externalResourceURL: result.three_ds_info.external_resource_url, creq: result.three_ds_info.creq } } : {}) }) : null, [result]);
  const onPaymentRef = useRef(onPayment);
  onPaymentRef.current = onPayment;
  const handleError = useCallback(() => { setError('Não foi possível carregar o formulário. Confira sua conexão e tente novamente.'); setCanRetry(true); }, []);
  const handleStatusError = useCallback(() => setError('Não foi possível mostrar os detalhes. Use “Verificar confirmação” antes de tentar pagar novamente.'), []);
  const handleSubmit = useCallback(async ({ formData }: { formData: unknown }) => {
      setError(''); setCanRetry(false);
      const { data, error: paymentError } = await supabase.functions.invoke('process-mercadopago-payment', { body: { billing_id: session.billing_id, form_data: formData } });
      if (paymentError || data?.error) {
        let detail = data?.error || 'Não foi possível processar. Verifique a confirmação antes de tentar novamente.';
        if (paymentError?.context instanceof Response) { const body = await paymentError.context.json().catch(() => null); detail = body?.error || detail; }
        setCanRetry([400, 422].includes(paymentError?.context instanceof Response ? paymentError.context.status : 0));
        setError(detail); throw new Error(detail);
      }
      setResult(data); onPaymentRef.current(data);
    
  }, [session.billing_id]);
  return <div className="mt-6 border-t border-border pt-6">
    <h2 className="mb-2 text-lg font-medium">Escolha como pagar</h2>
    <p className="mb-4 text-sm text-muted-foreground">Pix ou cartão, sem precisar entrar ou criar conta no Mercado Pago.</p>
    {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
    {statusInitialization ? <><StatusScreen initialization={statusInitialization} onError={handleStatusError} />{['rejected', 'cancelled'].includes(result?.status ?? '') && <p className="mt-3 text-sm text-muted-foreground">Pagamento não aprovado.</p>}</> : <Payment initialization={initialization} customization={customization} onSubmit={handleSubmit} onError={handleError} />}
    {(canRetry || ['rejected', 'cancelled'].includes(result?.status ?? '')) && <Button variant="outline" className="mt-4 w-full" onClick={onRetry}>Escolher outra forma de pagamento</Button>}
  </div>;
}

export function RecoveredPaymentStatus({ paymentId, retryUrl }: { paymentId: string; retryUrl: string }) {
  const initialization = useMemo(() => ({ paymentId }), [paymentId]);
  const customization = useMemo(() => ({ backUrls: { error: retryUrl } }), [retryUrl]);
  return <StatusScreen initialization={initialization} customization={customization} />;
}
