import { motion } from "framer-motion";
import { Check } from "lucide-react";

const items = [
  "Você é nutricionista, psicólogo(a), fisioterapeuta, fonoaudiólogo(a), médico(a) ou terapeuta",
  "Atende presencialmente e quer que pacientes da sua cidade te encontrem no Google",
  "Sua agenda ainda depende muito de indicação e você quer mudar isso",
  "Não tem site — ou tem um que não aparece no Google e não traz ninguém",
  "Não quer pagar agência todo mês nem aprender a mexer em ferramentas técnicas",
  "Quer ter presença profissional real sem depender de stories e algoritmo",
];

export const ForYouSection = () => {
  return (
    <section id="para-quem" className="py-20 md:py-28">
      <div className="section-divider mx-auto mb-20 max-w-xl" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl">
            Este serviço foi feito para você se...
          </h2>
        </motion.div>

        <div className="mx-auto max-w-xl space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-4 rounded-xl px-2 py-1"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md gold-gradient-bg">
                <Check size={14} className="text-primary-foreground" />
              </div>
              <p className="text-muted-foreground">{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
