import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink, Globe } from "lucide-react";
import { ProjectTimeline } from "@/components/client/ProjectTimeline";
import { DomainPurchaseFlow } from "@/components/domain/DomainPurchaseFlow";
import type { ClientProject } from "@/hooks/useClientProjects";

interface Props {
  project: ClientProject;
  onDomainComplete?: () => void;
}

export function SiteGbpProjectCard({ project, onDomainComplete }: Props) {
  return (
    <div className="glass-card rounded-xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
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
