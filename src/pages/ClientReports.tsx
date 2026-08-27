import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useGbpReports } from "@/hooks/useGbpReports";
import {
  FileText, TrendingUp, Eye, MousePointerClick,
  Phone, Navigation, Loader2, AlertTriangle, Globe,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ActiveProject {
  id: string;
  name: string;
  status: string;
  site_url: string | null;
  gbp_url: string | null;
}

// ── Status label helpers ───────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  intake: "Intake em andamento",
  onboarding_in_progress: "Onboarding em andamento",
  content_ready: "Conteúdo pronto",
  lovable_prompt_ready: "Gerando site",
  lovable_site_generated: "Site gerado",
  repo_created: "Repositório criado",
  vercel_deployed_preview: "Preview disponível",
  qa_passed: "QA aprovado",
  client_review: "Aguardando sua revisão",
  vercel_deployed_prod: "Site publicado",
  handoff_ready: "Entrega pronta",
  handoff_done: "Entregue",
  monthly_active: "Ativo — Acompanhamento mensal",
};

const ACTIVE_STATUSES = [
  "vercel_deployed_prod",
  "handoff_ready",
  "handoff_done",
  "monthly_active",
];

// ── Component ─────────────────────────────────────────────────────────────────

const ClientReports = () => {
  const { user } = useAuth();
  const [activeProject, setActiveProject] = useState<ActiveProject | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);

  // Find the most advanced project for this client
  useEffect(() => {
    const fetchProject = async () => {
      if (!user) return;

      const { data: client } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!client) { setLoadingProject(false); return; }

      const { data: projects } = await supabase
        .from("projects")
        .select("id, name, status, site_url, gbp_url")
        .eq("client_id", client.id)
        .order("updated_at", { ascending: false });

      // Prefer active project; fall back to most recent
      const active =
        (projects ?? []).find((p) => ACTIVE_STATUSES.includes(p.status)) ??
        (projects ?? [])[0] ??
        null;

      setActiveProject(active as ActiveProject | null);
      setLoadingProject(false);
    };

    fetchProject();
  }, [user]);

  // GBP metrics (only loaded when there's a project with GBP URL)
  const hasGbp = !!activeProject?.gbp_url;
  const { data: gbpData, loading: gbpLoading, error: gbpError } = useGbpReports(
    hasGbp ? activeProject?.id : undefined
  );

  // ── Loading ──────────────────────────────────────────────────────────────

  if (loadingProject) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  // ── No project yet ───────────────────────────────────────────────────────

  if (!activeProject) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="font-serif text-2xl text-foreground">Relatórios</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe o desempenho da sua presença digital
          </p>
        </div>
        <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
          <FileText size={48} className="mb-4 text-muted-foreground" />
          <h2 className="font-serif text-xl text-foreground">Nenhum projeto ainda</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Crie seu primeiro projeto para começar a acompanhar o desempenho.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // ── KPI values ───────────────────────────────────────────────────────────

  const kpis = [
    {
      label: "Impressões",
      value: gbpData ? gbpData.total_impressions.toLocaleString("pt-BR") : "—",
      icon: Eye,
      desc: "no Google (30 dias)",
    },
    {
      label: "Cliques no site",
      value: gbpData ? gbpData.total_website_clicks.toLocaleString("pt-BR") : "—",
      icon: MousePointerClick,
      desc: "via GBP (30 dias)",
    },
    {
      label: "Ligações",
      value: gbpData ? gbpData.total_calls.toLocaleString("pt-BR") : "—",
      icon: Phone,
      desc: "via GBP (30 dias)",
    },
    {
      label: "Rotas solicitadas",
      value: gbpData ? gbpData.total_direction_requests.toLocaleString("pt-BR") : "—",
      icon: Navigation,
      desc: "no Maps (30 dias)",
    },
  ];

  const isActive = ACTIVE_STATUSES.includes(activeProject.status);
  const statusLabel = STATUS_LABELS[activeProject.status] ?? activeProject.status;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Relatórios</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Acompanhe o desempenho da sua presença digital
        </p>
      </div>

      {/* Project status banner */}
      {!isActive && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <TrendingUp size={18} className="text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">{activeProject.name}</p>
            <p className="text-xs text-muted-foreground">
              Status atual: <span className="text-primary">{statusLabel}</span> — Os relatórios
              de desempenho ficam disponíveis após a publicação do site.
            </p>
          </div>
        </div>
      )}

      {/* Site link */}
      {activeProject.site_url && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm">
          <Globe size={14} className="text-primary flex-shrink-0" />
          <span className="text-muted-foreground">Seu site:</span>
          <a
            href={activeProject.site_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline truncate"
          >
            {activeProject.site_url}
          </a>
        </div>
      )}

      {/* KPI Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              {gbpLoading ? (
                <Loader2 size={16} className="animate-spin text-muted-foreground" />
              ) : (
                <stat.icon size={18} className="text-primary" />
              )}
            </div>
            <p className="mt-2 font-serif text-3xl text-foreground">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* GBP Chart or placeholder */}
      {!hasGbp ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
          <FileText size={48} className="mb-4 text-muted-foreground" />
          <h2 className="font-serif text-xl text-foreground">
            {isActive ? "Perfil Google não vinculado" : "Relatórios em breve"}
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {isActive
              ? "Solicite ao nosso time a vinculação do seu Google Business Profile para ver as métricas de desempenho."
              : "Após a publicação do seu site e integração com o Google Meu Negócio, os relatórios aparecem aqui automaticamente."}
          </p>
        </div>
      ) : gbpError ? (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-start gap-3 text-yellow-400">
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Relatório indisponível no momento</p>
              <p className="text-xs text-muted-foreground mt-1">{gbpError}</p>
            </div>
          </div>
        </div>
      ) : gbpData && gbpData.daily.length > 0 ? (
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Evolução — últimos 30 dias
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={gbpData.daily} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: string) => v.slice(5)}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="impressions_search"
                name="Busca Google"
                stroke="hsl(var(--primary))"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="impressions_maps"
                name="Google Maps"
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
              <Line
                type="monotone"
                dataKey="website_clicks"
                name="Cliques no site"
                stroke="#f59e0b"
                dot={false}
                strokeWidth={1.5}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-3 text-xs text-muted-foreground text-center">
            Fonte: Google Business Profile API · Atualizado diariamente
          </p>
        </div>
      ) : gbpLoading ? (
        <div className="glass-card rounded-xl p-6 flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Carregando métricas do Google…</span>
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default ClientReports;
