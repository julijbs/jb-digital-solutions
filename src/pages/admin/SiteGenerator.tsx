import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { templates as htmlTemplates } from "@/lib/templates";
import { applyTextsToTemplate } from "@/lib/siteGenerator";
import {
  Sparkles, Eye, Code, Loader2, Monitor, Check,
} from "lucide-react";

const templateOptions = [
  { value: "elegant-minimal", label: "🎨 Elegante Minimalista" },
  { value: "modern-clean", label: "✨ Moderno Clean" },
  { value: "warm-soft", label: "🌿 Acolhedor Suave" },
];

const generationSteps = [
  "Carregando dados do onboarding…",
  "Gerando textos com IA…",
  "Substituindo placeholders no template…",
  "Site pronto!",
];

const SiteGenerator = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [template, setTemplate] = useState("elegant-minimal");
  const [customInstructions, setCustomInstructions] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [generatedTexts, setGeneratedTexts] = useState<any>(null);
  const [showCode, setShowCode] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, name, plan, status, custom_domain, clients(business_name, vertical, city, state)")
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
    setGeneratedTexts(null);
    setGenerationStep(0);

    try {
      // Step 1: Call edge function to generate texts
      setGenerationStep(1);
      const { data: result, error } = await supabase.functions.invoke("generate-site-texts", {
        body: { projectId: selectedProject, customInstructions },
      });

      if (error) throw error;
      if (!result?.texts) throw new Error(result?.error || "Falha ao gerar textos");

      setGeneratedTexts(result.texts);

      // Step 2: Get project data for template substitution
      setGenerationStep(2);
      const project = projects.find((p) => p.id === selectedProject);
      const client = project?.clients as any;
      const bd = (projectData?.business_data as any) || {};
      const svd = (projectData?.services_data as any) || {};
      const sd = (projectData?.schedule_data as any) || {};

      const projInfo = {
        businessName: bd.name || client?.business_name || "Profissional",
        specialty: svd.main_category || client?.vertical || "",
        city: sd.city || client?.city || "",
        state: sd.state || client?.state || "",
        phone: bd.phone || "",
        email: bd.email || "",
        instagram: bd.instagram || "",
        vertical: client?.vertical || "",
        slug: project?.name?.toLowerCase().replace(/\s+/g, "-"),
        customDomain: project?.custom_domain || undefined,
      };

      // Step 3: Apply texts to template
      const templateHTML = htmlTemplates[template as keyof typeof htmlTemplates];
      const finalHTML = applyTextsToTemplate(templateHTML, result.texts, projInfo);

      setGeneratedHtml(finalHTML);
      setGenerationStep(3);
      toast({ title: "Site gerado com sucesso!" });

      // Update project status
      await supabase
        .from("projects")
        .update({ status: "site_generated" })
        .eq("id", selectedProject);
    } catch (err: any) {
      toast({
        title: "Erro na geração",
        description: err.message || "Tente novamente",
        variant: "destructive",
      });
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
          IA gera textos → substitui placeholders no template → HTML final
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
                    {templateOptions.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Instructions */}
              <div className="space-y-2">
                <Label className="text-xs">Instruções personalizadas (opcional)</Label>
                <Textarea
                  placeholder="Ex: Use tom mais informal, destaque atendimento online..."
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  rows={3}
                  className="text-xs"
                />
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
                      const keys = Object.keys(htmlTemplates);
                      const idx = keys.indexOf(template);
                      const next = keys[(idx + 1) % keys.length];
                      setTemplate(next);
                      // Re-apply texts to new template
                      if (generatedTexts) {
                        const project = projects.find((p) => p.id === selectedProject);
                        const client = project?.clients as any;
                        const projInfo = {
                          businessName: bd.name || client?.business_name || "",
                          specialty: svd.main_category || client?.vertical || "",
                          city: sd.city || client?.city || "",
                          state: sd.state || client?.state || "",
                          phone: bd.phone || "",
                          email: bd.email || "",
                          instagram: bd.instagram || "",
                          vertical: client?.vertical || "",
                          slug: project?.name?.toLowerCase().replace(/\s+/g, "-"),
                          customDomain: project?.custom_domain || undefined,
                        };
                        const newHTML = applyTextsToTemplate(htmlTemplates[next as keyof typeof htmlTemplates], generatedTexts, projInfo);
                        setGeneratedHtml(newHTML);
                        toast({ title: `Template alterado para ${templateOptions.find(t => t.value === next)?.label}` });
                      }
                    }}
                  >
                    Trocar Template
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
