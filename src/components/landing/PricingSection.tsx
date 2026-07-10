import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, CreditCard, ShieldCheck, Clock } from "lucide-react";
import { SITE_NOVO, GESTAO_GOOGLE } from "@/config/pricing";
import { WHATSAPP_URL } from "@/config/contact";

const plans = [
  {
    name: SITE_NOVO.name,
    setupLabel: "Setup único",
    setupPrice: SITE_NOVO.setupPrice,
    monthlyLabel: "Presença Ativa · mensal",
    monthlyPrice: SITE_NOVO.monthlyPrice,
    featured: true,
    features: SITE_NOVO.features,
    cta: "Falar agora",
  },
  {
    name: GESTAO_GOOGLE.name,
    setupLabel: null,
    setupPrice: null,
    monthlyLabel: "Add-on opcional · mensal",
    monthlyPrice: GESTAO_GOOGLE.monthlyPrice,
    featured: false,
    features: GESTAO_GOOGLE.features,
    cta: "Quero o add-on",
  },
];

const badges = [
  { icon: CreditCard, text: "Pagamento via PIX ou Cartão (até 12x)" },
  { icon: Clock, text: "Setup em até 7 dias" },
  { icon: ShieldCheck, text: "Processo de aprovação em etapas — revisões incluídas" },
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
          <h2 className="font-serif text-3xl md:text-4xl">
            Uma oferta, sem letra miúda
          </h2>
          <p className="mt-4 text-muted-foreground">
            Um setup para construir o site. Uma mensalidade para mantê-lo vivo e no topo.
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
                  <Star size={12} /> Nossa oferta
                </div>
              )}

              <h3 className="font-serif text-2xl text-foreground">{plan.name}</h3>

              <div className="mt-4 space-y-2 rounded-xl bg-secondary/30 p-4">
                {plan.setupPrice && (
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground">{plan.setupLabel}</span>
                    <span className="font-serif text-xl text-primary">{plan.setupPrice}</span>
                  </div>
                )}
                <div className={`flex items-baseline justify-between ${plan.setupPrice ? "border-t border-border/40 pt-2" : ""}`}>
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
                asChild
              >
                <a
                  href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Olá! Tenho interesse no ${plan.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {plan.cta} <ArrowRight size={16} />
                </a>
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
