import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowUpRight } from 'lucide-react';
import { getSiteOffer } from '../../../supabase/functions/_shared/site-offer';

export function useSiteOffer() {
  const [offer, setOffer] = useState(() => getSiteOffer());
  useEffect(() => {
    const timer = window.setInterval(() => setOffer(getSiteOffer()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return offer;
}
export function BlackFridayOffer() {
  const offer = useSiteOffer();
  const seconds = Math.floor(offer.remainingMs / 1000);
  const units = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
  return <article className="service-offer service-offer--complete" aria-label="Oferta Sistema Completo">
    <div className="service-offer-heading"><span className="service-offer-type">Sua presença conectada</span>{offer.active && <span className="campaign-tag">Black Friday</span>}</div>
    <h3>Sistema Completo</h3>
    <p className="service-description">Site + criação ou otimização do Perfil Google, com integração ao site.</p>
    <div className="service-price-block">
      {offer.active && <span className="service-original">De <s>R$ 1.497</s> por</span>}
      <div className="service-price-row"><strong className={offer.active ? 'campaign-price' : ''}>{offer.setupPrice}</strong><span>pagamento único<br />sem mensalidade</span></div>
      <p className="service-saving">{offer.active ? 'R$ 1.000 de economia até 30/11' : 'Criação, integração e entrega pontual'}</p>
    </div>
    <ul className="service-features">
      {['Site profissional adaptado a celulares', 'Criação ou otimização do Perfil Google', 'Integração do GBP ao site', 'Contato pelo WhatsApp', 'Revisão e aprovação antes da entrega'].map(f => <li key={f}><Check size={15} />{f}</li>)}
    </ul>
    <Link className="elegant-primary service-buy" to="/checkout?plan=site_novo">Contratar Sistema Completo <ArrowUpRight size={17} /></Link>
    {offer.active && <div className="campaign-deadline"><div><span>Condição até 30/11</span><small>23h59 · horário de Brasília</small></div><div className="campaign-clock" role="timer" aria-label="Tempo restante para o fim da promoção">{units.map((value, i) => <span key={i}><b>{String(value).padStart(2, '0')}</b><small>{['d', 'h', 'm', 's'][i]}</small></span>)}</div></div>}
  </article>;
}
