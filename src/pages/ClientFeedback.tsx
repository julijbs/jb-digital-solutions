import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Star, Send, CheckCircle2 } from "lucide-react";
import jbLogo from "@/assets/jb-logo.jpg";

const NPS_LABELS: Record<number, string> = {
  0: "😞", 1: "😞", 2: "😟", 3: "😟", 4: "😐", 5: "😐",
  6: "😐", 7: "🙂", 8: "🙂", 9: "😄", 10: "🤩",
};

const ClientFeedback = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const initialScore = searchParams.get("score");
  const feedbackType = searchParams.get("type") || "nps";
  const projectId = searchParams.get("project");
  const clientIdParam = searchParams.get("client");

  const [score, setScore] = useState<number | null>(initialScore ? parseInt(initialScore) : null);
  const [comment, setComment] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"nps" | "testimonial">(feedbackType === "testimonial" ? "testimonial" : "nps");
  const [clientId, setClientId] = useState<string | null>(clientIdParam);
  const [resolvedProjectId, setResolvedProjectId] = useState<string | null>(projectId);

  useEffect(() => {
    const fetchClient = async () => {
      // If we already have both IDs from URL params, skip fetching
      if (clientId && resolvedProjectId) return;

      if (!user) return;
      const { data } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        if (!clientId) setClientId(data.id);
        if (!resolvedProjectId) {
          const { data: proj } = await supabase
            .from("projects")
            .select("id")
            .eq("client_id", data.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          if (proj) setResolvedProjectId(proj.id);
        }
      }
    };
    fetchClient();
  }, [user, clientId, resolvedProjectId]);

  const handleSubmitNPS = async () => {
    if (score === null || !clientId || !resolvedProjectId) return;
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("submit-feedback", {
        body: {
          client_id: clientId,
          project_id: resolvedProjectId,
          type: "nps",
          nps_score: score,
          comment: comment || null,
        },
      });
      if (error) throw error;
      if (score >= 9) {
        setStep("testimonial");
        setComment("");
      } else {
        setSubmitted(true);
      }
      toast.success("Obrigado pelo seu feedback!");
    } catch {
      toast.error("Erro ao enviar feedback");
    }
    setLoading(false);
  };

  const handleSubmitTestimonial = async () => {
    if (!comment.trim() || !clientId || !resolvedProjectId) return;
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("submit-feedback", {
        body: {
          client_id: clientId,
          project_id: resolvedProjectId,
          type: "testimonial",
          comment,
          is_public: isPublic,
        },
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Depoimento enviado! Obrigado!");
    } catch {
      toast.error("Erro ao enviar depoimento");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 size={40} className="text-primary" />
          </div>
          <h1 className="font-serif text-2xl text-foreground">Obrigado! 🙏</h1>
          <p className="mt-3 text-muted-foreground">
            Seu feedback é muito importante para nós. Ele nos ajuda a melhorar continuamente nossos serviços.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex justify-center">
          <img src={jbLogo} alt="JB Digital" className="h-10 rounded-lg" />
        </div>

        {step === "nps" && (
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <h1 className="font-serif text-xl text-foreground text-center mb-2">
              Como foi sua experiência?
            </h1>
            <p className="text-center text-sm text-muted-foreground mb-8">
              De 0 a 10, o quanto você recomendaria nosso serviço para um colega?
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                <button
                  key={n}
                  onClick={() => setScore(n)}
                  className={`flex h-12 w-12 flex-col items-center justify-center rounded-xl border-2 text-sm font-semibold transition-all ${
                    score === n
                      ? "border-primary bg-primary text-primary-foreground scale-110"
                      : n <= 6
                      ? "border-destructive/30 bg-destructive/5 text-destructive hover:border-destructive/50"
                      : n <= 8
                      ? "border-yellow-500/30 bg-yellow-500/5 text-yellow-600 hover:border-yellow-500/50"
                      : "border-green-500/30 bg-green-500/5 text-green-600 hover:border-green-500/50"
                  }`}
                >
                  <span>{n}</span>
                  <span className="text-[10px]">{NPS_LABELS[n]}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between px-2 mb-6">
              <span className="text-xs text-muted-foreground">Nada provável</span>
              <span className="text-xs text-muted-foreground">Com certeza!</span>
            </div>

            <Textarea
              placeholder="Conte-nos mais sobre sua experiência (opcional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-4"
              rows={3}
            />

            <Button
              className="w-full"
              onClick={handleSubmitNPS}
              disabled={score === null || loading || !clientId}
            >
              <Send size={16} />
              {loading ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </div>
        )}

        {step === "testimonial" && (
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Star size={28} className="text-primary" />
            </div>
            <h1 className="font-serif text-xl text-foreground text-center mb-2">
              Que legal! Nota {score}! ⭐
            </h1>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Ficamos muito felizes! Pode nos deixar um depoimento rápido? Ele poderá ser usado em nosso site.
            </p>

            <Textarea
              placeholder="Ex: A JB Digital transformou minha presença online. Em poucas semanas já recebi novos pacientes pelo Google..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-4"
              rows={4}
            />

            <label className="mb-4 flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <span className="text-sm text-muted-foreground">
                Autorizo usar meu depoimento publicamente
              </span>
            </label>

            <Button
              className="w-full"
              onClick={handleSubmitTestimonial}
              disabled={!comment.trim() || loading}
            >
              <Send size={16} />
              {loading ? "Enviando..." : "Enviar Depoimento"}
            </Button>

            <button
              onClick={() => setSubmitted(true)}
              className="mt-3 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pular por enquanto
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientFeedback;
