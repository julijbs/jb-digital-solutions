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
  Sparkles, Eye, Code, Loader2, Monitor, Check, Upload, ExternalLink,
} from "lucide-react";

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
    if (!isValidTemplate(template)) {
      setTemplate(DEFAULT_TEMPLATE);
    }
  }, [template]);

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

    const selectedTemplate = isValidTemplate(template) ? template : DEFAULT_TEMPLATE;

    if (selectedTemplate !== template) {
      setTemplate(selectedTemplate);
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
      const project = projects.find((p) => p.id === selectedProject);
      const client = project?.clients as any;
      const bd = (projectData?.business_data as any) || {};
      const svd = (projectData?.services_data as any) || {};
      const sd = (projectData?.schedule_data as any) || {};

      const projInfo = {
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

      const templateHTML = htmlTemplates[selectedTemplate];
      if (!templateHTML) {
        throw new Error("Template inválido. Selecione um template e tente novamente.");
      }

      const finalHTML = applyTextsToTemplate(templateHTML, result.texts, projInfo);

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
...
              <div className="space-y-2">
                <Label className="text-xs">Template</Label>
                <Select value={isValidTemplate(template) ? template : DEFAULT_TEMPLATE} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templateOptions.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
...
                      onClick={() => {
                        const keys = Object.keys(htmlTemplates) as Array<keyof typeof htmlTemplates>;
                        const currentTemplate = isValidTemplate(template) ? template : DEFAULT_TEMPLATE;
                        const idx = keys.indexOf(currentTemplate);
                        const next = keys[(idx + 1) % keys.length];
                        setTemplate(next);
                        if (generatedTexts) {
                          const project = projects.find((p) => p.id === selectedProject);
                          const client = project?.clients as any;
                          const projInfo = {
                            businessName: bd.name || bd.business_name || client?.business_name || "",
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
                          const nextTemplateHtml = htmlTemplates[next];
                          const newHTML = applyTextsToTemplate(nextTemplateHtml, generatedTexts, projInfo);
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

                {/* Publish Button */}
                {generatedHtml && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <Button
                      className="w-full gap-2"
                      onClick={handlePublish}
                      disabled={publishing}
                    >
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
                        <ExternalLink size={14} className="text-primary flex-shrink-0" />
                        <a
                          href={publishedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary underline break-all"
                        >
                          {publishedUrl}
                        </a>
                      </div>
                    )}
                  </div>
                )}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SiteGenerator;
