import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { WHATSAPP_URL } from "@/config/contact";

const highlights = [
  "Sem depender de anúncio novo, lançamento ou mais conteúdo",
  "Clientes primeiro; leads qualificados quando fizer sentido",
  "Campanha de teste com risco reduzido para os dois lados",
];

export const ArcHero = () => (
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
            ARC™ · Ativação de Receita Contínua
          </span>
          <span className="h-px w-8 bg-primary md:w-12" />
        </div>

        <h1 className="font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
          Se o seu negócio já vende e tem base ativa,{" "}
          <span className="gold-gradient-text">provavelmente existe receita parada esperando uma campanha.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          O ARC™ é a operação de monetização da base: identifico a oportunidade com maior
          potencial de caixa, escrevo e configuro as campanhas no seu tom — e a minha remuneração
          vem do resultado que elas gerarem. Você não opera no dia a dia. E não paga nada adiantado.
        </p>

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-border/50 bg-card px-4 py-3 text-sm text-muted-foreground"
            >
              {item}
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
            Aplicar para diagnóstico ARC™ <ArrowRight size={16} />
          </Button>
          <p className="mt-4 text-xs text-muted-foreground/60">
            Para negócios com base estabelecida, oferta validada e abertura ao modelo por performance.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);
