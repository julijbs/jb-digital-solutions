import { motion } from "framer-motion";

const pains = [
  {
    title: "Prospecção manual que consome horas",
    text: "Pesquisar negócio por negócio no Google, anotar telefone em planilha, repetir o processo. Trabalho manual que escala zero.",
  },
  {
    title: "Sem critério de prioridade",
    text: "Não saber quais leads têm mais urgência: aqueles com site ruim? Sem avaliações? Sem site algum? Sem dados, a abordagem é genérica — e genérica não converte.",
  },
  {
    title: "Tempo perdido em leads desqualificados",
    text: "Abordar negócios que já têm presença digital forte ou que simplesmente não têm verba para investir. Cada contato errado é energia desperdiçada.",
  },
];

export const SeoPainPoints = () => (
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
          <span className="gold-gradient-text">O problema de prospectar localmente hoje</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Encontrar negócios com potencial de compra é trabalhoso, impreciso e caro em tempo.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {pains.map((pain, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="font-serif text-lg text-foreground">{pain.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pain.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
