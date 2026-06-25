import { motion } from "framer-motion";
import { Star, MapPin, ExternalLink } from "lucide-react";

const reviews = [
  {
    name: "Camila R.",
    rating: 5,
    text: "Profissional incrível! Me ajudou a entender meus padrões de comportamento. Super recomendo.",
    date: "2 semanas atrás",
  },
  {
    name: "Lucas M.",
    rating: 5,
    text: "Atendimento acolhedor e pontual. Senti confiança desde a primeira sessão.",
    date: "1 mês atrás",
  },
  {
    name: "Fernanda S.",
    rating: 5,
    text: "Excelente profissional. O espaço é lindo e o atendimento online funciona perfeitamente.",
    date: "3 semanas atrás",
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < count ? "fill-primary text-primary" : "text-muted-foreground/30"}
      />
    ))}
  </div>
);

export const GBPReviewsWidget = () => {
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
            Sua reputação{" "}
            <span className="gold-gradient-text">trabalhando por você</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Seus pacientes já te recomendam. Configuramos seu Perfil Google para que essas
            avaliações apareçam com destaque nas buscas — a prova social que converte antes
            mesmo do paciente entrar em contato.
          </p>
        </motion.div>

        {/* Mockup widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-lg"
        >
          <div className="glass-card rounded-2xl p-6">
            {/* Header do widget */}
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full gold-gradient-bg">
                <MapPin size={22} className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-foreground">Exemplo de Perfil</h3>
                <div className="flex items-center gap-2">
                  <Stars count={5} />
                  <span className="text-xs text-muted-foreground">5.0 · 47 avaliações</span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border/50 bg-secondary/20 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                        {review.name[0]}
                      </div>
                      <span className="text-sm font-medium text-foreground">{review.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <Stars count={review.rating} />
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    "{review.text}"
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-center gap-1 text-xs text-primary">
              <ExternalLink size={12} />
              <span>Visualizar no Google Maps</span>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-8 max-w-lg text-center text-sm text-muted-foreground"
        >
          Integramos suas avaliações reais do Google diretamente ao seu site — para que o
          paciente veja sua reputação no momento em que está decidindo a quem confiar sua saúde.
        </motion.p>
      </div>
    </section>
  );
};
