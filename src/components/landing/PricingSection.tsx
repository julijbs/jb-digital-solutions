import { Link } from "react-router-dom";
import { Check, ArrowUpRight } from "lucide-react";
import { BlackFridayOffer } from "./BlackFridayOffer";

export const PricingSection = () => (
  <section id="planos" className="elegant-pricing">
    <div className="container">
      <div className="elegant-section-heading"><div><p className="elegant-intro">Um investimento, uma entrega</p><h2>Escolha seu próximo passo.</h2></div><p>Sistema Completo ou Perfil Google avulso.<br />Duas opções claras. Sem assinatura.</p></div>
      <div className="elegant-pricing-grid">
        <BlackFridayOffer />
        <article className="service-offer">
          <div className="service-offer-heading"><span className="service-offer-type">Para quem já tem um site</span></div>
          <h3>GBP avulso</h3>
          <p className="service-description">Criação ou otimização do Perfil da Empresa no Google, em uma entrega pontual.</p>
          <div className="service-price-block"><span className="service-original">Serviço independente</span><div className="service-price-row"><strong>R$ 297</strong><span>pagamento único<br />sem mensalidade</span></div><p className="service-saving">Foco na sua presença no Google</p></div>
          <ul className="service-features">{['Criação ou otimização do Perfil Google', 'Informações e categorias do negócio', 'Serviços e dados de contato organizados', 'Sem criação de site neste serviço'].map(f => <li key={f}><Check size={15} />{f}</li>)}</ul>
          <Link to="/signup?plan=gbp_avulso" className="elegant-secondary service-buy">Contratar GBP avulso <ArrowUpRight size={17} /></Link>
          <p className="service-footnote">A verificação e aprovação do perfil dependem do Google.</p>
        </article>
      </div>
      <p className="elegant-pricing-note">Criação, configuração e entrega. Sem gestão contínua ou cobrança mensal. A verificação e aprovação do Perfil Google dependem do Google.</p>
    </div>
  </section>
);
