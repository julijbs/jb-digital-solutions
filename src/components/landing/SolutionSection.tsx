import { motion } from "framer-motion";
import { Globe, MapPin, Link2 } from "lucide-react";

const cards = [
  {
    icon: Globe,
    title: "Site Profissional",
    subtitle: "Seu espaço digital próprio",
    text: "Um site elegante, rápido e otimizado para o Google te encontrar. Carrega em segundos, funciona perfeitamente no celular e transmite confiança profissional.\n\nSem WordPress, sem hospedagem paga, sem dor de cabeça.",
  },
  {
    icon: MapPin,
    title: "Google Meu Negócio",
    subtitle: "Visibilidade local no Google",
    text: "Quando alguém procurar pelo seu serviço na sua cidade, você aparece no mapa, com foto, telefone, endereço e avaliações. Tudo organizado e conectado ao seu site.",
  },
  {
    icon: Link2,
    title: "Conexão Técnica",
    subtitle: "Tudo integrado e consistente",
    text: 'Seu site e seu perfil no Google "conversam" entre si. Informações sincronizadas, dados corretos, apresentação profissional. O Google entende quem você é e te mostra para as pessoas certas.',
  },
];

export const SolutionSection = () => {
  return (
    <section id="solucao" className="py-20 md:py-28">
      <div className="section-divider mx-auto mb-20 max-w-xl" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-4 max-w-2xl text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl">
            <span className="gold-gradient-text">Presença Google Essencial</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            A base digital que profissionais liberais precisam para serem encontrados, confiarem e conectarem — sem complicação, sem mensalidade, sem depender de redes sociais.
          </p>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover rounded-xl p-6"
            >
              <card.icon size={28} className="mb-4 text-primary" />
              <h3 className="font-serif text-xl text-foreground">{card.title}</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-primary/80">{card.subtitle}</p>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
