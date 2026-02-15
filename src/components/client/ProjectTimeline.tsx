import { Check, Circle, Clock } from "lucide-react";

const stages = [
  { key: "intake", label: "Onboarding", description: "Preenchimento dos dados do negócio" },
  { key: "onboarding_in_progress", label: "Onboarding", description: "Preenchimento dos dados do negócio" },
  { key: "content_ready", label: "Conteúdo pronto", description: "Textos e informações coletados" },
  { key: "lovable_prompt_ready", label: "Em criação", description: "Seu site está sendo criado" },
  { key: "lovable_site_generated", label: "Site gerado", description: "Seu site foi gerado com sucesso" },
  { key: "client_review", label: "Sua revisão", description: "Revise e aprove seu site" },
  { key: "vercel_deployed_prod", label: "Publicado", description: "Seu site está no ar!" },
  { key: "handoff_done", label: "Entregue", description: "Projeto finalizado" },
  { key: "monthly_active", label: "Ativo", description: "Acompanhamento e manutenção" },
];

// Collapsed view: group internal stages into user-facing milestones
const clientStages = [
  { keys: ["intake", "onboarding_in_progress"], label: "Onboarding", description: "Dados do negócio coletados" },
  { keys: ["content_ready"], label: "Conteúdo pronto", description: "Textos e informações prontos" },
  { keys: ["lovable_prompt_ready", "lovable_site_generated", "repo_created", "vercel_deployed_preview", "qa_passed"], label: "Criando seu site", description: "Nosso time está construindo seu site" },
  { keys: ["client_review"], label: "Sua revisão", description: "Revise e aprove seu site" },
  { keys: ["vercel_deployed_prod", "handoff_ready", "handoff_done"], label: "Publicado", description: "Seu site está no ar!" },
  { keys: ["monthly_active"], label: "Acompanhamento", description: "Manutenção e otimização contínua" },
];

interface ProjectTimelineProps {
  currentStatus: string;
}

export function ProjectTimeline({ currentStatus }: ProjectTimelineProps) {
  const currentIndex = clientStages.findIndex((s) =>
    s.keys.includes(currentStatus)
  );

  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-2">
      {clientStages.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isFuture = index > currentIndex;

        return (
          <div key={stage.label} className="flex items-start flex-1 min-w-[100px]">
            <div className="flex flex-col items-center text-center w-full">
              {/* Icon */}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                  isCompleted
                    ? "border-green-500 bg-green-500/10 text-green-500"
                    : isCurrent
                    ? "border-primary bg-primary/10 text-primary animate-pulse"
                    : "border-border bg-muted/30 text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <Check size={14} />
                ) : isCurrent ? (
                  <Clock size={14} />
                ) : (
                  <Circle size={10} />
                )}
              </div>

              {/* Label */}
              <p
                className={`mt-2 text-xs font-medium leading-tight ${
                  isCompleted
                    ? "text-green-500"
                    : isCurrent
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {stage.label}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground leading-tight max-w-[90px]">
                {stage.description}
              </p>
            </div>

            {/* Connector line */}
            {index < clientStages.length - 1 && (
              <div
                className={`mt-4 h-0.5 flex-1 min-w-[16px] ${
                  isCompleted ? "bg-green-500" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
