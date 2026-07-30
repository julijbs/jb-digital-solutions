import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const LOVABLE_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

// ─── Content generation (Gemini Flash — cheap + fast) ───────────────────────

function getCopyTone(vertical: string): string {
  const tones: Record<string, string> = {
    psicologo: "Empático, acolhedor e profissional. Evita promessas de cura. Usa linguagem de saúde mental responsável.",
    dentista: "Clínico mas acessível. Transmite confiança e conforto. Evita termos que causem ansiedade.",
    terapeuta: "Holístico, caloroso, integrador. Não promete cura clínica. Linguagem de jornada e transformação.",
    nutricionista: "Científico mas prático. Foca em hábitos sustentáveis, não em restrições. Celebra o processo.",
    default: "Profissional, humano e claro. Foca em benefícios concretos para o cliente.",
  };
  return tones[vertical] || tones.default;
}

async function generateContent(
  intakeData: any,
  vertical: string,
  lovableKey: string
): Promise<any> {
  const bd = intakeData.business_data || {};
  const sd = intakeData.schedule_data || {};
  const svd = intakeData.services_data || {};

  const prompt = `Você é um copywriter e diretor criativo especializado em landing pages premium para profissionais liberais brasileiros.

DADOS DO CLIENTE:
- Nome: ${bd.name || bd.business_name || "Profissional"}
- Tipo: ${vertical} — ${svd.main_category || ""}
- Cidade/Estado: ${sd.city || ""} / ${sd.state || ""}
- Descrição: ${bd.description || ""}
- Serviços: ${svd.services_tags || ""}
- Diferenciais: ${svd.differentials || ""}
- Abordagem: ${svd.approach || ""}
- Dores do público: ${svd.pain_points || ""}
- WhatsApp: ${bd.phone || ""}
- Email: ${bd.email || ""}
- Instagram: ${bd.instagram || ""}

TOM: ${getCopyTone(vertical)}

REGRAS:
- Nada genérico ou corporativo. Cada frase deve soar escrita por um humano que conhece o negócio.
- FAQs otimizadas para AEO: formuladas como perguntas naturais do Google/ChatGPT.
- Depoimentos críveis, específicos, humanos — nunca parecer publicidade.
- Retorne APENAS JSON válido, sem markdown.

JSON EXATO:
{
  "meta_description": "140-160 chars com keyword + localização",
  "hero_badge": "label pequeno acima do headline (ex: Psicóloga Online · São Paulo, SP)",
  "hero_headline": "headline emocional máx 65 chars",
  "hero_subheadline": "promessa de transformação 100-130 chars",
  "hero_cta_primary": "texto botão principal (3-5 palavras)",
  "hero_cta_secondary": "texto botão secundário",
  "hero_card_label": "micro-label acima da frase no card lateral (ex: Por que trabalhar comigo)",
  "hero_card_headline": "frase de impacto 1 linha para o card lateral",
  "hero_card_desc": "1-2 frases de apoio no card lateral (40-60 palavras)",
  "pain_pull_quote": "1ª dor em formato pull-quote — frase impactante, 15-25 palavras",
  "pain_point_2": "2ª dor concreta",
  "pain_point_3": "3ª dor concreta",
  "pain_section_label": "label da seção de dores (ex: Você se reconhece?)",
  "about_headline": "headline seção sobre — com autoridade e acolhimento",
  "about_text": "150-220 palavras acolhedoras + credenciais + diferencial humano",
  "about_credential_1": "formação/certificação 1 (curta)",
  "about_credential_2": "formação/certificação 2",
  "about_credential_3": "experiência relevante",
  "services_headline": "headline serviços com promessa",
  "service_1_name": "nome serviço 1",
  "service_1_desc": "benefício emocional + resultado (60-90 chars)",
  "service_2_name": "nome serviço 2",
  "service_2_desc": "benefício",
  "service_3_name": "nome serviço 3",
  "service_3_desc": "benefício",
  "process_headline": "Como funciona — com sensação de clareza",
  "process_step_1_title": "nome do passo 1",
  "process_step_1_desc": "o que acontece (20-30 palavras)",
  "process_step_2_title": "nome do passo 2",
  "process_step_2_desc": "o que acontece",
  "process_step_3_title": "nome do passo 3",
  "process_step_3_desc": "o que acontece",
  "testimonial_1": "depoimento fictício realista (50-80 palavras, tom humano)",
  "testimonial_1_name": "Nome Sobrenome",
  "testimonial_1_role": "ex: Mãe de família, São Paulo",
  "testimonial_2": "depoimento fictício realista 2",
  "testimonial_2_name": "Nome Sobrenome",
  "testimonial_2_role": "ex: Empreendedor, 34 anos",
  "cta_headline": "chamada final elegante e madura",
  "cta_button": "texto botão CTA (3-5 palavras)",
  "faq_q1": "pergunta FAQ em linguagem de busca natural",
  "faq_a1": "resposta objetiva, útil, 60-90 palavras",
  "faq_q2": "pergunta FAQ 2",
  "faq_a2": "resposta 2",
  "faq_q3": "pergunta FAQ 3",
  "faq_a3": "resposta 3",
  "faq_q4": "pergunta FAQ 4",
  "faq_a4": "resposta 4",
  "faq_q5": "pergunta FAQ 5",
  "faq_a5": "resposta 5"
}`;

  const resp = await fetch(LOVABLE_GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "Copywriter expert. Retorne APENAS JSON válido." },
        { role: "user", content: prompt },
      ],
      max_tokens: 4096,
      temperature: 0.85,
    }),
  });

  if (!resp.ok) throw new Error(`Content gen failed: ${resp.status}`);
  const data = await resp.json();
  let raw = (data.choices?.[0]?.message?.content || "").trim();
  if (raw.includes("```json")) raw = raw.split("```json")[1].split("```")[0].trim();
  else if (raw.includes("```")) raw = raw.split("```")[1].split("```")[0].trim();
  return JSON.parse(raw);
}

