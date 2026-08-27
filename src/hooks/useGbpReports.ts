import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface GbpMetric {
  date: string;
  impressions_maps: number;
  impressions_search: number;
  calls: number;
  website_clicks: number;
  direction_requests: number;
}

export interface GbpSummary {
  total_impressions: number;
  total_calls: number;
  total_website_clicks: number;
  total_direction_requests: number;
  daily: GbpMetric[];
  location_name: string;
  business_name: string;
}

export interface UseGbpReportsResult {
  data: GbpSummary | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function sumMetric(series: Record<string, unknown>[], key: string): number {
  return series.reduce((acc, day) => {
    const val = day[key];
    return acc + (typeof val === "number" ? val : 0);
  }, 0);
}

function parseDailySeries(
  multiDailyMetricTimeSeries: Record<string, unknown>[]
): GbpMetric[] {
  // Build a date-keyed map
  const dateMap: Record<string, GbpMetric> = {};

  for (const metricSeries of multiDailyMetricTimeSeries) {
    const metricType = metricSeries.dailyMetric as string;
    const timeSeries = metricSeries.timeSeries as
      | { datedValues?: { date?: { year: number; month: number; day: number }; value?: number }[] }
      | undefined;

    if (!timeSeries?.datedValues) continue;

    for (const dv of timeSeries.datedValues) {
      if (!dv.date) continue;
      const key = `${dv.date.year}-${String(dv.date.month).padStart(2, "0")}-${String(
        dv.date.day
      ).padStart(2, "0")}`;
      if (!dateMap[key]) {
        dateMap[key] = {
          date: key,
          impressions_maps: 0,
          impressions_search: 0,
          calls: 0,
          website_clicks: 0,
          direction_requests: 0,
        };
      }
      const v = dv.value ?? 0;
      if (metricType.includes("MAPS")) dateMap[key].impressions_maps += v;
      else if (metricType.includes("SEARCH")) dateMap[key].impressions_search += v;
      else if (metricType === "CALL_CLICKS") dateMap[key].calls += v;
      else if (metricType === "WEBSITE_CLICKS") dateMap[key].website_clicks += v;
      else if (metricType === "BUSINESS_DIRECTION_REQUESTS")
        dateMap[key].direction_requests += v;
    }
  }

  return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
}

export function useGbpReports(projectId?: string): UseGbpReportsResult {
  const { session } = useAuth();
  const [data, setData] = useState<GbpSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = () => setTick((t) => t + 1);

  useEffect(() => {
    if (!session || !projectId) return;

    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Get the project's GBP account/location from project table
        const { data: project } = await supabase
          .from("projects")
          .select("gbp_url, gbp_account_id, gbp_location_id, name")
          .eq("id", projectId)
          .maybeSingle();

        const accountId = project?.gbp_account_id as string | undefined;

        // 2. Call edge function
        const { data: result, error: fnError } = await supabase.functions.invoke(
          "gbp-reports",
          { body: { accountId: accountId ?? null } }
        );

        if (fnError) throw new Error(fnError.message);

        if (result?.error) {
          setError(result.error === "google_api_error"
            ? "Erro ao acessar o Google Business Profile. Verifique as credenciais."
            : result.error);
          setLoading(false);
          return;
        }

        const locations = result?.locations as {
          location: Record<string, unknown>;
          metrics: Record<string, unknown>[];
        }[];

        if (!locations || locations.length === 0) {
          setError("Nenhuma localização GBP encontrada para esta conta.");
          setLoading(false);
          return;
        }

        // Use first location (or match by project if multiple)
        const loc = locations[0];
        const daily = parseDailySeries(
          loc.metrics as Record<string, unknown>[]
        );

        const summary: GbpSummary = {
          location_name: (loc.location?.name as string) ?? "",
          business_name: (loc.location?.title as string) ?? project?.name ?? "",
          daily,
          total_impressions:
            sumMetric(daily as unknown as Record<string, unknown>[], "impressions_maps") +
            sumMetric(daily as unknown as Record<string, unknown>[], "impressions_search"),
          total_calls: sumMetric(daily as unknown as Record<string, unknown>[], "calls"),
          total_website_clicks: sumMetric(
            daily as unknown as Record<string, unknown>[],
            "website_clicks"
          ),
          total_direction_requests: sumMetric(
            daily as unknown as Record<string, unknown>[],
            "direction_requests"
          ),
        };

        setData(summary);
      } catch (err) {
        setError((err as Error).message || "Erro ao carregar relatório GBP");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [session, projectId, tick]);

  return { data, loading, error, refetch };
}
