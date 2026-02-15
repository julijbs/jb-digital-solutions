import { motion } from "framer-motion";
import { Search, Smartphone, DollarSign } from "lucide-react";

const pains = [
  {
    icon: Search,
    title: '"Ninguém me encontra no Google"',
    text: "Você investe tempo criando conteúdo, mas quando alguém procura pelo seu serviço na sua região, você simplesmente não aparece. É como se você não existisse.",
  },
  {
    icon: Smartphone,
    title: '"Dependo das redes sociais"',
    text: "Você sente que precisa postar todo dia para existir profissionalmente. Se parar de alimentar o algoritmo, desaparece. É exaustivo.",
  },
  {
    icon: DollarSign,
    title: '"Não tenho verba para marketing"',
    text: "Agências cobram mensalidades altas, sites prontos são genéricos e você não sabe por onde começar para ter uma presença digital profissional e acessível.",
  },
];

export const PainPoints = () => {
  return (
    <section id="problema" className="py-20 md:py-28">
      <div className="section-divider mx-auto mb-20 max-w-xl" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl">
            Talvez você reconheça esses sinais...
          </h2>
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
              <pain.icon size={28} className="mb-4 text-primary" />
              <h3 className="font-serif text-lg text-foreground">{pain.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pain.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-12 max-w-xl text-center text-lg text-primary"
        >
          E se existisse um caminho mais simples, ético e sustentável?
        </motion.p>
      </div>
    </section>
  );
};
