import { Helmet } from "react-helmet-async";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { HeroSection } from "@/components/landing/HeroSection";
import { PainPoints } from "@/components/landing/PainPoints";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { AEOSection } from "@/components/landing/AEOSection";
import { GBPReviewsWidget } from "@/components/landing/GBPReviewsWidget";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ForYouSection } from "@/components/landing/ForYouSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Testimonials } from "@/components/landing/Testimonials";
import { GuaranteeSection } from "@/components/landing/GuaranteeSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { MobileCTA } from "@/components/landing/MobileCTA";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Como funciona o pagamento?",
      acceptedAnswer: { "@type": "Answer", text: "Existem dois valores: o setup único do Site Novo, que constrói todo o sistema, e a Presença Ativa, a mensalidade que mantém o site no ar, atualizado e monitorado. A Gestão de Google é um add-on opcional, contratado à parte. Aceitamos PIX e cartão em até 12x." },
    },
    {
      "@type": "Question",
      name: "Quanto tempo leva para ficar pronto?",
      acceptedAnswer: { "@type": "Answer", text: "Até 7 dias após você preencher o formulário de onboarding com suas informações." },
    },
    {
      "@type": "Question",
      name: "O que é AEO e por que isso importa?",
      acceptedAnswer: { "@type": "Answer", text: "AEO (Answer Engine Optimization) é a técnica que prepara sua presença digital para ser recomendada por IAs como ChatGPT, Gemini e Perplexity — além do Google tradicional. Quando alguém pede uma indicação de dentista, médico ou psicólogo para uma IA, você precisa aparecer como resposta." },
    },
    {
      "@type": "Question",
      name: "Eu consigo editar o site depois?",
      acceptedAnswer: { "@type": "Answer", text: "Sim! Você recebe acesso para fazer pequenas atualizações. Para mudanças maiores, podemos ajustar com custo adicional." },
    },
    {
      "@type": "Question",
      name: "Minha clínica vai aparecer no Google após o setup?",
      acceptedAnswer: { "@type": "Answer", text: "O sistema é otimizado tecnicamente para isso, mas o ranqueamento orgânico cresce com o tempo — depende de fatores como concorrência local e volume de avaliações. Entregamos a base técnica completa e acompanhamos seu crescimento mensalmente." },
    },
    {
      "@type": "Question",
      name: "Posso usar meu próprio domínio?",
      acceptedAnswer: { "@type": "Answer", text: "Sim! Você pode adquirir seu domínio personalizado (ex: draanacardoso.com.br) e nós configuramos. Custo adicional de R$ 100 (taxa única de configuração)." },
    },
  ],
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "JB Digital Consulting",
  description: "Presença digital profissional para profissionais liberais — sites otimizados para Google e IA (AEO), Perfil da Empresa no Google e estruturação de dados.",
  url: "https://jbdigitalsystem.com",
  areaServed: "BR",
  serviceType: ["Web Design", "SEO", "AEO", "Google Business Profile Management"],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "47",
  },
};

const navItems = [
  { label: "O Sistema", href: "#solucao" },
  { label: "Presença em IA", href: "#aeo" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Planos", href: "#planos" },
  { label: "FAQ", href: "#faq" },
];

const SiteGbp = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Sistema de Posicionamento Online para Profissionais de Saúde | JB Digital System</title>
      <meta
        name="description"
        content="Site + Perfil Google + Presença em IA para dentistas, médicos, psicólogos, nutricionistas e profissionais de saúde. Sistema completo que atrai pacientes de forma orgânica. Setup em até 7 dias."
      />
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
    </Helmet>

    <SiteHeader
      navItems={navItems}
      ctaSecondary={{ label: "Ver planos", href: "#planos" }}
      ctaPrimary={{ label: "Quero atrair mais pacientes", href: "/signup" }}
    />

    <main>
      <HeroSection />
      <PainPoints />
      <SolutionSection />
      <AEOSection />
      <GBPReviewsWidget />
      <HowItWorks />
      <ForYouSection />
      <PricingSection />
      <Testimonials />
      <GuaranteeSection />
      <FAQSection />
      <FinalCTA />
    </main>

    <SiteFooter
      tagline="Sistema completo de posicionamento online para profissionais de saúde — site, Perfil Google e IA trabalhando juntos para atrair mais pacientes organicamente."
    />
    <MobileCTA />
  </div>
);

export default SiteGbp;
