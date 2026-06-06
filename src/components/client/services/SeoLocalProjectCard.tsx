import { ExternalLink } from "lucide-react";
import { ServiceTimeline } from "@/components/client/ServiceTimeline";
import { SERVICE_CONFIG } from "@/config/services";
import type { ClientProject } from "@/hooks/useClientProjects";

interface Props {
  project: ClientProject;
}

export function SeoLocalProjectCard({ project }: Props) {
  const config = SERVICE_CONFIG.seo_local;
  const metric = project.latestMetric;
  const deliverables = project.deliverables ?? [];

  return (
    <div className="glass-card rounded-xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-serif text-lg text-foreground">{project.name}</h3>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bgClass} ${config.accentClass}`}>
              {config.shortLabel}
            </span>
          </div>
          {metric && (
            <p className="text-xs text-muted-foreground">Último relatório: {metric.period_label}</p>
          )}
        </div>
        <a
          href={config.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs ${config.accentClass} hover:bg-emerald-500/10 transition-colors whitespace-nowrap`}
        >
          {config.ctaLabel} <ExternalLink size={10} />
        </a>
      </div>

      {/* Timeline de fases SEO */}
      <ServiceTimeline stages={config.phases} currentStatus={project.status} />

      {/* Métricas do último período */}
      {metric && Object.keys(metric.metrics as Record<string, unknown>).length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            Métricas — {metric.period_label}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {config.metricFields.map((field) => {
              const val = (metric.metrics as Record<string, unknown>)[field.key];
              if (val === undefined || val === null) return null;
              return (
                <div key={field.key} className="rounded-lg bg-muted/30 px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">{field.label}</p>
                  <p className={`mt-0.5 text-base font-semibold ${config.accentClass}`}>
                    {field.unit === "R$" ? `R$ ${val}` : field.unit === "%" ? `${val}%` : String(val)}
                  </p>
                </div>
              );
            })}
          </div>
          {metric.summary && (
            <p className="mt-3 text-xs text-muted-foreground italic">{metric.summary}</p>
          )}
        </div>
      )}

      {/* Entregáveis */}
      {deliverables.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            Entregáveis
          </p>
          <div className="space-y-2">
            {deliverables.slice(0, 5).map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2">
                <div>
                  <p className="text-xs font-medium text-foreground">{d.title}</p>
                  {d.description && (
                    <p className="text-[10px] text-muted-foreground">{d.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                    {d.status}
                  </span>
                  {d.url && (
                    <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
