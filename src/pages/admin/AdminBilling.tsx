import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { CreditCard, Receipt, TrendingUp, AlertTriangle, ExternalLink, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PRODUCT_LABELS } from "@/config/pricing";

interface BillingRecord {
  id: string;
  project_id: string;
  client_id: string;
  product_type: string;
  amount: number;
  status: string;
  paid_at: string | null;
  created_at: string;
  stripe_checkout_session_id: string | null;
}

const AdminBilling = () => {
  const [records, setRecords] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBilling = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("billing")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Erro ao carregar cobranças");
    } else {
      setRecords(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const totalPaid = records.filter((r) => r.status === "paid").reduce((sum, r) => sum + r.amount, 0);
  const pending = records.filter((r) => r.status === "pending").length;
  const failed = records.filter((r) => r.status === "failed").length;
  const paidCount = records.filter((r) => r.status === "paid").length;

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      paid: { label: "Pago", variant: "default" },
      pending: { label: "Pendente", variant: "secondary" },
      failed: { label: "Falhou", variant: "destructive" },
      refunded: { label: "Reembolsado", variant: "outline" },
    };
    const info = map[status] || { label: status, variant: "outline" as const };
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Cobrança</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestão de faturas e pagamentos de todos os clientes</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchBilling} disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Atualizar
        </Button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Receita total", value: `R$ ${(totalPaid / 100).toFixed(2).replace(".", ",")}`, icon: TrendingUp, color: "text-green-400" },
          { label: "Faturas pendentes", value: String(pending), icon: Receipt, color: "text-yellow-400" },
          { label: "Falhas", value: String(failed), icon: AlertTriangle, color: "text-destructive" },
          { label: "Pagamentos confirmados", value: String(paidCount), icon: CreditCard, color: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="mt-2 font-serif text-3xl text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {records.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
          <Receipt size={48} className="mb-4 text-muted-foreground" />
          <h2 className="font-serif text-xl text-foreground">Nenhuma cobrança ainda</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            As cobranças aparecerão aqui quando os clientes forem cobrados via Stripe.
          </p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Produto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Valor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Data</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b border-border/20">
                  <td className="px-4 py-3 text-foreground">{PRODUCT_LABELS[r.product_type] || r.product_type}</td>
                  <td className="px-4 py-3 text-foreground">R$ {(r.amount / 100).toFixed(2).replace(".", ",")}</td>
                  <td className="px-4 py-3">{statusBadge(r.status)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(r.paid_at || r.created_at).toLocaleDateString("pt-BR")}
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

export default AdminBilling;
