import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Users, FolderKanban, AlertTriangle, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const pipelineStages = [
  { key: "intake", label: "Intake" },
  { key: "onboarding_in_progress", label: "Onboarding" },
  { key: "content_ready", label: "Conteúdo" },
  { key: "lovable_prompt_ready", label: "Prompt" },
  { key: "lovable_site_generated", label: "Site" },
  { key: "repo_created", label: "Repo" },
  { key: "vercel_deployed_preview", label: "Preview" },
  { key: "qa_passed", label: "QA" },
  { key: "client_review", label: "Revisão" },
  { key: "vercel_deployed_prod", label: "Produção" },
  { key: "handoff_ready", label: "Entrega" },
  { key: "handoff_done", label: "Entregue" },
  { key: "monthly_active", label: "Ativo" },
];

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({ clients: 0, projects: 0, alerts: 0, active: 0 });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [pipelineData, setPipelineData] = useState<{ name: string; count: number }[]>([]);
  const [planData, setPlanData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [clientsRes, projectsRes] = await Promise.all([
        supabase.from("clients").select("id", { count: "exact" }),
        supabase.from("projects").select("*, clients(business_name)").order("updated_at", { ascending: false }),
      ]);

      const allProjects = projectsRes.data || [];
      const activeCount = allProjects.filter((p: any) => p.status === "monthly_active").length;
      const alertCount = allProjects.filter((p: any) =>
        ["intake", "client_review"].includes(p.status)
      ).length;

      setStats({
        clients: clientsRes.count || 0,
        projects: allProjects.length,
        alerts: alertCount,
        active: activeCount,
      });
      setRecentProjects(allProjects.slice(0, 8));

      // Pipeline distribution
      const stageCounts = pipelineStages.map((s) => ({
        name: s.label,
        count: allProjects.filter((p: any) => p.status === s.key).length,
      })).filter((s) => s.count > 0);
      setPipelineData(stageCounts);

      // Plan distribution
      const plans: Record<string, number> = {};
      allProjects.forEach((p: any) => {
        plans[p.plan] = (plans[p.plan] || 0) + 1;
      });
      setPlanData(Object.entries(plans).map(([name, value]) => ({ name, value })));

      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    { label: "Clientes", value: stats.clients, icon: Users, color: "text-primary", link: "/admin/clients" },
    { label: "Projetos", value: stats.projects, icon: FolderKanban, color: "text-accent", link: "/admin/pipeline" },
    { label: "Ações pendentes", value: stats.alerts, icon: AlertTriangle, color: "text-destructive", link: "/admin/pipeline" },
    { label: "Mensais ativos", value: stats.active, icon: TrendingUp, color: "text-green-400", link: "/admin/pipeline" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Painel Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visão geral de todos os projetos e clientes</p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.link} className="glass-card-hover rounded-xl p-5 block">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="mt-2 font-serif text-3xl text-foreground">
              {loading ? "—" : stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        {/* Pipeline Chart */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Distribuição do Pipeline</h3>
          {loading ? (
            <div className="h-48 animate-pulse rounded bg-secondary/30" />
          ) : pipelineData.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-12">Nenhum projeto ainda</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pipelineData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Plan Distribution */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Distribuição por Plano</h3>
          {loading ? (
            <div className="h-48 animate-pulse rounded bg-secondary/30" />
          ) : planData.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-12">Nenhum projeto ainda</p>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={planData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} strokeWidth={0}>
                    {planData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {planData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <div className="h-3 w-3 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-muted-foreground capitalize">{item.name}</span>
                    <span className="font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl text-foreground">Projetos Recentes</h2>
        <Link to="/admin/pipeline">
          <Button variant="ghost" size="sm" className="text-xs">
            Ver Pipeline <ArrowRight size={14} />
          </Button>
        </Link>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card animate-pulse rounded-xl h-16" />
          ))}
        </div>
      ) : recentProjects.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum projeto ainda.</p>
      ) : (
        <div className="glass-card overflow-hidden rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Nome</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium hidden sm:table-cell">Cliente</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Plano</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Status</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium hidden md:table-cell">Atualizado</th>
                <th className="px-4 py-3 text-right text-muted-foreground font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((p: any) => (
                <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3 text-foreground font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {(p.clients as any)?.business_name || "—"}
                  </td>
                  <td className="px-4 py-3 capitalize text-foreground">{p.plan}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {pipelineStages.find((s) => s.key === p.status)?.label || p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(p.updated_at).toLocaleDateString("pt-BR")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/projects/${p.id}`}>
                      <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                        Detalhes <ArrowRight size={12} />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
