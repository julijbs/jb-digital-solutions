import { Helmet } from "react-helmet-async";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { HubHero } from "@/components/hub/HubHero";
import { ServicesGrid } from "@/components/hub/ServicesGrid";
import { HubCTA } from "@/components/hub/HubCTA";

const navItems = [
  { label: "Site + Google", href: "/servicos/site-gbp" },
];

const Index = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>JB Digital Solutions — Site + Google para negócios brasileiros</title>
      <meta
        name="description"
        content="Site profissional e Google Business Profile para negócios locais brasileiros. Entrega em até 7 dias, sem mensalidade. JB Digital Consulting."
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
