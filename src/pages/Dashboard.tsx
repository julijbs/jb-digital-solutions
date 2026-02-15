import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban, ExternalLink, Globe, Eye } from "lucide-react";
import { DomainPurchaseFlow } from "@/components/domain/DomainPurchaseFlow";
import { ProjectTimeline } from "@/components/client/ProjectTimeline";

const Dashboard = () => {
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
        const { data: projectsData } = await supabase
          .from("projects")
          .select("*")
          .eq("client_id", client.id)
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
        <>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="glass-card rounded-xl p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-serif text-lg text-foreground">{project.name}</h3>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
                        {project.plan}
                      </span>
                    </div>
                    {project.custom_domain && project.domain_status === "domain_ready" && (
                      <div className="flex items-center gap-1 text-xs text-accent">
                        <Globe size={12} />
                        <span>{project.custom_domain}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {project.site_url && (
                      <a
                        href={project.site_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Eye size={12} /> Ver site <ExternalLink size={10} />
                      </a>
                    )}
                    {project.status === "intake" && (
                      <Link to={`/dashboard/onboarding/${project.id}`}>
                        <Button variant="hero" size="sm">Continuar onboarding</Button>
                      </Link>
                    )}
                    {project.status === "client_review" && (
                      <Link to="/dashboard/review">
                        <Button variant="hero" size="sm">Revisar site</Button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <ProjectTimeline currentStatus={project.status} />
              </div>
            ))}
          </div>

          {projects.some((p: any) => p.domain_status === "not_configured") && (
            <div className="mt-8">
              <DomainPurchaseFlow
                projectId={projects.find((p: any) => p.domain_status === "not_configured")?.id}
                onComplete={() => window.location.reload()}
              />
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
