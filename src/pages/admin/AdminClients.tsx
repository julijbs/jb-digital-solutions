import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Users, Search, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";

const AdminClients = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      // Fetch clients
      const { data: clientsData } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      // Fetch profiles for each client's user_id
      const userIds = (clientsData || []).map((c: any) => c.user_id).filter(Boolean);
      let profilesMap: Record<string, any> = {};
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("user_id, full_name, phone, avatar_url")
          .in("user_id", userIds);
        (profilesData || []).forEach((p: any) => {
          profilesMap[p.user_id] = p;
        });
      }

      const enriched = (clientsData || []).map((c: any) => ({
        ...c,
        profiles: profilesMap[c.user_id] || null,
      }));
      setClients(enriched);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = clients.filter(
    (c) =>
      c.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.toLowerCase().includes(search.toLowerCase())
  );

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminClients;
