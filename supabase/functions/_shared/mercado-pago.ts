export interface MercadoPayment {
  id: number | string;
  external_reference: string;
  status: string;
  transaction_amount: number;
  currency_id: string;
  date_approved?: string;
}
export function matchesApprovedPayment(payment: MercadoPayment, billing: { id: string; amount: number }) {
  return payment.status === 'approved' && payment.currency_id === 'BRL' &&
    payment.external_reference === billing.id &&
    Math.round(payment.transaction_amount * 100) === billing.amount;
}
export async function verifyMercadoSignature(secret: string, dataId: string, requestId: string, signature: string) {
  const parts: Record<string, string> = Object.fromEntries(signature.split(',').map(part => part.trim().split('=')));
  if (!secret || !dataId || !requestId || !parts.ts || !/^[a-f0-9]{64}$/i.test(parts.v1 ?? '')) return false;
  const bytes = new TextEncoder();
  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${parts.ts};`;
  const key = await crypto.subtle.importKey('raw', bytes.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  const digest = Uint8Array.from(parts.v1.match(/../g)!, byte => parseInt(byte, 16));
  return crypto.subtle.verify('HMAC', key, digest, bytes.encode(manifest));
}
