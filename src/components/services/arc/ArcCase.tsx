import { motion } from "framer-motion";

const antes = [
  "Base de mais de 3.000 contatos sem comunicação há mais de 6 meses",
  "Oferta validada, mas sem campanha ativa para a base existente",
  "Dependência total de indicação e tráfego pago para novas vendas",
  "Margem sendo corroída pelo custo de aquisição de cliente novo",
];

const depois = [
  "Sequência de 4 emails escrita, configurada e disparada em 7 dias",
  "Reativação de compradores antigos com oferta de continuidade",
  "Primeiras respostas no dia 2 — clientes que queriam voltar, mas não tinham recebido uma oferta",
  "Resultado em caixa suficiente para validar o modelo e iniciar o ciclo contínuo",
];

export const ArcCase = () => (
  <section className="py-20 md:py-28">
    <div className="section-divider mx-auto mb-20 max-w-xl" />
    <div className="container">
      <div className="mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80 mb-6">Resultado</p>
          <h2 className="font-serif text-3xl md:text-4xl mb-10">O que acontece quando a base começa a ser ativada.</h2>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-border/50 flex flex-wrap gap-2">
              <span className="text-xs text-primary border border-primary/30 rounded-full px-3 py-1">Empresa de serviços — base acumulada em 4 anos</span>
              <span className="text-xs text-muted-foreground border border-border/50 rounded-full px-3 py-1">Campanha de reativação</span>
              <span className="text-xs text-muted-foreground border border-border/50 rounded-full px-3 py-1">14 dias</span>
            </div>
            <div className="px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs text-muted-foreground/60 uppercase tracking-widest mb-4">Situação antes</p>
                <ul className="space-y-3">
                  {antes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-muted-foreground text-sm">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40 mt-2 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-primary/60 uppercase tracking-widest mb-4">Resultado — ciclo de 14 dias</p>
                <ul className="space-y-3">
                  {depois.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-foreground/90 text-sm">
                      <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="px-6 py-5 border-t border-border/50 bg-card/40">
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                "A base estava parada há meses. A gente achava que estava morta. Na primeira semana de campanha já vieram respostas de pessoas que tinham comprado há mais de um ano e queriam retomar."
              </p>
              <p className="mt-3 text-xs text-muted-foreground/50">Cliente ARC™ — Empresa de serviços B2B</p>
            </div>
          </div>
          <p className="mt-6 text-xs text-muted-foreground/40 text-center">Dados representativos do primeiro ciclo de ativação. Resultados variam de acordo com tamanho e qualidade da base, oferta e contexto de mercado.</p>
        </motion.div>
      </div>
    </div>
  </section>
);
