import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const forYou = [
  "Profissional de saúde ou serviço local",
  "Quer aparecer quando procuram no Google",
  "Valoriza qualidade e posicionamento",
  "Prefere processo organizado a improviso",
  "Quer acompanhar tudo com transparência",
];

const notForYou = [
  "Busca promessas de resultado garantido",
  "Quer o site mais barato possível",
  "Não se importa com presença digital",
  "Prefere fazer tudo por conta própria",
  "Espera resultados sem consistência",
];

export const ForYouSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="section-divider mx-auto mb-20 max-w-xl" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl">
            É pra você?
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="mb-4 font-serif text-lg text-primary">É pra você se…</h3>
            <ul className="space-y-3">
              {forYou.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="mb-4 font-serif text-lg text-muted-foreground">Não é pra você se…</h3>
            <ul className="space-y-3">
              {notForYou.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <X size={16} className="mt-0.5 shrink-0 text-muted-foreground/50" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
