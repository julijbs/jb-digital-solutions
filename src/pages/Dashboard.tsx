import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban, ExternalLink } from "lucide-react";

const statusLabels: Record<string, string> = {
  lead_created: "Lead criado",
  onboarding_in_progress: "Onboarding",
  content_ready: "Conteúdo pronto",
  lovable_prompt_ready: "Prompt pronto",
  lovable_site_generated: "Site gerado",
  repo_created: "Repositório criado",
  vercel_deployed_preview: "Preview no ar",
  qa_passed: "QA aprovado",
  client_review: "Em revisão",
  vercel_deployed_prod: "Publicado",
  handoff_ready: "Handoff pronto",
  handoff_done: "Entregue",
  monthly_active: "Mensal ativo",
};

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      const { data: clients } = await supabase
        .from("clients")
        .select("id")
        .eq("owner_user_id", user.id);

      if (clients && clients.length > 0) {
        const clientIds = clients.map((c) => c.id);
        const { data: projectsData } = await supabase
          .from("projects")
          .select("*")
          .in("client_id", clientIds)
          .order("created_at", { ascending: false });
        setProjects(projectsData || []);
      }
      setLoading(false);
    };
    fetchProjects();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Meus Projetos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acompanhe o status de tudo em um só lugar</p>
        </div>
        <Link to="/dashboard/new-project">
          <Button variant="hero" size="sm">
            <Plus size={16} />
            Novo Projeto
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card animate-pulse rounded-xl p-6 h-40" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
          <FolderKanban size={48} className="mb-4 text-muted-foreground" />
          <h2 className="font-serif text-xl text-foreground">Nenhum projeto ainda</h2>
          <p className="mt-2 mb-6 max-w-sm text-sm text-muted-foreground">
            Crie seu primeiro projeto e comece a organizar sua presença digital.
          </p>
          <Link to="/dashboard/new-project">
            <Button variant="hero">
              <Plus size={16} />
              Criar Projeto
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/dashboard/projects/${project.id}`}
              className="glass-card-hover rounded-xl p-6 block"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
                  {project.vertical}
                </span>
                <ExternalLink size={14} className="text-muted-foreground" />
              </div>
              <h3 className="font-serif text-lg text-foreground mb-1">
                Projeto #{project.id.slice(0, 8)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {statusLabels[project.status] || project.status}
              </p>
              {project.preview_url && (
                <p className="mt-3 text-xs text-primary truncate">{project.preview_url}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