// ─── HTML generation (Claude Sonnet — premium design) ────────────────────────

function buildDesignPrompt(
  c: any, // content
  brand: { primary: string; accent: string; bg: string; text: string; fontDisplay: string; fontBody: string; mood: string },
  style: string,
  meta: { businessName: string; specialty: string; city: string; state: string; phone: string; email: string; instagram: string; schemaType: string }
): string {
  const wa = `https://wa.me/55${meta.phone.replace(/\D/g, "")}`;
  const year = new Date().getFullYear();

  const styleGuide: Record<string, string> = {
    "editorial-dark": `Visual editorial escuro. Hero e CTA têm fundo escuro (primary color ou near-black). Seções de conteúdo são branco/creme. Tipografia com enorme contraste de tamanho. Atmosfera: Linear.app meets premium therapy brand.`,
    "minimal-cream": `Máximo espaço negativo. Fundo creme/branco quente. Primary color usado com extrema parcimônia. Luxo discreto. Atmosfera: Notion meets high-end wellness studio.`,
    "warm-gradient": `Seções com transições de gradiente suaves. Formas orgânicas. Sensação convidativa e humana. Atmosfera: Airbnb meets coaching brand.`,
    "bold-modern": `Alto contraste. Tipografia grande e geométrica. Seções alternando preto/branco. Energia moderna. Atmosfera: startup de tech meets professional services.`,
  };

  const faqSchema = [1, 2, 3, 4, 5].map(i => `
      { "@type": "Question", "name": "${(c[`faq_q${i}`] || "").replace(/"/g, '\\"')}", "acceptedAnswer": { "@type": "Answer", "text": "${(c[`faq_a${i}`] || "").replace(/"/g, '\\"')}" } }`).join(",");

  return `Você é um designer sênior que trabalhou na Linear, Vercel e Notion. Você escreve HTML/Tailwind que parece exportado do Figma — não templates de IA.

BRAND:
- Primary: ${brand.primary}
- Accent: ${brand.accent}
- Background base: ${brand.bg}
- Text: ${brand.text}
- Font display: ${brand.fontDisplay}
- Font body: ${brand.fontBody}
- Mood: ${brand.mood}

NEGÓCIO:
- Nome: ${meta.businessName}
- Especialidade: ${meta.specialty}
- Cidade: ${meta.city}, ${meta.state}
- WhatsApp: ${wa}
- Email: ${meta.email}
- Instagram: @${meta.instagram}

DIREÇÃO VISUAL: ${style}
${styleGuide[style] || styleGuide["minimal-cream"]}

CONTEÚDO (use exatamente estes textos, não altere):
${JSON.stringify(c, null, 2)}

═══ PRINCÍPIOS DE DESIGN (violar qualquer um = falha) ═══

1. RITMO VISUAL — Cada seção deve ter aparência DIFERENTE da anterior. Rotacione entre:
   a) Full-bleed escuro (bg da primary ou near-black, texto branco)
   b) Card contido branco (max-w-6xl, bg-white, rounded-3xl, shadow)
   c) Layout assimétrico dividido (grid com colunas de tamanhos desiguais)
   d) Full-width com só padding interno
   Nunca empilhe dois padrões idênticos seguidos.

2. HIERARQUIA TIPOGRÁFICA — Contraste dramático de tamanhos:
   - Label/eyebrow: text-[11px], uppercase, tracking-[0.22em], opacity-60
   - Headline: text-5xl a text-7xl no desktop, leading-[0.92]
   - Body: text-lg, leading-[1.75]
   Um label de 11px + headline de 72px na mesma seção cria tensão editorial.

3. ESPAÇO NEGATIVO — py-24 ou py-32 na maioria das seções. Conteúdo precisa de ar.

4. DISCIPLINA DE COR — Primary como fundo: máx 2 seções (hero + CTA). Accent só em elementos interativos e destaques pontuais. O resto é branco, creme ou near-white.

5. BENTO DE SERVIÇOS — A seção de serviços DEVE usar bento grid:
   - 1 card grande featured (col-span-2 ou maior, fundo escuro/primary) + 2 cards menores
   - NÃO três colunas iguais.

6. PULL-QUOTE — A seção de dores começa com pull-quote grande (text-3xl/text-4xl, italic ou bold), não cards. Os outros 2 pain points ficam em mini-cards abaixo.

7. PROIBIDO — Sem: gradient text em tudo, glass cards sobre glass, 3 cards idênticos repetidos por seção, badge de confiança genérico, hero centralizado com botão embaixo sem nenhum visual.

═══ ESTRUTURA OBRIGATÓRIA ═══

<head> inclui:
- charset, viewport, title "${meta.businessName} | ${meta.specialty} em ${meta.city}"
- meta description: "${c.meta_description || ""}"
- canonical: https://{{SITE_URL}}
- og:title, og:description, og:type
- Google Fonts: ${brand.fontDisplay} + ${brand.fontBody}
- Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
- JSON-LD Schema:
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "${meta.schemaType}",
      "name": "${meta.businessName}",
      "description": "${c.meta_description || ""}",
      "url": "https://{{SITE_URL}}",
      "telephone": "${meta.phone}",
      "email": "${meta.email}",
      "areaServed": "${meta.city}, ${meta.state}",
      "address": { "@type": "PostalAddress", "addressLocality": "${meta.city}", "addressRegion": "${meta.state}", "addressCountry": "BR" },
      "sameAs": ["https://instagram.com/${meta.instagram}"],
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "47" }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [${faqSchema}]
    }
  ]
}
</script>
- <style> inline com:
  * { box-sizing: border-box; scroll-behavior: smooth; }
  body { margin: 0; font-family: '${brand.fontBody}', sans-serif; background: ${brand.bg}; color: ${brand.text}; }
  .font-display { font-family: '${brand.fontDisplay}', serif; }
  .shadow-soft { box-shadow: 0 20px 60px rgba(0,0,0,0.07); }
  .shadow-panel { box-shadow: 0 24px 80px rgba(0,0,0,0.14); }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.6s ease-out both; }

SEÇÕES:
1. <nav> fixo: logo (nome em font-display), links âncora ocultos no mobile, botão WhatsApp CTA
2. <section id="hero" data-section="hero"> — headline grande, subheadline, 2 CTAs, elemento visual lateral (card com ${c.hero_card_headline || "informações de contato"})
3. <section data-section="pain"> — pull-quote grande com "${c.pain_pull_quote || ""}" + 2 pain points menores
4. <section id="sobre" data-section="about"> — assimétrico: texto grande + credenciais; use ${c.about_credential_1 || ""}, ${c.about_credential_2 || ""}, ${c.about_credential_3 || ""}
5. <section id="servicos" data-section="services"> — BENTO grid obrigatório
6. <section id="processo" data-section="process"> — timeline horizontal com linhas conectoras OU vertical alternado
7. <section data-section="testimonials"> — quote editorial, aspas grandes (text-8xl), ${c.testimonial_1_name || "Cliente"} e ${c.testimonial_2_name || "Cliente"}
8. <section id="faq" data-section="faq"> — fundo escuro, 5 <details>/<summary> com todas as perguntas
9. <section id="contato" data-section="cta"> — full-bleed, tipográfico, sem boxes
10. <footer data-section="footer"> — 3 colunas, fundo escuro
11. Botão WhatsApp flutuante: fixed bottom-6 right-6, z-50, bg-[#25D366], rounded-full

IDIOMA: pt-BR. lang="pt-BR" no html.
MOBILE: Tudo responsivo, mobile-first. Nav mobile simples (esconder links, manter botão CTA).

OUTPUT: Retorne APENAS o documento HTML completo (<!DOCTYPE html> até </html>). Sem markdown. Sem explicações. Sem code fences.`;
}

