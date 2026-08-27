import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useGbpReports } from "@/hooks/useGbpReports";
import { Button } from "@/components/ui/button";
import {
  ExternalLink, RefreshCcw, Loader2, AlertTriangle,
  MapPin, Phone, Globe, Eye, TrendingUp, MousePointerClick,
  Navigation, Star,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ── Types ────────────────────────────────────────────────────────────────────

interface GbpGap {
  field: string;
  severity: "critical" | "warning" | "info";
  title: string;
  evidence: string;
  impact: string;
  action: string;
}

interface GbpDiagnosisResult {
  total: number;
  breakdown: Record<string, number>;
  review_count: number;
  avg_rating: number;
  photo_count: number;
  gaps: GbpGap[];
  verdict: string;
  business_name: string;
  generated_at: string;
}

interface ProjectData {
  id: string;
  gbp_url: string | null;
  gbp_account_id?: string | null;
  name: string;
  clients: { business_name: string } | null;
}

interface GbpPanelProps {
  project: ProjectData;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">Score GBP</span>
        <span
          className={`font-bold text-lg ${
            score >= 70
              ? "text-green-400"
              : score >= 40
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        >
          {score}/100
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {score >= 70 ? "✅ Perfil bem otimizado" : score >= 40 ? "⚠️ Melhorias necessárias" : "🔴 Perfil incompleto — ação urgente"}
      </p>
    </div>
  );
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "border-red-500/30 bg-red-500/5 text-red-400",
  warning: "border-yellow-500/30 bg-yellow-500/5 text-yellow-400",
  info: "border-blue-500/30 bg-blue-500/5 text-blue-400",
};

const SEVERITY_LABEL: Record<string, string> = {
  critical: "🔴 Crítico",
  warning: "⚠️ Aviso",
  info: "ℹ️ Info",
};

// ── Component ─────────────────────────────────────────────────────────────────

export function GbpPanel({ project }: GbpPanelProps) {
  const { toast } = useToast();
  const [diagnosis, setDiagnosis] = useState<GbpDiagnosisResult | null>(null);
  const [diagLoading, setDiagLoading] = useState(false);

  const { data: metrics, loading: metricsLoading, error: metricsError, refetch } =
    useGbpReports(project.id);

  // Auto-load diagnosis on mount if GBP is configured
  useEffect(() => {
    if (project.gbp_url) {
      fetchDiagnosis();
    }
  }, [project.gbp_url]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDiagnosis = async () => {
    setDiagLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("gbp-diagnosis", {
        body: { project_id: project.id },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      setDiagnosis(data as GbpDiagnosisResult);
    } catch (err) {
      toast({
        title: "Erro ao carregar diagnóstico GBP",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setDiagLoading(false);
    }
  };

  // ── Render: no GBP configured ──────────────────────────────────────────────

  if (!project.gbp_url && !project.gbp_account_id) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
        <MapPin size={40} className="text-muted-foreground" />
        <h4 className="font-serif text-lg text-foreground">GBP não configurado</h4>
        <p className="text-sm text-muted-foreground max-w-sm">
          Vincule o perfil do Google Business deste cliente para ver métricas e diagnóstico.
        </p>
        <p className="text-xs text-muted-foreground">
          Use o botão "Vincular GBP" na aba Resumo para configurar.
        </p>
      </div>
    );
  }

  // ── Render: metrics ────────────────────────────────────────────────────────

  const kpis = metrics
    ? [
        { label: "Impressões (30d)", value: metrics.total_impressions.toLocaleString("pt-BR"), icon: Eye },
        { label: "Cliques no site", value: metrics.total_website_clicks.toLocaleString("pt-BR"), icon: MousePointerClick },
        { label: "Chamadas", value: metrics.total_calls.toLocaleString("pt-BR"), icon: Phone },
        { label: "Rotas solicitadas", value: metrics.total_direction_requests.toLocaleString("pt-BR"), icon: Navigation },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-foreground">
            {project.clients?.business_name || project.name}
          </h4>
          {project.gbp_url && (
            <a
              href={project.gbp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline mt-0.5"
            >
              <Globe size={11} /> Abrir no Google
              <ExternalLink size={10} />
            </a>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { refetch(); fetchDiagnosis(); }}>
            <RefreshCcw size={13} className="mr-1" /> Atualizar
          </Button>
        </div>
      </div>

      {/* Diagnosis score */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Diagnóstico GBP</h4>
        {diagLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 size={14} className="animate-spin" /> Analisando perfil…
          </div>
        ) : diagnosis ? (
          <>
            <ScoreBar score={diagnosis.total} />

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-yellow-400">
                  <Star size={14} />
                  <span className="font-bold text-foreground">{diagnosis.avg_rating.toFixed(1)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">Avaliação média</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground">{diagnosis.review_count}</p>
                <p className="text-[10px] text-muted-foreground">Avaliações</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground">{diagnosis.photo_count}</p>
                <p className="text-[10px] text-muted-foreground">Fotos</p>
              </div>
            </div>

            {/* Gaps */}
            {diagnosis.gaps.length > 0 && (
              <div className="space-y-2 pt-1">
                <h5 className="text-xs font-medium text-muted-foreground">Oportunidades de melhoria</h5>
                {diagnosis.gaps.slice(0, 5).map((gap) => (
                  <div
                    key={gap.field}
                    className={`rounded-lg border px-3 py-2 text-xs ${SEVERITY_COLORS[gap.severity]}`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium">{SEVERITY_LABEL[gap.severity]}</span>
                      <span className="font-medium text-foreground">{gap.title}</span>
                    </div>
                    <p className="text-muted-foreground">{gap.action}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <Button variant="outline" size="sm" onClick={fetchDiagnosis}>
            <TrendingUp size={13} className="mr-1" /> Analisar GBP
          </Button>
        )}
      </div>

      {/* Metrics */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Métricas — últimos 30 dias
        </h4>

        {metricsLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 size={14} className="animate-spin" /> Carregando métricas…
          </div>
        ) : metricsError ? (
          <div className="flex items-start gap-2 text-sm text-yellow-400 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
            <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Métricas indisponíveis</p>
              <p className="text-xs text-muted-foreground mt-0.5">{metricsError}</p>
            </div>
          </div>
        ) : metrics ? (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="rounded-lg bg-background/40 p-3 text-center">
                  <kpi.icon size={16} className="mx-auto mb-1 text-primary" />
                  <p className="font-bold text-lg text-foreground">{kpi.value}</p>
                  <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            {metrics.daily.length > 0 && (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={metrics.daily} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: string) => v.slice(5)} // MM-DD
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="impressions_search"
                    name="Busca"
                    stroke="hsl(var(--primary))"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="impressions_maps"
                    name="Maps"
                    stroke="hsl(var(--accent))"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="calls"
                    name="Ligações"
                    stroke="#10b981"
                    dot={false}
                    strokeWidth={1.5}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Nenhuma métrica disponível.</p>
        )}
      </div>
    </div>
  );
}
