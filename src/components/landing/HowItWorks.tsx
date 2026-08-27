import { motion } from "framer-motion";
import { ClipboardList, Paintbrush, ThumbsUp, Rocket, Check } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "1. Você preenche o onboarding no seu tempo",
    text: "Sem reuniões ou formulários confusos. Você insere seus dados, serviços, fotos e horários direto no painel.",
  },
  {
    icon: Paintbrush,
    title: "2. Orquestramos todo o seu ecossistema (até 7 dias)",
    text: "Site one-page, Perfil Google otimizado, páginas programáticas por serviço/bairro e dados estruturados para as IAs.",
  },
  {
    icon: ThumbsUp,
    title: "3. Você revisa e aprova no seu painel",
    text: "Você visualiza o preview interativo e solicita ajustes pontuais se quiser. O site só vai ao ar após sua aprovação total.",
  },
  {
    icon: Rocket,
    title: "4. Seu sistema entra no ar e atrai pacientes",
    text: "Publicação instantânea, Google ativo e presença nas IAs pronta para recomendar seu consultório.",
  },
  {
    icon: Check,
    title: "5. Acompanhamento contínuo e relatórios ao vivo",
    text: "Monitore visualizações, ligações e cliques no seu painel em tempo real, com otimizações mensais.",
  },
];

const notes = [
  "100% Assíncrono · Sem reuniões de alinhamento",
  "Entrega: em até 7 dias úteis",
  "Revisões e ajustes inclusos antes do ar",
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
