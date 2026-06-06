import { motion } from "framer-motion";

const outcomes = [
  "Clientes que compraram uma vez voltam a comprar — sem você fazer nada",
  "Leads antigos que nunca converteram entram em uma sequência que trabalha por você",
  "Você para de depender de lançamento ou campanha pontual para gerar caixa",
  "O LTV da sua base cresce sem crescer o custo de aquisição",
  "Uma campanha que funciona em outubro ainda funciona em março — sem reescrever nada",
];

export const ArcOutcomes = () => (
  <section className="py-20 md:py-28">
    <div className="section-divider mx-auto mb-20 max-w-xl" />
    <div className="container">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80 mb-6">
            Resultados
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-4">
            O que muda quando a base começa a trabalhar para você
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed mb-10">
            O ganho não é só financeiro. O negócio deixa de tratar a base como arquivo morto
            e passa a enxergar uma fonte de receita recorrente, previsível e crescente — sem
            precisar investir mais em aquisição.
          </p>
        </motion.div>

        <div className="space-y-4">
          {outcomes.map((outcome, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover flex items-center gap-4 rounded-xl p-5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-medium text-primary">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-foreground/90">{outcome}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 border-t border-border/50 pt-8">
          <p className="text-muted-foreground">
            Não é sobre aparecer mais.{" "}
            <span className="font-medium text-primary">
              É sobre fazer a base que você já conquistou finalmente trabalhar para você.
            </span>
          </p>
        </div>
      </div>
    </div>
  </section>
);
