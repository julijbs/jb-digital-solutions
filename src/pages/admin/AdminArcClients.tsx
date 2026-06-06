import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ArcClient } from "@/types/arc";

const statusLabel: Record<string, string> = {
  ativo: "Ativo",
  pausado: "Pausado",
  encerrado: "Encerrado",
};

const statusColor: Record<string, string> = {
  ativo: "bg-green-500/10 text-green-400",
  pausado: "bg-yellow-500/10 text-yellow-400",
  encerrado: "bg-muted text-muted-foreground",
};

const AdminArcClients = () => {
  const [clients, setClients] = useState<ArcClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("arc_clients")
        .select("*")
        .order("created_at", { ascending: false });
      setClients((data as ArcClient[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = clients.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.empresa.toLowerCase().includes(search.toLowerCase()) ||
      (c.nicho ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">ARC™ — Clientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">{clients.length} clientes cadastrados</p>
        </div>
      </div>

      <div className="mb-6 relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar nome, empresa ou nicho…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card animate-pulse rounded-xl h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Briefcase size={32} className="mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground">Nenhum cliente ARC™ encontrado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((client) => (
            <div
              key={client.id}
              className="glass-card rounded-xl px-5 py-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Briefcase size={16} className="shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{client.nome}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {[client.empresa, client.nicho].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground">{client.comissao_percentual}% comissão</span>
                <span className="text-xs text-muted-foreground">
                  Início: {new Date(client.data_inicio).toLocaleDateString("pt-BR")}
                </span>
                <span
                  className={`text-xs rounded-full px-2.5 py-0.5 font-medium ${
                    statusColor[client.status] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  {statusLabel[client.status] ?? client.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminArcClients;
