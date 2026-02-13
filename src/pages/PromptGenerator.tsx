import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Sparkles } from "lucide-react";

const verticals = [
  { value: "psicologo", label: "Psicólogo(a)", emoji: "🧠" },
  { value: "dentista", label: "Dentista", emoji: "🦷" },
  { value: "terapeuta", label: "Terapeuta", emoji: "🌿" },
];

const generatePrompt = (vertical: string, data: Record<string, string>) => {
  const disclaimers: Record<string, string> = {
    psicologo: `OBRIGATÓRIO: Incluir disclaimer "Este site não substitui atendimento de emergência. Em caso de crise, ligue 188 (CVV) ou procure o CAPS mais próximo."`,
    dentista: `OBRIGATÓRIO: Linguagem clínica ética. Seção antes/depois só com assets reais; caso contrário usar "Resultados e expectativas".`,
    terapeuta: `OBRIGATÓRIO: Linguagem acolhedora sem prometer cura clínica. Incluir aviso "A terapia complementar não substitui cuidados médicos ou psicológicos."`,
  };

  return `Crie um site one-page premium para ${data.business_name || "[NOME DO NEGÓCIO]"} — ${data.description || "[DESCRIÇÃO]"}.

VERTICAL: ${vertical}
CIDADE: ${data.city || "[CIDADE]"}
TELEFONE/WHATSAPP: ${data.phone || "[TELEFONE]"}

REGRAS DE PERFORMANCE:
- JS mínimo, imagens otimizadas (lazy loading), layout leve
- Mobile-first, Core Web Vitals ready

REGRAS DE SEO LOCAL:
- Title tag com keyword principal + cidade (< 60 chars)
- Meta description persuasiva (< 160 chars)
- H1 único com keyword principal
- Schema JSON-LD (LocalBusiness ou ProfessionalService)
- NAP no rodapé (Nome, Endereço, Telefone)
- Open Graph tags

ESTRUTURA OBRIGATÓRIA (nesta ordem):
1. Hero — headline forte + subheadline + CTA WhatsApp
2. Espelho/Dor — bullets com sinais e situações do público (linguagem simples)
3. Sobre/Autoridade — abordagem e diferenciais (ético, sem prometer resultados)
4. Como funciona — 4 passos obrigatórios
5. Serviços — lista clara dos serviços oferecidos
6. Antes/Depois ou Resultados esperados
7. Depoimentos — anonimizados, realistas
8. FAQ — 5 perguntas relevantes
9. CTA Final — headline + botão WhatsApp
10. Rodapé — NAP + aviso legal

SERVIÇOS: ${data.services || "[SERVIÇOS]"}
DIFERENCIAIS: ${data.differentials || "[DIFERENCIAIS]"}
DORES DO PÚBLICO: ${data.pain_points || "[DORES]"}
ABORDAGEM: ${data.approach || "[ABORDAGEM]"}

${disclaimers[vertical] || ""}

ESTILO VISUAL: Dark premium, tipografia elegante (serif para títulos), paleta sofisticada, espaçamento generoso. NÃO usar aspecto de template genérico.`;
};

const generateContentPack = (vertical: string, data: Record<string, string>) => {
  return {
    meta_title: `${data.business_name || "Profissional"} | ${data.main_category || vertical} em ${data.city || "sua cidade"}`,
    meta_description: `${data.description || "Profissional qualificado"}. Atendimento ${data.city ? `em ${data.city}` : "presencial e online"}. Agende pelo WhatsApp.`,
    faq: [
      `Como funciona o primeiro atendimento?`,
      `Qual o valor da consulta?`,
      `Vocês atendem por convênio/plano?`,
      `Posso agendar online?`,
      `Quanto tempo dura cada sessão?`,
    ],
    schema_type: vertical === "dentista" ? "Dentist" : "ProfessionalService",
  };
};

const PromptGenerator = () => {
  const { toast } = useToast();
  const [vertical, setVertical] = useState("psicologo");
  const [data, setData] = useState({
    business_name: "", description: "", city: "", phone: "", services: "",
    differentials: "", pain_points: "", approach: "", main_category: "",
  });
  const [prompt, setPrompt] = useState("");
  const [contentPack, setContentPack] = useState<any>(null);

  const handleGenerate = () => {
    const p = generatePrompt(vertical, data);
    setPrompt(p);
    setContentPack(generateContentPack(vertical, data));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!" });
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="font-serif text-2xl text-foreground">Gerador de Prompt Lovable</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gere prompts otimizados para criar sites premium por vertical
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="space-y-2">
              <Label>Vertical</Label>
              <div className="flex gap-2">
                {verticals.map((v) => (
                  <button
                    key={v.value}
                    onClick={() => setVertical(v.value)}
                    className={`flex-1 rounded-lg border p-3 text-sm transition-all ${
                      vertical === v.value
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {v.emoji} {v.label}
                  </button>
                ))}
              </div>
            </div>

            {Object.entries({
              business_name: "Nome do negócio",
              description: "Descrição curta",
              main_category: "Categoria principal",
              city: "Cidade",
              phone: "WhatsApp",
              services: "Serviços (vírgula)",
              differentials: "Diferenciais",
              pain_points: "Dores do público",
              approach: "Abordagem/método",
            }).map(([key, label]) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs">{label}</Label>
                <Input
                  value={(data as any)[key]}
                  onChange={(e) => setData({ ...data, [key]: e.target.value })}
                  placeholder={label}
                />
              </div>
            ))}

            <Button variant="hero" className="w-full" onClick={handleGenerate}>
              <Sparkles size={16} />
              Gerar Prompt
            </Button>
          </div>

          {/* Output */}
          <div className="space-y-4">
            {prompt && (
              <div className="glass-card rounded-xl p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-serif text-lg text-foreground">Prompt Gerado</h3>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(prompt)}>
                    <Copy size={14} />
                    Copiar
                  </Button>
                </div>
                <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-background/50 p-4 text-xs text-foreground">
                  {prompt}
                </pre>
              </div>
            )}

            {contentPack && (
              <div className="glass-card rounded-xl p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-serif text-lg text-foreground">Content Pack</h3>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(JSON.stringify(contentPack, null, 2))}>
                    <Copy size={14} />
                    Copiar
                  </Button>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Meta Title:</span>
                    <p className="text-foreground">{contentPack.meta_title}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Meta Description:</span>
                    <p className="text-foreground">{contentPack.meta_description}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Schema:</span>
                    <p className="text-foreground">{contentPack.schema_type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">FAQ sugerido:</span>
                    <ul className="mt-1 space-y-1">
                      {contentPack.faq.map((q: string, i: number) => (
                        <li key={i} className="text-foreground">• {q}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PromptGenerator;
