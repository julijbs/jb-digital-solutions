import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/config/contact";

const prereqs = [
  "Oferta validada com vendas ativas",
  "Base própria para ativar (mínimo 2.000 contatos)",
  "Abertura ao modelo 100% por performance",
];

export const ArcFinalCTA = () => (
  <section className="py-20 md:py-28">
    <div className="section-divider mx-auto mb-20 max-w-xl" />
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-2xl text-center">
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-8 bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">Próximo Passo</span>
          <span className="h-px w-8 bg-primary" />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl leading-tight">
          Se você tem base e oferta funcionando,{" "}
          <span className="gold-gradient-text">provavelmente tem receita parada esperando uma campanha.</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Aplicar não é comprar. É verificar se existe oportunidade real. Se existir, mostro no
          Diagnóstico ARC™ — com análise da sua base e o que faria nas primeiras campanhas — antes de qualquer acordo.
        </p>
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 text-left">
          {prereqs.map((item) => (
            <div key={item} className="glass-card rounded-lg px-4 py-3 text-sm text-muted-foreground">{item}</div>
          ))}
        </div>
        <div className="mt-10">
          <Button variant="hero" size="default" className="gap-2 text-sm md:text-base md:px-8 md:py-6"
            onClick={() => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")}>
            <MessageCircle size={18} /> Aplicar para diagnóstico ARC™
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);
