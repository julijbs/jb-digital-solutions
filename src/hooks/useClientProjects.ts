import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { ServiceMetric, ServiceDeliverable } from "@/types/services";

export interface ClientProject {
  id: string;
  name: string;
  plan: string;
  status: string;
  service_type: "site_gbp" | "seo_local" | "arc_backend";
  site_url: string | null;
  custom_domain: string | null;
  domain_status: string | null;
  created_at: string;
  updated_at: string;
  // populated for seo_local / arc_backend
  latestMetric?: ServiceMetric;
  deliverables?: ServiceDeliverable[];
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

      if (!rows || rows.length === 0) {
        setProjects([]);
        setLoading(false);
        return;
      }

      // 3. for non-site projects, batch-load metrics + deliverables
      const nonSiteIds = rows
        .filter((p) => p.service_type !== "site_gbp")
        .map((p) => p.id);

      let metricsMap: Record<string, ServiceMetric> = {};
      let deliverablesMap: Record<string, ServiceDeliverable[]> = {};

      if (nonSiteIds.length > 0) {
        // latest metric per project: fetch all and take most recent in JS
        const { data: allMetrics } = await supabase
          .from("service_metrics")
          .select("*")
          .in("project_id", nonSiteIds)
          .order("created_at", { ascending: false });

        if (allMetrics) {
          for (const m of allMetrics) {
            if (!metricsMap[m.project_id]) {
              metricsMap[m.project_id] = m as unknown as ServiceMetric;
            }
          }
        }

        const { data: allDeliverables } = await supabase
          .from("service_deliverables")
          .select("*")
          .in("project_id", nonSiteIds)
          .order("delivered_at", { ascending: false });

        if (allDeliverables) {
          for (const d of allDeliverables) {
            if (!deliverablesMap[d.project_id]) deliverablesMap[d.project_id] = [];
            deliverablesMap[d.project_id].push(d as unknown as ServiceDeliverable);
          }
        }
      }

      const enriched: ClientProject[] = rows.map((p) => ({
        ...(p as ClientProject),
        latestMetric: metricsMap[p.id],
        deliverables: deliverablesMap[p.id] ?? [],
      }));

      setProjects(enriched);
      setLoading(false);
    };

    fetchAll();
  }, [user]);

  return { projects, loading };
}
