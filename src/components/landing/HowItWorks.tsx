import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Onboarding guiado",
    desc: "Preencha um formulário rápido (espelho do Google). Em 3 minutos você tem o mínimo; o resto é opcional.",
  },
  {
    num: "02",
    title: "Implementação",
    desc: "Criamos seu site leve + perfil no Google Maps otimizado com estrutura de SEO local.",
  },
  {
    num: "03",
    title: "Validação técnica",
    desc: "Checklist completo: headings, schema, performance, metas, NAP no rodapé, imagens otimizadas.",
  },
  {
    num: "04",
    title: "Rotina de crescimento",
    desc: "Relatórios mensais, gestão de avaliações e atualizações — para quem quer consistência.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-20 md:py-28">
      <div className="section-divider mx-auto mb-20 max-w-xl" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl">
            Como funciona
          </h2>
          <p className="mt-4 text-muted-foreground">
            Método em 4 passos. Sem burocracia.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover rounded-xl p-6"
            >
              <span className="font-serif text-2xl text-primary">{step.num}</span>
              <h3 className="mt-2 font-serif text-xl text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
