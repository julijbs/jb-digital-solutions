import { Check, MapPin, Globe2, ArrowUpRight } from "lucide-react";

export const HeroSection = () => (
  <section className="elegant-hero">
    <div className="container elegant-hero-grid">
      <div className="elegant-hero-copy">
        <p className="elegant-intro">Presença digital para negócios locais</p>
        <h1>Seu trabalho merece<br />ser encontrado.</h1>
        <p className="elegant-lead">Um site profissional e um Perfil Google bem preparado, conectados para apresentar seu negócio e facilitar o próximo contato.</p>
        <div className="elegant-actions">
          <a href="#planos" className="elegant-primary">Conhecer o Sistema Completo <ArrowUpRight size={17} /></a>
          <a href="#como-funciona" className="elegant-text-link">Entenda como funciona</a>
        </div>
        <div className="elegant-assurances">
          <span><Check size={14} />Pagamento único</span>
          <span><Check size={14} />Sem mensalidade</span>
          <span><Check size={14} />Aprovação antes da entrega</span>
        </div>
      </div>
      <div className="presence-preview" aria-label="Exemplo ilustrativo de site integrado ao Perfil Google">
        <div className="preview-browser"><span /><span /><span /><small>Seu negócio, bem apresentado</small></div>
        <div className="preview-site">
          <div className="preview-site-nav"><span>Seu negócio</span><Globe2 size={17} /></div>
          <div className="preview-site-body">
            <span className="preview-category">Cuidado em cada detalhe</span>
            <h2>Uma boa primeira<br />impressão começa aqui.</h2>
            <p>Seus serviços, sua história e um caminho simples para entrar em contato.</p>
            <span className="preview-contact">Fale com a nossa equipe <ArrowUpRight size={13} /></span>
          </div>
          <div className="preview-services"><span>Seus serviços</span><span>Sobre você</span><span>Contato</span></div>
        </div>
        <div className="preview-google"><div className="preview-map"><MapPin size={22} /></div><div><strong>Seu Perfil no Google</strong><p>Informações, localização e site integrados</p></div><Check size={17} /></div>
        <p className="preview-caption">Site + Perfil Google. Uma presença conectada.<span>Exemplo ilustrativo</span></p>
      </div>
    </div>
    <div className="container"><div className="elegant-deliverables"><span><Globe2 size={19} />Site profissional</span><span><MapPin size={19} />Criação ou otimização do GBP</span><span><Check size={19} />Integração do perfil ao site</span></div></div>
  </section>
);
