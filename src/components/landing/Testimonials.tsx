import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "O serviço prestado pela Thaís foi excelente desde o primeiro contato. Como não tenho nenhuma experiência com as ferramentas e o que seria bom pro meu negócio, precisei de muita ajuda — e ela sempre foi muito prestativa e esclarecedora. O site saiu exatamente como pedi e, com a contribuição dela, ficou muito aderente ao meu nicho de trabalho. Além disso, todo o trabalho foi feito em colaboração comigo, num tempo recorde. É uma profissional que indico de olhos fechados!",
    author: "Dra. Ariane Pontes",
    role: "Psicóloga Clínica — São Paulo/SP",
  },
  {
    text: "Fiquei impressionada com a qualidade e a rapidez. Meu site ficou lindo, profissional e exatamente como eu imaginava. E sem pagar mensalidade!",
    author: "Aline E.",
    role: "Terapeuta Sistêmica — Campinas/SP",
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
