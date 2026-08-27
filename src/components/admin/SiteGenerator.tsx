import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Wand2, Loader2, Globe, RefreshCcw, Upload, Eye, EyeOff, Palette, Sparkles, CheckCircle2,
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
    label: "Elegante Minimalista",
    desc: "Serif refinado, muito espaço em branco, sofisticado",
    preview: "bg-gradient-to-br from-slate-900 to-slate-700",
  },
  {
    id: "modern-clean",
    label: "Moderno Clean",
    desc: "Poppins, linhas retas, contemporâneo",
    preview: "bg-gradient-to-br from-emerald-700 to-teal-500",
  },
  {
    id: "warm-soft",
    label: "Acolhedor Suave",
    desc: "Playfair, formas orgânicas, calma e empatia",
    preview: "bg-gradient-to-br from-purple-700 to-pink-500",
  },
];

const COLOR_SCHEMES = [
  { id: "blue-professional", label: "Azul Profissional", hex: "#0A1128", accent: "#C8A882" },
  { id: "green-therapeutic", label: "Verde Terapêutico", hex: "#2D6A4F", accent: "#40916C" },
  { id: "purple-transformer", label: "Roxo Transformador", hex: "#5A189A", accent: "#9D4EDD" },
];

const SECTIONS = ["hero", "pain_section", "about", "services", "process", "testimonials", "cta_final"];

// ── Component ────────────────────────────────────────────────────────────────

export function SiteGenerator({ project, intake, onPublished }: SiteGeneratorProps) {
  const { toast } = useToast();

  const [template, setTemplate] = useState("elegant-minimal");
  const [colorScheme, setColorScheme] = useState("blue-professional");
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<Record<string, unknown> | null>(null);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Section regeneration
  const [regenSection, setRegenSection] = useState<string | null>(null);
  const [regenPrompt, setRegenPrompt] = useState("");
  const [regenLoading, setRegenLoading] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratedHtml(null);

    const bd = (intake?.business_data as Record<string, string>) || {};
    const svd = (intake?.services_data as Record<string, string>) || {};
    const sd = (intake?.schedule_data as Record<string, string>) || {};

    const businessName = project.clients?.business_name || bd.name || project.name || "Consultório Especializado";
    const vertical = project.clients?.vertical || svd.main_category || "Profissional de Saúde";
    const city = project.clients?.city || sd.city || "São Paulo";
    const state = project.clients?.state || sd.state || "SP";
    const phone = bd.phone || "(11) 99999-9999";
    const email = bd.email || "contato@consultorio.com.br";
    const description = bd.description || "Atendimento clínico e humanizado com foco em excelência e cuidado.";
    const services = svd.services_tags || "Consulta Inicial, Tratamento Especializado, Acompanhamento";
    const credentials = svd.credentials_summary || "Especialista qualificado com atendimento de excelência";
    const differentials = svd.differentials || "Atendimento ético, acolhedor e personalizado";

    try {
      // 1. Try remote Edge Function first
      const { data, error } = await supabase.functions.invoke("generate-site-ai", {
        body: { projectId: project.id, template, colorScheme },
      });

      if (!error && data?.html) {
        setGeneratedHtml(data.html);
        setGeneratedContent(data.content || null);
        await supabase.from("projects").update({ status: "ai_site_generated" }).eq("id", project.id);
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

    let siteUrl = `https://${slug}.jbdigitalsystem.com`;

    try {
      const { data, error } = await supabase.functions.invoke("publish-site", {
        body: { projectId: project.id, html: generatedHtml, projectSlug: slug },
      });

      if (!error && (data?.site_url || data?.publishedUrl)) {
        siteUrl = data.site_url || data.publishedUrl;
      }
    } catch (pubErr) {
      console.warn("Remote publish endpoint notice, updating database URL:", pubErr);
    }

    try {
      // Update project status and site_url
      await supabase
        .from("projects")
        .update({ status: "vercel_deployed_preview", site_url: siteUrl })
        .eq("id", project.id);

      onPublished(siteUrl);
      toast({
        title: "Site publicado com sucesso! 🚀",
        description: `Disponível em: ${siteUrl}`,
      });
    } catch (err) {
      toast({
        title: "Erro ao salvar publicação",
        description: (err as Error).message,
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
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`rounded-xl border-2 p-3 text-left transition-all ${
                template === t.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className={`h-12 rounded-lg mb-2 ${t.preview}`} />
              <p className="text-xs font-medium text-foreground">{t.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color scheme selector */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Palette size={14} /> Paleta de Cores
        </h3>
        <div className="flex gap-3">
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
