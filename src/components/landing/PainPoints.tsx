import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const pains = [
  "Você até é bom — mas não aparece quando procuram no Google.",
  "Seu site não passa confiança ou nem existe.",
  "Seu Google Meu Negócio está incompleto (ou nem foi criado).",
  "Você perde pedidos por falta de avaliações e consistência.",
];

export const PainPoints = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="section-divider mx-auto mb-20 max-w-xl" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl">
            Se você depende do Instagram…
          </h2>
        </motion.div>

        <div className="mx-auto mt-12 max-w-xl space-y-4">
          {pains.map((pain, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card flex items-start gap-4 rounded-xl px-6 py-4"
            >
              <AlertCircle size={20} className="mt-0.5 shrink-0 text-primary" />
              <p className="text-muted-foreground">{pain}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mx-auto mt-10 max-w-xl text-center text-sm text-primary"
        >
          JB Digital OS organiza isso como sistema — não como improviso.
        </motion.p>
      </div>
    </section>
  );
};
