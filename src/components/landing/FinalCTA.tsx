import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const FinalCTA = () => {
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
            Se o seu negócio é bom,
            <br />
            <span className="gold-gradient-text">ele precisa ser encontrável.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            O JB Digital OS organiza sua presença no Google com padrão premium — sem burocracia.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button variant="hero" size="lg" className="gap-2">
              Começar agora <ArrowRight size={18} />
            </Button>
            <Button variant="heroOutline" size="lg">
              Ver planos
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground/60">
            Onboarding guiado. Você acompanha tudo pelo painel.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
