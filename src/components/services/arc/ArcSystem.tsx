import { motion } from "framer-motion";

export const ArcSystem = () => (
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
            Entrega
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-8">
            Você não paga pela hora. Você paga pelo resultado.
          </h2>

          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              A entrada não começa por consultoria abstrata nem por projeto fechado com escopo fixo.
            </p>
            <p>
              Ela começa pela campanha com maior potencial de caixa na base existente. Identifico
              qual é essa campanha, escrevo, configuro na ferramenta do cliente e entrego pronta
              para disparar. O modelo é orientado a resultado: minha remuneração é uma fatia do
              que for gerado, e somente durante o período ativo de cada campanha.
            </p>
            <p>
              Isso significa que meu incentivo é o mesmo que o seu: fazer a campanha funcionar de
              verdade. Se não funcionar, você não pagou hora de consultoria.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="glass-card rounded-xl p-5">
              <p className="font-medium text-foreground text-sm mb-2">Primeira campanha</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ativação de base latente, reativação de clientes ou conversão de leads antigos.
                Resultado esperado em 14 a 30 dias.
              </p>
            </div>
            <div className="glass-card rounded-xl p-5">
              <p className="font-medium text-foreground text-sm mb-2">Ciclo contínuo</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sequências recorrentes, automações e campanhas sazonais rodando de forma
                independente e previsível.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border-l-2 border-primary glass-card p-5">
            <p className="font-medium text-foreground text-sm">
              Receita primeiro.
            </p>
            <p className="mt-1 text-sm text-primary">
              Estrutura contínua depois, no ritmo que o negócio pede.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
