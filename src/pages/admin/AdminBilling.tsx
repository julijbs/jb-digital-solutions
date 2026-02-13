import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { CreditCard, Receipt, TrendingUp, AlertTriangle } from "lucide-react";

const AdminBilling = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Cobrança</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gestão de faturas e pagamentos de todos os clientes</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Receita mensal", value: "R$ 0", icon: TrendingUp, color: "text-green-400" },
          { label: "Faturas pendentes", value: "0", icon: Receipt, color: "text-yellow-400" },
          { label: "Inadimplentes", value: "0", icon: AlertTriangle, color: "text-destructive" },
          { label: "Clientes pagantes", value: "0", icon: CreditCard, color: "text-primary" },
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

      <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
        <Receipt size={48} className="mb-4 text-muted-foreground" />
        <h2 className="font-serif text-xl text-foreground">Integração Asaas em breve</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          A gestão completa de cobranças será integrada com o Asaas via webhooks n8n.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default AdminBilling;
