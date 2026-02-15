import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Brain, AlertTriangle, ShieldCheck, TrendingDown, Zap } from "lucide-react";
import { toast } from "sonner";

interface HealthScore {
  id: string;
  client_id: string;
  project_id: string;
  risk_level: string;
  risk_score: number;
  factors: string[];
  recommended_actions: string[];
  ai_summary: string | null;
  analyzed_at: string;
}

const RISK_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof ShieldCheck }> = {
  low: { label: "Saudável", variant: "default", icon: ShieldCheck },
  medium: { label: "Atenção", variant: "secondary", icon: AlertTriangle },
  high: { label: "Risco Alto", variant: "destructive", icon: TrendingDown },
  critical: { label: "Crítico", variant: "destructive", icon: AlertTriangle },
};

const AdminChurnAlerts = () => {
  const [scores, setScores] = useState<HealthScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchScores = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("client_health_scores")
      .select("*")
      .order("risk_score", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar dados");
    } else {
      setScores((data || []) as HealthScore[]);
    }
    setLoading(false);
  };

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("cs-ai-analysis");
      if (error) throw error;
      toast.success(`Análise concluída: ${data.analyzed} clientes analisados`);
      await fetchScores();
    } catch (err: any) {
      if (err?.status === 429) {
        toast.error("Limite de requisições excedido. Tente novamente em alguns minutos.");
      } else if (err?.status === 402) {
        toast.error("Créditos de IA insuficientes. Adicione créditos no workspace.");
      } else {
        toast.error("Erro ao executar análise de IA");
      }
    }
    setAnalyzing(false);
  };

  useEffect(() => { fetchScores(); }, []);

  const criticalCount = scores.filter((s) => s.risk_level === "critical").length;
  const highCount = scores.filter((s) => s.risk_level === "high").length;
  const mediumCount = scores.filter((s) => s.risk_level === "medium").length;
  const healthyCount = scores.filter((s) => s.risk_level === "low").length;
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b.risk_score, 0) / scores.length) : 0;

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">IA de Customer Success</h1>
          <p className="mt-1 text-sm text-muted-foreground">Análise inteligente de comportamento e alertas de churn</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchScores} disabled={loading}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Atualizar
          </Button>
          <Button size="sm" onClick={runAnalysis} disabled={analyzing}>
            <Brain size={14} className={analyzing ? "animate-pulse" : ""} />
            {analyzing ? "Analisando..." : "Rodar Análise IA"}
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Críticos</span>
            <AlertTriangle size={18} className="text-destructive" />
          </div>
          <p className="mt-2 font-serif text-3xl text-destructive">{criticalCount}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Risco Alto</span>
            <TrendingDown size={18} className="text-destructive" />
          </div>
          <p className="mt-2 font-serif text-3xl text-foreground">{highCount}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Atenção</span>
            <AlertTriangle size={18} className="text-muted-foreground" />
          </div>
          <p className="mt-2 font-serif text-3xl text-foreground">{mediumCount}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Saudáveis</span>
            <ShieldCheck size={18} className="text-primary" />
          </div>
          <p className="mt-2 font-serif text-3xl text-primary">{healthyCount}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Risco Médio</span>
            <Zap size={18} className="text-muted-foreground" />
          </div>
          <p className="mt-2 font-serif text-3xl text-foreground">{avgScore}%</p>
        </div>
      </div>

      {/* Alerts List */}
      {scores.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
          <Brain size={48} className="mb-4 text-muted-foreground" />
          <h2 className="font-serif text-xl text-foreground">Nenhuma análise realizada</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Clique em "Rodar Análise IA" para a inteligência artificial avaliar seus clientes e gerar alertas de churn.
          </p>
          <Button className="mt-6" onClick={runAnalysis} disabled={analyzing}>
            <Brain size={16} />
            {analyzing ? "Analisando..." : "Iniciar Análise"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {scores.map((score) => {
            const config = RISK_CONFIG[score.risk_level] || RISK_CONFIG.low;
            const RiskIcon = config.icon;
            return (
              <div key={score.id} className="glass-card rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      score.risk_level === "critical" || score.risk_level === "high"
                        ? "bg-destructive/10"
                        : score.risk_level === "medium"
                        ? "bg-secondary"
                        : "bg-primary/10"
                    }`}>
                      <RiskIcon size={20} className={
                        score.risk_level === "critical" || score.risk_level === "high"
                          ? "text-destructive"
                          : score.risk_level === "medium"
                          ? "text-muted-foreground"
                          : "text-primary"
                      } />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={config.variant}>{config.label}</Badge>
                        <span className="text-xs text-muted-foreground">Score: {score.risk_score}/100</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(score.analyzed_at).toLocaleDateString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {score.ai_summary && (
                  <p className="text-sm text-foreground mb-3">{score.ai_summary}</p>
                )}

                {score.factors.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Fatores de risco:</p>
                    <div className="flex flex-wrap gap-1">
                      {score.factors.map((f, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {score.recommended_actions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Ações recomendadas:</p>
                    <ul className="space-y-1">
                      {score.recommended_actions.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminChurnAlerts;
