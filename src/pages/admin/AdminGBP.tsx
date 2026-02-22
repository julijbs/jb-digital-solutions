import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin, Star, Image as ImageIcon, Clock, MessageSquare,
  ExternalLink, Search, Loader2, Link2, RefreshCw, BarChart3,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

interface GbpAccount {
  name: string;
  accountName: string;
  type: string;
}

interface GbpLocation {
  name: string;
  title: string;
  storefrontAddress?: {
    addressLines?: string[];
    locality?: string;
    administrativeArea?: string;
    postalCode?: string;
  };
  websiteUri?: string;
  phoneNumbers?: { primaryPhone?: string };
}

interface GbpMetrics {
  location: GbpLocation;
  metrics: any[];
  error?: string;
}

const AdminGBP = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  // GBP state
  const [accounts, setAccounts] = useState<GbpAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [locations, setLocations] = useState<GbpMetrics[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // Link dialog
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkingLocation, setLinkingLocation] = useState<GbpLocation | null>(null);
  const [linkProjectId, setLinkProjectId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Metrics dialog
  const [metricsDialogOpen, setMetricsDialogOpen] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<GbpMetrics | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*, clients(business_name, vertical, city, state), client_intake(google_data, business_data, schedule_data)")
      .order("updated_at", { ascending: false });
    setProjects(data || []);
    setLoading(false);
  };

  const fetchAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const { data, error } = await supabase.functions.invoke("gbp-reports", {
        body: {},
      });
      if (error) throw error;
      setAccounts(data?.accounts || []);
      if (data?.accounts?.length === 0) {
        toast({ title: "Nenhuma conta encontrada", description: "Verifique as credenciais OAuth do Google." });
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro desconhecido";
      toast({ title: "Erro ao buscar contas GBP", description: msg, variant: "destructive" });
    } finally {
      setLoadingAccounts(false);
    }
  };

  const fetchLocations = async (accountId: string) => {
    setSelectedAccount(accountId);
    setLoadingLocations(true);
    try {
      const { data, error } = await supabase.functions.invoke("gbp-reports", {
        body: { accountId },
      });
      if (error) throw error;
      setLocations(data?.locations || []);
      if (data?.locations?.length === 0) {
        toast({ title: "Nenhuma localização encontrada", description: "Esta conta não tem localizações cadastradas." });
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro desconhecido";
      toast({ title: "Erro ao buscar localizações", description: msg, variant: "destructive" });
    } finally {
      setLoadingLocations(false);
    }
  };

  const openLinkDialog = (location: GbpLocation, projectId?: string) => {
    setLinkingLocation(location);
    setLinkProjectId(projectId || null);
    setLinkDialogOpen(true);
  };

  const linkGbpToProject = async (projectId: string, location: GbpLocation) => {
    setSaving(true);
    try {
      const gbpUrl = `https://business.google.com/dashboard/l/${location.name.split("/").pop()}`;
      const { error } = await supabase
        .from("projects")
        .update({ gbp_url: gbpUrl })
        .eq("id", projectId);
      if (error) throw error;
      toast({ title: "GBP vinculado!", description: `Perfil "${location.title}" vinculado ao projeto.` });
      setLinkDialogOpen(false);
      fetchProjects();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro desconhecido";
      toast({ title: "Erro ao vincular", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const openMetrics = (metrics: GbpMetrics) => {
    setSelectedMetrics(metrics);
    setMetricsDialogOpen(true);
  };

  const sumMetricValues = (series: any[]) => {
    if (!series?.length) return 0;
    return series.reduce((acc: number, point: any) => {
      return acc + (parseInt(point?.value || "0", 10));
    }, 0);
  };

  const filtered = projects.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      (p.clients as any)?.business_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Google Business Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie os perfis GBP de todos os clientes
          </p>
        </div>
        <Button
          onClick={fetchAccounts}
          disabled={loadingAccounts}
          variant="outline"
          size="sm"
        >
          {loadingAccounts ? <Loader2 size={14} className="animate-spin mr-1" /> : <RefreshCw size={14} className="mr-1" />}
          Carregar contas GBP
        </Button>
      </div>

      {/* GBP Accounts & Locations Panel */}
      {accounts.length > 0 && (
        <div className="mb-8 glass-card rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-medium text-foreground">Contas Google Business</h2>
          <div className="flex flex-wrap gap-2">
            {accounts.map((acc) => (
              <Button
                key={acc.name}
                variant={selectedAccount === acc.name ? "default" : "outline"}
                size="sm"
                onClick={() => fetchLocations(acc.name)}
                disabled={loadingLocations}
              >
                {acc.accountName || acc.name}
              </Button>
            ))}
          </div>

          {loadingLocations && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={14} className="animate-spin" /> Carregando localizações…
            </div>
          )}

          {!loadingLocations && locations.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {locations.map((loc, i) => {
                const l = loc.location;
                const addr = l.storefrontAddress;
                const totalImpressions = loc.metrics?.reduce((sum: number, m: any) => {
                  const series = m?.dailyMetricTimeSeries?.timeSeries?.datedValues || [];
                  return sum + sumMetricValues(series);
                }, 0) || 0;

                return (
                  <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm text-foreground">{l.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {addr?.addressLines?.join(", ")} {addr?.locality && `- ${addr.locality}`}
                        </p>
                      </div>
                      {totalImpressions > 0 && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openMetrics(loc)}>
                          <BarChart3 size={12} className="mr-1" /> Métricas
                        </Button>
                      )}
                    </div>
                    {l.websiteUri && (
                      <p className="text-xs text-muted-foreground truncate">🌐 {l.websiteUri}</p>
                    )}
                    {l.phoneNumbers?.primaryPhone && (
                      <p className="text-xs text-muted-foreground">📞 {l.phoneNumbers.primaryPhone}</p>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-7 text-xs"
                      onClick={() => openLinkDialog(l)}
                    >
                      <Link2 size={12} className="mr-1" /> Vincular a projeto
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Search */}
      <div className="mb-6 relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar projeto…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Projects Grid */}
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
                    project.gbp_url
                      ? "bg-green-500/10 text-green-400"
                      : hasGbp
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {project.gbp_url ? "Vinculado" : hasGbp ? "Tem GBP" : "Sem GBP"}
                  </span>
                </div>

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
                      onClick={() => {
                        if (accounts.length === 0) {
                          fetchAccounts();
                        } else {
                          toast({ title: "Use o painel acima", description: "Selecione uma conta e vincule uma localização a este projeto." });
                        }
                      }}
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

      {/* Link Location to Project Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vincular "{linkingLocation?.title}" a um projeto</DialogTitle>
            <DialogDescription>
              Selecione o projeto ao qual deseja vincular esta localização GBP.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {projects
              .filter((p) => !p.gbp_url)
              .map((p) => (
                <button
                  key={p.id}
                  className="w-full flex items-center justify-between rounded-lg border border-border p-3 text-left hover:bg-accent/50 transition-colors"
                  disabled={saving}
                  onClick={() => linkingLocation && linkGbpToProject(p.id, linkingLocation)}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(p.clients as any)?.business_name}
                    </p>
                  </div>
                  {saving && linkProjectId === p.id && <Loader2 size={14} className="animate-spin" />}
                </button>
              ))}
            {projects.filter((p) => !p.gbp_url).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Todos os projetos já possuem um GBP vinculado.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Metrics Dialog */}
      <Dialog open={metricsDialogOpen} onOpenChange={setMetricsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Métricas — {selectedMetrics?.location?.title}</DialogTitle>
            <DialogDescription>Últimos 30 dias</DialogDescription>
          </DialogHeader>
          {selectedMetrics?.metrics?.length ? (
            <div className="grid grid-cols-2 gap-3 mt-2">
              {selectedMetrics.metrics.map((m: any, i: number) => {
                const metric = m?.dailyMetricTimeSeries;
                const label = metric?.dailyMetric?.replace(/_/g, " ") || `Métrica ${i + 1}`;
                const values = metric?.timeSeries?.datedValues || [];
                const total = sumMetricValues(values);
                return (
                  <div key={i} className="rounded-lg border border-border p-3 text-center">
                    <p className="text-xs text-muted-foreground capitalize">{label.toLowerCase()}</p>
                    <p className="text-lg font-semibold text-foreground mt-1">{total.toLocaleString("pt-BR")}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Sem métricas disponíveis.</p>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminGBP;
