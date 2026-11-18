import { getSiteOffer } from '../../../supabase/functions/_shared/site-offer';
const offer = getSiteOffer();
export const plan = { name: 'Sistema Completo (Site + GBP)', setupPrice: offer.setupPrice };
export const schemaOffers = [
  { '@type': 'Offer', name: 'Sistema Completo (Site + GBP)', price: String(offer.setupCents / 100), priceCurrency: 'BRL', ...(offer.active ? { priceValidUntil: '2026-11-30' } : {}), description: 'Site + criação ou otimização do GBP e integração ao site. Pagamento único, sem mensalidade.' },
  { '@type': 'Offer', name: 'GBP avulso', price: '297', priceCurrency: 'BRL', description: 'Criação ou otimização do Perfil Google. Pagamento único.' },
];
export const whatsappUrl = 'https://wa.me/5521980990577';
export const salesPhone = '+55-21-98099-0577';
export const loginUrl = 'https://jbdigitalsystem.com/login';
