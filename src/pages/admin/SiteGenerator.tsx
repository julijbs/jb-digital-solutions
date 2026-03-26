import { useEffect, useMemo, useState } from "react";
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
  Sparkles,
  Eye,
  Code,
  Loader2,
  Monitor,
  Check,
  Upload,
  ExternalLink,
} from "lucide-react";
import { Palette } from "lucide-react";

const templateOptions = [
  { value: "elegant-minimal", label: "🎨 Elegante Minimalista" },
  { value: "modern-clean", label: "✨ Moderno Clean" },
  { value: "warm-soft", label: "🌿 Acolhedor Suave" },
] as const;

const generationSteps = [
  "Carregando dados do onboarding…",
  "Gerando textos com IA…",
  "Substituindo placeholders no template…",
  "Site pronto!",
];

const DEFAULT_TEMPLATE = templateOptions[0].value;

const isValidTemplate = (value: string): value is keyof typeof htmlTemplates => value in htmlTemplates;

const SiteGenerator = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [template, setTemplate] = useState<string>(DEFAULT_TEMPLATE);
  const [customInstructions, setCustomInstructions] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [generatedTexts, setGeneratedTexts] = useState<any>(null);
  const [showCode, setShowCode] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const [brandData, setBrandData] = useState<any>(null);

  const safeTemplate = useMemo(
    () => (isValidTemplate(template) ? template : DEFAULT_TEMPLATE),
    [template]
  );

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
    if (template !== safeTemplate) {
      setTemplate(safeTemplate);
    }
  }, [safeTemplate, template]);

  useEffect(() => {
    if (!selectedProject) {
      setProjectData(null);
      setBrandData(null);
      return;
    }

    const fetchIntake = async () => {
      const { data } = await supabase
        .from("client_intake")
        .select("*")
        .eq("project_id", selectedProject)
        .maybeSingle();

      setProjectData(data);
      if (data?.brand_data && (data.brand_data as any)?.primary_color) {
        setBrandData(data.brand_data);
      }
    };

    fetchIntake();
  }, [selectedProject]);

  const buildProjectInfo = () => {
    const project = projects.find((p) => p.id === selectedProject);
    const client = project?.clients as any;
    const bd = (projectData?.business_data as any) || {};
    const svd = (projectData?.services_data as any) || {};
    const sd = (projectData?.schedule_data as any) || {};

    return {
      businessName: bd.name || bd.business_name || client?.business_name || "Profissional",
      specialty: svd.main_category || client?.vertical || "",
      city: sd.city || sd.main_city || client?.city || "",
      state: sd.state || client?.state || "",
      phone: bd.phone || "",
      email: bd.email || "",
      instagram: bd.instagram || "",
      vertical: client?.vertical || "",
      slug: project?.name?.toLowerCase().replace(/\s+/g, "-"),
      customDomain: project?.custom_domain || undefined,
    };
  };

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
      setGenerationStep(1);
      const { data: result, error } = await supabase.functions.invoke("generate-site-texts", {
        body: { projectId: selectedProject, customInstructions },
      });

      if (error) throw error;
      if (!result?.texts) throw new Error(result?.error || "Falha ao gerar textos");

      setGeneratedTexts(result.texts);

      setGenerationStep(2);
      const templateHTML = htmlTemplates[safeTemplate];
      if (!templateHTML) {
        throw new Error("Template inválido. Selecione um template e tente novamente.");
      }

      const finalHTML = applyTextsToTemplate(templateHTML, result.texts, buildProjectInfo());
      // Note: brandData is applied via applyTextsToTemplate's 4th arg

      setGeneratedHtml(finalHTML);
      setGenerationStep(3);
      toast({ title: "Site gerado com sucesso!" });

      await supabase
        .from("projects")
        .update({ status: "lovable_site_generated" })
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

  const handlePublish = async () => {
    if (!generatedHtml || !selectedProject) return;

    setPublishing(true);

    try {
      const project = projects.find((p) => p.id === selectedProject);
      const slug = project?.name?.toLowerCase().replace(/\s+/g, "-") || selectedProject;

      const { data, error } = await supabase.functions.invoke("publish-site", {
        body: { projectId: selectedProject, html: generatedHtml, projectSlug: slug },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setPublishedUrl(data.publishedUrl);
      toast({
        title: "Site publicado com sucesso!",
        description: `URL: ${data.publishedUrl}`,
      });
    } catch (err: any) {
      toast({
        title: "Erro ao publicar",
        description: err.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
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
        <div className="space-y-4">
          <Card className="glass-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
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

              <div className="space-y-2">
                <Label className="text-xs">Template</Label>
                <Select value={safeTemplate} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templateOptions.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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

              {selectedProject && projectData && (
                <div className="space-y-1 rounded-lg bg-background/50 p-3">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Dados do Onboarding</p>
                  {brandData?.logo_url && (
                    <div className="mb-3 flex items-center gap-3">
                      <img src={brandData.logo_url} alt="Logo" className="h-10 w-10 rounded-lg border border-border bg-white object-contain p-1" />
                      <div className="flex gap-1.5">
                        {(brandData.dominant_colors || [brandData.primary_color, brandData.accent_color]).filter(Boolean).map((c: string, i: number) => (
                          <div key={i} className="h-6 w-6 rounded-md border border-border shadow-sm" style={{ backgroundColor: c }} title={c} />
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    <Check size={10} className="mr-1 inline text-primary" />
                    Nome: <span className="text-foreground">{bd.name || bd.business_name || "—"}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <Check size={10} className="mr-1 inline text-primary" />
                    Especialidade: <span className="text-foreground">{svd.main_category || "—"}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <Check size={10} className="mr-1 inline text-primary" />
                    Cidade: <span className="text-foreground">{sd.city || sd.main_city || "—"}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <Check size={10} className="mr-1 inline text-primary" />
                    Completo: <span className="text-foreground">{projectData.completed ? "Sim" : `Passo ${projectData.step_current}/6`}</span>
                  </p>
                </div>
              )}

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
                  <p className="text-center text-xs text-muted-foreground">{generationSteps[generationStep]}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Preview</CardTitle>
              {generatedHtml && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => setShowCode(!showCode)}
                  >
                    <Code size={12} />
                    {showCode ? "Preview" : "Ver Código"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs"
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
                <pre className="max-h-[600px] overflow-auto rounded-lg bg-background/80 p-4 font-mono text-xs text-muted-foreground">
                  {generatedHtml}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 h-7 text-xs"
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
                <div className="overflow-hidden rounded-lg border border-border">
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
                      const keys = Object.keys(htmlTemplates) as Array<keyof typeof htmlTemplates>;
                      const idx = keys.indexOf(safeTemplate);
                      const next = keys[(idx + 1) % keys.length];
                      setTemplate(next);

                      if (generatedTexts) {
                        const nextTemplateHtml = htmlTemplates[next];
                        const newHTML = applyTextsToTemplate(nextTemplateHtml, generatedTexts, buildProjectInfo(), brandData || undefined);
                        setGeneratedHtml(newHTML);
                        toast({ title: `Template alterado para ${templateOptions.find((t) => t.value === next)?.label}` });
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
                      navigator.clipboard.writeText(generatedHtml);
                      toast({ title: "HTML copiado!" });
                    }}
                  >
                    Copiar HTML
                  </Button>
                </div>

                <div className="space-y-3 border-t border-border pt-2">
                  <Button className="w-full gap-2" onClick={handlePublish} disabled={publishing}>
                    {publishing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Publicando…
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Publicar Site
                      </>
                    )}
                  </Button>
                  {publishedUrl && (
                    <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3">
                      <ExternalLink size={14} className="flex-shrink-0 text-primary" />
                      <a
                        href={publishedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-xs text-primary underline"
                      >
                        {publishedUrl}
                      </a>
                    </div>
                  )}
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
