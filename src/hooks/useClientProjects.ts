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

  return { projects, loading };
}