async function generateHTML(prompt: string, anthropicKey: string): Promise<string> {
  const resp = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      system: "You are a senior frontend designer. Output ONLY clean, complete HTML. No markdown, no explanations, no code fences.",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Claude API error ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  let html = (data.content?.[0]?.text || "").trim();

  // Strip accidental code fences
  if (html.includes("```html")) html = html.split("```html")[1].split("```")[0].trim();
  else if (html.includes("```")) html = html.split("```")[1].split("```")[0].trim();

  if (!html.toLowerCase().startsWith("<!doctype")) {
    html = `<!DOCTYPE html>\n<html lang="pt-BR">\n<head><meta charset="UTF-8"></head>\n<body>\n${html}\n</body>\n</html>`;
  }

  return html;
}

// ─── Schema type by vertical ─────────────────────────────────────────────────

function getSchemaType(vertical: string): string {
  const map: Record<string, string> = {
    psicologo: "Psychologist",
    dentista: "Dentist",
    terapeuta: "HealthAndBeautyBusiness",
    nutricionista: "Physician",
  };
  return map[vertical] || "ProfessionalService";
}

// ─── Default brand fallbacks by vertical ────────────────────────────────────

function getDefaultBrand(vertical: string): any {
  const brands: Record<string, any> = {
    psicologo: { primary: "#16233b", accent: "#c8a882", bg: "#f6f2ea", text: "#111827", fontDisplay: "DM Serif Display", fontBody: "Manrope", mood: "Elegante, acolhedor e profissional" },
    dentista: { primary: "#0d3b5e", accent: "#4ab3f4", bg: "#f0f8ff", text: "#0f172a", fontDisplay: "Sora", fontBody: "Inter", mood: "Confiável, limpo e moderno" },
    terapeuta: { primary: "#2d6a4f", accent: "#52b788", bg: "#f0fdf4", text: "#1a2e1a", fontDisplay: "Playfair Display", fontBody: "Manrope", mood: "Natural, holístico e acolhedor" },
    nutricionista: { primary: "#5c4033", accent: "#a0785a", bg: "#fdf6f0", text: "#1f1210", fontDisplay: "DM Serif Display", fontBody: "Inter", mood: "Científico mas humano e prático" },
  };
  return brands[vertical] || { primary: "#16233b", accent: "#c8a882", bg: "#f6f2ea", text: "#111827", fontDisplay: "DM Serif Display", fontBody: "Manrope", mood: "Profissional e humano" };
}

