import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const trustBadges = [
  "Entrega em até 7 dias",
  "Hospedagem inclusa",
  "Sem mensalidades",
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
            Você merece ser encontrado por quem{" "}
            <span className="gold-gradient-text">realmente precisa de você</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Transforme sua presença digital em uma ferramenta de conexão verdadeira
            — sem depender de redes sociais, sem complicação técnica,
            sem gastar fortunas todo mês.
          </p>

          <div className="mt-10">
            <Button variant="hero" size="lg" className="gap-2 text-base" onClick={() => navigate("/signup")}>
              Quero minha Presença Google agora <ArrowRight size={18} />
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {trustBadges.map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check size={14} className="text-primary" />
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
