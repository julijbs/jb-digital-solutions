import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Target, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ArcProspect } from "@/types/arc";

const statusLabel: Record<string, string> = {
  nao_enviado: "Não Enviado",
  enviado: "Enviado",
  respondido: "Respondido",
  qualificado: "Qualificado",
  descartado: "Descartado",
};

const statusColor: Record<string, string> = {
  nao_enviado: "bg-muted text-muted-foreground",
  enviado: "bg-blue-500/10 text-blue-400",
  respondido: "bg-yellow-500/10 text-yellow-400",
  qualificado: "bg-green-500/10 text-green-400",
  descartado: "bg-destructive/10 text-destructive",
};

const AdminArcProspects = () => {
  const [prospects, setProspects] = useState<ArcProspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("arc_prospects")
        .select("*")
        .order("created_at", { ascending: false });
      setProspects((data as ArcProspect[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = prospects.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      (p.produto ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.nicho ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">ARC™ — Prospects</h1>
          <p className="mt-1 text-sm text-muted-foreground">{prospects.length} prospects cadastrados</p>
        </div>
      </div>

      <div className="mb-6 relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar nome, produto ou nicho…"
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
          <Target size={32} className="mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground">Nenhum prospect encontrado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((prospect) => (
            <div
              key={prospect.id}
              className="glass-card rounded-xl px-5 py-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Target size={16} className="shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{prospect.nome}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {[prospect.produto, prospect.nicho].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground">Score: {prospect.score}</span>
                <span
                  className={`text-xs rounded-full px-2.5 py-0.5 font-medium ${
                    statusColor[prospect.status_direct] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  {statusLabel[prospect.status_direct] ?? prospect.status_direct}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminArcProspects;
