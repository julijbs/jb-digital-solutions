import { expect, it } from 'vitest';
import { webcrypto } from 'node:crypto';
import { matchesApprovedPayment, verifyMercadoSignature } from '../../supabase/functions/_shared/mercado-pago';
const billing = { id: 'billing-123', amount: 49700 };
const payment = { id: 123, external_reference: billing.id, status: 'approved', transaction_amount: 497, currency_id: 'BRL' };
it('requires an approved payment with matching reference, BRL and full amount', () => {
  expect(matchesApprovedPayment(payment, billing)).toBe(true);
  for (const mismatch of [{ status: 'pending' }, { currency_id: 'USD' }, { external_reference: 'another-order' }, { transaction_amount: 297 }]) {
    expect(matchesApprovedPayment({ ...payment, ...mismatch }, billing)).toBe(false);
  }
});
it('validates the documented HMAC manifest and rejects tampering or missing signatures', async () => {
  const secret = 'unit-test-secret';
  const encoder = new TextEncoder();
  const key = await webcrypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await webcrypto.subtle.sign('HMAC', key, encoder.encode('id:123;request-id:req-123;ts:1704908010;'));
  const hex = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('');
  expect(await verifyMercadoSignature(secret, '123', 'req-123', `ts=1704908010,v1=${hex}`)).toBe(true);
  expect(await verifyMercadoSignature(secret, '999', 'req-123', `ts=1704908010,v1=${hex}`)).toBe(false);
  expect(await verifyMercadoSignature(secret, '123', 'req-123', '')).toBe(false);
});
