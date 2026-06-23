import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, AlertCircle, AlertTriangle, Info, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ProjectOption {
  id: string;
  gbp_url: string;
  business_name: string;
  city: string | null;
  state: string | null;
}

interface Breakdown {
  description: number;
  categories: number;
  hours: number;
  contact: number;
  website: number;
  address: number;
  photos: number;
  reviews: number;
}

interface Gap {
  field: string;
  severity: "critical" | "warning" | "info";
  title: string;
  evidence: string;
  impact: string;
  action: string;
}

interface GBPScore {
  total: number;
  breakdown: Breakdown;
  review_count: number;
  avg_rating: number;
  photo_count: number;
  gaps: Gap[];
  verdict: string;
  business_name: string;
  generated_at: string;
}

const BREAKDOWN_LABELS: Record<keyof Breakdown, { label: string; max: number }> = {
  description: { label: "Descrição", max: 15 },
  categories: { label: "Categorias", max: 15 },
  hours: { label: "Horários", max: 15 },
  contact: { label: "Telefone", max: 10 },
  website: { label: "Site", max: 10 },
  address: { label: "Endereço", max: 10 },
  photos: { label: "Fotos", max: 15 },
  reviews: { label: "Reviews", max: 10 },
};

function scoreColor(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
}

function scoreRingColor(score: number): string {
  if (score >= 80) return "stroke-green-400";
  if (score >= 50) return "stroke-yellow-400";
  return "stroke-red-400";
}

function scoreBg(score: number): string {
  if (score >= 80) return "bg-green-500/10 border-green-500/30";
  if (score >= 50) return "bg-yellow-500/10 border-yellow-500/30";
  return "bg-red-500/10 border-red-500/30";
}

function severityIcon(severity: string) {
  if (severity === "critical") return <AlertCircle size={16} className="text-red-400 shrink-0" />;
  if (severity === "warning") return <AlertTriangle size={16} className="text-yellow-400 shrink-0" />;
  return <Info size={16} className="text-blue-400 shrink-0" />;
}

function severityBadge(severity: string) {
  if (severity === "critical") return <Badge variant="destructive">Crítico</Badge>;
  if (severity === "warning") return <Badge variant="secondary">Atenção</Badge>;
  return <Badge variant="outline">Info</Badge>;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-secondary"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={scoreRingColor(score)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${scoreColor(score)}`}>{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <span className="text-sm text-muted-foreground font-medium">Score GBP</span>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}
        />
      ))}
      <span className="text-sm text-foreground ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

