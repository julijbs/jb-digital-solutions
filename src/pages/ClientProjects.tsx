import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban, ExternalLink, Clock, CheckCircle2 } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
  intake: { label: "Onboarding", color: "bg-yellow-500/10 text-yellow-400" },
  lead_created: { label: "Lead criado", color: "bg-blue-500/10 text-blue-400" },
  onboarding_in_progress: { label: "Onboarding", color: "bg-yellow-500/10 text-yellow-400" },
  content_ready: { label: "Conteúdo pronto", color: "bg-emerald-500/10 text-emerald-400" },
  lovable_prompt_ready: { label: "Prompt pronto", color: "bg-purple-500/10 text-purple-400" },
  lovable_site_generated: { label: "Site gerado", color: "bg-purple-500/10 text-purple-400" },
  repo_created: { label: "Repositório criado", color: "bg-blue-500/10 text-blue-400" },
  vercel_deployed_preview: { label: "Preview online", color: "bg-cyan-500/10 text-cyan-400" },
  qa_passed: { label: "QA aprovado", color: "bg-emerald-500/10 text-emerald-400" },
  client_review: { label: "Em revisão", color: "bg-yellow-500/10 text-yellow-400" },
  vercel_deployed_prod: { label: "Publicado", color: "bg-green-500/10 text-green-400" },
  handoff_ready: { label: "Entrega pronta", color: "bg-emerald-500/10 text-emerald-400" },
  handoff_done: { label: "Entregue", color: "bg-green-500/10 text-green-400" },
  monthly_active: { label: "Ativo mensal", color: "bg-primary/10 text-primary" },
};

const ClientProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      const { data: client } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (client) {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .eq("client_id", client.id)
          .order("created_at", { ascending: false });
        setProjects(data || []);
      }
      setLoading(false);
    };
    fetchProjects();
  }, [user]);

  const getStatus = (status: string) => statusConfig[status] || { label: status, color: "bg-secondary text-muted-foreground" };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Projetos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Todos os seus projetos e status detalhado</p>
        </div>
        <Link to="/dashboard/new-project">
          <Button variant="hero" size="sm">
            <Plus size={16} />
            Novo Projeto
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card animate-pulse rounded-xl h-24" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
          <FolderKanban size={48} className="mb-4 text-muted-foreground" />
          <h2 className="font-serif text-xl text-foreground">Nenhum projeto ainda</h2>
          <p className="mt-2 mb-6 max-w-sm text-sm text-muted-foreground">
            Crie seu primeiro projeto para começar.
          </p>
          <Link to="/dashboard/new-project">
            <Button variant="hero"><Plus size={16} /> Criar Projeto</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const st = getStatus(project.status);
            return (
              <div key={project.id} className="glass-card-hover rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif text-lg text-foreground">{project.name}</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${st.color}`}>
                        {st.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="capitalize">Plano: {project.plan}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(project.updated_at).toLocaleDateString("pt-BR")}
                      </span>
                      {project.site_url && (
                        <a href={project.site_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                          <ExternalLink size={12} /> Ver site
                        </a>
                      )}
                    </div>
                  </div>
                  {project.status === "intake" && (
                    <Link to={`/dashboard/onboarding/${project.id}`}>
                      <Button variant="heroOutline" size="sm">Continuar onboarding</Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClientProjects;
