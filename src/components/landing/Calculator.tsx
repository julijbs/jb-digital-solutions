import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator as CalcIcon } from "lucide-react";

export const Calculator = () => {
  const [ticket, setTicket] = useState("");
  const [meta, setMeta] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const t = parseFloat(ticket) || 0;
    const m = parseFloat(meta) || 0;
    setResult(t * m * 12);
  };

  return (
    <section className="py-20 md:py-28">
      <div className="section-divider mx-auto mb-20 max-w-xl" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-lg"
        >
          <div className="glass-card rounded-2xl p-8">
            <div className="mb-6 flex items-center gap-3">
              <CalcIcon size={22} className="text-primary" />
              <h2 className="font-serif text-2xl">Custo de oportunidade</h2>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Quanto você pode estar deixando de faturar por mês sem presença no Google?
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Ticket médio (R$)
                </label>
                <input
                  type="number"
                  value={ticket}
                  onChange={(e) => setTicket(e.target.value)}
                  placeholder="Ex.: 250"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Meta de novos clientes/mês
                </label>
                <input
                  type="number"
                  value={meta}
                  onChange={(e) => setMeta(e.target.value)}
                  placeholder="Ex.: 10"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <Button variant="hero" className="w-full gap-2" onClick={calculate}>
                Calcular <ArrowRight size={16} />
              </Button>

              {result !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-5 text-center"
                >
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Potencial anual estimado
                  </p>
                  <p className="mt-1 font-serif text-3xl text-primary">
                    R$ {result.toLocaleString("pt-BR")}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Investir em presença digital custa uma fração disso.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
