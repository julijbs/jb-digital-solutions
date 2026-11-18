import { expect, it } from 'vitest';
import { buildEmbeddedPayment } from '../../supabase/functions/_shared/embedded-payment';
const now = Date.parse('2026-11-18T12:00:00Z');
const billing = { id: 'bill-1', amount: 49700, product_type: 'site_novo', created_at: new Date(now).toISOString() };
const form = { payment_method_id: 'pix', transaction_amount: 1, external_reference: 'forged', payer: { email: 'buyer@example.com' } };
it('uses server amount/reference and rejects wallet payments', () => {
  const payment = buildEmbeddedPayment(form, billing, now);
  expect(payment.transaction_amount).toBe(497);
  expect(payment.external_reference).toBe('bill-1');
  expect(payment).not.toHaveProperty('token');
  expect(() => buildEmbeddedPayment({ ...form, payment_method_id: 'account_money' }, billing, now)).toThrow();
});
it('rejects expired, malformed, and incorrectly priced bills', () => {
  expect(() => buildEmbeddedPayment(form, billing, now + 3600001)).toThrow();
  expect(() => buildEmbeddedPayment(form, { ...billing, created_at: 'bad' }, now)).toThrow();
  expect(() => buildEmbeddedPayment(form, { ...billing, amount: 29700 }, now)).toThrow();
});
it('preserves tokenized card fields and enables issuer verification', () => {
  const payment = buildEmbeddedPayment({ ...form, payment_method_id: 'visa', token: 'test-token', installments: 1 }, billing, now);
  expect(payment.token).toBe('test-token');
  expect(payment.three_d_secure_mode).toBe('optional');
  expect(() => buildEmbeddedPayment({ ...form, payment_method_id: 'visa', token: 'token', installments: -1 }, billing, now)).toThrow();
});
