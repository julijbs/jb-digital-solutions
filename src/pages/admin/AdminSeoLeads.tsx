import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { SeoLead } from "@/types/seo";

const statusLabel: Record<string, string> = {
  prospect_identificado: "Prospect",
  contato_enviado: "Contato Enviado",
  em_negociacao: "Em Negociação",
  proposta_enviada: "Proposta Enviada",
  fechado: "Fechado",
  perdido: "Perdido",
  inativo: "Inativo",
};

const statusColor: Record<string, string> = {
  prospect_identificado: "bg-muted text-muted-foreground",
  contato_enviado: "bg-blue-500/10 text-blue-400",
  em_negociacao: "bg-yellow-500/10 text-yellow-400",
  proposta_enviada: "bg-primary/10 text-primary",
  fechado: "bg-green-500/10 text-green-400",
  perdido: "bg-destructive/10 text-destructive",
  inativo: "bg-muted text-muted-foreground",
};

const AdminSeoLeads = () => {
  const [leads, setLeads] = useState<SeoLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("seo_leads")
        .select("*")
        .order("created_at", { ascending: false });
      setLeads((data as SeoLead[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = leads.filter(
    (l) =>
      l.empresa.toLowerCase().includes(search.toLowerCase()) ||
      (l.cidade ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (l.nicho ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">SEO Local — Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">{leads.length} leads cadastrados</p>
        </div>
      </div>

      <div className="mb-6 relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar empresa, cidade ou nicho…"
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
          <MapPin size={32} className="mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground">Nenhum lead encontrado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((lead) => (
            <div
              key={lead.id}
              className="glass-card rounded-xl px-5 py-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <MapPin size={16} className="shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{lead.empresa}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {[lead.nicho, lead.cidade].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {lead.prioridade && (
                  <span className="text-xs text-muted-foreground capitalize">{lead.prioridade}</span>
                )}
                <span
                  className={`text-xs rounded-full px-2.5 py-0.5 font-medium ${
                    statusColor[lead.status] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  {statusLabel[lead.status] ?? lead.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminSeoLeads;
