import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

/** Client UX gate. Database RLS independently enforces the same payment prerequisite. */
export function PaidOnboardingGate({ children }: { children: ReactNode }) {
  const { projectId } = useParams();
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setAllowed(false); setError('');
    if (!user || !projectId) return;
    async function check() {
      if (role === 'admin_jb') { if (active) setAllowed(true); return; }
      const [{ data: billing, error: billingError }, { data: project, error: projectError }] = await Promise.all([
        supabase.from('billing').select('id,product_type').eq('project_id', projectId!).eq('status', 'paid'),
        supabase.from('projects').select('plan').eq('id', projectId!).maybeSingle(),
      ]);
      if (!active) return;
      if (billingError || projectError || !project) { setError('Não foi possível verificar a liberação deste projeto. Atualize a página para tentar novamente.'); return; }
      if (billing?.some(b => b.product_type === project.plan || ['site', 'gbp', 'pacote_completo'].includes(b.product_type))) setAllowed(true);
      else navigate(`/checkout?plan=${encodeURIComponent(project.plan)}&project_id=${projectId}`, { replace: true });
    }
    void check();
    return () => { active = false; };
  }, [user, role, projectId, navigate]);
  if (error) return <p role="alert" className="container py-20 text-muted-foreground">{error}</p>;
  return allowed ? <>{children}</> : <div className="flex min-h-screen items-center justify-center gap-3"><Loader2 className="animate-spin" size={20} /><span>Verificando confirmação do pagamento…</span></div>;
}
