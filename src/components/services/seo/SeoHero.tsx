import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { WHATSAPP_URL } from "@/config/contact";

const problems = [
  "Site lento que o Google penaliza",
  "Sem HTTPS — o Google marca como inseguro",
  "Aparece na 8ª página enquanto o concorrente leva o pedido",
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
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-8 bg-primary md:w-12" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            SEO Local — JB Digital Solutions
          </span>
          <span className="h-px w-8 bg-primary md:w-12" />
        </div>

        <h1 className="font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
          O seu concorrente aparece no Google.{" "}
          <span className="gold-gradient-text">Os pedidos de orçamento vão para ele.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Empresas locais com serviços de ticket alto perdem clientes todos os dias para concorrentes
          que aparecem na primeira página — não porque oferecem um serviço melhor, mas porque o
          Google os encontra primeiro.
        </p>

        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
          {problems.map((p) => (
            <div
              key={p}
              className="rounded-lg border border-border/50 bg-card px-4 py-3 text-sm text-muted-foreground"
            >
              {p}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Button
            variant="hero"
            size="default"
            className="gap-2 text-sm md:text-base md:px-8 md:py-6"
            onClick={() => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")}
          >
            Quero saber se estou perdendo clientes <ArrowRight size={16} />
          </Button>
          <p className="mt-4 text-xs text-muted-foreground/60">
            Diagnóstico gratuito — mostro exatamente o que está impedindo o Google de te encontrar.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);
