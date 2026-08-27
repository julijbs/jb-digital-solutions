import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const trustBadges = [
  "Setup em até 7 dias úteis",
  "100% Assíncrono · Sem reuniões",
  "Site + Google + IA integrados",
  "Aprovação total antes de ir ao ar",
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
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-6">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Infraestrutura Completa de Presença Online em 7 Dias
          </div>

          <h1 className="font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
            Você é excelente no que faz.{" "}
            <span className="gold-gradient-text">Mas quem precisa de você ainda não te encontra online.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            O JB Digital System constrói seu ecossistema digital completo — site otimizado, Perfil Google
            e presença nas respostas de IAs — tudo integrado de forma <strong>100% assíncrona</strong>, para que novos pacientes te encontrem
            organicamente, todo dia, sem reuniões e sem perda de tempo.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="hero" size="default" className="gap-2 text-sm md:text-base md:px-8 md:py-6 w-full sm:w-auto" onClick={() => navigate("/signup?plan=site_novo")}>
              Iniciar Meu Projeto <ArrowRight size={16} />
            </Button>
            <a href="#auditoria" className="w-full sm:w-auto">
              <Button variant="outline" size="default" className="gap-2 text-sm md:text-base md:px-6 md:py-6 w-full">
                Fazer Auditoria Gratuita
              </Button>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {trustBadges.map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
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
