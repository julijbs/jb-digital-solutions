import { motion } from "framer-motion";

const pains = [
  {
    title: "Você está na 8ª página enquanto o concorrente leva todos os pedidos",
    text: "Quando alguém precisa do seu serviço no Google, clica nos primeiros resultados. Quem não aparece ali simplesmente não existe para esse cliente — e o orçamento vai para quem está à frente.",
  },
  {
    title: "Problemas técnicos que o Google penaliza em silêncio",
    text: "Site lento, sem HTTPS, não responsivo no celular — cada um desses problemas faz o Google empurrar seu site para trás. E enquanto esses problemas existem, nenhuma divulgação resolve.",
  },
  {
    title: "Cada dia sem aparecer é um cliente que foi para o concorrente",
    text: "Serviços de ticket alto têm margens que compensam investir em posicionamento. Um cliente a mais por mês pode representar R$ 2.000 a R$ 10.000 em faturamento — e ele foi para quem aparece antes de você.",
  },
];

export const SeoPainPoints = () => (
  <section className="py-20 md:py-28">
    <div className="section-divider mx-auto mb-20 max-w-xl" />
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-14 max-w-2xl text-center"
      >
        <h2 className="font-serif text-3xl md:text-4xl">
          <span className="gold-gradient-text">Por que bons negócios ficam invisíveis no Google</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Não é falta de qualidade no serviço. É falta de estrutura técnica no site.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {pains.map((pain, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="font-serif text-lg text-foreground">{pain.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pain.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
