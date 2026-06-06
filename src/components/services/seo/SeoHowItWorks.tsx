import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Auditoria do site atual",
    text: "Faço uma análise técnica do seu site: velocidade, segurança, responsividade e estrutura de palavras-chave. Identifico exatamente o que está fazendo o Google esconder o seu negócio.",
  },
  {
    num: "02",
    title: "Diagnóstico personalizado",
    text: "Você recebe um vídeo ou relatório mostrando os problemas encontrados e o plano de ação para corrigi-los. Transparência total antes de qualquer compromisso.",
  },
  {
    num: "03",
    title: "Construção do novo site",
    text: "Seu site é reconstruído do zero — rápido, seguro, responsivo e estruturado com as palavras-chave certas para o seu serviço na sua cidade. Sem perder sua identidade.",
  },
  {
    num: "04",
    title: "Entrega e posicionamento",
    text: "Site no ar, Google Business Profile configurado e site enviado ao índice do Google. A partir daí, o Google começa a te encontrar — e os pedidos de orçamento chegam de quem te busca.",
  },
];

export const SeoHowItWorks = () => (
  <section id="como-funciona" className="py-20 md:py-28">
    <div className="section-divider mx-auto mb-20 max-w-xl" />
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-14 max-w-2xl text-center"
      >
        <h2 className="font-serif text-3xl md:text-4xl">Como funciona</h2>
      </motion.div>

      <div className="mx-auto max-w-3xl">
        <div className="relative">
          <div className="absolute left-6 top-8 bottom-8 w-px bg-border/50 hidden md:block" />
          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-6 glass-card rounded-xl p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-medium text-primary">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-serif text-lg text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
