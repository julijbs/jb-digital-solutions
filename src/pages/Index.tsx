import { Header } from "@/components/landing/Header";
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
import { Footer } from "@/components/landing/Footer";
import { MobileCTA } from "@/components/landing/MobileCTA";
import { Helmet } from "react-helmet-async";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Preciso pagar hospedagem todo mês?",
      acceptedAnswer: { "@type": "Answer", text: "Não! A hospedagem já está inclusa no serviço e é gratuita para sempre. Zero mensalidade." },
    },
    {
      "@type": "Question",
      name: "Quanto tempo leva para ficar pronto?",
      acceptedAnswer: { "@type": "Answer", text: "Até 7 dias após você preencher o formulário de onboarding com suas informações." },
    },
    {
      "@type": "Question",
      name: "O que é AEO e por que isso importa?",
      acceptedAnswer: { "@type": "Answer", text: "AEO (Answer Engine Optimization) é a técnica que prepara sua presença digital para ser recomendada por IAs como ChatGPT, Gemini e Perplexity — além do Google tradicional." },
    },
    {
      "@type": "Question",
      name: "Eu consigo editar o site depois?",
      acceptedAnswer: { "@type": "Answer", text: "Sim! Você recebe acesso para fazer pequenas atualizações. Para mudanças maiores, podemos ajustar com custo adicional." },
    },
    {
      "@type": "Question",
      name: "O site vai aparecer no Google automaticamente?",
      acceptedAnswer: { "@type": "Answer", text: "O site é otimizado tecnicamente com SEO e AEO, mas o ranqueamento depende de fatores como concorrência local, conteúdo e avaliações. Entregamos a base técnica completa." },
    },
    {
      "@type": "Question",
      name: "Posso usar meu próprio domínio?",
      acceptedAnswer: { "@type": "Answer", text: "Sim! Você pode comprar seu domínio personalizado e nós configuramos. Custo adicional de R$ 100 (setup único)." },
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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>JB Digital Consulting — Presença Google + IA para Profissionais Liberais</title>
        <meta name="description" content="Site profissional otimizado para Google e IA (AEO). Seja encontrado e recomendado pelo Google, ChatGPT e Gemini. Entrega em 7 dias, sem mensalidade." />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      </Helmet>
      <Header />
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
      <Footer />
      <MobileCTA />
    </div>
  );
};

export default Index;
