import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface ClientProject {
  id: string;
  name: string;
  plan: string;
  status: string;
  service_type: "site_gbp";
  site_url: string | null;
  custom_domain: string | null;
  domain_status: string | null;
  created_at: string;
  updated_at: string;
}

export function useClientProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      if (!user) return;

      // 1. resolve client record
      const { data: client } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!client) {
        setLoading(false);
        return;
      }

      setClientId(client.id);

      // 2. fetch all projects for this client
      const { data: rows } = await supabase
        .from("projects")
        .select("id, name, plan, status, service_type, site_url, custom_domain, domain_status, created_at, updated_at")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false });

      setProjects((rows ?? []) as ClientProject[]);
      setLoading(false);
    };

    fetchAll();
  }, [user]);

  // Realtime: atualiza quando o admin muda o status do projeto
  useEffect(() => {
    if (!clientId) return;

    const channel = supabase
      .channel(`client-projects-${clientId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
          filter: `client_id=eq.${clientId}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setProjects((prev) =>
              prev.map((p) =>
                p.id === payload.new.id
                  ? ({ ...p, ...payload.new } as ClientProject)
                  : p
              )
            );
          } else if (payload.eventType === "INSERT") {
            setProjects((prev) => [payload.new as ClientProject, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setProjects((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId]);

  return { projects, loading };
}
