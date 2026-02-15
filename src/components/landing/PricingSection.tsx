import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, CreditCard, Gift, ShieldCheck } from "lucide-react";

const plans = [
  {
    name: "Site Profissional",
    tag: "Site Otimizado para Google",
    price: "R$ 597",
    featured: false,
    features: [
      "Site institucional one-page",
      "Otimização básica para SEO",
      "Hospedagem inclusa (sem mensalidade)",
      "Mobile-first e carregamento rápido",
      "Entrega em até 7 dias",
    ],
    cta: "Escolher Site",
  },
  {
    name: "Perfil da Empresa no Google",
    tag: "Perfil no Google",
    price: "R$ 597",
    featured: false,
    features: [
      "Criação/otimização do Perfil no Google",
      "Categorização estratégica",
      "Integração de dados (NAP)",
      "Configuração de horários e serviços",
      "Entrega em até 7 dias",
    ],
    cta: "Escolher Perfil no Google",
  },
  {
    name: "Presença Google Essencial",
    tag: "Pacote Completo — Site + Perfil no Google",
    price: "R$ 997",
    savings: "economize R$ 197",
    featured: true,
    features: [
      "Tudo do Site Profissional",
      "Tudo do Perfil no Google",
      "Conexão técnica entre site e perfil",
      "Dados sincronizados e consistentes",
      "Presença digital completa e profissional",
    ],
    cta: "Começar Agora — Pacote Completo",
  },
];

const badges = [
  { icon: CreditCard, text: "Pagamento via PIX ou Cartão (até 12x)" },
  { icon: Gift, text: "Hospedagem gratuita permanente incluída" },
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
            Escolha o que faz sentido para você agora
          </h2>
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
                  <Star size={12} /> Mais escolhido
                </div>
              )}

              <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {plan.tag}
              </div>
              <h3 className="font-serif text-2xl text-foreground">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-serif text-3xl text-primary">{plan.price}</span>
                {plan.savings && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {plan.savings}
                  </span>
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
                onClick={() => navigate("/signup")}
              >
                {plan.cta} <ArrowRight size={16} />
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {badges.map((b, i) => (
            <span key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <b.icon size={16} className="text-primary" />
              {b.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
