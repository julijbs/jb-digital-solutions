import { Check, Circle, Clock } from "lucide-react";

export interface TimelineStage {
  key: string;
  label: string;
  description: string;
}

interface ServiceTimelineProps {
  stages: TimelineStage[];
  currentStatus: string;
}

export function ServiceTimeline({ stages, currentStatus }: ServiceTimelineProps) {
  const currentIndex = stages.findIndex((s) => s.key === currentStatus);

  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-2">
      {stages.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={stage.key} className="flex items-start flex-1 min-w-[100px]">
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
            {index < stages.length - 1 && (
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
