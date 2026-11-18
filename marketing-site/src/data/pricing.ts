import { getSiteOffer } from '../../../supabase/functions/_shared/site-offer';
const offer = getSiteOffer();
export const plan = { name: 'Site Novo', setupPrice: offer.setupPrice };
export const schemaOffers = [
  { '@type': 'Offer', name: 'Site Novo', price: String(offer.setupCents / 100), priceCurrency: 'BRL', ...(offer.active ? { priceValidUntil: '2026-11-30' } : {}), description: 'Criação e entrega da página. Pagamento único, sem mensalidade.' },
  { '@type': 'Offer', name: 'Criação do Perfil Google', price: '297', priceCurrency: 'BRL', description: 'Criação e configuração. Pagamento único.' },
  { '@type': 'Offer', name: 'Site + Perfil Google', price: '750', priceCurrency: 'BRL', description: 'As duas entregas. Pagamento único.' },
];
export const whatsappUrl = 'https://wa.me/5521980990577';
export const salesPhone = '+55-21-98099-0577';
export const loginUrl = 'https://jbdigitalsystem.com/login';
