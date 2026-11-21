import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Wand2, Loader2, Globe, RefreshCcw, Upload, Eye, EyeOff, Palette,
} from "lucide-react";
import { generateSiteHtml } from "@/utils/generateSiteTemplate";

// ── Types ────────────────────────────────────────────────────────────────────

interface ProjectData {
  id: string;
  name: string;
  status: string;
  site_url: string | null;
  clients: { business_name: string; vertical: string; city?: string; state?: string } | null;
}

interface IntakeData {
  business_data: Record<string, string>;
  services_data: Record<string, string>;
  schedule_data: Record<string, string>;
  completed: boolean;
}

interface SiteGeneratorProps {
  project: ProjectData;
  intake: IntakeData | null;
  onPublished: (siteUrl: string) => void;
}

// ── Constants ────────────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: "elegant-minimal",
    label: "Editorial de confiança",
    category: "Profissionais",
    desc: "Tipografia editorial, paleta azul-ardósia e respiro visual.",
    preview: "bg-gradient-to-br from-[#f4f2ed] to-[#e6e2d9]",
  },
  {
    id: "warm-soft",
    label: "Clínica serena",
    category: "Saúde e bem-estar",
    desc: "Composição calma, leitura clara e tons naturais.",
    preview: "bg-gradient-to-br from-emerald-50 to-[#c7d9cd]",
  },
  {
    id: "beauty-studio",
    label: "Beleza & estética",
    category: "Beleza",
    desc: "Visual sofisticado, tons rosé e destaque para serviços e imagens.",
    preview: "bg-gradient-to-br from-[#fbf1ed] to-[#d9a7a0]",
  },
  {
    id: "modern-clean",
    label: "Serviço local",
    category: "Negócios locais",
    desc: "Navegação direta, CTA visível e serviços fáceis de encontrar.",
    preview: "bg-gradient-to-br from-sky-50 to-[#afc8d8]",
  },
  {
    id: "hospitality-warm",
    label: "Gastronomia acolhedora",
    category: "Alimentação",
    desc: "Paleta quente e estrutura para apresentar especialidades.",
    preview: "bg-gradient-to-br from-[#fff4e5] to-[#d9a174]",
  },
];

const COLOR_SCHEMES = [
  { id: "blue-professional", label: "Azul & areia", hex: "#3E5C76", accent: "#8A5A33" },
  { id: "green-therapeutic", label: "Verde & sálvia", hex: "#2D6A4F", accent: "#2F6F52" },
  { id: "rose-editorial", label: "Rosé & vinho", hex: "#6E3447", accent: "#8A4750" },
  { id: "terracotta-hospitality", label: "Terracota & creme", hex: "#7A3F2B", accent: "#843E25" },
  { id: "purple-transformer", label: "Roxo Transformador", hex: "#5A189A", accent: "#7B2CBF" },
];

const SECTIONS = ["hero", "pain_section", "about", "services", "process", "cta_final"];

function recommendTemplate(vertical: string): string {
  const normalized = vertical.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (/(beleza|estet|cabelo|salao|maqui|sobrancelha|manicure|unha|spa)/.test(normalized)) {
    return "beauty-studio";
  }
  if (/(restaurante|gastronom|cafe|cafeteria|bar\b|pizzaria|padaria|comida|buffet)/.test(normalized)) {
    return "hospitality-warm";
  }
  if (/(saude|clin|psicol|terap|medic|nutri|dent|vet|fisioter|fono)/.test(normalized)) {
    return "warm-soft";
  }
  return "elegant-minimal";
}

function recommendColorScheme(vertical: string): string {
  const normalized = vertical.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (/(beleza|estet|cabelo|salao|maqui|sobrancelha|manicure|unha|spa)/.test(normalized)) {
    return "rose-editorial";
  }
  if (/(restaurante|gastronom|cafe|cafeteria|bar\b|pizzaria|padaria|comida|buffet)/.test(normalized)) {
    return "terracotta-hospitality";
  }
  if (/(saude|clin|psicol|terap|medic|nutri|dent|vet|fisioter|fono)/.test(normalized)) {
    return "green-therapeutic";
  }
  return "blue-professional";
}

// ── Component ────────────────────────────────────────────────────────────────

