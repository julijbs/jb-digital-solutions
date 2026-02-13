import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Users, FolderKanban, AlertTriangle, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ clients: 0, projects: 0, alerts: 0, active: 0 });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [clientsRes, projectsRes] = await Promise.all([
        supabase.from("clients").select("id", { count: "exact" }),
        supabase.from("projects").select("*").order("updated_at", { ascending: false }).limit(10),
      ]);

      const projects = projectsRes.data || [];
      const activeCount = projects.filter((p) => p.status === "monthly_active").length;
      const alertCount = projects.filter((p) =>
        ["onboarding_in_progress", "client_review"].includes(p.status)
      ).length;

      setStats({
        clients: clientsRes.count || 0,
        projects: projects.length,
        alerts: alertCount,
        active: activeCount,
      });
      setRecentProjects(projects);
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    { label: "Clientes", value: stats.clients, icon: Users, color: "text-primary" },
    { label: "Projetos", value: stats.projects, icon: FolderKanban, color: "text-accent" },
    { label: "Alertas", value: stats.alerts, icon: AlertTriangle, color: "text-destructive" },
    { label: "Mensais ativos", value: stats.active, icon: TrendingUp, color: "text-green-400" },
  ];

  const statusLabels: Record<string, string> = {
    lead_created: "Lead",
    onboarding_in_progress: "Onboarding",
    content_ready: "Conteúdo",
    lovable_prompt_ready: "Prompt",
    lovable_site_generated: "Site",
    repo_created: "Repo",
    vercel_deployed_preview: "Preview",
    qa_passed: "QA",
    client_review: "Revisão",
    vercel_deployed_prod: "Prod",
    handoff_ready: "Handoff",
    handoff_done: "Entregue",
    monthly_active: "Mensal",
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Painel Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visão geral de todos os projetos e clientes</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="mt-2 font-serif text-3xl text-foreground">
              {loading ? "—" : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-4 font-serif text-xl text-foreground">Projetos Recentes</h2>
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
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">ID</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Vertical</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Atualizado</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
                    <td className="px-4 py-3 font-mono text-xs text-foreground">{p.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 capitalize text-foreground">{p.vertical}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {statusLabels[p.status] || p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(p.updated_at).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
