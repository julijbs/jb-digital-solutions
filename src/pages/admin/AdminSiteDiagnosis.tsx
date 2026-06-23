import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, AlertCircle, AlertTriangle, Info, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
}

interface IntakeRow {
  project_id: string;
  existing_site_url: string | null;
  site_diagnosis: DiagnosisResult | null;
}

interface DiagnosisResult {
  url: string;
  generated_at: string;
  scores: {
    performance_mobile: number;
    performance_desktop: number;
    seo: number;
    accessibility: number;
    best_practices: number;
  };
  problems: Array<{
    category: "performance" | "seo" | "aeo" | "mobile" | "technical";
    severity: "critical" | "warning" | "info";
    title: string;
    evidence: string;
    impact: string;
  }>;
  verdict: string;
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
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

const SCORE_LABELS: Record<keyof DiagnosisResult["scores"], string> = {
  performance_mobile: "Performance Mobile",
  performance_desktop: "Performance Desktop",
  seo: "SEO",
  accessibility: "Acessibilidade",
  best_practices: "Boas Práticas",
};

const AdminSiteDiagnosis = () => {
  const [intakes, setIntakes] = useState<IntakeRow[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: intakeData, error } = await (supabase as any)
        .from("client_intake")
        .select("project_id, existing_site_url, site_diagnosis")
        .not("existing_site_url", "is", null)
        .neq("existing_site_url", "");

      if (error) {
        toast.error("Erro ao carregar projetos");
        setLoading(false);
        return;
      }

      const rows = (intakeData || []) as IntakeRow[];
      setIntakes(rows);

      if (rows.length > 0) {
        const ids = rows.map((r) => r.project_id);
        const { data: projectData } = await supabase
          .from("projects")
          .select("id, name")
          .in("id", ids);
        setProjects((projectData || []) as Project[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const selectedIntake = intakes.find((i) => i.project_id === selectedProjectId);
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleAnalyze = async () => {
    if (!selectedProjectId) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("site-diagnosis", {
        body: { project_id: selectedProjectId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data as DiagnosisResult);
      if (data?.warnings?.length) {
        toast.warning(`Análise parcial: ${data.warnings.join(", ")}`);
      } else {
        toast.success("Diagnóstico concluído!");
      }
    } catch (err: any) {
      toast.error(err?.message || "Erro ao analisar site");
    }
    setAnalyzing(false);
  };

  const handleCopyReport = () => {
    if (!result) return;
    const lines: string[] = [
      `DIAGNÓSTICO DE SITE — ${result.url}`,
      `Gerado em: ${new Date(result.generated_at).toLocaleString("pt-BR")}`,
      "",
      "PONTUAÇÕES:",
      ...Object.entries(result.scores).map(
        ([key, val]) => `  ${SCORE_LABELS[key as keyof DiagnosisResult["scores"]]}: ${val}/100`
      ),
      "",
      `PROBLEMAS ENCONTRADOS (${result.problems.length}):`,
      ...result.problems.map(
        (p, i) =>
          `\n${i + 1}. [${p.severity.toUpperCase()}] ${p.title}\n   Evidência: ${p.evidence}\n   Impacto: ${p.impact}`
      ),
      "",
      "VEREDICTO:",
      result.verdict,
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      toast.success("Relatório copiado!");
    });
  };

  const displayResult = result || (selectedIntake?.site_diagnosis as DiagnosisResult | null);
  const criticals = displayResult?.problems.filter((p) => p.severity === "critical") ?? [];
  const warnings = displayResult?.problems.filter((p) => p.severity === "warning") ?? [];
  const infos = displayResult?.problems.filter((p) => p.severity === "info") ?? [];

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Diagnóstico de Site</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Identifique problemas e gere evidências para o cliente
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
        ) : intakes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum projeto com URL de site cadastrada. Peça ao cliente para preencher o URL no onboarding.
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
              {intakes.map((intake) => {
                const proj = projects.find((p) => p.id === intake.project_id);
                return (
                  <option key={intake.project_id} value={intake.project_id}>
                    {proj?.name || intake.project_id} — {intake.existing_site_url}
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
                  <Search size={16} className="mr-2" />
                  Analisar site
                </>
              )}
            </Button>
          </div>
        )}
        {selectedIntake?.existing_site_url && (
          <p className="mt-3 text-xs text-muted-foreground">
            URL: <span className="text-foreground font-medium">{selectedIntake.existing_site_url}</span>
            {selectedIntake.site_diagnosis && !result && (
              <span className="ml-2 text-primary">(diagnóstico anterior disponível)</span>
            )}
          </p>
        )}
        {analyzing && (
          <p className="mt-3 text-xs text-muted-foreground animate-pulse">
            Consultando Google PageSpeed Insights (mobile + desktop)… isso pode levar 10–20 segundos.
          </p>
        )}
      </div>

      {/* Results */}
      {displayResult && (
        <div className="space-y-6">
          {/* Score cards */}
          <div>
            <h2 className="font-medium text-foreground mb-3">Pontuações</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {(Object.entries(displayResult.scores) as [keyof DiagnosisResult["scores"], number][]).map(
                ([key, score]) => (
                  <div
                    key={key}
                    className={`rounded-xl border p-4 text-center ${scoreBg(score)}`}
                  >
                    <div className={`text-3xl font-bold ${scoreColor(score)}`}>{score}</div>
                    <div className="text-xs text-muted-foreground mt-1">{SCORE_LABELS[key]}</div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Problems */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium text-foreground">
                Problemas encontrados ({displayResult.problems.length})
              </h2>
              <Button variant="outline" size="sm" onClick={handleCopyReport}>
                <Copy size={14} className="mr-2" />
                Copiar relatório
              </Button>
            </div>

            <div className="space-y-4">
              {/* Criticals */}
              {criticals.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-400">
                    Críticos ({criticals.length})
                  </p>
                  {criticals.map((p, i) => (
                    <div key={i} className="glass-card rounded-lg p-4 border-l-2 border-l-red-500">
                      <div className="flex items-start gap-3">
                        {severityIcon(p.severity)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-medium text-sm text-foreground">{p.title}</span>
                            {severityBadge(p.severity)}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            <span className="font-medium text-foreground">Evidência:</span> {p.evidence}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Impacto:</span> {p.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Warnings */}
              {warnings.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-yellow-400">
                    Atenção ({warnings.length})
                  </p>
                  {warnings.map((p, i) => (
                    <div key={i} className="glass-card rounded-lg p-4 border-l-2 border-l-yellow-500">
                      <div className="flex items-start gap-3">
                        {severityIcon(p.severity)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-medium text-sm text-foreground">{p.title}</span>
                            {severityBadge(p.severity)}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            <span className="font-medium text-foreground">Evidência:</span> {p.evidence}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Impacto:</span> {p.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Infos */}
              {infos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                    Informações ({infos.length})
                  </p>
                  {infos.map((p, i) => (
                    <div key={i} className="glass-card rounded-lg p-4 border-l-2 border-l-blue-500">
                      <div className="flex items-start gap-3">
                        {severityIcon(p.severity)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-medium text-sm text-foreground">{p.title}</span>
                            {severityBadge(p.severity)}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            <span className="font-medium text-foreground">Evidência:</span> {p.evidence}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Impacto:</span> {p.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {displayResult.problems.length === 0 && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-sm text-green-400">
                  Nenhum problema detectado — site com bom desempenho técnico.
                </div>
              )}
            </div>
          </div>

          {/* Verdict */}
          <div className="glass-card rounded-xl p-6 border-l-4 border-l-primary">
            <h2 className="font-medium text-foreground mb-2">Veredicto</h2>
            <p className="text-base text-foreground leading-relaxed">{displayResult.verdict}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Análise realizada em{" "}
              {new Date(displayResult.generated_at).toLocaleString("pt-BR")} via Google PageSpeed
              Insights
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminSiteDiagnosis;
