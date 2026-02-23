import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin, Search, Loader2, RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GbpLocationCard, { GbpLocation, GbpMetrics } from "@/components/admin/gbp/GbpLocationCard";
import GbpMetricsDialog from "@/components/admin/gbp/GbpMetricsDialog";
import GbpLinkDialog from "@/components/admin/gbp/GbpLinkDialog";

interface GbpAccount {
  name: string;
  accountName: string;
  type: string;
}

const AdminGBP = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // GBP state
  const [accounts, setAccounts] = useState<GbpAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [locations, setLocations] = useState<GbpMetrics[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // Search per tab
  const [searchOwn, setSearchOwn] = useState("");
  const [searchClients, setSearchClients] = useState("");

  // Dialogs
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkingLocation, setLinkingLocation] = useState<GbpLocation | null>(null);
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
      if (accs.length > 0) {
        fetchLocations(accs[0].name);
      } else {
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

  // Helpers
  const getLinkedProject = (location: GbpLocation) => {
    const locId = location.name.split("/").pop();
    return projects.find((p) => p.gbp_url?.includes(locId));
  };

  // Split locations: "own" = not linked to any project, "clients" = linked to a project
  const ownLocations = locations.filter((loc) => !getLinkedProject(loc.location));
  const clientLocations = locations.filter((loc) => !!getLinkedProject(loc.location));

  const filterLocations = (locs: GbpMetrics[], query: string) =>
    locs.filter(
      (loc) =>
        loc.location.title?.toLowerCase().includes(query.toLowerCase()) ||
        loc.location.storefrontAddress?.locality?.toLowerCase().includes(query.toLowerCase())
    );

  const filteredOwn = filterLocations(ownLocations, searchOwn);
  const filteredClients = filterLocations(clientLocations, searchClients);

  const isLoading = loadingAccounts || loadingLocations;

  const openMetrics = (loc: GbpMetrics) => {
    setSelectedMetrics(loc);
    setMetricsDialogOpen(true);
  };

  const openLink = (location: GbpLocation) => {
    setLinkingLocation(location);
    setLinkDialogOpen(true);
  };

  const renderLocationGrid = (
    locs: GbpMetrics[],
    showLinkAction: boolean,
    emptyMsg: string
  ) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Carregando perfis GBP…</span>
        </div>
      );
    }

    if (locs.length === 0) {
      return (
        <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
          <MapPin size={48} className="mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{emptyMsg}</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {locs.map((loc, i) => (
          <GbpLocationCard
            key={i}
            loc={loc}
            linkedProject={getLinkedProject(loc.location)}
            showLinkAction={showLinkAction}
            onLink={openLink}
            onMetrics={openMetrics}
          />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Google Business Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie seu perfil e os perfis GBP dos seus clientes
          </p>
        </div>
        <Button onClick={fetchAccounts} disabled={isLoading} variant="outline" size="sm">
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

      <Tabs defaultValue="own" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="own">
            Meu Perfil {!isLoading && ownLocations.length > 0 && (
              <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs text-primary">{ownLocations.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="clients">
            Clientes {!isLoading && clientLocations.length > 0 && (
              <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs text-primary">{clientLocations.length}</span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Meu Perfil tab */}
        <TabsContent value="own">
          {ownLocations.length > 0 && (
            <div className="mb-6 relative max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar localização…"
                value={searchOwn}
                onChange={(e) => setSearchOwn(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
          {renderLocationGrid(
            filteredOwn,
            true,
            accounts.length === 0
              ? "Clique em Atualizar para carregar suas contas GBP"
              : "Nenhum perfil avulso encontrado. Todos estão vinculados a projetos."
          )}
        </TabsContent>

        {/* Clientes tab */}
        <TabsContent value="clients">
          {clientLocations.length > 0 && (
            <div className="mb-6 relative max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente ou cidade…"
                value={searchClients}
                onChange={(e) => setSearchClients(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
          {renderLocationGrid(
            filteredClients,
            true,
            "Nenhum perfil GBP vinculado a projetos. Vincule perfis pela aba 'Meu Perfil'."
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <GbpLinkDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        location={linkingLocation}
        projects={projects}
        onLinked={fetchProjects}
      />
      <GbpMetricsDialog
        open={metricsDialogOpen}
        onOpenChange={setMetricsDialogOpen}
        metrics={selectedMetrics}
      />
    </DashboardLayout>
  );
};

export default AdminGBP;
