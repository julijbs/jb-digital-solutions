import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function DomainSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState(false);

  const domain = searchParams.get("domain") || "";
  const sessionId = searchParams.get("session_id") || "";
  const projectId = searchParams.get("project_id") || "";

  useEffect(() => {
    if (!sessionId || !domain || !projectId) {
      navigate("/dashboard");
      return;
    }
    registerDomain();
  }, []);

  const registerDomain = async () => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke("domain-register", {
        body: { domain, projectId, sessionId },
      });

      if (fnError) throw fnError;
      if (data.success) {
        setProcessing(false);
        toast({
          title: "Domínio registrado com sucesso! 🎉",
          description: `${domain} está ativo e configurado`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast({ title: "Erro ao registrar domínio", description: err.message, variant: "destructive" });
      setProcessing(false);
      setError(true);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-lg py-16">
        <Card className="glass-card border-border">
          <CardContent className="flex flex-col items-center py-12 text-center">
            {processing ? (
              <>
                <Loader2 size={48} className="mb-4 animate-spin text-primary" />
                <h2 className="font-serif text-xl text-foreground mb-2">Configurando seu domínio...</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Estamos registrando e configurando <strong>{domain}</strong>
                </p>
                <div className="space-y-2 text-left text-sm w-full max-w-xs">
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle size={16} />
                    <span>Pagamento confirmado</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Registrando domínio...</span>
                  </div>
                </div>
              </>
            ) : error ? (
              <>
                <h2 className="font-serif text-xl text-destructive mb-2">Erro no registro</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Houve um problema ao registrar o domínio. Nossa equipe foi notificada.
                </p>
                <Button variant="hero" onClick={() => navigate("/dashboard")}>
                  Voltar ao Dashboard
                </Button>
              </>
            ) : (
              <>
                <CheckCircle size={48} className="mb-4 text-green-500" />
                <h2 className="font-serif text-xl text-foreground mb-2">Domínio configurado! 🎉</h2>
                <p className="text-sm text-muted-foreground mb-4">Seu site está disponível em:</p>
                <a
                  href={`https://${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline mb-6"
                >
                  {domain}
                  <ExternalLink size={14} />
                </a>
                <Button variant="hero" onClick={() => navigate("/dashboard")}>
                  Voltar ao Dashboard
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
