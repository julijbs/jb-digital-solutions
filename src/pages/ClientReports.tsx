import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { FileText, TrendingUp, Eye, MousePointerClick } from "lucide-react";

const ClientReports = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Relatórios</h1>
        <p className="mt-1 text-sm text-muted-foreground">Acompanhe o desempenho da sua presença digital</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Visualizações", value: "—", icon: Eye, desc: "no Google" },
          { label: "Cliques", value: "—", icon: MousePointerClick, desc: "no site" },
          { label: "Ligações", value: "—", icon: TrendingUp, desc: "via GBP" },
          { label: "Posição média", value: "—", icon: FileText, desc: "no Maps" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon size={18} className="text-primary" />
            </div>
            <p className="mt-2 font-serif text-3xl text-foreground">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
        <FileText size={48} className="mb-4 text-muted-foreground" />
        <h2 className="font-serif text-xl text-foreground">Relatórios em breve</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Após a publicação do seu site e integração com o Google Meu Negócio, os relatórios de desempenho aparecerão aqui automaticamente.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default ClientReports;
