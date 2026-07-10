import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SITE_NOVO } from "@/config/pricing";

const verticals = [
  { value: "psicologo", label: "Psicólogo(a)", emoji: "🧠" },
  { value: "dentista", label: "Dentista", emoji: "🦷" },
  { value: "terapeuta", label: "Terapeuta", emoji: "🌿" },
  { value: "outro", label: "Outro negócio local", emoji: "🏪" },
];

// Só o Site Novo cria projeto. A Gestão de Google é add-on de assinatura,
// contratada em /dashboard/billing — não gera projeto próprio.
const plans = [
  {
    value: SITE_NOVO.key,
    label: SITE_NOVO.name,
    price: `${SITE_NOVO.setupPrice} + ${SITE_NOVO.monthlyPrice}`,
    description: "Site programático com SEO por serviço e bairro",
    emoji: "🚀",
  },
];

const NewProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [businessName, setBusinessName] = useState("");
  const [vertical, setVertical] = useState("");
  const [plan, setPlan] = useState(SITE_NOVO.key);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !vertical) return;
    setLoading(true);

    // Get or create client
    let clientId: string;
    const { data: existingClient } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingClient) {
      clientId = existingClient.id;
    } else {
      const { data: newClient, error: clientError } = await supabase
        .from("clients")
        .insert({ user_id: user.id, business_name: businessName, vertical, city, state })
        .select("id")
        .single();
      if (clientError || !newClient) {
        toast({ title: "Erro", description: clientError?.message || "Erro ao criar cliente", variant: "destructive" });
        setLoading(false);
        return;
      }
      clientId = newClient.id;
    }

    // Create project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        client_id: clientId,
        name: businessName,
        status: "intake",
        plan,
      })
      .select("id")
      .single();

    if (projectError || !project) {
      toast({ title: "Erro", description: projectError?.message || "Erro ao criar projeto", variant: "destructive" });
      setLoading(false);
      return;
    }

    // Create intake record
    const { error: intakeError } = await supabase.from("client_intake").insert({
      project_id: project.id,
      step_current: 1,
      business_data: { business_name: businessName, vertical, city, state },
    });

    if (intakeError) {
      toast({ title: "Erro ao criar intake", description: intakeError.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    toast({ title: "Projeto criado!", description: "Vamos começar o onboarding." });
    navigate(`/dashboard/onboarding/${project.id}`);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-lg">
        <h1 className="mb-2 font-serif text-2xl text-foreground">Novo Projeto</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Preencha os dados iniciais para começar
        </p>

        <form onSubmit={handleCreate} className="glass-card rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <Label>Nome do negócio</Label>
            <Input
              placeholder="Ex.: Clínica Dra. Maria"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input placeholder="São Paulo" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Input placeholder="SP" value={state} onChange={(e) => setState(e.target.value)} maxLength={2} />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Tipo de negócio</Label>
            <div className="grid grid-cols-2 gap-3">
              {verticals.map((v) => (
                <button
                  key={v.value}
                  type="button"
                  onClick={() => setVertical(v.value)}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left text-sm transition-all ${
                    vertical === v.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <span className="text-xl">{v.emoji}</span>
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Plano</Label>
            <div className="grid grid-cols-1 gap-3">
              {plans.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPlan(p.value)}
                  className={`flex flex-col gap-1 rounded-lg border p-4 text-left text-sm transition-all ${
                    plan === p.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <span className="text-xl">{p.emoji}</span>
                  <span className="font-medium">{p.label}</span>
                  <span className="text-xs text-muted-foreground">{p.description}</span>
                  <span className="mt-1 text-xs font-medium text-primary">{p.price}</span>
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" variant="hero" className="w-full" disabled={loading || !vertical || !plan}>
            {loading ? "Criando…" : "Criar e iniciar onboarding"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default NewProject;