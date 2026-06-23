import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Globe, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Site + Google",
    subtitle: "Presença Google Essencial",
    text: "Site profissional otimizado para IA, Perfil da Empresa no Google configurado e conectado. Entrega em até 7 dias, hospedagem inclusa, sem mensalidade.",
    href: "/servicos/site-gbp",
    cta: "Ver planos",
  },
];

export const ServicesGrid = () => (
  <section id="solucoes" className="py-20 md:py-28">
    <div className="section-divider mx-auto mb-20 max-w-xl" />
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-14 max-w-2xl text-center"
      >
        <h2 className="font-serif text-3xl md:text-4xl">
          <span className="gold-gradient-text">Soluções para cada etapa</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Desde a primeira presença digital até a ativação da receita da base que você já conquistou.
        </p>
      </motion.div>

      <div className="mx-auto flex max-w-sm justify-center gap-6">
        {services.map((svc, i) => (
          <motion.div
            key={svc.href}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={svc.href}
              className="glass-card-hover flex h-full flex-col rounded-xl p-6 no-underline"
            >
              <svc.icon size={28} className="mb-4 text-primary" />
              <h3 className="font-serif text-xl text-foreground">{svc.title}</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-primary/80">
                {svc.subtitle}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {svc.text}
              </p>
              <span className="mt-6 flex items-center gap-1.5 text-sm font-medium text-primary">
                {svc.cta} <ArrowRight size={14} />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
