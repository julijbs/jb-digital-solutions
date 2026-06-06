import { motion } from "framer-motion";

const painItems = [
  "deixa dinheiro parado na base que já conquistou",
  "depende de lançamento ou campanha pontual para gerar caixa",
  "não tem uma rotina consistente de monetização por email",
  "sente que cada novo resultado exige começar tudo de novo",
];

export const ArcPain = () => (
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
            Diagnóstico
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            Todo negócio digital tem duas fontes de receita.{" "}
            <span className="gold-gradient-text">A maioria só usa uma.</span>
          </h2>

          <div className="mt-8 space-y-5 text-muted-foreground">
            <p className="text-base leading-relaxed">
              A primeira é a <strong className="text-foreground">frente de captação</strong>: anúncio, conteúdo, lançamento, tráfego.
              Caro, cansativo, imprevisível. Você concorre com todo mundo pelo mesmo clique.
            </p>
            <p className="text-base leading-relaxed">
              A segunda é a <strong className="text-foreground">base estabelecida</strong>: clientes que já compraram, leads que nunca
              converteram, contatos que pararam de receber atenção. Custo zero para acessar.
              Potencial que a maioria deixa apodrecer.
            </p>
            <p className="font-medium text-foreground">Mas ainda assim, a maioria dos negócios:</p>
          </div>

          <ul className="mt-4 space-y-3">
            {painItems.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 text-sm text-muted-foreground"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </motion.li>
            ))}
          </ul>

          <div className="mt-10 rounded-xl border-l-2 border-primary glass-card p-6">
            <p className="font-medium text-foreground">
              Um comprador compra de novo.
            </p>
            <p className="mt-2 text-sm text-primary">
              É até 7 vezes mais barato vender para quem já te conhece do que conquistar um cliente novo.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              O problema é que ativar essa base exige campanhas de email consistentes — e isso demanda
              tempo, habilidade e dedicação que a maioria dos donos de negócio simplesmente não tem.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
