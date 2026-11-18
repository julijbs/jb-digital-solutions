import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  return <aside className={`bf-offer ${offer.active ? 'bf-offer--active' : ''}`} aria-label="Oferta Site Novo">
    <p className="bf-label">{offer.active ? 'Black Friday • até 30/11' : 'Seu novo site começa aqui'}</p>
    <h2>Site Novo</h2>
    <p className="bf-description">Uma página profissional para apresentar seu negócio e facilitar o contato.</p>
    {offer.active && <p className="bf-was">De <s>R$ 1.497</s> por</p>}
    <p className="bf-price">{offer.setupPrice}</p>
    <p>Pagamento único. Sem mensalidade.</p>
    {offer.active && <>
      <p className="bf-saving">Economize R$ 1.000 na criação da página</p>
      <div className="bf-countdown" role="timer" aria-label="Tempo restante para o fim da promoção">
        {units.map((value, i) => <div key={i}><strong>{String(value).padStart(2, '0')}</strong><span>{['dias', 'horas', 'min', 'seg'][i]}</span></div>)}
      </div>
      <p className="bf-deadline">Termina em 30/11/2026, às 23h59 (Brasília).</p>
    </>}
    <Link className="bf-button" to="/signup?plan=site_novo">{offer.active ? 'Quero minha página por R$ 497' : 'Iniciar meu projeto'}</Link>
    <p className="bf-note">Criação e entrega da página. Perfil Google contratado à parte.</p>
  </aside>;
}
