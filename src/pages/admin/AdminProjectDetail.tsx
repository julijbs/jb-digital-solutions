import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, ExternalLink, GitBranch, Globe, MapPin, Sparkles,
  ChevronRight, ChevronLeft, Copy, Send, Clock, CheckCircle2,
} from "lucide-react";

// Site+GBP admin pipeline stages (internal, not in SERVICE_CONFIG)
const SITE_GBP_ADMIN_STAGES = [
  { key: "intake",                  label: "Intake" },
  { key: "onboarding_in_progress",  label: "Onboarding" },
  { key: "content_ready",           label: "Conteúdo pronto" },
  { key: "lovable_prompt_ready",    label: "Prompt pronto" },
  { key: "lovable_site_generated",  label: "Site gerado" },
  { key: "repo_created",            label: "Repo criado" },
  { key: "vercel_deployed_preview", label: "Preview" },
  { key: "qa_passed",               label: "QA aprovado" },
  { key: "client_review",           label: "Revisão cliente" },
  { key: "vercel_deployed_prod",    label: "Produção" },
  { key: "handoff_ready",           label: "Entrega pronta" },
  { key: "handoff_done",            label: "Entregue" },
  { key: "monthly_active",          label: "Ativo mensal" },
];

const AdminProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [project, setProject] = useState<any>(null);
  const [intake, setIntake] = useState<any>(null);
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    if (!projectId) return;
    const [projRes, intakeRes, reviewRes] = await Promise.all([
      supabase.from("projects").select("*, clients(business_name, vertical, city, state, user_id)").eq("id", projectId).maybeSingle(),
      supabase.from("client_intake").select("*").eq("project_id", projectId).maybeSingle(),
      supabase.from("client_reviews").select("*").eq("project_id", projectId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    ]);
    setProject(projRes.data);
    setIntake(intakeRes.data);
    setReview(reviewRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [projectId]);

  const getPipelineStages = () => SITE_GBP_ADMIN_STAGES;

  const moveProject = async (newStatus: string) => {
    if (!projectId) return;
    await supabase.from("projects").update({ status: newStatus }).eq("id", projectId);
    const stages = getPipelineStages();
    toast({ title: `Status: ${stages.find(s => s.key === newStatus)?.label ?? newStatus}` });
    fetchAll();
  };

  const sendToReview = async () => {
    if (!projectId || !project) return;
    await supabase.from("client_reviews").insert({ project_id: projectId, status: "pending" });
    await supabase.from("projects").update({ status: "client_review" }).eq("id", projectId);
    const clientUserId = (project.clients as any)?.user_id;
    if (clientUserId) {
      await supabase.from("notifications").insert({
        user_id: clientUserId,
        title: "Seu site está pronto para revisão!",
        message: `O projeto "${project.name}" está pronto para sua aprovação.`,
        type: "review",
        link: "/dashboard/projects",
      });
    }
    toast({ title: "Enviado para revisão do cliente" });
    fetchAll();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Projeto não encontrado.</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate("/admin/pipeline")}>
            <ArrowLeft size={16} /> Voltar ao Pipeline
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const client = project.clients as any;
  const bd = (intake?.business_data as any) || {};
  const sd = (intake?.schedule_data as any) || {};
  const svd = (intake?.services_data as any) || {};
  const gd = (intake?.google_data as any) || {};

  const pipelineStages = getPipelineStages();
  const currentIdx = pipelineStages.findIndex(s => s.key === project.status);
  const nextStatus = currentIdx < pipelineStages.length - 1 ? pipelineStages[currentIdx + 1].key : null;
  const prevStatus = currentIdx > 0 ? pipelineStages[currentIdx - 1].key : null;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Voltar
        </Button>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-2xl text-foreground">{project.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {client?.business_name} • {client?.city}/{client?.state} • {client?.vertical}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
              {project.plan}
            </span>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {pipelineStages.find(s => s.key === project.status)?.label || project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Pipeline timeline */}
      <div className="glass-card rounded-xl p-5 mb-6 overflow-x-auto">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Timeline do Pipeline</h3>
        <div className="flex items-center gap-1 min-w-max">
          {pipelineStages.map((stage, i) => {
            const isCurrent = stage.key === project.status;
            const isPast = i < currentIdx;
            return (
              <div key={stage.key} className="flex items-center">
                <button
                  onClick={() => moveProject(stage.key)}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : isPast
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {isPast && <CheckCircle2 size={10} />}
                  {stage.label}
                </button>
                {i < pipelineStages.length - 1 && (
                  <ChevronRight size={12} className="text-muted-foreground mx-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        {prevStatus && (
          <Button variant="outline" size="sm" onClick={() => moveProject(prevStatus)}>
            <ChevronLeft size={14} /> Voltar etapa
          </Button>
        )}
        {nextStatus && (
          <Button variant="outline" size="sm" onClick={() => moveProject(nextStatus)}>
            Avançar etapa <ChevronRight size={14} />
          </Button>
        )}
        {(project.status === "qa_passed" || project.status === "vercel_deployed_preview") && (
          <Button variant="hero" size="sm" onClick={sendToReview}>
            <Send size={14} /> Enviar para revisão
          </Button>
        )}
        <Link to={`/admin/prompt-generator?project=${projectId}`}>
          <Button variant="outline" size="sm">
            <Sparkles size={14} /> Gerar Prompt
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Links & Integrations */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Links & Integrações</h3>
          <div className="space-y-3">
            {[
              { label: "Site URL", value: project.site_url, icon: Globe },
              { label: "GitHub Repo", value: project.github_repo, icon: GitBranch },
              { label: "Vercel Project", value: project.vercel_project_id, icon: ExternalLink },
              { label: "Google Business", value: project.gbp_url, icon: MapPin },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <item.icon size={14} />
                  {item.label}
                </div>
                {item.value ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-foreground truncate max-w-[200px]">{item.value}</span>
                    <button onClick={() => { navigator.clipboard.writeText(item.value); toast({ title: "Copiado!" }); }}>
                      <Copy size={12} className="text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Não configurado</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Intake summary */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Resumo do Intake</h3>
          {intake ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="text-foreground">{intake.completed ? "✅ Completo" : `⏳ Passo ${intake.step_current}/6`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nome</span>
                <span className="text-foreground">{bd.name || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telefone</span>
                <span className="text-foreground">{bd.phone || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categoria</span>
                <span className="text-foreground">{svd.main_category || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Serviços</span>
                <span className="text-foreground text-right max-w-[60%] truncate">{svd.services_tags || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cidade</span>
                <span className="text-foreground">{sd.city || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GBP</span>
                <span className="text-foreground">{gd.has_gbp ? "Sim" : "Não"}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Nenhum intake encontrado.</p>
          )}
        </div>

        {/* Client Review */}
        <div className="glass-card rounded-xl p-5 space-y-4 lg:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">Revisão do Cliente</h3>
          {review ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  review.status === "approved"
                    ? "bg-green-500/10 text-green-400"
                    : review.status === "changes_requested"
                    ? "bg-yellow-500/10 text-yellow-400"
                    : "bg-blue-500/10 text-blue-400"
                }`}>
                  {review.status === "approved" ? "✅ Aprovado" : review.status === "changes_requested" ? "🔄 Ajustes solicitados" : "⏳ Aguardando"}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(review.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
              {review.feedback && (
                <div className="rounded-lg bg-background/50 p-3 text-sm text-foreground">
                  <p className="text-xs text-muted-foreground mb-1">Feedback do cliente:</p>
                  {review.feedback}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Nenhuma revisão enviada ainda.</p>
          )}
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground flex items-center gap-1">
        <Clock size={12} />
        Criado em {new Date(project.created_at).toLocaleDateString("pt-BR")} •
        Atualizado em {new Date(project.updated_at).toLocaleDateString("pt-BR")}
      </p>
    </DashboardLayout>
  );
};

export default AdminProjectDetail;
