import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dashboardMockup from "@/assets/dashboard-mockup.png";

const highlights = [
  { icon: Zap, label: "Setup em poucos dias" },
  { icon: Shield, label: "Site leve + SEO local" },
  { icon: BarChart3, label: "Checklist técnico" },
  { icon: ArrowRight, label: "Painel + Relatórios" },
];

export const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden pt-28 pb-12 md:pt-36 md:pb-20">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="container relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
              Presença Google,{" "}
              <span className="gold-gradient-text">do jeito certo.</span>
              <br />
              Em poucos dias.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Site leve + Perfil no Google (Maps) + automações de reputação — com tudo organizado no painel da JB Digital Consulting.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button variant="hero" size="lg" className="gap-2" onClick={() => navigate("/signup")}>
                Começar agora <ArrowRight size={18} />
              </Button>
              <Button variant="heroOutline" size="lg" onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}>
                Ver como funciona
              </Button>
            </div>

            <p className="mt-6 text-xs tracking-wide text-muted-foreground/70 uppercase">
              Entrega produtizada • Sem burocracia • Padrão premium
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card overflow-hidden rounded-2xl p-1">
              <img
                src={dashboardMockup}
                alt="Painel JB Digital — acompanhamento de projetos"
                className="w-full rounded-xl"
                loading="lazy"
              />
            </div>
            <div className="pointer-events-none absolute -inset-4 rounded-3xl border border-primary/10" />
          </motion.div>
        </div>

        {/* Highlight bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {highlights.map((h, i) => (
            <div
              key={i}
              className="glass-card flex items-center gap-3 rounded-xl px-5 py-4"
            >
              <h.icon size={20} className="shrink-0 text-primary" />
              <span className="text-sm font-medium text-foreground">{h.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
