import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Plug, Check, Clock } from "lucide-react";

const integrations = [
  { name: "Google Business Profile", desc: "API para gerenciar perfis GBP dos clientes", status: "planned" },
  { name: "Asaas", desc: "Gestão de cobranças e boletos via webhooks", status: "planned" },
  { name: "n8n", desc: "Orquestração de automações e workflows", status: "planned" },
  { name: "Vercel", desc: "Deploy automático de sites dos clientes", status: "planned" },
  { name: "GitHub", desc: "Repositórios de código dos projetos", status: "planned" },
];

const AdminIntegrations = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Integrações</h1>
        <p className="mt-1 text-sm text-muted-foreground">Conecte serviços externos à plataforma</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {integrations.map((int) => (
          <div key={int.name} className="glass-card-hover rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Plug size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{int.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{int.desc}</p>
                </div>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs text-yellow-400">
                <Clock size={10} />
                Planejado
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AdminIntegrations;
