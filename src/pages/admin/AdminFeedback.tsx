import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Star, MessageSquare, TrendingUp, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

interface Feedback {
  id: string;
  type: string;
  nps_score: number | null;
  comment: string | null;
  is_public: boolean;
  created_at: string;
  client_id: string;
  project_id: string;
}

interface NpsMetrics {
  total: number;
  promoters: number;
  passives: number;
  detractors: number;
  npsScore: number;
  avgScore: number;
}

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [metrics, setMetrics] = useState<NpsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"nps" | "testimonials">("nps");

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("client_feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar feedback");
      setLoading(false);
      return;
    }

    const items = (data || []) as Feedback[];
    setFeedback(items);

    // Calculate NPS metrics
    const npsItems = items.filter((f) => f.type === "nps" && f.nps_score !== null);
    if (npsItems.length > 0) {
      const promoters = npsItems.filter((f) => f.nps_score! >= 9).length;
      const detractors = npsItems.filter((f) => f.nps_score! <= 6).length;
      const passives = npsItems.length - promoters - detractors;
      const npsScore = Math.round(((promoters - detractors) / npsItems.length) * 100);
      const avgScore = +(npsItems.reduce((a, b) => a + b.nps_score!, 0) / npsItems.length).toFixed(1);
      setMetrics({ total: npsItems.length, promoters, passives, detractors, npsScore, avgScore });
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const togglePublic = async (id: string, current: boolean) => {
    await supabase.from("client_feedback").update({ is_public: !current }).eq("id", id);
    toast.success(current ? "Depoimento ocultado" : "Depoimento aprovado para exibição");
    fetchData();
  };

  const npsItems = feedback.filter((f) => f.type === "nps");
  const testimonials = feedback.filter((f) => f.type === "testimonial");

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">NPS & Depoimentos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Feedback dos clientes e depoimentos coletados</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Atualizar
        </Button>
      </div>

      {/* NPS Metrics */}
      {metrics && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">NPS Score</span>
              <TrendingUp size={18} className="text-primary" />
            </div>
            <p className={`mt-2 font-serif text-3xl ${metrics.npsScore >= 50 ? "text-primary" : metrics.npsScore >= 0 ? "text-muted-foreground" : "text-destructive"}`}>
              {metrics.npsScore}
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Média</span>
              <Star size={18} className="text-primary" />
            </div>
            <p className="mt-2 font-serif text-3xl text-foreground">{metrics.avgScore}</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Promotores (9-10)</span>
              <ThumbsUp size={18} className="text-primary" />
            </div>
            <p className="mt-2 font-serif text-3xl text-foreground">{metrics.promoters}</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Respostas</span>
              <MessageSquare size={18} className="text-muted-foreground" />
            </div>
            <p className="mt-2 font-serif text-3xl text-foreground">{metrics.total}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <Button variant={tab === "nps" ? "default" : "outline"} size="sm" onClick={() => setTab("nps")}>
          <Star size={14} /> NPS ({npsItems.length})
        </Button>
        <Button variant={tab === "testimonials" ? "default" : "outline"} size="sm" onClick={() => setTab("testimonials")}>
          <MessageSquare size={14} /> Depoimentos ({testimonials.length})
        </Button>
      </div>

      {tab === "nps" && (
        npsItems.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
            <Star size={48} className="mb-4 text-muted-foreground" />
            <h2 className="font-serif text-xl text-foreground">Nenhuma avaliação NPS</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              As avaliações aparecerão aqui quando os clientes responderem.
            </p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Nota</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Comentário</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Data</th>
                </tr>
              </thead>
              <tbody>
                {npsItems.map((item) => (
                  <tr key={item.id} className="border-b border-border/20">
                    <td className="px-4 py-3">
                      <Badge variant={item.nps_score! >= 9 ? "default" : item.nps_score! >= 7 ? "secondary" : "destructive"}>
                        {item.nps_score}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.nps_score! >= 9 ? "Promotor" : item.nps_score! >= 7 ? "Neutro" : "Detrator"}
                    </td>
                    <td className="px-4 py-3 text-foreground max-w-xs truncate">{item.comment || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {tab === "testimonials" && (
        testimonials.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
            <MessageSquare size={48} className="mb-4 text-muted-foreground" />
            <h2 className="font-serif text-xl text-foreground">Nenhum depoimento</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Os depoimentos aparecerão aqui quando os clientes enviarem.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {testimonials.map((t) => (
              <div key={t.id} className="glass-card rounded-xl p-6">
                <p className="text-foreground italic">"{t.comment}"</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(t.created_at).toLocaleDateString("pt-BR")}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant={t.is_public ? "default" : "outline"}>
                      {t.is_public ? "Público" : "Privado"}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => togglePublic(t.id, t.is_public)}>
                      {t.is_public ? "Ocultar" : "Aprovar"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </DashboardLayout>
  );
};

export default AdminFeedback;
