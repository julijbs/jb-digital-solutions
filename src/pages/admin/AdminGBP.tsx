import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin, Star, Image as ImageIcon, Clock, MessageSquare,
  ExternalLink, Search, Loader2, Link2, RefreshCw, BarChart3,
  Globe, Phone, Unlink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [saving, setSaving] = useState(false);

  // Metrics dialog
  const [metricsDialogOpen, setMetricsDialogOpen] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<GbpMetrics | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchAccounts();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*, clients(business_name, vertical, city, state)")
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
      const accs = data?.accounts || [];
      setAccounts(accs);
      // Auto-select first account
      if (accs.length > 0) {
        fetchLocations(accs[0].name);
      } else if (accs.length === 0) {
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
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro desconhecido";
      toast({ title: "Erro ao buscar localizações", description: msg, variant: "destructive" });
    } finally {
      setLoadingLocations(false);
    }
  };

  const openLinkDialog = (location: GbpLocation) => {
    setLinkingLocation(location);
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

  // Find which project is linked to a location
  const getLinkedProject = (location: GbpLocation) => {
    const locId = location.name.split("/").pop();
    return projects.find((p) => p.gbp_url?.includes(locId));
  };

  const filteredLocations = locations.filter(
    (loc) =>
      loc.location.title?.toLowerCase().includes(search.toLowerCase()) ||
      loc.location.storefrontAddress?.locality?.toLowerCase().includes(search.toLowerCase())
  );

  const isLoading = loadingAccounts || loadingLocations;

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Google Business Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie seus perfis GBP diretamente — sem precisar de projeto vinculado
          </p>
        </div>
        <Button
          onClick={fetchAccounts}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? <Loader2 size={14} className="animate-spin mr-1" /> : <RefreshCw size={14} className="mr-1" />}
          Atualizar
        </Button>
      </div>

      {/* Account selector */}
      {accounts.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
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
      )}

      {/* Search */}
      {locations.length > 0 && (
        <div className="mb-6 relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar localização…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Carregando perfis GBP…</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && locations.length === 0 && (
        <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
          <MapPin size={48} className="mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {accounts.length === 0
              ? "Clique em Atualizar para carregar suas contas GBP"
              : "Nenhuma localização encontrada nesta conta"}
          </p>
        </div>
      )}

      {/* Locations Grid */}
      {!isLoading && filteredLocations.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLocations.map((loc, i) => {
            const l = loc.location;
            const addr = l.storefrontAddress;
            const linkedProject = getLinkedProject(l);
            const totalImpressions = loc.metrics?.reduce((sum: number, m: any) => {
              const series = m?.dailyMetricTimeSeries?.timeSeries?.datedValues || [];
              return sum + sumMetricValues(series);
            }, 0) || 0;

            return (
              <div key={i} className="glass-card-hover rounded-xl p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{l.title}</h3>
                    {addr && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        <MapPin size={10} className="inline mr-1" />
                        {addr.addressLines?.join(", ")} {addr.locality && `— ${addr.locality}/${addr.administrativeArea}`}
                      </p>
                    )}
                  </div>
                  {linkedProject ? (
                    <span className="shrink-0 ml-2 rounded-full px-2 py-0.5 text-xs bg-primary/10 text-primary">
                      Vinculado
                    </span>
                  ) : (
                    <span className="shrink-0 ml-2 rounded-full px-2 py-0.5 text-xs bg-secondary text-muted-foreground">
                      Avulso
                    </span>
                  )}
                </div>

                {/* Contact info */}
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {l.websiteUri && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Globe size={11} /> <span className="truncate">{l.websiteUri}</span>
                    </div>
                  )}
                  {l.phoneNumbers?.primaryPhone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={11} /> {l.phoneNumbers.primaryPhone}
                    </div>
                  )}
                  {linkedProject && (
                    <div className="flex items-center gap-1.5 text-primary">
                      <Link2 size={11} /> Projeto: {linkedProject.name}
                    </div>
                  )}
                </div>

                {/* Metrics summary */}
                {totalImpressions > 0 && (
                  <div className="rounded-lg bg-accent/30 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Últimos 30 dias</p>
                    <p className="text-lg font-semibold text-foreground">{totalImpressions.toLocaleString("pt-BR")} <span className="text-xs font-normal text-muted-foreground">impressões</span></p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  {totalImpressions > 0 && (
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openMetrics(loc)}>
                      <BarChart3 size={12} className="mr-1" /> Métricas
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => openLinkDialog(l)}
                  >
                    <Link2 size={12} className="mr-1" /> {linkedProject ? "Revincular" : "Vincular projeto"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => toast({ title: "Em breve", description: "Gestão de fotos via API GBP" })}
                  >
                    <ImageIcon size={12} className="mr-1" /> Fotos
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => toast({ title: "Em breve", description: "Gestão de avaliações via API GBP" })}
                  >
                    <Star size={12} className="mr-1" /> Reviews
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
              Selecione o projeto ao qual deseja vincular esta localização GBP. Isso é opcional — você pode gerenciar o perfil sem projeto vinculado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {projects.map((p) => (
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
                    {p.gbp_url && " • ⚠️ já tem GBP vinculado"}
                  </p>
                </div>
                {saving && <Loader2 size={14} className="animate-spin" />}
              </button>
            ))}
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum projeto encontrado.
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
