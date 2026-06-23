import type { ClientProject } from "@/hooks/useClientProjects";
import { SiteGbpProjectCard } from "./SiteGbpProjectCard";

interface Props {
  project: ClientProject;
  onDomainComplete?: () => void;
}

export function ProjectCard({ project, onDomainComplete }: Props) {
  return <SiteGbpProjectCard project={project} onDomainComplete={onDomainComplete} />;
}
