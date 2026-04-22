import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  BarChart3,
  TrendingUp,
  Eye,
  MousePointerClick,
  Phone,
  MapPin,
  RefreshCw,
  Globe,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface GbpAccount {
  name: string;
  accountName?: string;
  type?: string;
}

interface LocationMetrics {
  location: {
    name: string;
    title: string;
    storefrontAddress?: any;
    websiteUri?: string;
    phoneNumbers?: any;
  };
  metrics: any[];
  error?: string;
}

const METRIC_LABELS: Record<string, string> = {
  BUSINESS_IMPRESSIONS_DESKTOP_MAPS: "Impressões Maps (Desktop)",
  BUSINESS_IMPRESSIONS_DESKTOP_SEARCH: "Impressões Search (Desktop)",
  BUSINESS_IMPRESSIONS_MOBILE_MAPS: "Impressões Maps (Mobile)",
  BUSINESS_IMPRESSIONS_MOBILE_SEARCH: "Impressões Search (Mobile)",
  CALL_CLICKS: "Cliques em Ligar",
  WEBSITE_CLICKS: "Cliques no Site",
  BUSINESS_DIRECTION_REQUESTS: "Pedidos de Rota",
};

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];

function parseMetrics(metricsData: any[]) {
  const totals: Record<string, number> = {};
  const dailyData: Record<string, Record<string, number>> = {};

  for (const series of metricsData) {
    const metricName = series.dailyMetric;
    const timeSeries = series.timeSeries?.datedValues || [];

    totals[metricName] = 0;

    for (const point of timeSeries) {
      const dateStr = `${point.date.month}/${point.date.day}`;
      const value = parseInt(point.value || "0", 10);
      totals[metricName] += value;

      if (!dailyData[dateStr]) dailyData[dateStr] = {};
      dailyData[dateStr][metricName] = (dailyData[dateStr][metricName] || 0) + value;
    }
  }

  const chartData = Object.entries(dailyData)
    .map(([date, metrics]) => ({ date, ...metrics }))
    .sort((a, b) => {
      const [am, ad] = a.date.split("/").map(Number);
      const [bm, bd] = b.date.split("/").map(Number);
      return am !== bm ? am - bm : ad - bd;
    });

  return { totals, chartData };
}

