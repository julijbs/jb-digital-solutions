import { motion } from "framer-motion";
import { ClipboardList, Paintbrush, ThumbsUp, Rocket, Check } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Você responde um formulário simples",
    text: "Nos conta sobre você, sua especialidade, onde atende e como prefere ser encontrado. Sem complicação.",
  },
  {
    icon: Paintbrush,
    title: "Construímos todo o seu sistema (até 7 dias)",
    text: "Site, Perfil Google completo, páginas por serviço e bairro, estrutura para as IAs — tudo configurado e integrado.",
  },
  {
    icon: ThumbsUp,
    title: "Você aprova antes de publicar",
    text: "Revisamos juntos em etapas. Só publicamos quando você estiver 100% satisfeito.",
  },
  {
    icon: Rocket,
    title: "Seu sistema entra no ar e começa a trabalhar",
    text: "Site publicado, Google ativo, presença nas IAs estruturada — tudo rodando para atrair pacientes.",
  },
  {
    icon: Check,
    title: "Acompanhamento mensal para manter o crescimento",
    text: "Monitoramos sua posição todo mês, ajustamos o que precisa e garantimos que você continue crescendo.",
  },
];

const notes = [
  "Setup: até 7 dias após o onboarding",
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

        <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-x-6">
          {notes.map((note) => (
            <span key={note} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Check size={14} className="shrink-0 text-primary" />
              {note}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
