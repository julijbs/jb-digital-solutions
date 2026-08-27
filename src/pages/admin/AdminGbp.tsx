import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  ExternalLink,
  Star,
  Search,
  CheckCircle2,
  AlertTriangle,
  Wand2,
  ArrowRight,
  TrendingUp,
  Building,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProjectGbpItem {
  id: string;
  name: string;
  status: string;
  gbp_url: string | null;
  site_url: string | null;
  clients: {
    business_name: string;
    vertical: string;
    city: string;
    state: string;
  } | null;
}

export default function AdminGbp() {
  const [projects, setProjects] = useState<ProjectGbpItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, status, gbp_url, site_url, clients(business_name, vertical, city, state)")
      .order("updated_at", { ascending: false });

    if (error) {
      toast({ title: "Erro ao carregar projetos", description: error.message, variant: "destructive" });
    } else {
      setProjects((data as unknown as ProjectGbpItem[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filtered = projects.filter((p) => {
    const term = searchTerm.toLowerCase();
    const name = p.name?.toLowerCase() || "";
    const bName = p.clients?.business_name?.toLowerCase() || "";
    const city = p.clients?.city?.toLowerCase() || "";
    return name.includes(term) || bName.includes(term) || city.includes(term);
  });

  const connectedCount = projects.filter((p) => p.gbp_url).length;

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl text-foreground">Gestão de Google Meu Negócio (GBP)</h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Admin
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitore a presença no Google Maps, audite perfis e gerencie métricas de cada cliente
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/pipeline">
            <Button variant="outline" size="sm" className="gap-1.5">
              Ver Pipeline Geral
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-xl p-5 flex items-center justify-between border border-border/50">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total de Clientes/Projetos</p>
            <h3 className="font-serif text-2xl font-bold text-foreground mt-1">{projects.length}</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Building size={20} />
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 flex items-center justify-between border border-border/50">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Perfis Conectados com Maps</p>
            <h3 className="font-serif text-2xl font-bold text-emerald-400 mt-1">{connectedCount}</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 flex items-center justify-between border border-border/50">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Perfis Pendentes de Vínculo</p>
            <h3 className="font-serif text-2xl font-bold text-amber-400 mt-1">
              {projects.length - connectedCount}
            </h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
            <AlertTriangle size={20} />
          </div>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, consultório ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center text-muted-foreground">
          Nenhum projeto encontrado.
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="glass-card rounded-xl p-5 border border-border/60 hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-serif text-lg font-semibold text-foreground">{p.name}</h3>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground capitalize">
                    {p.clients?.vertical || "Profissional"}
                  </span>
                  {p.clients?.city && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin size={12} className="text-primary" />
                      {p.clients.city}/{p.clients.state}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                  {p.gbp_url ? (
                    <a
                      href={p.gbp_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <CheckCircle2 size={13} /> Perfil Google Maps Vinculado <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-amber-400/90 flex items-center gap-1 font-medium">
                      <AlertTriangle size={13} /> Sem link do Maps informado no onboarding
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <Link to={`/admin/projects/${p.id}?tab=gbp`}>
                  <Button variant="hero" size="sm" className="gap-1.5 shadow-sm">
                    <Star size={14} className="fill-primary-foreground text-primary-foreground" />
                    Gerenciar GBP & Métricas
                  </Button>
                </Link>

                <Link to={`/admin/projects/${p.id}?tab=gerar-site`}>
                  <Button variant="outline" size="sm" className="gap-1.5 border-primary/30 hover:bg-primary/10">
                    <Wand2 size={14} className="text-primary" />
                    Gerar Site (IA)
                  </Button>
                </Link>

                <Link to={`/admin/projects/${p.id}`}>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Ver Projeto <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
