import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { PainPoints } from "@/components/landing/PainPoints";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ForYouSection } from "@/components/landing/ForYouSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Testimonials } from "@/components/landing/Testimonials";
import { GuaranteeSection } from "@/components/landing/GuaranteeSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { MobileCTA } from "@/components/landing/MobileCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <PainPoints />
        <SolutionSection />
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
