import { motion } from "framer-motion";
import { Scale, Eye, HeartHandshake } from "lucide-react";

const pillars = [
  {
    icon: Scale,
    title: "Ética Profissional",
    text: "Total respeito às diretrizes do seu conselho profissional e às políticas do Google.",
  },
  {
    icon: Eye,
    title: "Transparência",
    text: "Sem promessas mirabolantes. Entregamos base técnica sólida, não milagres de tráfego.",
  },
  {
    icon: HeartHandshake,
    title: "Suporte Humanizado",
    text: "Atendimento próximo, claro e sem robotização. Você não é só mais um número.",
  },
];

export const GuaranteeSection = () => {
  return (
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
            Compromisso com ética e qualidade
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <p.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-serif text-lg text-foreground">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
