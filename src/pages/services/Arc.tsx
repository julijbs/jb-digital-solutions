import { Helmet } from "react-helmet-async";
import { WHATSAPP_URL } from "@/config/contact";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ArcHero } from "@/components/services/arc/ArcHero";
import { ArcPain } from "@/components/services/arc/ArcPain";
import { ArcWhatIs } from "@/components/services/arc/ArcWhatIs";
import { ArcOutcomes } from "@/components/services/arc/ArcOutcomes";
import { ArcSystem } from "@/components/services/arc/ArcSystem";
import { ArcForWho } from "@/components/services/arc/ArcForWho";
import { ArcCase } from "@/components/services/arc/ArcCase";
import { ArcFinalCTA } from "@/components/services/arc/ArcFinalCTA";

const navItems = [
  { label: "O que é", href: "#o-que-e" },
  { label: "Para quem", href: "#perfil" },
  { label: "← Soluções", href: "/" },
];

const Arc = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>ARC™ — Ativação de Receita Contínua | JB Digital Solutions</title>
      <meta
        name="description"
        content="Metodologia proprietária de monetização da base estabelecida. Campanhas de email done-for-you, modelo 100% por performance — você não paga nada adiantado."
      />
    </Helmet>

    <SiteHeader
      navItems={navItems}
      ctaPrimary={{ label: "Aplicar para diagnóstico", href: WHATSAPP_URL }}
    />

    <main>
      <ArcHero />
      <ArcPain />
      <ArcWhatIs />
      <ArcOutcomes />
      <ArcSystem />
      <ArcForWho />
      <ArcCase />
      <ArcFinalCTA />
    </main>

    <SiteFooter tagline="ARC™ — Ativação de Receita Contínua. Modelo por performance, execução done-for-you." />
  </div>
);

export default Arc;
