import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban } from "lucide-react";
import { Clock } from "lucide-react";
import { ProjectCard } from "@/components/client/services/ProjectCard";
import { useClientProjects } from "@/hooks/useClientProjects";
import { SERVICE_CONFIG } from "@/config/services";

const STATUS_LABELS: Record<string, string> = {
  intake: "Onboarding",
  onboarding_in_progress: "Onboarding",
  content_ready: "Conteúdo pronto",
  lovable_prompt_ready: "Em criação",
  lovable_site_generated: "Site gerado",
  repo_created: "Repositório criado",
  vercel_deployed_preview: "Preview online",
  qa_passed: "QA aprovado",
  client_review: "Em revisão",
  vercel_deployed_prod: "Publicado",
  handoff_ready: "Entrega pronta",
  handoff_done: "Entregue",
  monthly_active: "Ativo mensal",
};

function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

const ClientProjects = () => {
  const { projects, loading } = useClientProjects();

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
        <div className="space-y-8">
          {/* Summary list — compact overview */}
          <div className="space-y-2">
            {projects.map((project) => {
              const cfg = SERVICE_CONFIG[project.service_type];
              const statusLabel = getStatusLabel(project.status);
              return (
                <div key={`summary-${project.id}`} className="glass-card-hover rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-serif text-base text-foreground">{project.name}</h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bgClass} ${cfg.accentClass}`}>
                          {cfg.shortLabel}
                        </span>
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {statusLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="capitalize">Plano: {project.plan}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(project.updated_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed cards */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              Detalhes
            </p>
            <div className="space-y-6">
              {projects.map((project) => (
                <ProjectCard
                  key={`detail-${project.id}`}
                  project={project}
                  onDomainComplete={() => window.location.reload()}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClientProjects;
