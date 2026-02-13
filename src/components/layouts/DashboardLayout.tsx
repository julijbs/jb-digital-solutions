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
} from "lucide-react";

const clientLinks = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projetos", icon: FolderKanban },
  { href: "/dashboard/reports", label: "Relatórios", icon: FileText },
  { href: "/dashboard/billing", label: "Cobrança", icon: CreditCard },
];

const adminLinks = [
  { href: "/admin", label: "Painel Admin", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Clientes", icon: Users },
  { href: "/admin/pipeline", label: "Pipeline", icon: FolderKanban },
  { href: "/admin/prompt-generator", label: "Gerador de Prompt", icon: Sparkles },
  { href: "/admin/billing", label: "Cobrança", icon: CreditCard },
  { href: "/admin/reports", label: "Relatórios", icon: FileText },
  { href: "/admin/integrations", label: "Integrações", icon: Plug },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
];

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { role, signOut, user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = role === "admin_jb" ? adminLinks : clientLinks;

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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gold-gradient-bg">
              <span className="text-xs font-bold text-primary-foreground">JB</span>
            </div>
            <span className="font-serif text-foreground">JB Digital</span>
          </Link>
          <button className="text-muted-foreground lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {links.map((link) => {
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
          })}
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
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
            {role === "admin_jb" ? "Admin" : "Cliente"}
          </span>
        </header>
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
};
