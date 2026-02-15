import { motion } from "framer-motion";
import { Check } from "lucide-react";

const items = [
  "Você é psicólogo(a), terapeuta, nutricionista ou profissional liberal",
  "Atende presencialmente ou online e quer ser encontrado na sua região",
  "Ainda não tem um site ou seu site atual não te ajuda a atrair clientes",
  "Quer reduzir a dependência das redes sociais e ter um espaço seu",
  "Busca uma solução ética, profissional e sem complicação técnica",
  "Não quer (ou não pode) pagar mensalidades de hospedagem ou gestão",
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
            Esse serviço é para você se...
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
