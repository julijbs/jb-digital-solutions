import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "O serviço foi impecável desde o início. Preenchi o formulário no meu tempo e, em menos de uma semana, o site estava exatamente como eu precisava para o meu nicho. Sem nenhuma reunião cansativa, tudo fluiu com muita clareza pelo painel. É uma agilidade que nunca vi em outra agência!",
    author: "Dra. Ariane Pontes",
    role: "Psicóloga Clínica — São Paulo/SP",
  },
  {
    text: "Fiquei impressionada com a velocidade da entrega e a qualidade técnica. Meu consultório passou a aparecer no topo do Google Maps e nas respostas do ChatGPT da minha região. Processo 100% assíncrono, prático e sem fricção!",
    author: "Dra. Camila Vasconcelos",
    role: "Cirurgiã Dentista — Campinas/SP",
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
            Profissionais que já transformaram sua presença digital
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card rounded-xl p-6"
            >
              <Quote size={24} className="mb-4 text-primary/40" />
              <p className="text-sm leading-relaxed text-foreground">"{t.text}"</p>
              <div className="mt-5">
                <p className="text-sm font-medium text-foreground">{t.author}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
