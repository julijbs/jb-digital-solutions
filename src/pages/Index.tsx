import { Helmet } from "react-helmet-async";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { HubHero } from "@/components/hub/HubHero";
import { ServicesGrid } from "@/components/hub/ServicesGrid";
import { HubCTA } from "@/components/hub/HubCTA";

const navItems = [
  { label: "Site + Google", href: "/servicos/site-gbp" },
  { label: "SEO Local", href: "/servicos/seo-local" },
  { label: "ARC™", href: "/servicos/arc" },
];

const Index = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>JB Digital Solutions — Site, SEO Local e ARC™ para negócios brasileiros</title>
      <meta
        name="description"
        content="Três soluções para crescer com estratégia: Site + Google, prospecção SEO local e ativação de receita por performance. JB Digital Consulting."
      />
    </Helmet>

    <SiteHeader
      navItems={navItems}
      ctaSecondary={{ label: "Entrar", href: "/login" }}
      ctaPrimary={{ label: "Começar agora", href: "#solucoes" }}
    />

    <main>
      <HubHero />
      <ServicesGrid />
      <HubCTA />
    </main>

    <SiteFooter />
  </div>
);

export default Index;
