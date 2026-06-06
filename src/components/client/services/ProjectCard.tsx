import type { ClientProject } from "@/hooks/useClientProjects";
import { SiteGbpProjectCard } from "./SiteGbpProjectCard";
import { SeoLocalProjectCard } from "./SeoLocalProjectCard";
import { ArcProjectCard } from "./ArcProjectCard";

interface Props {
  project: ClientProject;
  onDomainComplete?: () => void;
}

export function ProjectCard({ project, onDomainComplete }: Props) {
  switch (project.service_type) {
    case "seo_local":
      return <SeoLocalProjectCard project={project} />;
    case "arc_backend":
      return <ArcProjectCard project={project} />;
    case "site_gbp":
    default:
      return <SiteGbpProjectCard project={project} onDomainComplete={onDomainComplete} />;
  }
}
