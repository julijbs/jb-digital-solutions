import { motion } from "framer-motion";
import { Search, Smartphone, DollarSign } from "lucide-react";

const pains = [
  {
    icon: Search,
    title: '"Alguém procurou minha especialidade aqui perto — e não me achou"',
    text: "Você estudou anos para isso. Tem resultado real com seus pacientes. Mas quando alguém abre o Google e digita sua especialidade e sua cidade, aparece o concorrente — não você.",
  },
  {
    icon: Smartphone,
    title: '"Minha agenda ainda depende muito de indicação"',
    text: "Indicação é ótima. Mas ela seca quando você menos espera. E aí você volta a postar nas redes, fazer stories, torcer para o algoritmo ajudar — sem previsibilidade nenhuma.",
  },
  {
    icon: DollarSign,
    title: '"Tenho avaliações incríveis — mas elas ficam escondidas"',
    text: "Seus pacientes te recomendam. Mas quando alguém pesquisa online, essas avaliações não aparecem com destaque — ou não aparecem de jeito nenhum. Sua reputação não está trabalhando por você.",
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
            Isso soa familiar?
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
          O problema não é a sua competência. É que o Google não sabe que você existe.
        </motion.p>
      </div>
    </section>
  );
};
