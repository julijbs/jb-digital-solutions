import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const forItems = [
  "Aluguel de gerador, caminhão pipa, andaime, caçamba, banheiro químico",
  "Detetive particular, empresa de energia solar, aluguel de som para eventos",
  "Qualquer serviço local de ticket alto que depende de ser encontrado no Google",
  "Negócios com site existente que não aparecem bem nas buscas locais",
];

const notForItems = [
  "Negócios que ainda não têm site (veja o serviço Site + Google)",
  "E-commerce ou negócios sem foco em mercado local",
  "Empresas que já aparecem na primeira página para suas buscas principais",
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
          <span className="gold-gradient-text">Para quem é esse serviço</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Focado em negócios locais com serviços de alto valor que perdem clientes por não aparecerem no Google.
        </p>
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
          <p className="mt-6 text-xs text-muted-foreground/70">
            Se o seu serviço vale mais de R$ 1.000 por cliente e você depende de ser encontrado na sua região, o SEO Local foi feito para você.
          </p>
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
