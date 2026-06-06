import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const forItems = [
  "Agências e freelancers de marketing digital que prospectam PMEs locais",
  "Times de vendas de software, serviços ou SaaS com foco em negócios locais",
  "Consultores que precisam mapear oportunidades em uma cidade ou região",
  "Profissionais que querem abordar com dados concretos, não argumentos genéricos",
];

const notForItems = [
  "Quem busca prospecção nacional ou por segmento não-local",
  "Quem quer apenas uma lista de contatos sem análise de presença digital",
  "Empresas de e-commerce ou B2B sem foco em mercado local",
];

export const SeoForWho = () => (
  <section className="py-20 md:py-28">
    <div className="section-divider mx-auto mb-20 max-w-xl" />
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-14 max-w-2xl text-center"
      >
        <h2 className="font-serif text-3xl md:text-4xl">
          <span className="gold-gradient-text">Para quem é o SEO Local</span>
        </h2>
      </motion.div>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card-hover rounded-xl p-8"
        >
          <h3 className="mb-6 flex items-center gap-3 font-serif text-xl text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Check size={16} className="text-background" />
            </span>
            Para quem é
          </h3>
          <ul className="space-y-4">
            {forItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-8"
        >
          <h3 className="mb-6 flex items-center gap-3 font-serif text-xl text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <X size={16} className="text-muted-foreground" />
            </span>
            Para quem não é
          </h3>
          <ul className="space-y-4">
            {notForItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground/70">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);
