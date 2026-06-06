import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export const HubHero = () => (
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
          JB Digital Solutions
        </p>
        <h1 className="font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
          Ser encontrado. Ganhar clientes.{" "}
          <span className="gold-gradient-text">Ativar receita.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Três soluções complementares para negócios brasileiros que querem crescer com
          estratégia — sem depender de redes sociais, sem pagar por resultado que não chegou.
        </p>

        <div className="mt-10">
          <Button
            variant="hero"
            size="default"
            className="gap-2 text-sm md:text-base md:px-8 md:py-6"
            onClick={() =>
              document.getElementById("solucoes")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Conheça as soluções <ArrowDown size={16} />
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);
