import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { WHATSAPP_URL } from "@/config/contact";

const badges = [
  "Prospecção baseada em dados reais do Google",
  "Análise de presença digital automatizada",
  "Sem contrato de longo prazo",
];

export const SeoHero = () => (
  <section className="relative overflow-hidden pt-28 pb-16 md:pt-40 md:pb-28">
    <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

    <div className="container relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
          SEO Local — JB Digital Solutions
        </p>
        <h1 className="font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
          Encontre negócios locais{" "}
          <span className="gold-gradient-text">antes de qualquer concorrente.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Ferramenta de prospecção que mapeia estabelecimentos na sua cidade, analisa a presença
          digital de cada um e entrega uma lista qualificada — com notas de performance, telefone
          e endereço — em minutos.
        </p>

        <div className="mt-10">
          <Button
            variant="hero"
            size="default"
            className="gap-2 text-sm md:text-base md:px-8 md:py-6"
            onClick={() => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")}
          >
            Falar sobre SEO Local <ArrowRight size={16} />
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
