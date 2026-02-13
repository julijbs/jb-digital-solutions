import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { FolderKanban } from "lucide-react";

const pipelineStages = [
  { key: "intake", label: "Onboarding" },
  { key: "content_ready", label: "Conteúdo pronto" },
  { key: "lovable_prompt_ready", label: "Prompt pronto" },
  { key: "lovable_site_generated", label: "Site gerado" },
  { key: "vercel_deployed_preview", label: "Preview" },
  { key: "qa_passed", label: "QA aprovado" },
  { key: "client_review", label: "Revisão cliente" },
  { key: "vercel_deployed_prod", label: "Produção" },
  { key: "handoff_done", label: "Entregue" },
  { key: "monthly_active", label: "Ativo mensal" },
];

const AdminPipeline = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*, clients(business_name)")
        .order("updated_at", { ascending: false });
      setProjects(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

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
            <div key={stage.key} className="min-w-[220px] flex-shrink-0">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stage.label}
                </h3>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                  {stageProjects.length}
                </span>
              </div>
              <div className="space-y-2">
                {stageProjects.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-4 text-center">
                    <p className="text-xs text-muted-foreground">Vazio</p>
                  </div>
                ) : (
                  stageProjects.map((p: any) => (
                    <div key={p.id} className="glass-card-hover rounded-lg p-3">
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(p.clients as any)?.business_name || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(p.updated_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  ))
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
