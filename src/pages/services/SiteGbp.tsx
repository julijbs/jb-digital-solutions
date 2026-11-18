import { Helmet } from "react-helmet-async";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection, faqs } from "@/components/landing/FAQSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { MobileCTA } from "@/components/landing/MobileCTA";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(faq => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a === "guarantee"
      ? "Você acompanha e aprova layout, textos e site final antes da publicação. Revisões estão incluídas no processo."
      : faq.a },
  })),
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "JB Digital Consulting",
  description: "Site profissional e criação ou otimização do Perfil Google para negócios locais brasileiros. Pagamento único, sem mensalidade.",
  url: "https://jbdigitalsystem.com",
  areaServed: "BR",
  serviceType: ["Criação de sites", "Criação ou otimização do Perfil Google"],
};

const navItems = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Serviços", href: "#planos" },
  { label: "FAQ", href: "#faq" },
];

const SiteGbp = () => (
  <div className="min-h-screen bg-background elegant-landing">
    <Helmet>
      <link rel="canonical" href="https://jbdigitalsystem.com/" />
      <title>Site e Perfil Google para Negócios Locais | JB Digital System</title>
      <meta
        name="description"
        content="Site profissional, criação ou otimização do Perfil Google e integração ao site para negócios locais. Sistema Completo ou GBP avulso, com pagamento único e sem mensalidade."
      />
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
    </Helmet>

    <SiteHeader
      navItems={navItems}
      ctaPrimary={{ label: "Ver investimento", href: "#planos" }}
    />

    <main>
      <HeroSection />
      <HowItWorks />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
    </main>

    <SiteFooter
      tagline="Sistema Completo: site + criação ou otimização e integração do GBP. Também disponível: GBP avulso. Sem mensalidade."
    />
    <MobileCTA />
  </div>
);

export default SiteGbp;
