import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const trustBadges = [
  "Entrega em até 7 dias",
  "Hospedagem inclusa para sempre",
  "Sem mensalidades",
  "Visível no Google Maps",
];

export const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-40 md:pb-28">
      <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
            Seu consultório aparece no Google quando{" "}
            <span className="gold-gradient-text">o paciente está procurando por você</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Para nutricionistas, psicólogos, fisioterapeutas e profissionais de saúde que
            atendem presencialmente — e ainda dependem de indicação para lotar a agenda.
          </p>

          <div className="mt-10">
            <Button variant="hero" size="default" className="gap-2 text-sm md:text-base md:px-8 md:py-6" onClick={() => navigate("/signup")}>
              Quero aparecer no Google agora <ArrowRight size={16} />
            </Button>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-x-6">
            {trustBadges.map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check size={14} className="shrink-0 text-primary" />
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
