import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { FileText, BarChart3, TrendingUp } from "lucide-react";

const AdminReports = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Relatórios</h1>
        <p className="mt-1 text-sm text-muted-foreground">Métricas consolidadas de todos os projetos</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Projetos ativos", value: "—", icon: BarChart3 },
          { label: "Taxa de conversão", value: "—", icon: TrendingUp },
          { label: "Relatórios gerados", value: "0", icon: FileText },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon size={18} className="text-primary" />
            </div>
            <p className="mt-2 font-serif text-3xl text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
        <BarChart3 size={48} className="mb-4 text-muted-foreground" />
        <h2 className="font-serif text-xl text-foreground">Relatórios GBP em breve</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Após a integração com a API do Google Business Profile, os relatórios de desempenho consolidados aparecerão aqui.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
