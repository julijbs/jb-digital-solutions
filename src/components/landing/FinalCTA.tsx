import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const badges = [
  "Entrega em 7 dias",
  "Hospedagem grátis para sempre",
  "Garantia de 7 dias",
];

export const FinalCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="container relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl"
        >
          <h2 className="font-serif text-3xl md:text-5xl">
            Você está a um passo de ter sua{" "}
            <span className="gold-gradient-text">presença digital profissional</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Pare de depender de algoritmos que mudam toda semana. Tenha seu próprio espaço, seja encontrado por quem realmente precisa de você e construa autoridade digital de forma ética e sustentável.
          </p>

          <div className="mt-8">
            <Button variant="hero" size="default" className="gap-2 text-sm md:text-base md:px-8 md:py-6" onClick={() => navigate("/signup")}>
              Começar minha Presença Google agora <ArrowRight size={16} />
            </Button>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-x-6">
            {badges.map((badge) => (
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
