import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban } from "lucide-react";
import { ProjectCard } from "@/components/client/services/ProjectCard";
import { useClientProjects } from "@/hooks/useClientProjects";

const Dashboard = () => {
  const { projects, loading } = useClientProjects();

  const handleDomainComplete = () => window.location.reload();

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
        <div className="space-y-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDomainComplete={handleDomainComplete}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
