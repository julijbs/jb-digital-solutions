import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

const plans = [
  {
    name: "Essencial",
    tag: "Setup",
    price: "R$ 997",
    period: "único",
    featured: true,
    features: [
      "Site one-page leve com SEO local",
      "Google Business Profile (criar/otimizar)",
      "Checklist técnico completo",
      "Dashboard do cliente",
      "Entrega organizada (handoff pack)",
    ],
    cta: "Quero o Essencial",
    note: "Prazo: poucos dias (após onboarding)",
  },
  {
    name: "Crescimento",
    tag: "Mensal",
    price: "R$ 297",
    period: "/mês",
    featured: false,
    features: [
      "Relatório mensal de performance",
      "Rotina de avaliações (pedido + respostas)",
      "Pequenas atualizações (limite mensal)",
      "Suporte por painel",
    ],
    cta: "Ativar Crescimento",
    note: "Requer plano Essencial",
  },
  {
    name: "Premium SEO",
    tag: "Local",
    price: "A partir de R$ 12.000",
    period: "",
    featured: false,
    features: [
      "Para nichos disputados",
      "Negócios estruturados",
      "Estratégia personalizada",
      "Consultoria dedicada",
    ],
    cta: "Aplicar para o Premium",
    note: "Análise prévia obrigatória",
  },
];

export const PricingSection = () => {
  return (
    <section id="planos" className="py-20 md:py-28">
      <div className="section-divider mx-auto mb-20 max-w-xl" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl">Planos</h2>
          <p className="mt-4 text-muted-foreground">
            Escolha o que faz sentido para o seu momento.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-6 ${
                plan.featured
                  ? "glass-card border-primary/30 shadow-lg shadow-primary/10"
                  : "glass-card"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-6 flex items-center gap-1 rounded-full gold-gradient-bg px-3 py-1 text-xs font-semibold text-primary-foreground">
                  <Star size={12} /> Mais popular
                </div>
              )}

              <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {plan.tag}
              </div>
              <h3 className="font-serif text-2xl text-foreground">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-serif text-3xl text-primary">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                )}
              </div>

              <ul className="mt-6 space-y-2.5">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.featured ? "hero" : "heroOutline"}
                className="mt-6 w-full gap-2"
              >
                {plan.cta} <ArrowRight size={16} />
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground/60">{plan.note}</p>
            </motion.div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-xs text-muted-foreground/70">
          Resultados variam conforme nicho, concorrência e consistência. A JB entrega estrutura e processo.
        </p>
      </div>
    </section>
  );
};