export function SiteGenerator({ project, intake, onPublished }: SiteGeneratorProps) {
  const { toast } = useToast();

  const vertical = project.clients?.vertical || "";
  const recommendedTemplate = recommendTemplate(vertical);
  const recommendedColorScheme = recommendColorScheme(vertical);
  const [template, setTemplate] = useState(recommendedTemplate);
  const [colorScheme, setColorScheme] = useState(recommendedColorScheme);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<Record<string, unknown> | null>(null);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Section regeneration
  const [regenSection, setRegenSection] = useState<string | null>(null);
  const [regenPrompt, setRegenPrompt] = useState("");
  const [regenLoading, setRegenLoading] = useState(false);

  useEffect(() => {
    setTemplate(recommendedTemplate);
    setColorScheme(recommendedColorScheme);
  }, [project.id, recommendedTemplate, recommendedColorScheme]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratedHtml(null);

    const bd = (intake?.business_data as Record<string, string>) || {};
    const svd = (intake?.services_data as Record<string, string>) || {};
    const sd = (intake?.schedule_data as Record<string, string>) || {};

    const businessName = project.clients?.business_name || bd.name || project.name || "Negócio local";
    const vertical = project.clients?.vertical || svd.main_category || "Negócio local";
    const city = project.clients?.city || sd.city || "";
    const state = project.clients?.state || sd.state || "";
    const phone = bd.phone || "";
    const email = bd.email || "";
    const description = bd.description || "";
    const services = svd.services_tags || "";
    const credentials = svd.credentials_summary || "";
    const differentials = svd.differentials || "";

    try {
      // 1. Try remote Edge Function first
      const { data, error } = await supabase.functions.invoke("generate-site-ai", {
        body: { projectId: project.id, template, colorScheme },
      });

      if (!error && data?.html) {
        setGeneratedHtml(data.html);
        setGeneratedContent(data.content || null);
        await supabase.from("projects").update({ status: "ai_site_generated" }).eq("id", project.id);
        setGenerating(false);
        toast({ title: "Site gerado com sucesso via IA! ✨", description: "Confira o preview abaixo." });
        return;
      }
    } catch (edgeErr) {
      console.warn("Edge function invoke failed, fallback to local compiler:", edgeErr);
    }

    // 2. Fallback: High quality instant site compiler
    try {
      const generated = generateSiteHtml({
        businessName,
        vertical,
        city,
        state,
        phone,
        email,
        description,
        services,
        credentials,
        differentials,
        template,
        colorScheme,
      });

      setGeneratedHtml(generated.html);
      setGeneratedContent(generated.content);

      await supabase.from("projects").update({ status: "ai_site_generated" }).eq("id", project.id);

      toast({
        title: "Site compilado com sucesso! ✨",
        description: "Template responsivo gerado com Schema.org e AEO.",
      });
    } catch (compileErr) {
      toast({
        title: "Erro ao compilar site",
        description: (compileErr as Error).message,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedHtml) return;

    setPublishing(true);
    const slug = project.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 30);

    try {
      const { data, error } = await supabase.functions.invoke("publish-site", {
        body: { projectId: project.id, html: generatedHtml, projectSlug: slug },
      });

      if (error) {
        if (error.context instanceof Response) {
          const responseBody = await error.context.clone().json().catch(() => null) as { error?: unknown } | null;
          if (typeof responseBody?.error === "string") throw new Error(responseBody.error);
        }
        throw new Error(error.message);
      }
      if (data?.error) throw new Error(data.error);
      if (data?.success !== true || typeof data?.publishedUrl !== "string") {
        throw new Error("O serviço não confirmou a publicação no Cloudflare.");
      }

      const siteUrl = data.publishedUrl;
      onPublished(siteUrl);
      toast({
        title: data.domainWarning ? "Site publicado no Cloudflare Pages" : "Site publicado com sucesso! 🚀",
        description: data.domainWarning
          ? `URL publicada: ${siteUrl}. O domínio personalizado ainda não foi configurado.`
          : `Disponível em: ${siteUrl}`,
      });
    } catch (err) {
      toast({
        title: "Não foi possível confirmar a publicação",
        description: err instanceof Error ? err.message : "Erro inesperado ao publicar.",
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleRegenSection = async () => {
    if (!regenSection || !generatedContent) return;

    setRegenLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("regenerate-section", {
        body: {
          section: regenSection,
          currentContent: generatedContent[regenSection],
          customPrompt: regenPrompt || undefined,
        },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      // Update content and re-generate HTML with new section
      const newContent = { ...generatedContent, [regenSection]: data.newContent };
      setGeneratedContent(newContent);

      // Re-generate the full HTML with updated content
      const { data: regenData, error: regenError } = await supabase.functions.invoke(
        "generate-site-ai",
        { body: { projectId: project.id, template, colorScheme } }
      );

      if (!regenError && regenData?.html) {
        setGeneratedHtml(regenData.html);
        setGeneratedContent(regenData.content);
      }

      setRegenSection(null);
      setRegenPrompt("");
      toast({ title: `Seção "${regenSection}" refinada! ✅` });
    } catch (err) {
      toast({
        title: "Erro ao refinar seção",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setRegenLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Intake status notice */}
      {!intake?.completed && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground flex items-center gap-2">
          <span>ℹ️</span>
          <span>
            Onboarding em andamento (passo {(intake as { step_current?: number } | null)?.step_current ?? 0}/6). Você já pode gerar e visualizar o preview com os dados atuais.
          </span>
        </div>
      )}

      {/* Template selector */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Wand2 size={14} /> Template
        </h3>
        <p className="mb-3 text-xs text-muted-foreground">
          Templates originais e gratuitos, sem dependência de imagens ou recursos pagos. A sugestão inicial considera a área do negócio.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={template === t.id}
              onClick={() => setTemplate(t.id)}
              className={`rounded-xl border-2 p-3 text-left transition-all ${
                template === t.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className={`relative mb-3 h-20 overflow-hidden rounded-lg border border-black/5 p-3 ${t.preview}`}>
                <div className="flex items-center justify-between">
                  <span className="h-1.5 w-10 rounded-full bg-slate-700/70" />
                  <span className="h-2 w-8 rounded-full bg-slate-700/20" />
                </div>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <div className="w-2/3 space-y-1.5">
                    <span className="block h-2.5 w-full rounded-sm bg-slate-800/65" />
                    <span className="block h-1.5 w-4/5 rounded-sm bg-slate-700/25" />
                    <span className="mt-2 block h-3.5 w-12 rounded-full bg-slate-700/70" />
                  </div>
                  <span className="h-9 w-8 rounded-t-full bg-white/70" />
                </div>
                {template === t.id && (
                  <span className="absolute right-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-[9px] font-semibold text-primary">
                    Selecionado
                  </span>
                )}
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">{t.category}</p>
              <p className="mt-0.5 text-sm font-medium text-foreground">{t.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color scheme selector */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Palette size={14} /> Paleta de Cores
        </h3>
        <div className="flex flex-wrap gap-3">
          {COLOR_SCHEMES.map((c) => (
            <button
              key={c.id}
              onClick={() => setColorScheme(c.id)}
              className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm transition-all ${
                colorScheme === c.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <span
                className="inline-block h-4 w-4 rounded-full flex-shrink-0"
                style={{ background: c.hex }}
              />
              <span
                className="inline-block h-4 w-4 rounded-full flex-shrink-0 -ml-2 border border-white/20"
                style={{ background: c.accent }}
              />
              <span className="text-xs text-foreground">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <div className="flex items-center gap-3">
        <Button
          variant="hero"
          onClick={handleGenerate}
          disabled={generating}
          className="gap-2"
        >
          {generating ? (
            <><Loader2 size={16} className="animate-spin" /> Gerando Site… (5-15s)</>
          ) : (
            <><Wand2 size={16} /> Gerar Site com IA</>
          )}
        </Button>

        {generatedHtml && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview((v) => !v)}
            >
              {showPreview ? <><EyeOff size={14} /> Ocultar preview</> : <><Eye size={14} /> Ver preview</>}
            </Button>

            <Button
              variant="hero"
              size="sm"
              onClick={handlePublish}
              disabled={publishing}
            >
              {publishing ? (
                <><Loader2 size={14} className="animate-spin" /> Publicando…</>
              ) : (
                <><Upload size={14} /> Publicar Site</>
              )}
            </Button>
          </>
        )}
      </div>

      {/* Generating indicator */}
      {generating && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center space-y-2">
          <Loader2 size={32} className="animate-spin mx-auto text-primary" />
          <p className="text-sm text-foreground font-medium">Gerando site com IA…</p>
          <p className="text-xs text-muted-foreground">
            Fase 1: Criando copy personalizado • Fase 2: Montando HTML — aguarde 20-40s
          </p>
        </div>
      )}

      {/* Published URL */}
      {project.site_url && (
        <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm">
          <Globe size={14} className="text-green-400 flex-shrink-0" />
          <span className="text-muted-foreground">Site publicado:</span>
          <a
            href={project.site_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline truncate"
          >
            {project.site_url}
          </a>
        </div>
      )}

      {/* Section regeneration panel */}
      {generatedHtml && generatedContent && (
        <div className="glass-card rounded-xl p-4 space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <RefreshCcw size={14} /> Refinar Seção
          </h4>
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setRegenSection(regenSection === s ? null : s)}
                className={`rounded-full px-2.5 py-1 text-xs border transition-colors ${
                  regenSection === s
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
          {regenSection && (
            <div className="space-y-2">
              <Textarea
                placeholder={`Instrução para refinar "${regenSection}" (opcional)…`}
                value={regenPrompt}
                onChange={(e) => setRegenPrompt(e.target.value)}
                className="min-h-[60px] text-sm"
              />
              <Button
                size="sm"
                onClick={handleRegenSection}
                disabled={regenLoading}
                className="gap-1"
              >
                {regenLoading ? (
                  <><Loader2 size={12} className="animate-spin" /> Refinando…</>
                ) : (
                  <><RefreshCcw size={12} /> Refinar seção</>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Preview iframe */}
      {generatedHtml && showPreview && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">Preview do site</h4>
            <span className="text-xs text-muted-foreground">Escala 50% — aparência real no browser</span>
          </div>
          <div className="rounded-xl border border-border overflow-hidden bg-white" style={{ height: 600 }}>
            <iframe
              srcDoc={generatedHtml}
              title="Preview do site gerado"
              className="w-full h-full"
              style={{ transform: "scale(0.5)", transformOrigin: "top left", width: "200%", height: "200%" }}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      )}
    </div>
  );
}
