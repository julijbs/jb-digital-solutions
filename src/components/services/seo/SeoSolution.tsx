import { motion } from "framer-motion";
import { Search, BarChart2, Download } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Busca por categoria e cidade",
    text: "Pesquise \"vidraçaria Niterói\" ou \"dentista Belo Horizonte\" e receba uma lista completa de estabelecimentos com nome, endereço, telefone e avaliações do Google.",
  },
  {
    icon: BarChart2,
    title: "Análise de presença digital",
    text: "Cada negócio recebe um score de performance: site, velocidade de carregamento (PageSpeed), GBP configurado, quantidade de avaliações. Você sabe na hora quem precisa mais de você.",
  },
  {
    icon: Download,
    title: "Lista exportável e pronta para ação",
    text: "Ordene por oportunidade, filtre por critério e exporte a lista. Nenhum dado digitado manualmente — tudo direto da fonte: Google Places + PageSpeed Insights.",
  },
];

export const SeoSolution = () => (
  <section id="solucao" className="py-20 md:py-28">
    <div className="section-divider mx-auto mb-20 max-w-xl" />
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-14 max-w-2xl text-center"
      >
        <h2 className="font-serif text-3xl md:text-4xl">
          <span className="gold-gradient-text">Prospecção inteligente em 3 passos</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Uma ferramenta que faz em minutos o que levaria horas de pesquisa manual.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {features.map((feat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover rounded-xl p-6"
          >
            <feat.icon size={28} className="mb-4 text-primary" />
            <h3 className="font-serif text-xl text-foreground">{feat.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{feat.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
