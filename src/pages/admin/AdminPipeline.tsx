import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronRight, ChevronLeft, Eye, Sparkles, FolderKanban,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const pipelineStages = [
  { key: "intake", label: "Intake", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  { key: "onboarding_in_progress", label: "Onboarding", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  { key: "content_ready", label: "Conteúdo pronto", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { key: "lovable_prompt_ready", label: "Prompt pronto", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { key: "lovable_site_generated", label: "Site gerado", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { key: "repo_created", label: "Repo criado", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { key: "vercel_deployed_preview", label: "Preview", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  { key: "qa_passed", label: "QA aprovado", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { key: "client_review", label: "Revisão", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  { key: "vercel_deployed_prod", label: "Produção", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  { key: "handoff_ready", label: "Entrega pronta", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { key: "handoff_done", label: "Entregue", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  { key: "monthly_active", label: "Ativo mensal", color: "bg-primary/10 text-primary border-primary/20" },
];

const AdminPipeline = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [intakeData, setIntakeData] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*, clients(business_name, vertical)")
      .order("updated_at", { ascending: false });
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const moveProject = async (projectId: string, newStatus: string) => {
    const oldStatus = projects.find(p => p.id === projectId)?.status;
    await supabase.from("projects").update({ status: newStatus }).eq("id", projectId);
    toast({ title: `Projeto movido para: ${pipelineStages.find(s => s.key === newStatus)?.label}` });

    // Trigger lifecycle webhook (emails, notifications, auto-create review)
    try {
      await supabase.functions.invoke("project-status-webhook", {
        body: {
          project_id: projectId,
          new_status: newStatus,
          old_status: oldStatus,
          origin_url: window.location.origin,
        },
      });
    } catch (e) {
      console.error("Webhook trigger failed:", e);
    }

    fetchProjects();
  };

  const getNextStatus = (current: string) => {
    const idx = pipelineStages.findIndex(s => s.key === current);
    return idx < pipelineStages.length - 1 ? pipelineStages[idx + 1].key : null;
  };

  const getPrevStatus = (current: string) => {
    const idx = pipelineStages.findIndex(s => s.key === current);
    return idx > 0 ? pipelineStages[idx - 1].key : null;
  };

  const viewIntake = async (projectId: string) => {
    if (expandedProject === projectId) {
      setExpandedProject(null);
      return;
    }
    const { data } = await supabase
      .from("client_intake")
      .select("*")
      .eq("project_id", projectId)
      .maybeSingle();
    setIntakeData((prev) => ({ ...prev, [projectId]: data }));
    setExpandedProject(projectId);
  };

  const getProjectsByStage = (stageKey: string) =>
    projects.filter((p) => p.status === stageKey);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Pipeline</h1>
        <p className="mt-1 text-sm text-muted-foreground">{projects.length} projetos no total</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineStages.map((stage) => {
          const stageProjects = getProjectsByStage(stage.key);
          return (
            <div key={stage.key} className="min-w-[260px] flex-shrink-0">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stage.label}
                </h3>
                <span className={`rounded-full px-2 py-0.5 text-xs border ${stage.color}`}>
                  {stageProjects.length}
                </span>
              </div>
              <div className="space-y-2">
                {stageProjects.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-4 text-center">
                    <p className="text-xs text-muted-foreground">Vazio</p>
                  </div>
                ) : (
                  stageProjects.map((p: any) => {
                    const next = getNextStatus(p.status);
                    const prev = getPrevStatus(p.status);
                    const isExpanded = expandedProject === p.id;

                    return (
                      <div key={p.id} className="glass-card rounded-lg p-3 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">{p.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {(p.clients as any)?.business_name || "—"}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-1">
                          {prev && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs px-2"
                              onClick={() => moveProject(p.id, prev)}
                            >
                              <ChevronLeft size={12} /> Voltar
                            </Button>
                          )}
                          {next && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs px-2"
                              onClick={() => moveProject(p.id, next)}
                            >
                              Avançar <ChevronRight size={12} />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs px-2"
                            onClick={() => viewIntake(p.id)}
                          >
                            <Eye size={12} /> Intake
                          </Button>
                          {(p.status === "content_ready" || p.status === "intake") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs px-2 text-primary"
                              onClick={() => navigate(`/admin/prompt-generator?project=${p.id}`)}
                            >
                              <Sparkles size={12} /> Prompt
                            </Button>
                          )}
                        </div>

                        {/* Expanded intake data */}
                        {isExpanded && intakeData[p.id] && (
                          <div className="mt-2 rounded-lg bg-background/50 p-3 text-xs space-y-1">
                            {(() => {
                              const d = intakeData[p.id];
                              const bd = (d.business_data as any) || {};
                              const svd = (d.services_data as any) || {};
                              return (
                                <>
                                  <p><span className="text-muted-foreground">Nome:</span> <span className="text-foreground">{bd.name || "—"}</span></p>
                                  <p><span className="text-muted-foreground">Desc:</span> <span className="text-foreground">{bd.description || "—"}</span></p>
                                  <p><span className="text-muted-foreground">Tel:</span> <span className="text-foreground">{bd.phone || "—"}</span></p>
                                  <p><span className="text-muted-foreground">Categoria:</span> <span className="text-foreground">{svd.main_category || "—"}</span></p>
                                  <p><span className="text-muted-foreground">Serviços:</span> <span className="text-foreground">{svd.services_tags || "—"}</span></p>
                                  <p><span className="text-muted-foreground">Completo:</span> <span className="text-foreground">{d.completed ? "✅ Sim" : "❌ Não"}</span></p>
                                  <p><span className="text-muted-foreground">Passo:</span> <span className="text-foreground">{d.step_current}/6</span></p>
                                </>
                              );
                            })()}
                          </div>
                        )}

                        <p className="text-[10px] text-muted-foreground">
                          {new Date(p.updated_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default AdminPipeline;
