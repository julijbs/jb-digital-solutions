import { ServiceTimeline, type TimelineStage } from "./ServiceTimeline";

// Collapsed view: group internal site_gbp stages into user-facing milestones
const clientStages: TimelineStage[] = [
  { key: "intake|onboarding_in_progress",                                               label: "Onboarding",     description: "Dados do negócio coletados" },
  { key: "content_ready",                                                                label: "Conteúdo pronto", description: "Textos e informações prontos" },
  { key: "lovable_prompt_ready|lovable_site_generated|repo_created|vercel_deployed_preview|qa_passed", label: "Criando seu site", description: "Nosso time está construindo seu site" },
  { key: "client_review",                                                                label: "Sua revisão",    description: "Revise e aprove seu site" },
  { key: "vercel_deployed_prod|handoff_ready|handoff_done",                             label: "Publicado",      description: "Seu site está no ar!" },
  { key: "monthly_active",                                                               label: "Acompanhamento", description: "Manutenção e otimização contínua" },
];

// Map incoming status to the collapsed stage key that contains it
function resolveStatus(currentStatus: string): string {
  const stage = clientStages.find((s) => s.key.split("|").includes(currentStatus));
  return stage ? stage.key : currentStatus;
}

interface ProjectTimelineProps {
  currentStatus: string;
}

export function ProjectTimeline({ currentStatus }: ProjectTimelineProps) {
  return (
    <ServiceTimeline
      stages={clientStages}
      currentStatus={resolveStatus(currentStatus)}
    />
  );
}
