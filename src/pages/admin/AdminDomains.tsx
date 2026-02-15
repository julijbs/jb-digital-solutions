import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Search, Calendar, RefreshCw, ExternalLink, RotateCcw, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AdminDomains = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [renewals, setRenewals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [retrying, setRetrying] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const [projRes, renewalRes] = await Promise.all([
        supabase
          .from("projects")
          .select("id, name, custom_domain, domain_status, domain_renewal_date, domain_auto_renew, domain_payment_id, clients(business_name)")
          .not("custom_domain", "is", null)
          .order("updated_at", { ascending: false }),
        supabase
          .from("domain_renewals")
          .select("*")
          .order("renewal_date", { ascending: true }),
      ]);
      setProjects(projRes.data || []);
      setRenewals(renewalRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = projects.filter(
    (p) =>
      p.custom_domain?.toLowerCase().includes(search.toLowerCase()) ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      (p.clients as any)?.business_name?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "domain_ready":
      case "active":
        return "bg-green-500/10 text-green-400";
      case "pending":
      case "pending_dns":
      case "dns_configuring":
      case "ssl_activating":
      case "registering":
      case "payment_processing":
        return "bg-yellow-500/10 text-yellow-400";
      case "expired":
      case "payment_pending":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-secondary text-muted-foreground";
    }
  };

  const isFailedStatus = (status: string) =>
    ["payment_pending", "registering", "dns_configuring", "ssl_activating"].includes(status);

  const handleRetry = async (project: any) => {
    if (!project.custom_domain && !project.domain_payment_id) {
      toast({ title: "Sem dados de domínio para retry", variant: "destructive" });
      return;
    }
    setRetrying(project.id);
    try {
      const { data, error } = await supabase.functions.invoke("domain-register", {
        body: {
          domain: project.custom_domain,
          projectId: project.id,
          sessionId: project.domain_payment_id || "retry",
        },
      });
      if (error) throw error;
      if (data.success) {
        toast({ title: "Domínio registrado com sucesso! 🎉" });
        // Refresh data
        const { data: updated } = await supabase
          .from("projects")
          .select("id, name, custom_domain, domain_status, domain_renewal_date, domain_auto_renew, domain_payment_id, clients(business_name)")
          .not("custom_domain", "is", null)
          .order("updated_at", { ascending: false });
        setProjects(updated || []);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast({ title: "Erro no retry", description: err.message, variant: "destructive" });
    }
    setRetrying(null);
  };

  const stats = [
    { label: "Domínios ativos", value: projects.filter((p) => p.domain_status === "active").length, icon: Globe, color: "text-green-400" },
    { label: "Pendentes", value: projects.filter((p) => ["pending", "pending_dns"].includes(p.domain_status)).length, icon: RefreshCw, color: "text-yellow-400" },
    { label: "Renovações próximas", value: renewals.filter((r) => {
      const days = Math.ceil((new Date(r.renewal_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days <= 30 && days > 0;
    }).length, icon: Calendar, color: "text-primary" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Domínios</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gerencie todos os domínios registrados</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
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

      <div className="mb-6 relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar domínio…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="glass-card animate-pulse rounded-xl h-16" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
          <Globe size={48} className="mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhum domínio registrado</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Domínio</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium hidden sm:table-cell">Cliente</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Status</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium hidden md:table-cell">Renovação</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium hidden md:table-cell">Auto-renew</th>
                <th className="px-4 py-3 text-right text-muted-foreground font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p: any) => (
                <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3 text-foreground font-medium">{p.custom_domain}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {(p.clients as any)?.business_name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${getStatusBadge(p.domain_status)}`}>
                      {p.domain_status || "não configurado"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {p.domain_renewal_date
                      ? new Date(p.domain_renewal_date).toLocaleDateString("pt-BR")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs ${p.domain_auto_renew ? "text-green-400" : "text-muted-foreground"}`}>
                      {p.domain_auto_renew ? "Sim" : "Não"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                    {isFailedStatus(p.domain_status) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-yellow-400 hover:text-yellow-300"
                        disabled={retrying === p.id}
                        onClick={() => handleRetry(p)}
                      >
                        {retrying === p.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <RotateCcw size={12} />
                        )}
                        Retry
                      </Button>
                    )}
                    {p.custom_domain && (
                      <a href={`https://${p.custom_domain}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <ExternalLink size={12} />
                        </Button>
                      </a>
                    )}
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

export default AdminDomains;
