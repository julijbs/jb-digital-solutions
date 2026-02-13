import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Star, Image as ImageIcon, Clock, MessageSquare, ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const AdminGBP = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*, clients(business_name, vertical, city, state), client_intake(google_data, business_data, schedule_data)")
        .order("updated_at", { ascending: false });
      setProjects(data || []);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const filtered = projects.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      (p.clients as any)?.business_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Google Business Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie os perfis GBP de todos os clientes
        </p>
      </div>

      <div className="mb-6 relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar projeto…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="glass-card animate-pulse rounded-xl h-32" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
          <MapPin size={48} className="mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhum projeto encontrado</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project: any) => {
            const client = project.clients as any;
            const intake = Array.isArray(project.client_intake) ? project.client_intake[0] : project.client_intake;
            const gd = (intake?.google_data as any) || {};
            const bd = (intake?.business_data as any) || {};
            const sd = (intake?.schedule_data as any) || {};
            const hasGbp = gd.has_gbp;
            const googleConnected = gd.google_connected;

            return (
              <div key={project.id} className="glass-card-hover rounded-xl p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{project.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {client?.business_name} • {client?.city}/{client?.state}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    googleConnected
                      ? "bg-green-500/10 text-green-400"
                      : hasGbp
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {googleConnected ? "Conectado" : hasGbp ? "Tem GBP" : "Sem GBP"}
                  </span>
                </div>

                {/* Quick info */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={12} />
                    <span>{sd.city ? `${sd.street || ""} ${sd.number || ""} - ${sd.city}` : "Endereço não informado"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={12} />
                    <span>Vertical: {client?.vertical || "—"}</span>
                  </div>
                  {bd.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageSquare size={12} />
                      <span>{bd.phone}</span>
                    </div>
                  )}
                </div>

                {/* GBP Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  {project.gbp_url ? (
                    <a href={project.gbp_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <ExternalLink size={12} /> Ver GBP
                      </Button>
                    </a>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => toast({ title: "Em breve", description: "Busca automática no Google Maps será implementada" })}
                    >
                      <Search size={12} /> Buscar GBP
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => toast({ title: "Em breve", description: "Gestão de posts e fotos via API GBP" })}
                  >
                    <ImageIcon size={12} /> Fotos
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => toast({ title: "Em breve", description: "Gestão de avaliações via API GBP" })}
                  >
                    <Star size={12} /> Reviews
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminGBP;
