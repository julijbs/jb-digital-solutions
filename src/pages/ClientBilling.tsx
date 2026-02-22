import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { CreditCard, Receipt, CheckCircle2, Clock, Loader2, ArrowRight, Star, ExternalLink } from "lucide-react";
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

const PLANS = [
  {
    key: "site",
    name: "Site Profissional",
    tag: "Site Otimizado para Google",
    price: "R$ 597",
    priceValue: 59700,
    featured: false,
    features: [
      "Site institucional one-page",
      "Otimização básica para SEO",
      "Hospedagem inclusa (sem mensalidade)",
      "Mobile-first e carregamento rápido",
      "Entrega em até 7 dias",
    ],
  },
  {
    key: "gbp",
    name: "Perfil da Empresa no Google",
    tag: "Perfil no Google",
    price: "R$ 597",
    priceValue: 59700,
    featured: false,
    features: [
      "Criação/otimização do Perfil no Google",
      "Categorização estratégica",
      "Integração de dados (NAP)",
      "Configuração de horários e serviços",
      "Entrega em até 7 dias",
    ],
  },
  {
    key: "pacote_completo",
    name: "Presença Google Essencial",
    tag: "Pacote Completo — Site + Perfil no Google",
    price: "R$ 997",
    priceValue: 99700,
    savings: "economize R$ 197",
    featured: true,
    features: [
      "Tudo do Site Profissional",
      "Tudo do Perfil no Google",
      "Conexão técnica entre site e perfil",
      "Dados sincronizados e consistentes",
      "Presença digital completa e profissional",
    ],
  },
];

const ClientBilling = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [records, setRecords] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [clientData, setClientData] = useState<{ id: string; project_id: string } | null>(null);

  const fetchBilling = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("billing")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setRecords(data || []);
    setLoading(false);
  };

  const fetchClientData = async () => {
    if (!user) return;
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!client) return;

    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("client_id", client.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (project) {
      setClientData({ id: client.id, project_id: project.id });
    }
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
    fetchClientData();
  }, [user]);

  const handleCheckout = async (productType: string) => {
    if (!clientData) {
      toast.error("Dados do cliente não encontrados. Complete seu cadastro primeiro.");
      return;
    }

    setCheckoutLoading(productType);
    try {
      const { data, error } = await supabase.functions.invoke("create-billing-checkout", {
        body: {
          product_type: productType,
          project_id: clientData.project_id,
          client_id: clientData.id,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      toast.error("Erro ao iniciar checkout. Tente novamente.");
      console.error(err);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const paidRecords = records.filter((r) => r.status === "paid");
  const pendingRecords = records.filter((r) => r.status === "pending");
  const totalPaid = paidRecords.reduce((sum, r) => sum + r.amount, 0);
  const paidProductTypes = paidRecords.map((r) => r.product_type);

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
        <p className="mt-1 text-sm text-muted-foreground">Gerencie seus pagamentos e escolha seu plano</p>
      </div>

      {verifying && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <Loader2 size={16} className="animate-spin text-primary" />
          <span className="text-sm text-foreground">Verificando seu pagamento...</span>
        </div>
      )}

      {/* Plan selection */}
      <div className="mb-10">
        <h2 className="mb-4 font-serif text-xl text-foreground">Escolha seu plano</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const isPaid = paidProductTypes.includes(plan.key);
            return (
              <div
                key={plan.key}
                className={`relative rounded-2xl p-5 ${
                  plan.featured
                    ? "glass-card border-primary/30 shadow-lg shadow-primary/10"
                    : "glass-card"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-5 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    <Star size={12} /> Mais escolhido
                  </div>
                )}

                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {plan.tag}
                </div>
                <h3 className="font-serif text-xl text-foreground">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-serif text-2xl text-primary">{plan.price}</span>
                  {plan.savings && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {plan.savings}
                    </span>
                  )}
                </div>

                <ul className="mt-4 space-y-2">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>

                {isPaid ? (
                  <Button variant="outline" className="mt-5 w-full gap-2" disabled>
                    <CheckCircle2 size={16} /> Pago
                  </Button>
                ) : (
                  <Button
                    variant={plan.featured ? "default" : "outline"}
                    className="mt-5 w-full gap-2"
                    onClick={() => handleCheckout(plan.key)}
                    disabled={checkoutLoading !== null || !clientData}
                  >
                    {checkoutLoading === plan.key ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Processando...
                      </>
                    ) : (
                      <>
                        Contratar <ExternalLink size={14} />
                      </>
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
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

      {/* Invoice history */}
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