const AdminGBPDiagnosis = () => {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<GBPScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Load projects that have gbp_url, joined with clients for business_name
      const { data, error } = await supabase
        .from("projects")
        .select("id, gbp_url, clients(business_name, city, state)")
        .not("gbp_url", "is", null)
        .neq("gbp_url", "");

      if (error) {
        toast.error("Erro ao carregar projetos");
        setLoading(false);
        return;
      }

      const opts: ProjectOption[] = (data || []).map((p: any) => {
        const c = Array.isArray(p.clients) ? p.clients[0] : p.clients;
        return {
          id: p.id,
          gbp_url: p.gbp_url,
          business_name: c?.business_name || p.id,
          city: c?.city || null,
          state: c?.state || null,
        };
      });

      setProjects(opts);
      setLoading(false);
    };
    load();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedProjectId) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("gbp-diagnosis", {
        body: { project_id: selectedProjectId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data as GBPScore);
      toast.success("Diagnóstico GBP concluído!");
    } catch (err: any) {
      toast.error(err?.message || "Erro ao analisar GBP");
    }
    setAnalyzing(false);
  };

  const handleCopyReport = () => {
    if (!result) return;
    const lines: string[] = [
      `DIAGNÓSTICO GBP — ${result.business_name}`,
      `Gerado em: ${new Date(result.generated_at).toLocaleString("pt-BR")}`,
      `Score Total: ${result.total}/100`,
      "",
      "PONTUAÇÃO POR DIMENSÃO:",
      ...Object.entries(result.breakdown).map(([key, val]) => {
        const info = BREAKDOWN_LABELS[key as keyof Breakdown];
        return `  ${info.label}: ${val}/${info.max} pts`;
      }),
      "",
      `Reviews: ${result.review_count} avaliações | Nota média: ${result.avg_rating.toFixed(1)} estrelas`,
      `Fotos: ${result.photo_count} foto(s)`,
      "",
      `LACUNAS ENCONTRADAS (${result.gaps.length}):`,
      ...result.gaps.map(
        (g, i) =>
          `\n${i + 1}. [${g.severity.toUpperCase()}] ${g.title}\n   Evidência: ${g.evidence}\n   Impacto: ${g.impact}\n   Ação: ${g.action}`
      ),
      "",
      "VEREDICTO:",
      result.verdict,
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      toast.success("Relatório GBP copiado!");
    });
  };

  const criticals = result?.gaps.filter((g) => g.severity === "critical") ?? [];
  const warnings = result?.gaps.filter((g) => g.severity === "warning") ?? [];
  const infos = result?.gaps.filter((g) => g.severity === "info") ?? [];

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Diagnóstico GBP</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Avalie a completude e saúde do Perfil Google do cliente
          </p>
        </div>
      </div>

      {/* Selection card */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <h2 className="font-medium text-foreground mb-4">Selecionar projeto</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Carregando projetos…
          </div>
        ) : projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum projeto com GBP vinculado. Configure a URL do GBP no onboarding do cliente.
          </p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setResult(null);
              }}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Selecione um projeto…</option>
              {projects.map((p) => {
                const location = [p.city, p.state].filter(Boolean).join("/");
                return (
                  <option key={p.id} value={p.id}>
                    {p.business_name}{location ? ` — ${location}` : ""}
                  </option>
                );
              })}
            </select>
            <Button
              onClick={handleAnalyze}
              disabled={!selectedProjectId || analyzing}
              className="shrink-0"
            >
              {analyzing ? (
                <>
                  <RefreshCw size={16} className="animate-spin mr-2" />
                  Analisando…
                </>
              ) : (
                <>
                  <Star size={16} className="mr-2" />
                  Analisar GBP
                </>
              )}
            </Button>
          </div>
        )}
        {selectedProject && (
          <p className="mt-3 text-xs text-muted-foreground">
            GBP:{" "}
            <a
              href={selectedProject.gbp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              {selectedProject.gbp_url}
            </a>
          </p>
        )}
        {analyzing && (
          <p className="mt-3 text-xs text-muted-foreground animate-pulse">
            Consultando Google Business Profile API… isso pode levar alguns segundos.
          </p>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Score overview */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <ScoreRing score={result.total} />
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="font-medium text-foreground">{result.business_name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Diagnóstico realizado em {new Date(result.generated_at).toLocaleString("pt-BR")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Avaliações</p>
                    <div className="flex items-center gap-2">
                      <StarRating rating={result.avg_rating} />
                      <span className="text-xs text-muted-foreground">({result.review_count})</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Fotos</p>
                    <p className="text-sm text-foreground font-medium">{result.photo_count} foto(s)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown bars */}
          <div>
            <h2 className="font-medium text-foreground mb-3">Pontuação por dimensão</h2>
            <div className="glass-card rounded-xl p-6">
              <div className="space-y-3">
                {(Object.entries(result.breakdown) as [keyof Breakdown, number][]).map(([key, val]) => {
                  const { label, max } = BREAKDOWN_LABELS[key];
                  const pct = max > 0 ? (val / max) * 100 : 0;
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground">{label}</span>
                        <span className={`text-sm font-medium ${scoreColor(pct)}`}>
                          {val}/{max} pts
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            pct >= 80
                              ? "bg-green-400"
                              : pct >= 50
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Gaps */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium text-foreground">
                Lacunas encontradas ({result.gaps.length})
              </h2>
              <Button variant="outline" size="sm" onClick={handleCopyReport}>
                <Copy size={14} className="mr-2" />
                Copiar relatório GBP
              </Button>
            </div>

            <div className="space-y-4">
              {criticals.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-400">
                    Críticos ({criticals.length})
                  </p>
                  {criticals.map((g, i) => (
                    <div key={i} className="glass-card rounded-lg p-4 border-l-2 border-l-red-500">
                      <div className="flex items-start gap-3">
                        {severityIcon(g.severity)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-medium text-sm text-foreground">{g.title}</span>
                            {severityBadge(g.severity)}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            <span className="font-medium text-foreground">Evidência:</span> {g.evidence}
                          </p>
                          <p className="text-xs text-muted-foreground mb-1">
                            <span className="font-medium text-foreground">Impacto:</span> {g.impact}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Ação:</span> {g.action}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {warnings.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-yellow-400">
                    Atenção ({warnings.length})
                  </p>
                  {warnings.map((g, i) => (
                    <div key={i} className="glass-card rounded-lg p-4 border-l-2 border-l-yellow-500">
                      <div className="flex items-start gap-3">
                        {severityIcon(g.severity)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-medium text-sm text-foreground">{g.title}</span>
                            {severityBadge(g.severity)}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            <span className="font-medium text-foreground">Evidência:</span> {g.evidence}
                          </p>
                          <p className="text-xs text-muted-foreground mb-1">
                            <span className="font-medium text-foreground">Impacto:</span> {g.impact}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Ação:</span> {g.action}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {infos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                    Informações ({infos.length})
                  </p>
                  {infos.map((g, i) => (
                    <div key={i} className="glass-card rounded-lg p-4 border-l-2 border-l-blue-500">
                      <div className="flex items-start gap-3">
                        {severityIcon(g.severity)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-medium text-sm text-foreground">{g.title}</span>
                            {severityBadge(g.severity)}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            <span className="font-medium text-foreground">Evidência:</span> {g.evidence}
                          </p>
                          <p className="text-xs text-muted-foreground mb-1">
                            <span className="font-medium text-foreground">Impacto:</span> {g.impact}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Ação:</span> {g.action}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.gaps.length === 0 && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-sm text-green-400">
                  Nenhuma lacuna detectada — perfil GBP bem configurado.
                </div>
              )}
            </div>
          </div>

          {/* Verdict */}
          <div className={`glass-card rounded-xl p-6 border-l-4 ${scoreBg(result.total).includes("green") ? "border-l-green-500" : scoreBg(result.total).includes("yellow") ? "border-l-yellow-500" : "border-l-red-500"}`}>
            <h2 className="font-medium text-foreground mb-2">Veredicto</h2>
            <p className="text-base text-foreground leading-relaxed">{result.verdict}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Análise realizada em {new Date(result.generated_at).toLocaleString("pt-BR")} via Google Business Profile API
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminGBPDiagnosis;
