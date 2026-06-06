import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SERVICE_CONFIG } from "@/config/services";
import type { ServiceType } from "@/types/app";

type NewEngagementState = {
  clientId: string;
  clientName: string;
} | null;

const AdminClients = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // engagement creation
  const [newEng, setNewEng] = useState<NewEngagementState>(null);
  const [engServiceType, setEngServiceType] = useState<ServiceType>("seo_local");
  const [engProjectName, setEngProjectName] = useState("");
  const [savingEng, setSavingEng] = useState(false);

  const fetchClients = async () => {
    const { data: clientsData } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    const userIds = (clientsData || []).map((c: any) => c.user_id).filter(Boolean);
    let profilesMap: Record<string, any> = {};
    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, phone, avatar_url")
        .in("user_id", userIds);
      (profilesData || []).forEach((p: any) => { profilesMap[p.user_id] = p; });
    }

    const enriched = (clientsData || []).map((c: any) => ({
      ...c,
      profiles: profilesMap[c.user_id] || null,
    }));
    setClients(enriched);
    setLoading(false);
  };

  useEffect(() => { fetchClients(); }, []);

  const filtered = clients.filter(
    (c) =>
      c.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.toLowerCase().includes(search.toLowerCase())
  );

  const openEngDialog = (clientId: string, clientName: string) => {
    setNewEng({ clientId, clientName });
    setEngProjectName(`${clientName} — ${SERVICE_CONFIG[engServiceType].shortLabel}`);
  };

  const closeEngDialog = () => {
    setNewEng(null);
    setEngProjectName("");
    setEngServiceType("seo_local");
  };

  const createEngagement = async () => {
    if (!newEng || !engProjectName) return;
    setSavingEng(true);
    const initialPhase = SERVICE_CONFIG[engServiceType].phases[0]?.key ?? "ativo";
    const { error } = await supabase.from("projects").insert({
      client_id: newEng.clientId,
      name: engProjectName,
      service_type: engServiceType,
      status: initialPhase,
      plan: "ativo",
    });
    setSavingEng(false);
    if (error) {
      toast({ title: "Erro ao criar engajamento", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `Engajamento "${engProjectName}" criado` });
    closeEngDialog();
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Clientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">{clients.length} clientes cadastrados</p>
        </div>
      </div>

      <div className="mb-6 relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar cliente…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="glass-card animate-pulse rounded-xl h-16" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
          <Users size={48} className="mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhum cliente encontrado</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Negócio</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium hidden sm:table-cell">Contato</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium hidden md:table-cell">Cidade</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Vertical</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Status</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c: any) => (
                <tr key={c.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3 text-foreground font-medium">{c.business_name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {(c.profiles as any)?.full_name || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {c.city ? `${c.city}/${c.state}` : "—"}
                  </td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">{c.vertical || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary capitalize">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => openEngDialog(c.id, c.business_name)}
                    >
                      <Plus size={12} /> Novo Serviço
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New engagement modal */}
      {newEng && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg text-foreground">Novo Serviço</h2>
              <button onClick={closeEngDialog} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">Cliente: <span className="text-foreground font-medium">{newEng.clientName}</span></p>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Tipo de Serviço</label>
              <div className="flex gap-2 flex-wrap">
                {(["seo_local", "arc_backend"] as ServiceType[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setEngServiceType(st);
                      setEngProjectName(`${newEng.clientName} — ${SERVICE_CONFIG[st].shortLabel}`);
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      engServiceType === st
                        ? `${SERVICE_CONFIG[st].bgClass} ${SERVICE_CONFIG[st].accentClass} ring-1 ring-current`
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {SERVICE_CONFIG[st].shortLabel}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Nome do Projeto</label>
              <Input
                value={engProjectName}
                onChange={(e) => setEngProjectName(e.target.value)}
                placeholder="Nome do projeto…"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={closeEngDialog}>Cancelar</Button>
              <Button variant="hero" size="sm" onClick={createEngagement} disabled={savingEng || !engProjectName}>
                <Plus size={14} /> Criar Engajamento
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminClients;
