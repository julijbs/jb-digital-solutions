import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { PainPoints } from "@/components/landing/PainPoints";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Deliverables } from "@/components/landing/Deliverables";
import { QualitySection } from "@/components/landing/QualitySection";
import { Calculator } from "@/components/landing/Calculator";
import { ForYouSection } from "@/components/landing/ForYouSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Testimonials } from "@/components/landing/Testimonials";
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
        <HowItWorks />
        <Deliverables />
        <QualitySection />
        <Calculator />
        <ForYouSection />
        <PricingSection />
        <Testimonials />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
      <MobileCTA />
    </div>
  );
};

export default Index;
