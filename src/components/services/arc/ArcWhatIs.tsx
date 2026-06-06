import { motion } from "framer-motion";

const pillars = [
  {
    title: "Não para na estratégia.",
    subtitle: "A estratégia existe, mas vira execução: campanha escrita, configurada e pronta para disparar.",
  },
  {
    title: "Não é agência de marketing.",
    subtitle: "Sem pacote mensal fixo, sem relatório de alcance, sem custo garantido.",
  },
  {
    title: "É execução por performance.",
    subtitle: "Eu escrevo. Eu subo no seu CRM. Você dispara. Só pago se o caixa entrar.",
  },
];

export const ArcWhatIs = () => (
  <section className="py-20 md:py-28">
    <div className="section-divider mx-auto mb-20 max-w-xl" />
    <div className="container">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80 mb-6">
            O que é
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            O ARC™ faz o trabalho que você não tem tempo, equipe ou disposição para fazer.
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {pillars.map((pillar, i) => (
              <div key={i} className="glass-card rounded-xl p-5">
                <p className="font-medium text-foreground text-sm">{pillar.title}</p>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{pillar.subtitle}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Na prática funciona assim: analiso a sua base — principalmente clientes; leads
              qualificados quando fizer sentido — as ofertas disponíveis e o potencial real de
              receita. Crio um plano de ativação personalizado — o Diagnóstico ARC™ — entregue em
              documento antes de qualquer acordo. Escrevo as campanhas de email no seu tom e estilo,
              faço o upload direto na sua ferramenta de disparo e entrego tudo pronto. Você aprova e dispara.
            </p>
          </div>

          <div className="mt-6 glass-card rounded-xl p-5">
            <p className="text-sm text-muted-foreground">
              As campanhas são propriedade intelectual minha. Você não paga nada pelo trabalho.
              Paga apenas pelo resultado que eu gerar — e somente durante o período ativo de cada campanha.
            </p>
          </div>

          <div className="mt-4 rounded-xl border-l-2 border-primary glass-card p-5">
            <p className="font-medium text-foreground text-sm">
              Começamos com uma campanha de teste.
            </p>
            <p className="mt-1 text-sm text-primary">
              Se os resultados fizerem sentido para os dois lados, continuamos. Se não funcionar, você não pagou nada.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
