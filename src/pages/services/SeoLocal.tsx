import { Helmet } from "react-helmet-async";
import { WHATSAPP_URL } from "@/config/contact";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SeoHero } from "@/components/services/seo/SeoHero";
import { SeoPainPoints } from "@/components/services/seo/SeoPainPoints";
import { SeoSolution } from "@/components/services/seo/SeoSolution";
import { SeoHowItWorks } from "@/components/services/seo/SeoHowItWorks";
import { SeoForWho } from "@/components/services/seo/SeoForWho";
import { SeoFinalCTA } from "@/components/services/seo/SeoFinalCTA";

const navItems = [
  { label: "Solução", href: "#solucao" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "← Soluções", href: "/" },
];

const SeoLocal = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>SEO Local — Prospecção de Negócios Locais | JB Digital Solutions</title>
      <meta
        name="description"
        content="Ferramenta de prospecção que mapeia negócios na sua cidade, analisa presença digital e entrega uma lista qualificada com score de performance em minutos."
      />
    </Helmet>

    <SiteHeader
      navItems={navItems}
      ctaPrimary={{ label: "Falar com a equipe", href: WHATSAPP_URL }}
    />

    <main>
      <SeoHero />
      <SeoPainPoints />
      <SeoSolution />
      <SeoHowItWorks />
      <SeoForWho />
      <SeoFinalCTA />
    </main>

    <SiteFooter tagline="Prospecção local inteligente — dados reais do Google para abordagens que convertem." />
  </div>
);

export default SeoLocal;
