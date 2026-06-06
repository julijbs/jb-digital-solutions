import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Digite a busca",
    text: "Informe a categoria de negócio e a cidade. Ex: \"psicólogo São Paulo\".",
  },
  {
    num: "02",
    title: "Receba a lista",
    text: "O sistema consulta o Google Places e retorna até 20 resultados com dados completos de cada estabelecimento.",
  },
  {
    num: "03",
    title: "Analise o score",
    text: "Cada negócio é avaliado: site presente? Velocidade? Avaliações? Você vê quem tem maior oportunidade de melhoria.",
  },
  {
    num: "04",
    title: "Aborde com contexto",
    text: "Entre em contato com dados concretos — \"seu site carrega em 8 segundos\" é mais persuasivo do que qualquer script genérico.",
  },
];

export const SeoHowItWorks = () => (
  <section id="como-funciona" className="py-20 md:py-28">
    <div className="section-divider mx-auto mb-20 max-w-xl" />
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-14 max-w-2xl text-center"
      >
        <h2 className="font-serif text-3xl md:text-4xl">
          Como funciona na prática
        </h2>
      </motion.div>

      <div className="mx-auto max-w-3xl">
        <div className="relative">
          <div className="absolute left-6 top-8 bottom-8 w-px bg-border/50 hidden md:block" />
          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-6 glass-card rounded-xl p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-medium text-primary">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-serif text-lg text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
