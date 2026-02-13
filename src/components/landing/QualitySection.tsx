import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const seals = [
  "Core Web Vitals pronto para otimização",
  "Estrutura de headings correta",
  "Schema LocalBusiness / ProfessionalService",
  "Imagens otimizadas",
  "Mobile-first",
];

export const QualitySection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="section-divider mx-auto mb-20 max-w-xl" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="text-center font-serif text-3xl md:text-4xl">
            Padrão de qualidade
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            O objetivo é ser encontrado e transmitir confiança — sem site pesado e sem "cara de template".
          </p>

          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            {seals.map((seal, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 rounded-lg border border-border/50 px-5 py-3"
              >
                <CheckCircle2 size={18} className="shrink-0 text-primary" />
                <span className="text-sm text-foreground">{seal}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
