import { motion } from "framer-motion";
import { Search, Code, TrendingUp } from "lucide-react";

const deliverables = [
  {
    icon: Search,
    title: "Diagnóstico técnico completo",
    text: "Análise do site atual: velocidade de carregamento, segurança HTTPS, responsividade mobile e estrutura de SEO. Você recebe um relatório claro mostrando exatamente por que o Google não te encontra.",
  },
  {
    icon: Code,
    title: "Site novo — construído do zero",
    text: "Seu site atual é substituído por um site profissional, rápido, seguro e otimizado para os critérios técnicos que o Google exige. Feito para transformar visita em pedido de orçamento.",
  },
  {
    icon: TrendingUp,
    title: "Posicionamento local no Google",
    text: "Estrutura de palavras-chave, meta tags, dados estruturados e Perfil da Empresa no Google configurados e conectados — para sua empresa aparecer quando buscam o seu serviço na sua cidade.",
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
          <span className="gold-gradient-text">O que você recebe</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Não é ajuste pontual no site atual. É um site novo, construído com a estrutura certa
          para o Google te encontrar e o cliente te contactar.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {deliverables.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover rounded-xl p-6"
          >
            <d.icon size={28} className="mb-4 text-primary" />
            <h3 className="font-serif text-xl text-foreground">{d.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{d.text}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mt-10 max-w-3xl rounded-xl border-l-2 border-primary glass-card p-6"
      >
        <p className="font-medium text-foreground">Sem mensalidade. Sem contrato longo.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          É um investimento pontual, feito uma vez para funcionar no longo prazo. Você não fica
          preso em contrato de manutenção mensal.
        </p>
      </motion.div>
    </div>
  </section>
);
