import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Loader2,
  Bot,
  MapPin,
  Globe,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FreeAuditSection = () => {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [vertical, setVertical] = useState("Psicologia");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [result, setResult] = useState<null | {
    score: number;
    business: string;
    city: string;
    gaps: { title: string; desc: string; severity: "high" | "med" | "low"; icon: any }[];
  }>(null);

  const stepsText = [
    "Consultando posicionamento no Google Maps...",
    "Varrendo respostas em ChatGPT, Gemini e Perplexity...",
    "Analisando autoridade local e Schema Markup...",
    "Compilando diagnóstico de presença digital...",
  ];

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !city || !contact) return;

    setLoading(true);
    setResult(null);
    setAnalyzingStep(0);

    const interval = setInterval(() => {
      setAnalyzingStep((prev) => {
        if (prev >= stepsText.length - 1) {
          clearInterval(interval);
          setLoading(false);
          // Set simulated realistic audit result based on vertical
          setResult({
            score: 43,
            business: businessName,
            city: city,
            gaps: [
              {
                title: "Invisível para IAs (AEO)",
                desc: "Seu consultório não possui Schema.org JSON-LD nem FAQs estruturadas, ficando de fora das recomendações do ChatGPT e Perplexity.",
                severity: "high",
                icon: Bot,
              },
              {
                title: "Gargalo no Google Maps",
                desc: "Falta de otimização de categorias secundárias, palavras-chave locais e fluxo ativo de avaliações estruturadas.",
                severity: "high",
                icon: MapPin,
              },
              {
                title: "Falta de Páginas por Procedimento",
                desc: "Sem páginas programáticas específicas para capturar buscas por bairros e especialidades específicas.",
                severity: "med",
                icon: Globe,
              },
            ],
          });
          return prev;
        }
        return prev + 1;
      });
    }, 700);
  };

  return (
    <section id="auditoria" className="py-20 md:py-28 relative">
      <div className="section-divider mx-auto mb-20 max-w-xl" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            <Sparkles size={12} className="text-primary" /> Diagnóstico Instantâneo
          </div>
          <h2 className="font-serif text-3xl md:text-4xl">
            Descubra como seu consultório é visto pelo Google e pelas IAs
          </h2>
          <p className="mt-4 text-muted-foreground text-sm sm:text-base">
            Faça uma auditoria gratuita e veja os principais gargalos que estão fazendo você perder pacientes para concorrentes locais.
          </p>
        </motion.div>

        <div className="mx-auto max-w-2xl">
          {!result && !loading && (
            <motion.form
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              onSubmit={handleAudit}
              className="glass-card rounded-2xl p-6 sm:p-8 space-y-4.5 border border-primary/20 shadow-xl"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="audit-business" className="text-xs text-foreground font-medium">
                    Nome do seu consultório ou clínica
                  </Label>
                  <Input
                    id="audit-business"
                    placeholder="Ex.: Consultório Dra. Maria"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    className="bg-background/50 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="audit-city" className="text-xs text-foreground font-medium">
                    Cidade / Bairro onde atende
                  </Label>
                  <Input
                    id="audit-city"
                    placeholder="Ex.: São Paulo, Pinheiros"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="bg-background/50 text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="audit-vertical" className="text-xs text-foreground font-medium">
                    Sua especialidade
                  </Label>
                  <select
                    id="audit-vertical"
                    value={vertical}
                    onChange={(e) => setVertical(e.target.value)}
                    className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Psicologia">Psicologia</option>
                    <option value="Odontologia">Odontologia</option>
                    <option value="Nutrição">Nutrição</option>
                    <option value="Fisioterapia">Fisioterapia</option>
                    <option value="Medicina">Medicina / Clínica</option>
                    <option value="Outro">Outra especialidade</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="audit-contact" className="text-xs text-foreground font-medium">
                    Seu WhatsApp ou E-mail
                  </Label>
                  <Input
                    id="audit-contact"
                    placeholder="(11) 99999-9999 ou seu@email.com"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    className="bg-background/50 text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button variant="hero" type="submit" className="w-full gap-2 text-sm sm:text-base py-6">
                  <Search size={16} /> Gerar Diagnóstico Gratuito
                </Button>
                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  Análise 100% gratuita · Sem necessidade de cartão
                </p>
              </div>
            </motion.form>
          )}

          {loading && (
            <div className="glass-card rounded-2xl p-10 text-center space-y-5 border border-primary/20">
              <Loader2 size={36} className="animate-spin text-primary mx-auto" />
              <div>
                <h3 className="font-serif text-xl text-foreground">Analisando sua presença online...</h3>
                <p className="text-xs text-muted-foreground mt-1">Isso leva apenas alguns segundos</p>
              </div>
              <div className="space-y-2 max-w-sm mx-auto text-left text-xs text-muted-foreground">
                {stepsText.map((text, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {idx < analyzingStep ? (
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    ) : idx === analyzingStep ? (
                      <Loader2 size={14} className="animate-spin text-primary shrink-0" />
                    ) : (
                      <span className="h-3.5 w-3.5 rounded-full border border-border shrink-0" />
                    )}
                    <span className={idx === analyzingStep ? "text-foreground font-medium" : ""}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border border-primary/30 shadow-2xl shadow-primary/5"
            >
              <div className="flex items-start justify-between flex-wrap gap-4 border-b border-border/50 pb-5">
                <div>
                  <span className="text-xs text-muted-foreground">Diagnóstico Preliminar</span>
                  <h3 className="font-serif text-xl sm:text-2xl text-foreground mt-0.5">
                    {result.business}
                  </h3>
                  <p className="text-xs text-muted-foreground">{result.city} · {vertical}</p>
                </div>
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                  <AlertTriangle size={24} className="text-red-400" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Score Geral</span>
                    <p className="font-serif text-2xl font-bold text-red-400 leading-none">{result.score}<span className="text-xs font-sans text-muted-foreground font-normal">/100</span></p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Gargalos Críticos Encontrados:
                </h4>
                {result.gaps.map((gap, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3.5"
                  >
                    <gap.icon size={18} className="text-red-400 mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-foreground">{gap.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{gap.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3 text-center">
                <h4 className="font-serif text-lg text-foreground">
                  Como resolver esses gargalos em até 7 dias?
                </h4>
                <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  O <strong>JB Digital System</strong> constrói a infraestrutura técnica completa do seu consultório (Site + Google Maps + Presença em IA) de forma 100% assíncrona.
                </p>
                <Button
                  variant="hero"
                  size="default"
                  className="w-full gap-2 text-sm sm:text-base py-6"
                  onClick={() => navigate("/signup?plan=site_novo")}
                >
                  Contratar Sistema Completo e Resolver Tudo <ArrowRight size={16} />
                </Button>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors underline pt-1 block mx-auto"
                >
                  Fazer outra análise
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
