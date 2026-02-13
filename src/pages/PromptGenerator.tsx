import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Sparkles, Loader2, FileDown } from "lucide-react";

const verticals = [
  { value: "psicologo", label: "Psicólogo(a)", emoji: "🧠" },
  { value: "dentista", label: "Dentista", emoji: "🦷" },
  { value: "terapeuta", label: "Terapeuta", emoji: "🌿" },
];

const PromptGenerator = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [vertical, setVertical] = useState("psicologo");
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [data, setData] = useState({
    business_name: "", description: "", city: "", phone: "", services: "",
    differentials: "", pain_points: "", approach: "", main_category: "",
  });
  const [prompt, setPrompt] = useState("");
  const [contentPack, setContentPack] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatingContent, setGeneratingContent] = useState(false);

  // Load projects for dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      const { data: p } = await supabase
        .from("projects")
        .select("id, name, clients(business_name, vertical)")
        .order("created_at", { ascending: false });
      setProjects(p || []);

      // Auto-select project from URL param
      const projectParam = searchParams.get("project");
      if (projectParam && p?.some((proj: any) => proj.id === projectParam)) {
        loadIntakeData(projectParam, p || []);
      }
    };
    fetchProjects();
  }, []);

  // Load intake data when project is selected
  const loadIntakeData = async (projectId: string, projectsList?: any[]) => {
    setSelectedProject(projectId);
    if (!projectId) return;

    const { data: intake } = await supabase
      .from("client_intake")
      .select("*")
      .eq("project_id", projectId)
      .maybeSingle();

    if (intake) {
      const bd = (intake.business_data as any) || {};
      const sd = (intake.schedule_data as any) || {};
      const svd = (intake.services_data as any) || {};

      setData({
        business_name: bd.business_name || bd.name || "",
        description: bd.description || "",
        city: sd.main_city || sd.city || "",
        phone: bd.phone || "",
        services: svd.services_tags || "",
        differentials: svd.differentials || "",
        pain_points: svd.pain_points || "",
        approach: svd.approach || "",
        main_category: svd.main_category || "",
      });

      // Set vertical from client or intake
      const list = projectsList || projects;
      const project = list.find((p: any) => p.id === projectId);
      const v = bd.vertical || (project?.clients as any)?.vertical;
      if (v) setVertical(v);
    }
    toast({ title: "Dados do onboarding carregados!" });
  };

  const handleGeneratePrompt = async () => {
    setGenerating(true);
    try {
      const intakeData = {
        business_data: {
          name: data.business_name, description: data.description,
          phone: data.phone, email: "", instagram: "",
        },
        schedule_data: { city: data.city, state: "", type: "", street: "", number: "", neighborhood: "", cep: "" },
        services_data: {
          main_category: data.main_category, services_tags: data.services,
          differentials: data.differentials, pain_points: data.pain_points, approach: data.approach,
        },
      };

      const { data: result, error } = await supabase.functions.invoke("generate-prompt", {
        body: { intake_data: intakeData, vertical, action: "generate_prompt" },
      });

      if (error) throw error;
      if (result?.error) {
        toast({ title: "Erro", description: result.error, variant: "destructive" });
      } else {
        setPrompt(result.content);
        // Auto-advance pipeline to lovable_prompt_ready
        if (selectedProject) {
          await supabase
            .from("projects")
            .update({ status: "lovable_prompt_ready" })
            .eq("id", selectedProject);
          toast({ title: "Pipeline atualizado", description: "Projeto movido para 'Prompt pronto'" });
        }
      }
    } catch (err: any) {
      toast({ title: "Erro ao gerar prompt", description: err.message, variant: "destructive" });
    }
    setGenerating(false);
  };

  const handleGenerateContentPack = async () => {
    setGeneratingContent(true);
    try {
      const intakeData = {
        business_data: { name: data.business_name, description: data.description },
        schedule_data: { city: data.city },
        services_data: { main_category: data.main_category, services_tags: data.services },
      };

      const { data: result, error } = await supabase.functions.invoke("generate-prompt", {
        body: { intake_data: intakeData, vertical, action: "generate_content_pack" },
      });

      if (error) throw error;
      if (result?.error) {
        toast({ title: "Erro", description: result.error, variant: "destructive" });
      } else {
        setContentPack(result.content);
        // Auto-advance pipeline to content_ready if still in intake/onboarding
        if (selectedProject) {
          const { data: proj } = await supabase
            .from("projects")
            .select("status")
            .eq("id", selectedProject)
            .single();
          if (proj && (proj.status === "intake" || proj.status === "onboarding_in_progress")) {
            await supabase
              .from("projects")
              .update({ status: "content_ready" })
              .eq("id", selectedProject);
            toast({ title: "Pipeline atualizado", description: "Projeto movido para 'Conteúdo pronto'" });
          }
        }
      }
    } catch (err: any) {
      toast({ title: "Erro ao gerar content pack", description: err.message, variant: "destructive" });
    }
    setGeneratingContent(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!" });
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="font-serif text-2xl text-foreground">Gerador de Prompt Lovable</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gere prompts otimizados com IA a partir dos dados do onboarding
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            {/* Project selector */}
            <div className="space-y-2">
              <Label>Carregar dados de um projeto</Label>
              <select
                value={selectedProject}
                onChange={(e) => loadIntakeData(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Selecione um projeto...</option>
                {projects.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {(p.clients as any)?.business_name || "Sem cliente"}
                  </option>
                ))}
              </select>
            </div>

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

            <div className="flex gap-3">
              <Button variant="hero" className="flex-1" onClick={handleGeneratePrompt} disabled={generating}>
                {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {generating ? "Gerando…" : "Gerar Prompt IA"}
              </Button>
              <Button variant="heroOutline" onClick={handleGenerateContentPack} disabled={generatingContent}>
                {generatingContent ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
                Content Pack
              </Button>
            </div>
          </div>

          {/* Output */}
          <div className="space-y-4">
            {prompt && (
              <div className="glass-card rounded-xl p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-serif text-lg text-foreground">Prompt Gerado por IA</h3>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(prompt)}>
                    <Copy size={14} /> Copiar
                  </Button>
                </div>
                <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap rounded-lg bg-background/50 p-4 text-xs text-foreground leading-relaxed">
                  {prompt}
                </pre>
              </div>
            )}

            {contentPack && (
              <div className="glass-card rounded-xl p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-serif text-lg text-foreground">Content Pack IA</h3>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(contentPack)}>
                    <Copy size={14} /> Copiar
                  </Button>
                </div>
                <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-background/50 p-4 text-xs text-foreground leading-relaxed">
                  {contentPack}
                </pre>
              </div>
            )}

            {!prompt && !contentPack && (
              <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
                <Sparkles size={48} className="mb-4 text-muted-foreground" />
                <h3 className="font-serif text-lg text-foreground">Nenhum prompt gerado</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                  Selecione um projeto para carregar os dados do onboarding e gere o prompt com IA.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PromptGenerator;
