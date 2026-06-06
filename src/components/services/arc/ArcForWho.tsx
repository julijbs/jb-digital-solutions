import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const forItems = [
  "Negócios com base própria de clientes — lista de email, CRM ou cadastro com pelo menos 2.000 contatos",
  "Empresas com oferta validada e ticket que funciona, mas que não exploram a base que já têm",
  "Prestadores de serviço, consultores, infoprodutores ou empresas com clientes que compraram e pararam de receber atenção",
  "Quem entende que pagar por resultado é mais inteligente do que contratar consultoria por hora",
];

const notForItems = [
  "Negócios que ainda estão construindo a primeira base de clientes",
  "Quem não tem lista de email ou base com pelo menos 2.000 contatos ativos",
  "Quem quer agência de marketing, produção de conteúdo ou gestão de redes sociais",
  "Quem quer misturar múltiplas frentes antes de gerar caixa com o que já tem",
];

export const ArcForWho = () => (
  <section className="py-20 md:py-28">
    <div className="section-divider mx-auto mb-20 max-w-xl" />
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto mb-14 max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80 mb-4">Perfil</p>
        <h2 className="font-serif text-3xl md:text-4xl"><span className="gold-gradient-text">Para quem é o ARC™</span></h2>
        <p className="mt-4 text-muted-foreground">
          Para negócios que já têm base de clientes ativa e querem monetizá-la — sem pagar tráfego, sem novo lançamento.
        </p>
      </motion.div>
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card-hover rounded-xl p-8">
          <h3 className="mb-6 flex items-center gap-3 font-serif text-xl text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary"><Check size={16} className="text-background" /></span>
            Para quem é
          </h3>
          <ul className="space-y-4">
            {forItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-muted-foreground/70">Se o negócio já vende, já tem base e a oferta funciona — existe matéria-prima real para o ARC™ trabalhar.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-8">
          <h3 className="mb-6 flex items-center gap-3 font-serif text-xl text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"><X size={16} className="text-muted-foreground" /></span>
            Para quem não é
          </h3>
          <ul className="space-y-4">
            {notForItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground/70">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />{item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-muted-foreground/50">A exclusão faz parte da estratégia. O objetivo é ser aderente ao cliente certo — não parecer acessível para todos.</p>
        </motion.div>
      </div>
    </div>
  </section>
);
