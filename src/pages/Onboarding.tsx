import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, ChevronRight, ChevronLeft, Save, Upload, X, Image as ImageIcon } from "lucide-react";

const steps = [
  { id: 0, label: "Google Meu Negócio" },
  { id: 1, label: "Dados básicos" },
  { id: 2, label: "Atendimento" },
  { id: 3, label: "Serviços" },
  { id: 4, label: "Fotos" },
  { id: 5, label: "Google" },
];

const Onboarding = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [intake, setIntake] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [hasGbp, setHasGbp] = useState<string>("");
  const [business, setBusiness] = useState({
    name: "", description: "", phone: "", email: "", instagram: "", has_site: "no",
  });
  const [location, setLocation] = useState({
    type: "address", cep: "", street: "", number: "", neighborhood: "", city: "", state: "",
    show_address: true, main_city: "", regions: "", radius_km: "",
    hours: { seg: "", ter: "", qua: "", qui: "", sex: "", sab: "", dom: "" },
  });
  const [services, setServices] = useState({
    main_category: "", alt_categories: "", services_tags: "",
    pain_points: "", differentials: "", approach: "",
  });

  // Photos state
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Google connect state
  const [googleConnecting, setGoogleConnecting] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);

  useEffect(() => {
    const fetchIntake = async () => {
      if (!projectId) return;
      const { data } = await supabase
        .from("client_intake")
        .select("*")
        .eq("project_id", projectId)
        .maybeSingle();

      if (data) {
        setIntake(data);
        const bd = data.business_data as any;
        const sd = data.schedule_data as any;
        const svd = data.services_data as any;
        const gd = data.google_data as any;
        const pd = data.photos_data as any;

        if (gd?.has_gbp !== undefined) setHasGbp(gd.has_gbp ? "yes" : "no");
        if (gd?.google_connected) setGoogleConnected(true);
        if (bd) setBusiness((prev) => ({ ...prev, ...bd }));
        if (sd) setLocation((prev) => ({ ...prev, ...sd }));
        if (svd) setServices((prev) => ({ ...prev, ...svd }));
        if (pd?.photos) setPhotos(pd.photos);

        if (data.step_current) {
          setCurrentStep(Math.max(0, data.step_current - 1));
        }
      }
      setLoading(false);
    };
    fetchIntake();
  }, [projectId]);

  const saveProgress = async (nextStep?: number) => {
    if (!projectId) return;
    setSaving(true);
    const stepNum = (nextStep ?? currentStep) + 1;

    await supabase
      .from("client_intake")
      .update({
        google_data: { has_gbp: hasGbp === "yes", google_connected: googleConnected },
        business_data: business as any,
        schedule_data: location as any,
        services_data: services as any,
        photos_data: { photos } as any,
        step_current: stepNum,
        completed: nextStep === 5,
      })
      .eq("project_id", projectId);

    setSaving(false);
    toast({ title: "Progresso salvo!" });
  };

  const goNext = async () => {
    const next = Math.min(currentStep + 1, 5);
    await saveProgress(next);
    setCurrentStep(next);
  };

  const goBack = () => setCurrentStep(Math.max(currentStep - 1, 0));

  const handleComplete = async () => {
    await saveProgress(5);
    await supabase
      .from("projects")
      .update({ status: "intake" })
      .eq("id", projectId);
    toast({ title: "Onboarding completo!", description: "Seus dados foram enviados para análise." });
    navigate("/dashboard");
  };

  // Photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;
    setUploading(true);

    const newPhotos: { name: string; url: string }[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${projectId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("client-photos").upload(path, file);
      if (!error) {
        const { data: urlData } = supabase.storage.from("client-photos").getPublicUrl(path);
        newPhotos.push({ name: file.name, url: urlData.publicUrl });
      }
    }

    setPhotos((prev) => [...prev, ...newPhotos]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast({ title: `${newPhotos.length} foto(s) enviada(s)!` });
  };

  const removePhoto = async (index: number) => {
    const photo = photos[index];
    // Extract path from URL
    const urlParts = photo.url.split("/client-photos/");
    if (urlParts[1]) {
      await supabase.storage.from("client-photos").remove([decodeURIComponent(urlParts[1])]);
    }
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Google OAuth connect
  const handleGoogleConnect = async () => {
    setGoogleConnecting(true);
    try {
      const { lovable } = await import("@/integrations/lovable/index");
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
        extraParams: { prompt: "select_account" },
      });
      if (error) {
        toast({ title: "Erro ao conectar", description: String(error), variant: "destructive" });
      } else {
        setGoogleConnected(true);
        toast({ title: "Google conectado com sucesso!" });
      }
    } catch (err) {
      toast({ title: "Erro ao conectar Google", variant: "destructive" });
    }
    setGoogleConnecting(false);
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

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2 shrink-0">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                    i < currentStep
                      ? "gold-gradient-bg text-primary-foreground"
                      : i === currentStep
                      ? "border-2 border-primary text-primary"
                      : "border border-border text-muted-foreground"
                  }`}
                >
                  {i < currentStep ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:inline ${i === currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
                {i < steps.length - 1 && <ChevronRight size={14} className="text-border" />}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          {/* Step 0: GBP */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-xl text-foreground">Google Meu Negócio</h2>
                <p className="mt-1 text-sm text-muted-foreground">Você já tem um perfil no Google Meu Negócio?</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "yes", label: "Sim" },
                  { value: "no", label: "Não" },
                  { value: "unknown", label: "Não sei" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setHasGbp(opt.value)}
                    className={`rounded-lg border p-4 text-sm transition-all ${
                      hasGbp === opt.value
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Basic data */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl text-foreground">Dados do negócio</h2>
              {[
                { key: "name", label: "Nome do negócio *", placeholder: "Ex.: Clínica Dra. Maria" },
                { key: "description", label: "Em 1 frase, o que você faz? *", placeholder: "Ex.: Psicóloga clínica especializada em ansiedade" },
                { key: "phone", label: "WhatsApp/Telefone *", placeholder: "(11) 99999-9999" },
                { key: "email", label: "E-mail *", placeholder: "contato@clinica.com" },
                { key: "instagram", label: "Instagram (opcional)", placeholder: "@clinicamaria" },
              ].map((field) => (
                <div key={field.key} className="space-y-1">
                  <Label>{field.label}</Label>
                  <Input
                    placeholder={field.placeholder}
                    value={(business as any)[field.key]}
                    onChange={(e) => setBusiness({ ...business, [field.key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="space-y-1">
                <Label>Tem site?</Label>
                <div className="flex gap-3">
                  {[
                    { value: "yes", label: "Tenho" },
                    { value: "no", label: "Não tenho (JB cria)" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setBusiness({ ...business, has_site: opt.value })}
                      className={`rounded-lg border px-4 py-2 text-sm ${
                        business.has_site === opt.value
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl text-foreground">Tipo de atendimento</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "address", label: "Tenho endereço" },
                  { value: "area", label: "Atendo em área" },
                  { value: "both", label: "Os dois" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLocation({ ...location, type: opt.value })}
                    className={`rounded-lg border p-3 text-sm ${
                      location.type === opt.value
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {(location.type === "address" || location.type === "both") && (
                <div className="space-y-3 pt-2">
                  <Label className="text-foreground">Endereço</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="CEP" value={location.cep} onChange={(e) => setLocation({ ...location, cep: e.target.value })} />
                    <Input placeholder="Cidade/UF" value={location.city} onChange={(e) => setLocation({ ...location, city: e.target.value })} />
                    <Input placeholder="Rua" value={location.street} onChange={(e) => setLocation({ ...location, street: e.target.value })} className="col-span-2" />
                    <Input placeholder="Número" value={location.number} onChange={(e) => setLocation({ ...location, number: e.target.value })} />
                    <Input placeholder="Bairro" value={location.neighborhood} onChange={(e) => setLocation({ ...location, neighborhood: e.target.value })} />
                  </div>
                </div>
              )}

              {(location.type === "area" || location.type === "both") && (
                <div className="space-y-3 pt-2">
                  <Label className="text-foreground">Área de atendimento</Label>
                  <Input placeholder="Cidade principal" value={location.main_city} onChange={(e) => setLocation({ ...location, main_city: e.target.value })} />
                  <Input placeholder="Regiões/bairros (separados por vírgula)" value={location.regions} onChange={(e) => setLocation({ ...location, regions: e.target.value })} />
                  <Input placeholder="Raio em km" value={location.radius_km} onChange={(e) => setLocation({ ...location, radius_km: e.target.value })} />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Services */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl text-foreground">Categoria e serviços</h2>
              {[
                { key: "main_category", label: "Categoria principal", placeholder: "Ex.: Psicólogo Clínico" },
                { key: "alt_categories", label: "2 categorias alternativas", placeholder: "Ex.: Terapia Cognitivo-Comportamental, Psicologia Infantil" },
                { key: "services_tags", label: "Serviços (3 a 10, separados por vírgula)", placeholder: "Ex.: Terapia individual, Terapia de casal, Avaliação psicológica" },
                { key: "pain_points", label: "Dores/situações dos seus clientes", placeholder: "Ex.: Ansiedade, Insônia, Dificuldade nos relacionamentos" },
                { key: "differentials", label: "Diferenciais reais (3 a 6)", placeholder: "Ex.: Atendimento online e presencial, Flexibilidade de horários" },
                { key: "approach", label: "Abordagem/método", placeholder: "Ex.: Terapia Cognitivo-Comportamental com foco em resultados práticos" },
              ].map((field) => (
                <div key={field.key} className="space-y-1">
                  <Label>{field.label}</Label>
                  {field.key === "pain_points" || field.key === "approach" ? (
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder={field.placeholder}
                      value={(services as any)[field.key]}
                      onChange={(e) => setServices({ ...services, [field.key]: e.target.value })}
                    />
                  ) : (
                    <Input
                      placeholder={field.placeholder}
                      value={(services as any)[field.key]}
                      onChange={(e) => setServices({ ...services, [field.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 4: Photos - NOW WITH UPLOAD */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-xl text-foreground">Fotos e identidade</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Envie logo e fotos do seu negócio. Recomendamos 5 a 20 fotos.
                </p>
              </div>

              {/* Upload area */}
              <div
                className="cursor-pointer rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary/40"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={32} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {uploading ? "Enviando…" : "Clique para selecionar ou arraste fotos aqui"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">JPG, PNG ou WebP • Máx 5MB cada</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>

              {/* Photo grid */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {photos.map((photo, i) => (
                    <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                      <img src={photo.url} alt={photo.name} className="h-full w-full object-cover" />
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute right-1 top-1 rounded-full bg-destructive/80 p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {photos.length === 0 && (
                <div className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3">
                  <ImageIcon size={18} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Nenhuma foto enviada ainda</p>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Connect Google - NOW FUNCTIONAL */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-xl text-foreground">Conectar Google</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Conecte sua conta Google para gerenciar seu perfil diretamente pela plataforma.
                </p>
              </div>
              <div className="glass-card rounded-lg p-6 text-center">
                {googleConnected ? (
                  <>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                      <Check size={32} className="text-green-400" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-2">Google conectado!</p>
                    <p className="text-xs text-muted-foreground">
                      Sua conta Google foi vinculada com sucesso.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mb-4 text-4xl">🔗</div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Vincule sua conta Google para que possamos gerenciar seu perfil no Google Meu Negócio.
                    </p>
                    <Button
                      variant="hero"
                      onClick={handleGoogleConnect}
                      disabled={googleConnecting}
                    >
                      {googleConnecting ? "Conectando…" : "Conectar com Google"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
            <Button variant="ghost" onClick={goBack} disabled={currentStep === 0}>
              <ChevronLeft size={16} />
              Voltar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => saveProgress()} disabled={saving}>
              <Save size={14} />
              {saving ? "Salvando…" : "Salvar"}
            </Button>
            {currentStep < 5 ? (
              <Button variant="hero" onClick={goNext}>
                Próximo
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button variant="hero" onClick={handleComplete}>
                Concluir onboarding
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Onboarding;
