import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink, Globe, Wand2, Star, Settings } from "lucide-react";
import { ProjectTimeline } from "@/components/client/ProjectTimeline";
import { DomainPurchaseFlow } from "@/components/domain/DomainPurchaseFlow";
import { useAuth } from "@/contexts/AuthContext";
import type { ClientProject } from "@/hooks/useClientProjects";

interface Props {
  project: ClientProject;
  onDomainComplete?: () => void;
}

export function SiteGbpProjectCard({ project, onDomainComplete }: Props) {
  const { role } = useAuth();
  const isAdmin = role === "admin_jb";

  return (
    <div className="glass-card rounded-xl p-6 space-y-5 border border-border/70 hover:border-primary/30 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h3 className="font-serif text-lg text-foreground">{project.name}</h3>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
              {project.plan}
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              Site + GBP
            </span>
          </div>
          {project.custom_domain && project.domain_status === "domain_ready" && (
            <div className="flex items-center gap-1 text-xs text-accent">
              <Globe size={12} />
              <span>{project.custom_domain}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && (
            <>
              <Link to={`/admin/projects/${project.id}?tab=gerar-site`}>
                <Button variant="hero" size="sm" className="gap-1.5 shadow-sm">
                  <Wand2 size={13} /> Gerar Site (IA)
                </Button>
              </Link>
              <Link to={`/admin/projects/${project.id}?tab=gbp`}>
                <Button variant="outline" size="sm" className="gap-1.5 border-primary/30 hover:bg-primary/10">
                  <Star size={13} className="text-primary fill-primary" /> Gerenciar GBP
                </Button>
              </Link>
              <Link to={`/admin/projects/${project.id}`}>
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <Settings size={13} /> Admin
                </Button>
              </Link>
            </>
          )}

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

      {/* Domain purchase */}
      {project.domain_status === "not_configured" && onDomainComplete && (
        <DomainPurchaseFlow
          projectId={project.id}
          onComplete={onDomainComplete}
        />
      )}
    </div>
  );
}
