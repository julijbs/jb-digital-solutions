import { motion } from "framer-motion";
import { ClipboardList, Paintbrush, ThumbsUp, Rocket, Check } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Você responde um formulário simples",
    text: "Informações sobre você, seu trabalho, sua forma de atender.",
  },
  {
    icon: Paintbrush,
    title: "Criamos sua presença digital (3–5 dias)",
    text: "Site profissional + Google Meu Negócio configurado e otimizado.",
  },
  {
    icon: ThumbsUp,
    title: "Você aprova e ajusta (se necessário)",
    text: "Garantimos que tudo esteja do jeito que você precisa.",
  },
  {
    icon: Rocket,
    title: "Você recebe tudo pronto para usar",
    text: "Site no ar, Google configurado, você sendo encontrado.",
  },
];

const notes = [
  "Prazo: até 7 dias após o onboarding",
  "Comunicação: via WhatsApp e painel do cliente",
  "Revisões: incluídas no processo",
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
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl">Como funciona na prática?</h2>
        </motion.div>

        <div className="mx-auto max-w-2xl space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card flex items-start gap-5 rounded-xl px-6 py-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gold-gradient-bg text-sm font-bold text-primary-foreground">
                {i + 1}
              </div>
              <div>
                <h3 className="font-serif text-lg text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {notes.map((note) => (
            <span key={note} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Check size={14} className="text-primary" />
              {note}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
