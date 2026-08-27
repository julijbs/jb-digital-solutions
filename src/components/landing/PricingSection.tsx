import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, CreditCard, ShieldCheck, Clock, CheckCircle2, Zap } from "lucide-react";
import { SITE_NOVO, GESTAO_GOOGLE } from "@/config/pricing";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    key: "site_novo",
    name: SITE_NOVO.name,
    setupLabel: "Setup único",
    setupPrice: SITE_NOVO.setupPrice,
    monthlyLabel: "Presença Ativa · mensal",
    monthlyPrice: SITE_NOVO.monthlyPrice,
    featured: true,
    features: SITE_NOVO.features,
    cta: "Contratar Sistema Completo",
    badge: "Mais Escolhido",
  },
  {
    key: "gestao_google",
    name: GESTAO_GOOGLE.name,
    setupLabel: null,
    setupPrice: null,
    monthlyLabel: "Add-on opcional · mensal",
    monthlyPrice: GESTAO_GOOGLE.monthlyPrice,
    featured: false,
    features: GESTAO_GOOGLE.features,
    cta: "Adicionar Gestão Google",
    badge: "Otimização Contínua",
  },
];

const guarantees = [
  {
    icon: ShieldCheck,
    title: "Garantia de Aprovação",
    text: "Seu site só vai ao ar com 100% da sua aprovação na etapa de revisão no painel.",
  },
  {
    icon: Zap,
    title: "100% Assíncrono",
    text: "Sem reuniões ou calls longas. Tudo organizado e acompanhado no seu painel.",
  },
  {
    icon: Clock,
    title: "Entrega em 7 Dias",
    text: "Toda a infraestrutura configurada e no ar em até 7 dias úteis pós-onboarding.",
  },
  {
    icon: CreditCard,
    title: "Facilidade de Pagamento",
    text: "PIX ou Cartão em até 12x com ativação imediata do seu acesso.",
  },
];

export const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="planos" className="py-20 md:py-28 relative">
      <div className="section-divider mx-auto mb-20 max-w-xl" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            <Star size={12} className="fill-primary" /> Investimento Transparente
          </div>
          <h2 className="font-serif text-3xl md:text-4xl">
            Uma oferta clara, sem surpresas
          </h2>
          <p className="mt-4 text-muted-foreground">
            Um setup único para construir seu ecossistema. Uma mensalidade acessível para mantê-lo vivo, seguro e gerando pacientes.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-7 flex flex-col justify-between ${
                plan.featured
                  ? "glass-card border-primary/40 shadow-xl shadow-primary/10 ring-1 ring-primary/20"
                  : "glass-card"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-6 flex items-center gap-1.5 rounded-full gold-gradient-bg px-3.5 py-1 text-xs font-bold text-primary-foreground shadow-md">
                  <Star size={12} className="fill-primary-foreground" /> {plan.badge}
                </div>
              )}

              <div>
                <h3 className="font-serif text-2xl text-foreground">{plan.name}</h3>

                <div className="mt-4 space-y-2.5 rounded-xl bg-secondary/40 p-4 border border-border/50">
                  {plan.setupPrice && (
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">{plan.setupLabel}</span>
                      <span className="font-serif text-2xl text-primary font-semibold">{plan.setupPrice}</span>
                    </div>
                  )}
                  <div className={`flex items-baseline justify-between ${plan.setupPrice ? "border-t border-border/60 pt-2.5" : ""}`}>
                    <span className="text-xs text-muted-foreground">{plan.monthlyLabel}</span>
                    <span className="font-serif text-2xl text-primary font-semibold">{plan.monthlyPrice}</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-border/40">
                <Button
                  variant={plan.featured ? "hero" : "heroOutline"}
                  className="w-full gap-2 text-sm font-medium py-6"
                  onClick={() => navigate(`/signup?plan=${plan.key}`)}
                >
                  {plan.cta} <ArrowRight size={16} />
                </Button>
                <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
                  Início imediato · Onboarding guiado no painel
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security & Guarantees Grid */}
        <div className="mx-auto mt-14 max-w-4xl grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((g, i) => (
            <div key={i} className="rounded-xl border border-primary/15 bg-card/60 p-4.5 text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <g.icon size={18} className="text-primary shrink-0" />
                <h4 className="text-sm font-semibold text-foreground">{g.title}</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{g.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
