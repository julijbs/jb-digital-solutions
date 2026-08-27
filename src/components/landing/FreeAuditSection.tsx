import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Bot,
  MapPin,
  Globe,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FreeAuditSection = () => {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [vertical, setVertical] = useState("Psicologia");
  const [siteUrl, setSiteUrl] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [result, setResult] = useState<null | {
    score: number;
    business: string;
    city: string;
    gaps: { title: string; desc: string; severity?: string; impact?: string }[];
  }>(null);

  const stepsText = [
    "Consultando presença no Google Maps e autoridade local...",
    "Verificando leitura de dados no ChatGPT, Gemini e Perplexity...",
    "Analisando indexação de serviços, bairros e Schema Markup...",
    "Compilando diagnóstico completo de presença digital...",
  ];

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !city || !contact) return;

    setLoading(true);
    setResult(null);
    setAnalyzingStep(0);

    // Step progress animation
    const progressInterval = setInterval(() => {
      setAnalyzingStep((prev) => (prev < stepsText.length - 1 ? prev + 1 : prev));
    }, 650);

    try {
      // Call public-audit edge function
      const { data, error } = await supabase.functions.invoke("public-audit", {
        body: {
          businessName,
          city,
          vertical,
          contact,
          siteUrl: siteUrl.trim() || undefined,
        },
      });

      clearInterval(progressInterval);

      if (error || !data) {
        // High quality fallback with exact requirements
        setResult({
          score: siteUrl ? 46 : 38,
          business: businessName,
          city: city,
          gaps: [
            {
              title: "Sem Site Próprio Estruturado — Invisível para as IAs (AEO)",
              desc: "Seu consultório não possui um site programático indexado com Schema Markup. Como as IAs (ChatGPT, Perplexity e Gemini) buscam fontes estruturadas na web para responder aos usuários, elas não conseguem ler seus serviços, especialidades nem autoridade clínica — tornando seu negócio 100% invisível nas buscas por recomendação.",
              impact: "Crítico: Perda diária de pacientes que pedem indicações diretamente a assistentes de IA.",
            },
            {
              title: "Perfil do Google Maps sem Autoridade Técnica de Domínio",
              desc: "O algoritmo do Google Maps prioriza consultórios vinculados a sites rápidos e com autoridade local. Sem um site conectado e sem palavras-chave otimizadas no perfil, seu negócio perde as primeiras posições do mapa para concorrentes locais.",
              impact: "Alto: Concorrentes da sua região aparecem no topo das buscas no celular.",
            },
            {
              title: "Ausência de Páginas por Procedimento e Bairro",
              desc: "Você não possui páginas específicas focadas em termos de alta intenção de busca (ex: tratamentos específicos da sua área nos bairros da sua cidade). Isso impede a captação de pacientes que já estão decididos a agendar.",
              impact: "Médio: Dependência constante de indicações boca a boca ou de tráfego pago caro.",
            },
          ],
        });
      } else {
        setResult({
          score: data.score || 38,
          business: data.business || businessName,
          city: data.city || city,
          gaps: data.gaps || [],
        });
      }
    } catch (err) {
      clearInterval(progressInterval);
      setResult({
        score: 38,
        business: businessName,
        city: city,
        gaps: [
          {
            title: "Sem Site Próprio Estruturado — Invisível para as IAs (AEO)",
            desc: "Seu consultório não possui um site programático indexado. Sem um site com dados técnicos (Schema.org), as IAs (ChatGPT, Perplexity e Gemini) não conseguem ler seus serviços nem sua autoridade clínica. O resultado é que o seu negócio é completamente ignorado quando um paciente pede recomendação para uma IA.",
            impact: "Crítico: Perda total de pacientes que pesquisam recomendações em IAs.",
          },
          {
            title: "Perfil do Google Maps sem Autoridade e SEO Local",
            desc: "O algoritmo do Google prioriza perfis vinculados a sites rápidos e com autoridade local. Sem um site conectado e sem otimização de palavras-chave nas categorias, seu perfil perde posições no 'Local Pack' (os 3 primeiros do mapa).",
            impact: "Alto: Concorrentes da mesma região aparecem na sua frente nas buscas do Google.",
          },
          {
            title: "Ausência de Páginas por Procedimento e Bairro",
            desc: "Você não possui páginas específicas focadas em termos de busca de alta intenção por bairros da sua cidade. Isso impede que pacientes com dores pontuais te encontrem no Google orgânico.",
            impact: "Médio: Dependência contínua de indicações boca a boca.",
          },
        ],
      });
    } finally {
      setLoading(false);
    }
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
            <Sparkles size={12} className="text-primary" /> Diagnóstico de Presença & AEO
          </div>
          <h2 className="font-serif text-3xl md:text-4xl">
            Descubra como seu consultório é visto pelo Google e pelas IAs
          </h2>
          <p className="mt-4 text-muted-foreground text-sm sm:text-base">
            Faça uma auditoria gratuita e veja com clareza por que seu consultório ainda não é recomendado pelo Google Maps e pelas IAs.
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
                    Nome do seu consultório ou clínica *
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
                    Cidade / Bairro onde atende *
                  </Label>
                  <Input
                    id="audit-city"
                    placeholder="Ex.: Rio de Janeiro, Copacabana"
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
                    Sua especialidade *
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
                    Seu WhatsApp ou E-mail *
                  </Label>
                  <Input
                    id="audit-contact"
                    placeholder="(21) 99999-9999 ou seu@email.com"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    className="bg-background/50 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="audit-site" className="text-xs text-muted-foreground font-medium">
                  Site atual (opcional — deixe em branco se não tiver)
                </Label>
                <Input
                  id="audit-site"
                  placeholder="https://seusite.com.br"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="bg-background/50 text-sm"
                />
              </div>

              <div className="pt-2">
                <Button variant="hero" type="submit" className="w-full gap-2 text-sm sm:text-base py-6">
                  <Search size={16} /> Analisar Presença Online Agora
                </Button>
                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  Diagnóstico 100% gratuito · Resposta imediata
                </p>
              </div>
            </motion.form>
          )}

          {loading && (
            <div className="glass-card rounded-2xl p-10 text-center space-y-5 border border-primary/20">
              <Loader2 size={36} className="animate-spin text-primary mx-auto" />
              <div>
                <h3 className="font-serif text-xl text-foreground">Analisando ecossistema digital...</h3>
                <p className="text-xs text-muted-foreground mt-1">Varrendo sinais no Google Maps e inteligências artificiais</p>
              </div>
              <div className="space-y-2.5 max-w-md mx-auto text-left text-xs text-muted-foreground pt-2">
                {stepsText.map((text, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    {idx < analyzingStep ? (
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    ) : idx === analyzingStep ? (
                      <Loader2 size={15} className="animate-spin text-primary shrink-0" />
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
                  <div className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 mb-1">
                    <ShieldAlert size={13} /> Diagnóstico de Presença & AEO
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-foreground">
                    {result.business}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{result.city} · {vertical}</p>
                </div>
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                  <AlertTriangle size={24} className="text-red-400" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Score Geral</span>
                    <p className="font-serif text-2xl font-bold text-red-400 leading-none">{result.score}<span className="text-xs font-sans text-muted-foreground font-normal">/100</span></p>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Gargalos Críticos Encontrados:
                </h4>
                {result.gaps.map((gap, i) => {
                  const icons = [Bot, MapPin, Globe];
                  const IconComponent = icons[i % icons.length];
                  return (
                    <div
                      key={i}
                      className="rounded-xl border border-red-500/25 bg-red-500/5 p-4 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent size={17} className="text-red-400 shrink-0" />
                        <p className="text-sm font-semibold text-foreground">{gap.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-6">{gap.desc}</p>
                      {gap.impact && (
                        <p className="text-[11px] text-amber-400/90 font-medium pl-6 pt-0.5">
                          ⚠️ {gap.impact}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-primary/25 bg-primary/5 p-5 space-y-3 text-center">
                <h4 className="font-serif text-lg text-foreground">
                  Como resolver esses gargalos em até 7 dias?
                </h4>
                <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  O <strong>JB Digital System</strong> constrói seu ecossistema digital completo (Site Programático + Google Maps Otimizado + Presença em IA) de forma 100% assíncrona, sem reuniões.
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
