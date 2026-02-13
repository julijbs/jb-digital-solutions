import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { CreditCard, Receipt, CheckCircle2, Clock } from "lucide-react";

const ClientBilling = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Cobrança</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gerencie seus pagamentos e faturas</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Plano atual</span>
            <CreditCard size={18} className="text-primary" />
          </div>
          <p className="mt-2 font-serif text-xl text-foreground">Essencial</p>
          <p className="mt-1 text-xs text-muted-foreground">Setup R$ 997 (50/50)</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <CheckCircle2 size={18} className="text-green-400" />
          </div>
          <p className="mt-2 font-serif text-xl text-foreground">Em dia</p>
          <p className="mt-1 text-xs text-muted-foreground">Nenhuma pendência</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Próximo vencimento</span>
            <Clock size={18} className="text-yellow-400" />
          </div>
          <p className="mt-2 font-serif text-xl text-foreground">—</p>
          <p className="mt-1 text-xs text-muted-foreground">Sem fatura ativa</p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-serif text-xl text-foreground">Histórico de faturas</h2>
        <div className="glass-card flex flex-col items-center justify-center rounded-xl py-12 text-center">
          <Receipt size={40} className="mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhuma fatura ainda</p>
          <p className="mt-1 text-xs text-muted-foreground">
            As faturas aparecerão aqui conforme o andamento do projeto.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientBilling;
