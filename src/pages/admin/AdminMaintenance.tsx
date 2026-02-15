import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, TrendingDown, Users, DollarSign, RefreshCw, Mail, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Subscription {
  id: string;
  status: string;
  current_period_end: string;
  created: string;
  canceled_at: string | null;
  cancel_at_period_end: boolean;
  customer_id: string;
  client_name: string;
  client_email: string;
}

interface Metrics {
  active: number;
  canceled: number;
  total: number;
  churnRate: string;
  mrr: number;
}

interface EmailLog {
  id: string;
  to_email: string;
  template: string;
  subject: string;
  status: string;
  created_at: string;
}

const TEMPLATE_LABELS: Record<string, string> = {
  onboarding_step_1: "Onboarding — Etapa 1",
  onboarding_step_2: "Onboarding — Etapa 2",
  onboarding_step_3: "Onboarding — Etapa 3",
  onboarding_step_4: "Onboarding — Etapa 4",
  onboarding_complete: "Onboarding Completo",
  site_ready_review: "Site Pronto p/ Revisão",
  site_approved: "Site Aprovado",
  site_published: "Site Publicado",
  nps_request: "Pesquisa NPS",
  testimonial_request: "Pedido Depoimento",
};

const AdminMaintenance = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"subscriptions" | "emails">("subscriptions");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, emailsRes] = await Promise.all([
        supabase.functions.invoke("admin-maintenance-stats"),
        supabase.from("email_logs").select("*").order("created_at", { ascending: false }).limit(50),
      ]);

      if (statsRes.data) {
        setSubscriptions(statsRes.data.subscriptions || []);
        setMetrics(statsRes.data.metrics || null);
      }
      if (emailsRes.data) {
        setEmailLogs(emailsRes.data as EmailLog[]);
      }
    } catch {
      toast.error("Erro ao carregar dados");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      active: { label: "Ativo", variant: "default" },
      canceled: { label: "Cancelado", variant: "destructive" },
      past_due: { label: "Atrasado", variant: "secondary" },
      trialing: { label: "Trial", variant: "outline" },
    };
    const info = map[status] || { label: status, variant: "outline" as const };
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Acompanhamento & CS</h1>
          <p className="mt-1 text-sm text-muted-foreground">Monitoramento de assinaturas, churn e emails de lifecycle</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Atualizar
        </Button>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Assinaturas ativas</span>
              <Users size={18} className="text-primary" />
            </div>
            <p className="mt-2 font-serif text-3xl text-foreground">{metrics.active}</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">MRR</span>
              <DollarSign size={18} className="text-green-400" />
            </div>
            <p className="mt-2 font-serif text-3xl text-foreground">
              R$ {metrics.mrr.toLocaleString("pt-BR")}
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Churn Rate</span>
              <TrendingDown size={18} className="text-destructive" />
            </div>
            <p className="mt-2 font-serif text-3xl text-foreground">{metrics.churnRate}%</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cancelamentos</span>
              <AlertTriangle size={18} className="text-yellow-400" />
            </div>
            <p className="mt-2 font-serif text-3xl text-foreground">{metrics.canceled}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={tab === "subscriptions" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("subscriptions")}
        >
          <Shield size={14} /> Assinaturas
        </Button>
        <Button
          variant={tab === "emails" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("emails")}
        >
          <Mail size={14} /> Emails Enviados
        </Button>
      </div>

      {tab === "subscriptions" && (
        subscriptions.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
            <Shield size={48} className="mb-4 text-muted-foreground" />
            <h2 className="font-serif text-xl text-foreground">Nenhuma assinatura ainda</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              As assinaturas de acompanhamento aparecerão aqui quando clientes contratarem.
            </p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Início</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Próx. Renovação</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-border/20">
                    <td className="px-4 py-3 text-foreground font-medium">{sub.client_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{sub.client_email}</td>
                    <td className="px-4 py-3">{statusBadge(sub.status)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(sub.created).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {sub.canceled_at
                        ? `Cancelado ${new Date(sub.canceled_at).toLocaleDateString("pt-BR")}`
                        : new Date(sub.current_period_end).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {tab === "emails" && (
        emailLogs.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
            <Mail size={48} className="mb-4 text-muted-foreground" />
            <h2 className="font-serif text-xl text-foreground">Nenhum email enviado</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Os emails de lifecycle aparecerão aqui conforme forem disparados.
            </p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Para</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Template</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Data</th>
                </tr>
              </thead>
              <tbody>
                {emailLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border/20">
                    <td className="px-4 py-3 text-foreground">{log.to_email}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {TEMPLATE_LABELS[log.template] || log.template}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={log.status === "sent" ? "default" : "destructive"}>
                        {log.status === "sent" ? "Enviado" : "Falhou"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(log.created_at).toLocaleDateString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </DashboardLayout>
  );
};

export default AdminMaintenance;
