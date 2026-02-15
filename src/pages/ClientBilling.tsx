import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { CreditCard, Receipt, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface BillingRecord {
  id: string;
  project_id: string;
  product_type: string;
  amount: number;
  status: string;
  paid_at: string | null;
  created_at: string;
}

const PRODUCT_LABELS: Record<string, string> = {
  site: "Site Profissional",
  gbp: "Perfil no Google",
  pacote_completo: "Pacote Completo",
};

const ClientBilling = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [records, setRecords] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const fetchBilling = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("billing")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setRecords(data || []);
    setLoading(false);
  };

  // Verify payment on success redirect
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const success = searchParams.get("success");
    if (success === "true" && sessionId) {
      setVerifying(true);
      supabase.functions
        .invoke("verify-billing-payment", { body: { session_id: sessionId } })
        .then(({ data, error }) => {
          if (error) {
            toast.error("Erro ao verificar pagamento");
          } else if (data?.status === "paid") {
            toast.success("Pagamento confirmado! 🎉");
          }
          setVerifying(false);
          fetchBilling();
        });
    }
  }, [searchParams]);

  useEffect(() => {
    fetchBilling();
  }, []);

  const paidRecords = records.filter((r) => r.status === "paid");
  const pendingRecords = records.filter((r) => r.status === "pending");
  const totalPaid = paidRecords.reduce((sum, r) => sum + r.amount, 0);

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
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Cobrança</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gerencie seus pagamentos e faturas</p>
      </div>

      {verifying && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <Loader2 size={16} className="animate-spin text-primary" />
          <span className="text-sm text-foreground">Verificando seu pagamento...</span>
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total pago</span>
            <CreditCard size={18} className="text-primary" />
          </div>
          <p className="mt-2 font-serif text-xl text-foreground">
            R$ {(totalPaid / 100).toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            {pendingRecords.length > 0 ? (
              <Clock size={18} className="text-yellow-400" />
            ) : (
              <CheckCircle2 size={18} className="text-green-400" />
            )}
          </div>
          <p className="mt-2 font-serif text-xl text-foreground">
            {pendingRecords.length > 0 ? `${pendingRecords.length} pendente(s)` : "Em dia"}
          </p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pagamentos confirmados</span>
            <CheckCircle2 size={18} className="text-primary" />
          </div>
          <p className="mt-2 font-serif text-xl text-foreground">{paidRecords.length}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-serif text-xl text-foreground">Histórico de faturas</h2>
        {records.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center rounded-xl py-12 text-center">
            <Receipt size={40} className="mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nenhuma fatura ainda</p>
            <p className="mt-1 text-xs text-muted-foreground">
              As faturas aparecerão aqui conforme o andamento do projeto.
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
      </div>
    </DashboardLayout>
  );
};

export default ClientBilling;
