import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "Em menos de uma semana meu consultório aparecia no Google Maps. Recebi 3 novos pacientes no primeiro mês.",
    author: "Profissional de saúde — SP",
  },
  {
    text: "Entrega rápida, organizada e com padrão visual que passa confiança. Recomendo sem ressalvas.",
    author: "Terapeuta — RJ",
  },
  {
    text: "O painel me dá visão de tudo. Não preciso entender de tecnologia para acompanhar meu projeto.",
    author: "Dentista — MG",
  },
];

export const Testimonials = () => {
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
            Quem já usou, aprova
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6"
            >
              <Quote size={20} className="mb-4 text-primary/50" />
              <p className="text-sm leading-relaxed text-foreground">"{t.text}"</p>
              <p className="mt-4 text-xs text-muted-foreground">{t.author}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
