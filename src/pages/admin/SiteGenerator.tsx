import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { SectionRegenerator } from "@/components/admin/SectionRegenerator";
import {
  Sparkles, Eye, Code, Loader2, Monitor, Check, PenLine,
} from "lucide-react";

const templates = [
  { value: "elegant-minimal", label: "🎨 Elegante Minimalista" },
  { value: "modern-clean", label: "✨ Moderno Clean" },
  { value: "warm-soft", label: "🌿 Acolhedor Suave" },
];

const colorSchemes = [
  { value: "blue-professional", label: "Azul Profissional", colors: ["#0A1128", "#C8A882", "#f8f9fa"] },
  { value: "green-therapeutic", label: "Verde Terapêutico", colors: ["#2D6A4F", "#40916C", "#f0fdf4"] },
  { value: "purple-transformer", label: "Roxo Transformador", colors: ["#5A189A", "#9D4EDD", "#faf5ff"] },
];

const generationSteps = [
  "Carregando dados do onboarding…",
  "Fase 1: Gerando conteúdo estruturado…",
  "Fase 2: Montando HTML com template…",
  "Finalizando site…",
];

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  pain_section: "Dores",
  about: "Sobre",
  services: "Serviços",
  process: "Processo",
  testimonials: "Depoimentos",
  cta_final: "CTA Final",
};

