import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, CreditCard, ShieldCheck, Clock } from "lucide-react";

const plans = [
  {
    name: "Essencial",
    setupLabel: "Setup único",
    setupPrice: "R$ 600",
    monthlyLabel: "Acompanhamento mensal",
    monthlyPrice: "R$ 150/mês",
    featured: false,
    features: [
      "Perfil Google completo e otimizado",
      "Schema de avaliações (estrelas visíveis no Google)",
      "Presença estruturada para as IAs",
      "Monitoramento mensal do perfil",
      "Relatório mensal de posicionamento",
    ],
    cta: "Começar com o Essencial",
  },
  {
    name: "Premium",
    setupLabel: "Setup único",
    setupPrice: "R$ 1.200",
    monthlyLabel: "Acompanhamento mensal",
    monthlyPrice: "R$ 350/mês",
    featured: true,
    features: [
      "Tudo do plano Essencial",
      "Site programático com páginas por serviço e bairro",
      "Dezenas de páginas otimizadas para buscas locais",
      "Otimização avançada para IAs (AEO)",
      "Relatório mensal de posições no Google",
    ],
    cta: "Começar com o Premium",
  },
];

const badges = [
  { icon: CreditCard, text: "Pagamento via PIX ou Cartão (até 12x)" },
  { icon: Clock, text: "Setup em até 7 dias" },
  { icon: ShieldCheck, text: "Processo de aprovação em etapas — revisões incluídas" },
];

export const PricingSection = () => {
  const navigate = useNavigate();
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
          <h2 className="font-serif text-3xl md:text-4xl">
            O sistema completo em dois tamanhos
          </h2>
          <p className="mt-4 text-muted-foreground">
            Cada plano inclui setup inicial e acompanhamento mensal contínuo.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
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
                  <Star size={12} /> Mais completo
                </div>
              )}

              <h3 className="font-serif text-2xl text-foreground">{plan.name}</h3>

              <div className="mt-4 space-y-2 rounded-xl bg-secondary/30 p-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">{plan.setupLabel}</span>
                  <span className="font-serif text-xl text-primary">{plan.setupPrice}</span>
                </div>
                <div className="flex items-baseline justify-between border-t border-border/40 pt-2">
                  <span className="text-xs text-muted-foreground">{plan.monthlyLabel}</span>
                  <span className="font-serif text-xl text-primary">{plan.monthlyPrice}</span>
                </div>
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
                onClick={() => navigate("/signup")}
              >
                {plan.cta} <ArrowRight size={16} />
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-x-8">
          {badges.map((b, i) => (
            <span key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <b.icon size={16} className="shrink-0 text-primary" />
              {b.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
