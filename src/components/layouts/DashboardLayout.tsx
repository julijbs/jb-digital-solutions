import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  CreditCard,
  FileText,
  Plug,
  Sparkles,
  MapPin,
  CheckCircle2,
  Bell,
  Folder,
  DollarSign,
  BarChart3,
  Globe,
  Palette,
  Shield,
  Star,
  Brain,
  Search,
} from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";
import jbLogo from "@/assets/jb-logo.jpg";

const clientLinks = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projetos", icon: FolderKanban },
  { href: "/dashboard/review", label: "Revisão", icon: CheckCircle2 },
  { href: "/dashboard/reports", label: "Relatórios", icon: FileText },
  { href: "/dashboard/billing", label: "Cobrança", icon: CreditCard },
];

const adminSections = [
  {
    label: "Visão Geral",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Produção",
    items: [
      { href: "/admin/site-generator", label: "Gerar Site com IA", icon: Sparkles },
      { href: "/admin/site-diagnosis", label: "Diagnóstico de Site", icon: Search },
      { href: "/admin/gbp-diagnosis", label: "Diagnóstico GBP", icon: Star },
      { href: "/admin/pipeline", label: "Pipeline", icon: FolderKanban },
      { href: "/admin/prompt-generator", label: "Gerador de Prompt", icon: FileText },
    ],
  },
  {
    label: "Clientes",
    items: [
      { href: "/admin/clients", label: "Clientes", icon: Users },
      { href: "/admin/gbp", label: "Perfil no Google", icon: MapPin },
      { href: "/admin/maintenance", label: "Acompanhamento", icon: Shield },
      { href: "/admin/feedback", label: "NPS & Depoimentos", icon: Star },
      { href: "/admin/churn-alerts", label: "IA de CS", icon: Brain },
    ],
  },
  {
    label: "Gestão",
    items: [
      { href: "/admin/billing", label: "Financeiro", icon: DollarSign },
      { href: "/admin/reports", label: "Relatórios", icon: BarChart3 },
      { href: "/admin/domains", label: "Domínios", icon: Globe },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/admin/templates", label: "Templates", icon: Palette },
      { href: "/admin/integrations", label: "Integrações", icon: Plug },
      { href: "/admin/settings", label: "Configurações", icon: Settings },
    ],
  },
];

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { role, signOut, user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = role === "admin_jb";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-card transition-transform duration-200 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={jbLogo} alt="JB Digital Consulting" className="h-8 w-auto rounded-lg" />
          </Link>
          <button className="text-muted-foreground lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {isAdmin ? (
            adminSections.map((section) => (
              <div key={section.label} className="mb-2">
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {section.label}
                </p>
                {section.items.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <link.icon size={16} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            ))
          ) : (
            clientLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              );
            })
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-3">
          <div className="mb-2 px-3 text-xs text-muted-foreground truncate">
            {user?.email}
          </div>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex-1">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:px-8">
          <button className="text-foreground lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <NotificationBell />
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
            {role === "admin_jb" ? "Admin" : "Cliente"}
          </span>
        </header>
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
};
