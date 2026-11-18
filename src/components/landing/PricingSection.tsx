import { BlackFridayOffer } from "./BlackFridayOffer";

export const PricingSection = () => (
  <section id="planos" className="py-20 md:py-28">
    <div className="container">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="font-serif text-3xl md:text-4xl">Contrate a entrega que seu negócio precisa</h2>
        <p className="mt-4 text-muted-foreground">Serviços avulsos. Pagamento único. Sem assinatura.</p>
      </div>
      <div className="mx-auto grid max-w-5xl items-start gap-8 md:grid-cols-2">
        <BlackFridayOffer />
        <div className="space-y-6">
          <article className="rounded-xl border border-border bg-card p-7">
            <h3 className="font-serif text-2xl">Perfil da Empresa no Google</h3>
            <p className="mt-4 text-3xl font-semibold">R$ 297 <span className="text-sm font-normal">pagamento único</span></p>
            <p className="my-4 text-muted-foreground">Criação e configuração do perfil com as informações do seu negócio. A verificação e aprovação dependem do Google.</p>
            <a className="text-primary underline underline-offset-4" href="/signup?plan=gbp_avulso">Contratar por R$ 297</a>
          </article>
          <article className="rounded-xl border border-border bg-card p-7">
            <h3 className="font-serif text-2xl">Página + Perfil Google</h3>
            <p className="mt-4 text-3xl font-semibold">R$ 750 <span className="text-sm font-normal">pagamento único</span></p>
            <p className="my-4 text-muted-foreground">As duas entregas em uma contratação. Uma página para apresentar seu trabalho e um perfil para sua presença local.</p>
            <a className="text-primary underline underline-offset-4" href="/signup?plan=site_gbp">Contratar por R$ 750</a>
          </article>
          <p className="text-sm text-muted-foreground">Criação e entrega pontual. Sem gestão contínua ou cobrança mensal.</p>
        </div>
      </div>
    </div>
  </section>
);
