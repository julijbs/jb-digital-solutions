import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2, MessageSquare, Globe, ExternalLink, Clock, Send, Shield, Loader2,
} from "lucide-react";

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Aguardando sua revisão", color: "bg-blue-500/10 text-blue-400" },
  approved: { label: "Aprovado", color: "bg-green-500/10 text-green-400" },
  changes_requested: { label: "Ajustes solicitados", color: "bg-yellow-500/10 text-yellow-400" },
};

const ClientReview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Record<string, any>>({});
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const subscribedSuccess = searchParams.get("subscribed") === "true";

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      const { data: client } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!client) { setLoading(false); return; }

      const { data: projectsData } = await supabase
        .from("projects")
        .select("*")
        .eq("client_id", client.id)
        .in("status", ["client_review", "vercel_deployed_prod", "handoff_ready", "handoff_done"])
        .order("updated_at", { ascending: false });

      const projs = projectsData || [];
      setProjects(projs);

      // Fetch reviews for each project
      const projectIds = projs.map((p: any) => p.id);
      if (projectIds.length > 0) {
        const { data: reviewsData } = await supabase
          .from("client_reviews")
          .select("*")
          .in("project_id", projectIds)
          .order("created_at", { ascending: false });

        const reviewMap: Record<string, any> = {};
        (reviewsData || []).forEach((r: any) => {
          if (!reviewMap[r.project_id]) reviewMap[r.project_id] = r;
        });
        setReviews(reviewMap);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const approveProject = async (projectId: string, reviewId: string) => {
    setSubmitting(projectId);
    await supabase.from("client_reviews").update({
      status: "approved",
      approved_at: new Date().toISOString(),
      feedback: feedbackText[projectId] || null,
    }).eq("id", reviewId);
    toast({ title: "Projeto aprovado! 🎉", description: "Vamos preparar o deploy final." });
    setSubmitting(null);
    window.location.reload();
  };

  const requestChanges = async (projectId: string, reviewId: string) => {
    if (!feedbackText[projectId]?.trim()) {
      toast({ title: "Descreva os ajustes", description: "Por favor, detalhe quais mudanças são necessárias.", variant: "destructive" });
      return;
    }
    setSubmitting(projectId);
    await supabase.from("client_reviews").update({
      status: "changes_requested",
      feedback: feedbackText[projectId],
    }).eq("id", reviewId);
    toast({ title: "Ajustes solicitados", description: "Nosso time irá revisar e aplicar as mudanças." });
    setSubmitting(null);
    window.location.reload();
  };

  const handleMaintenanceCheckout = async (projectId: string) => {
    setCheckoutLoading(projectId);
    try {
      const { data, error } = await supabase.functions.invoke("create-maintenance-checkout", {
        body: { project_id: projectId },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      toast({ title: "Erro", description: "Não foi possível iniciar o checkout.", variant: "destructive" });
    }
    setCheckoutLoading(null);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Revisão de Projetos</h1>
        <p className="mt-1 text-sm text-muted-foreground">Revise e aprove seus sites antes do lançamento</p>
      </div>

      {subscribedSuccess && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/5 p-4">
          <CheckCircle2 size={16} className="text-green-400" />
          <span className="text-sm text-foreground">Assinatura de acompanhamento ativada com sucesso! 🎉</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="glass-card animate-pulse rounded-xl h-40" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
          <CheckCircle2 size={48} className="mb-4 text-muted-foreground" />
          <h2 className="font-serif text-xl text-foreground">Nenhum projeto para revisar</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Quando seu site estiver pronto para aprovação, ele aparecerá aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => {
            const review = reviews[project.id];
            const st = review ? statusLabels[review.status] || statusLabels.pending : null;
            const isPending = review?.status === "pending";

            return (
              <div key={project.id} className="glass-card rounded-xl p-6 space-y-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="font-serif text-lg text-foreground">{project.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="capitalize">Plano: {project.plan}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(project.updated_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                  {st && (
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${st.color}`}>
                      {st.label}
                    </span>
                  )}
                </div>

                {/* Preview link */}
                {project.site_url && (
                  <a
                    href={project.site_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Globe size={14} /> Ver preview do site <ExternalLink size={12} />
                  </a>
                )}

                {/* Previous feedback */}
                {review?.feedback && review.status !== "pending" && (
                  <div className="rounded-lg bg-background/50 p-3 text-sm">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MessageSquare size={12} /> Seu feedback:
                    </p>
                    <p className="text-foreground">{review.feedback}</p>
                  </div>
                )}

                {/* Actions for pending review */}
                {isPending && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <Textarea
                      placeholder="Descreva ajustes ou observações (opcional para aprovar, obrigatório para solicitar alterações)..."
                      value={feedbackText[project.id] || ""}
                      onChange={(e) => setFeedbackText((prev) => ({ ...prev, [project.id]: e.target.value }))}
                      className="min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="hero"
                        size="sm"
                        disabled={submitting === project.id}
                        onClick={() => approveProject(project.id, review.id)}
                      >
                        <CheckCircle2 size={14} /> Aprovar site
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={submitting === project.id}
                        onClick={() => requestChanges(project.id, review.id)}
                      >
                        <Send size={14} /> Solicitar ajustes
                      </Button>
                    </div>
                  </div>
                )}

                {/* Maintenance upsell - shown after approval */}
                {review?.status === "approved" && (
                  <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield size={18} className="text-primary" />
                      <h4 className="font-serif text-base text-foreground">Acompanhamento e Manutenção</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mantenha seu site e perfil Google sempre atualizados e otimizados. 
                      Inclui suporte prioritário, atualizações de conteúdo e monitoramento contínuo.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xl text-foreground">
                        R$ 397<span className="text-sm text-muted-foreground font-sans">/mês</span>
                      </span>
                      <Button
                        variant="hero"
                        size="sm"
                        disabled={checkoutLoading === project.id}
                        onClick={() => handleMaintenanceCheckout(project.id)}
                      >
                        {checkoutLoading === project.id ? (
                          <><Loader2 size={14} className="animate-spin" /> Processando...</>
                        ) : (
                          <><Shield size={14} /> Assinar acompanhamento</>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClientReview;