const SiteGenerator = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [template, setTemplate] = useState("elegant-minimal");
  const [colorScheme, setColorScheme] = useState("blue-professional");
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [showCode, setShowCode] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, name, plan, status, clients(business_name, vertical, city, state)")
        .order("updated_at", { ascending: false });
      setProjects(data || []);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProject) { setProjectData(null); return; }
    const fetchIntake = async () => {
      const { data } = await supabase
        .from("client_intake")
        .select("*")
        .eq("project_id", selectedProject)
        .maybeSingle();
      setProjectData(data);
    };
    fetchIntake();
  }, [selectedProject]);

  const handleGenerate = async () => {
    if (!selectedProject) {
      toast({ title: "Selecione um projeto", variant: "destructive" });
      return;
    }

    setGenerating(true);
    setGeneratedHtml(null);
    setGeneratedContent(null);
    setGenerationStep(0);
    setEditingSection(null);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => Math.min(prev + 1, generationSteps.length - 1));
    }, 4000);

    try {
      const { data, error } = await supabase.functions.invoke("generate-site-ai", {
        body: { projectId: selectedProject, template, colorScheme },
      });

      clearInterval(stepInterval);

      if (error) throw error;
      if (data?.html) {
        setGeneratedHtml(data.html);
        setGeneratedContent(data.content || null);
        setGenerationStep(generationSteps.length - 1);
        toast({ title: "Site gerado com sucesso! (2 fases)" });
      } else {
        throw new Error(data?.error || "Falha na geração");
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      toast({
        title: "Erro na geração",
        description: err.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSectionRegenerate = async (section: string, newContent: any) => {
    if (!generatedContent) return;
    const updatedContent = { ...generatedContent, [section]: newContent };
    setGeneratedContent(updatedContent);

    // Re-generate HTML with updated content
    setGenerating(true);
    setGenerationStep(2);

    try {
      const { data, error } = await supabase.functions.invoke("generate-site-ai", {
        body: { projectId: selectedProject, template, colorScheme },
      });

      if (error) throw error;
      if (data?.html) {
        setGeneratedHtml(data.html);
        setGeneratedContent(data.content || updatedContent);
        toast({ title: "Site atualizado com seção refinada!" });
      }
    } catch (err: any) {
      toast({ title: "Erro ao atualizar", description: err.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const bd = (projectData?.business_data as any) || {};
  const svd = (projectData?.services_data as any) || {};
  const sd = (projectData?.schedule_data as any) || {};

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Gerador de Sites com IA</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Geração em 2 fases: conteúdo estruturado → HTML com template
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* Configuration Panel */}
        <div className="space-y-4">
          <Card className="glass-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Project Selector */}
              <div className="space-y-2">
                <Label className="text-xs">Projeto</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} — {(p.clients as any)?.business_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Template */}
              <div className="space-y-2">
                <Label className="text-xs">Template</Label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color Scheme */}
              <div className="space-y-2">
                <Label className="text-xs">Paleta de Cores</Label>
                <RadioGroup value={colorScheme} onValueChange={setColorScheme} className="space-y-2">
                  {colorSchemes.map((cs) => (
                    <div key={cs.value} className="flex items-center gap-3">
                      <RadioGroupItem value={cs.value} id={cs.value} />
                      <Label htmlFor={cs.value} className="flex items-center gap-2 text-sm cursor-pointer">
                        <div className="flex -space-x-1">
                          {cs.colors.map((c, i) => (
                            <div key={i} className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        {cs.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Project Data Preview */}
              {selectedProject && projectData && (
                <div className="rounded-lg bg-background/50 p-3 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Dados do Onboarding</p>
                  <p className="text-xs text-muted-foreground">
                    <Check size={10} className="inline mr-1 text-primary" />
                    Nome: <span className="text-foreground">{bd.name || "—"}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <Check size={10} className="inline mr-1 text-primary" />
                    Especialidade: <span className="text-foreground">{svd.main_category || "—"}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <Check size={10} className="inline mr-1 text-primary" />
                    Cidade: <span className="text-foreground">{sd.city || "—"}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <Check size={10} className="inline mr-1 text-primary" />
                    Completo: <span className="text-foreground">{projectData.completed ? "Sim" : `Passo ${projectData.step_current}/6`}</span>
                  </p>
                </div>
              )}

              {/* Generate Button */}
              <Button
                variant="hero"
                className="w-full gap-2"
                onClick={handleGenerate}
                disabled={generating || !selectedProject}
              >
                {generating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Gerando…
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Gerar Site com IA
                  </>
                )}
              </Button>

              {generating && (
                <div className="space-y-2">
                  <Progress value={((generationStep + 1) / generationSteps.length) * 100} className="h-1.5" />
                  <p className="text-xs text-muted-foreground text-center">
                    {generationSteps[generationStep]}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section Refinement Panel */}
          {generatedContent && !generating && (
            <Card className="glass-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <PenLine size={14} />
                  Refinar Seções
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.keys(SECTION_LABELS).map((key) => {
                  if (!generatedContent[key]) return null;
                  return (
                    <div key={key}>
                      {editingSection === key ? (
                        <SectionRegenerator
                          section={key}
                          currentContent={generatedContent[key]}
                          onRegenerate={handleSectionRegenerate}
                          onClose={() => setEditingSection(null)}
                        />
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start h-8 text-xs"
                          onClick={() => setEditingSection(key)}
                        >
                          <Sparkles size={10} className="mr-2 text-primary" />
                          {SECTION_LABELS[key]}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview Panel */}
        <Card className="glass-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Preview</CardTitle>
              {generatedHtml && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => setShowCode(!showCode)}
                  >
                    <Code size={12} />
                    {showCode ? "Preview" : "Ver Código"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => {
                      const blob = new Blob([generatedHtml], { type: "text/html" });
                      const url = URL.createObjectURL(blob);
                      window.open(url, "_blank");
                    }}
                  >
                    <Eye size={12} />
                    Abrir Preview
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!generatedHtml ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Monitor size={48} className="mb-4 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Nenhum site gerado ainda</p>
                <p className="mt-1 text-xs text-muted-foreground/60">
                  Selecione um projeto, escolha o template e clique em "Gerar Site com IA"
                </p>
              </div>
            ) : showCode ? (
              <div className="relative">
                <pre className="max-h-[600px] overflow-auto rounded-lg bg-background/80 p-4 text-xs text-muted-foreground font-mono">
                  {generatedHtml}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-7 text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedHtml);
                    toast({ title: "Código copiado!" });
                  }}
                >
                  Copiar
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-border overflow-hidden">
                  <iframe
                    srcDoc={generatedHtml}
                    className="h-[600px] w-full bg-white"
                    title="Site Preview"
                    sandbox="allow-scripts"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" className="text-xs" onClick={handleGenerate}>
                    Regerar Completo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      const idx = colorSchemes.findIndex((c) => c.value === colorScheme);
                      const next = colorSchemes[(idx + 1) % colorSchemes.length];
                      setColorScheme(next.value);
                      toast({ title: `Paleta alterada para ${next.label}` });
                    }}
                  >
                    Trocar Cores
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedHtml!);
                      toast({ title: "HTML copiado!" });
                    }}
                  >
                    Copiar HTML
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SiteGenerator;
