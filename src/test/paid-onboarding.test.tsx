import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { PaidOnboardingGate } from '../components/PaidOnboardingGate';
const state = vi.hoisted(() => ({ paid: false, productType: 'site_novo', navigate: vi.fn(), user: { id: 'customer' } }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: state.user, role: 'client' }) }));
vi.mock('react-router-dom', () => ({ useNavigate: () => state.navigate, useParams: () => ({ projectId: 'project-123' }) }));
vi.mock('@/integrations/supabase/client', () => {
  function query(table: string) {
    const result = Promise.resolve({ error: null, data: table === 'projects' ? { plan: 'site_novo' } : state.paid ? [{ id: 'confirmed-payment', product_type: state.productType }] : [] });
    return { select: () => query(table), eq: () => query(table), maybeSingle: () => result, then: result.then.bind(result) };
  }
  return { supabase: { from: query } };
});
afterEach(() => { cleanup(); state.paid = false; state.productType = 'site_novo'; vi.clearAllMocks(); });
it('blocks an unpaid project and sends the client to payment', async () => {
  render(<PaidOnboardingGate><p>Formulário liberado</p></PaidOnboardingGate>);
  await waitFor(() => expect(state.navigate).toHaveBeenCalledWith('/checkout?plan=site_novo&project_id=project-123', { replace: true }));
  expect(screen.queryByText('Formulário liberado')).not.toBeInTheDocument();
});
it('opens the onboarding only after the server billing record is paid', async () => {
  state.paid = true;
  render(<PaidOnboardingGate><p>Formulário liberado</p></PaidOnboardingGate>);
  expect(await screen.findByText('Formulário liberado')).toBeInTheDocument();
  expect(state.navigate).not.toHaveBeenCalled();
});

it('does not unlock the complete system with payment for another service', async () => {
  state.paid = true; state.productType = 'gbp_avulso';
  render(<PaidOnboardingGate><p>Formulário liberado</p></PaidOnboardingGate>);
  await waitFor(() => expect(state.navigate).toHaveBeenCalled());
  expect(screen.queryByText('Formulário liberado')).not.toBeInTheDocument();
});
