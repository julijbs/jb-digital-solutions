import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Settings, Shield, Bell, Palette } from "lucide-react";

const AdminSettings = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gerencie as configurações da plataforma</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {[
          { icon: Shield, title: "Segurança", desc: "Configurações de autenticação e permissões" },
          { icon: Bell, title: "Notificações", desc: "E-mails automáticos e alertas" },
          { icon: Palette, title: "Personalização", desc: "Logo, cores e branding da plataforma" },
          { icon: Settings, title: "Geral", desc: "Configurações gerais do sistema" },
        ].map((item) => (
          <div key={item.title} className="glass-card-hover rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <item.icon size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