// ─── Main handler ────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { projectId, styleDirection = "minimal-cream", brandOverride } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY não configurada — adicione em Supabase > Settings > Edge Functions > Secrets");

    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: project, error: projErr } = await sb
      .from("projects")
      .select("*, clients(*), client_intake(*)")
      .eq("id", projectId)
      .single();

    if (projErr || !project) {
      return new Response(JSON.stringify({ error: "Projeto não encontrado" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const client = project.clients as any;
    const intake = Array.isArray(project.client_intake) ? project.client_intake[0] : project.client_intake;
    const bd = (intake?.business_data as any) || {};
    const svd = (intake?.services_data as any) || {};
    const sd = (intake?.schedule_data as any) || {};
    const vertical = client?.vertical || svd.main_category || "outro";

    // ── Brand data ────────────────────────────────────────────────────────────
    let brand = getDefaultBrand(vertical);

    // Load extracted brand if exists
    const { data: brandRow } = await sb
      .from("client_brand_data")
      .select("*")
      .eq("client_id", client?.id)
      .maybeSingle();

    if (brandRow) {
      brand = { ...brand, ...brandRow };
    }

    // Manual override takes priority
    if (brandOverride) {
      brand = { ...brand, ...brandOverride };
    }

    // ── Phase 1: Content ──────────────────────────────────────────────────────
    console.log("[generate-site-brand] Phase 1: generating content...");
    const intakeData = { business_data: bd, schedule_data: sd, services_data: svd };
    const content = await generateContent(intakeData, vertical, LOVABLE_API_KEY);

    // ── Phase 2: HTML via Claude Sonnet ───────────────────────────────────────
    console.log("[generate-site-brand] Phase 2: generating HTML with Claude Sonnet...");
    const meta = {
      businessName: client?.business_name || bd.name || "Profissional",
      specialty: svd.main_category || vertical,
      city: sd.city || client?.city || "",
      state: sd.state || client?.state || "",
      phone: bd.phone || "",
      email: bd.email || "",
      instagram: bd.instagram || "",
      schemaType: getSchemaType(vertical),
    };

    const designPrompt = buildDesignPrompt(content, brand, styleDirection, meta);
    const html = await generateHTML(designPrompt, ANTHROPIC_API_KEY);

    // ── Update pipeline status ────────────────────────────────────────────────
    await sb.from("projects").update({ status: "lovable_site_generated" }).eq("id", projectId);

    return new Response(
      JSON.stringify({ success: true, html, content, metadata: { styleDirection, brand, vertical } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[generate-site-brand] error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
