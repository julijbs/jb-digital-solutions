import { motion } from "framer-motion";
import { Globe, MapPin, Link2 } from "lucide-react";

const cards = [
  {
    icon: Globe,
    title: "Presença nos Buscadores",
    subtitle: "Site + páginas estratégicas por serviço",
    text: "Construímos páginas específicas para cada serviço que você oferece e cada região que você atende. Assim, quando alguém busca sua especialidade no seu bairro, você aparece — não o concorrente.",
  },
  {
    icon: MapPin,
    title: "Perfil Google Completo",
    subtitle: "Visibilidade no mapa e nas buscas locais",
    text: "Seu Perfil da Empresa no Google configurado e otimizado — com avaliações visíveis, dados corretos e tudo integrado ao seu site. O paciente te encontra e te confia antes mesmo de ligar.",
  },
  {
    icon: Link2,
    title: "Acompanhamento Contínuo",
    subtitle: "Seu posicionamento monitorado todo mês",
    text: "O posicionamento orgânico precisa de cuidado constante. Monitoramos sua presença, ajustamos o que precisa e garantimos que você continue crescendo — sem você precisar entender de tecnologia.",
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
            <span className="gold-gradient-text">O Sistema Completo de Posicionamento</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Não vendemos apenas um site. Construímos toda a infraestrutura que faz pacientes
            encontrarem você organicamente — e mantemos ela funcionando, todo mês.
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