const AdminReports = () => {
  const [accounts, setAccounts] = useState<GbpAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [locations, setLocations] = useState<LocationMetrics[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoadingAccounts(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("gbp-reports", {
        body: {},
      });
      if (fnError) throw fnError;
      if (data?.error === "google_api_error") {
        const detail = data.detail?.error;
        if (detail?.status === "RESOURCE_EXHAUSTED") {
          setError("API do Google Business Profile aguardando aprovação de cota. O acesso será liberado em breve pelo Google.");
        } else {
          setError(detail?.message || "Erro na API do Google Business Profile");
        }
        return;
      }
      setAccounts(data.accounts || []);
      if (data.accounts?.length === 1) {
        setSelectedAccount(data.accounts[0].name);
      }
    } catch (e: any) {
      console.error("Error fetching GBP accounts:", e);
      setError(e.message || "Erro ao conectar com Google Business Profile");
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    if (selectedAccount) fetchMetrics();
  }, [selectedAccount]);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("gbp-reports", {
        body: { accountId: selectedAccount },
      });
      if (fnError) throw fnError;
      setLocations(data.locations || []);
    } catch (e: any) {
      console.error("Error fetching GBP metrics:", e);
      setError(e.message || "Erro ao buscar métricas");
    } finally {
      setLoading(false);
    }
  };

  const totalImpressions = locations.reduce((sum, loc) => {
    const { totals } = parseMetrics(loc.metrics);
    return (
      sum +
      (totals.BUSINESS_IMPRESSIONS_DESKTOP_MAPS || 0) +
      (totals.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH || 0) +
      (totals.BUSINESS_IMPRESSIONS_MOBILE_MAPS || 0) +
      (totals.BUSINESS_IMPRESSIONS_MOBILE_SEARCH || 0)
    );
  }, 0);

  const totalClicks = locations.reduce((sum, loc) => {
    const { totals } = parseMetrics(loc.metrics);
    return sum + (totals.WEBSITE_CLICKS || 0);
  }, 0);

  const totalCalls = locations.reduce((sum, loc) => {
    const { totals } = parseMetrics(loc.metrics);
    return sum + (totals.CALL_CLICKS || 0);
  }, 0);

  const totalDirections = locations.reduce((sum, loc) => {
    const { totals } = parseMetrics(loc.metrics);
    return sum + (totals.BUSINESS_DIRECTION_REQUESTS || 0);
  }, 0);

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Relatórios GBP</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Métricas de desempenho do Google Business Profile (últimos 30 dias)
          </p>
        </div>
        <div className="flex items-center gap-2">
          {accounts.length > 1 && (
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Selecionar conta" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((acc) => (
                  <SelectItem key={acc.name} value={acc.name}>
                    {acc.accountName || acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={selectedAccount ? fetchMetrics : fetchAccounts}
            disabled={loading || loadingAccounts}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle size={18} />
          <div>
            <p className="font-medium">Erro ao carregar dados</p>
            <p className="mt-0.5 text-xs opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Loading accounts */}
      {loadingAccounts && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Conectando ao Google Business Profile...</p>
        </div>
      )}

      {/* No accounts */}
      {!loadingAccounts && !error && accounts.length === 0 && (
        <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
          <Globe size={48} className="mb-4 text-muted-foreground" />
          <h2 className="font-serif text-xl text-foreground">Nenhuma conta GBP encontrada</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Verifique se as credenciais OAuth estão corretas e se a conta tem acesso ao Google Business Profile.
          </p>
        </div>
      )}

      {/* KPI Cards */}
      {!loadingAccounts && locations.length > 0 && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Impressões Totais", value: totalImpressions.toLocaleString("pt-BR"), icon: Eye, color: "text-primary" },
              { label: "Cliques no Site", value: totalClicks.toLocaleString("pt-BR"), icon: MousePointerClick, color: "text-green-500" },
              { label: "Ligações", value: totalCalls.toLocaleString("pt-BR"), icon: Phone, color: "text-amber-500" },
              { label: "Pedidos de Rota", value: totalDirections.toLocaleString("pt-BR"), icon: MapPin, color: "text-violet-500" },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <stat.icon size={18} className={stat.color} />
                  </div>
                  <p className="mt-2 font-serif text-3xl text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts per location */}
          {locations.map((loc, idx) => {
            const { totals, chartData } = parseMetrics(loc.metrics);

            const impressionsData = chartData.map((d: any) => ({
              date: d.date,
              maps:
                (d.BUSINESS_IMPRESSIONS_DESKTOP_MAPS || 0) +
                (d.BUSINESS_IMPRESSIONS_MOBILE_MAPS || 0),
              search:
                (d.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH || 0) +
                (d.BUSINESS_IMPRESSIONS_MOBILE_SEARCH || 0),
            }));

            const actionsData = chartData.map((d: any) => ({
              date: d.date,
              site: d.WEBSITE_CLICKS || 0,
              ligar: d.CALL_CLICKS || 0,
              rota: d.BUSINESS_DIRECTION_REQUESTS || 0,
            }));

            const pieData = [
              { name: "Maps", value: (totals.BUSINESS_IMPRESSIONS_DESKTOP_MAPS || 0) + (totals.BUSINESS_IMPRESSIONS_MOBILE_MAPS || 0) },
              { name: "Search", value: (totals.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH || 0) + (totals.BUSINESS_IMPRESSIONS_MOBILE_SEARCH || 0) },
            ].filter((d) => d.value > 0);

            return (
              <div key={loc.location.name} className="mb-8">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-primary" />
                  <h2 className="font-serif text-lg text-foreground">{loc.location.title}</h2>
                  {loc.location.storefrontAddress?.locality && (
                    <span className="text-xs text-muted-foreground">
                      — {loc.location.storefrontAddress.locality}
                    </span>
                  )}
                </div>

                {loc.error ? (
                  <div className="glass-card rounded-xl p-6 text-center text-sm text-muted-foreground">
                    Erro ao carregar métricas deste local: {loc.error}
                  </div>
                ) : chartData.length === 0 ? (
                  <div className="glass-card rounded-xl p-6 text-center text-sm text-muted-foreground">
                    Sem dados de métricas disponíveis para este local nos últimos 30 dias.
                  </div>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-3">
                    {/* Impressions chart */}
                    <Card className="lg:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Impressões (Maps vs Search)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={impressionsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: 8,
                                fontSize: 12,
                              }}
                            />
                            <Bar dataKey="maps" name="Maps" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="search" name="Search" fill="hsl(var(--accent))" radius={[2, 2, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Pie chart */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Distribuição
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center justify-center">
                        {pieData.length > 0 ? (
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                dataKey="value"
                                label={({ name, percent }) =>
                                  `${name} ${(percent * 100).toFixed(0)}%`
                                }
                                labelLine={false}
                              >
                                {pieData.map((_, i) => (
                                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <p className="text-xs text-muted-foreground">Sem dados</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Actions chart */}
                    <Card className="lg:col-span-3">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Ações dos Clientes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                          <LineChart data={actionsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: 8,
                                fontSize: 12,
                              }}
                            />
                            <Line type="monotone" dataKey="site" name="Cliques Site" stroke="#10b981" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="ligar" name="Ligações" stroke="#f59e0b" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="rota" name="Rotas" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* Loading metrics */}
      {loading && !loadingAccounts && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Carregando métricas GBP...</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminReports;
