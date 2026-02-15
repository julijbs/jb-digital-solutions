import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SECTION_SCHEMAS: Record<string, string> = {
  hero: '{ "headline": "...", "subheadline": "...", "cta_text": "..." }',
  pain_section: '{ "headline": "...", "pain_points": ["...", "...", "..."] }',
  about: '{ "intro": "...", "credentials": ["...", "..."] }',
  services: '[{ "name": "...", "description": "..." }]',
  process: '[{ "title": "...", "description": "..." }]',
  testimonials: '[{ "text": "...", "name": "..." }]',
  cta_final: '{ "headline": "...", "subheadline": "..." }',
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { section, currentContent, customPrompt } = await req.json();

    if (!section || !SECTION_SCHEMAS[section]) {
      return new Response(JSON.stringify({ error: "Seção inválida" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `
Você é um copywriter expert para sites de profissionais liberais.

TAREFA: Refinar APENAS a seção "${section}" do site.

CONTEÚDO ATUAL:
${JSON.stringify(currentContent, null, 2)}

INSTRUÇÃO DO CLIENTE:
${customPrompt || "Melhorar mantendo a essência. Tornar mais persuasivo e emocional."}

REGRAS:
- Mantenha o tom e estilo geral
- Aplique a sugestão do cliente
- Mantenha tamanho aproximado
- Retorne APENAS JSON válido no formato: ${SECTION_SCHEMAS[section]}
- Sem markdown, sem explicações, apenas JSON puro`;

    const resp = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Retorne APENAS JSON válido, sem markdown." },
          { role: "user", content: prompt },
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("AI error:", resp.status, errText);
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit excedido. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${resp.status}`);
    }

    const data = await resp.json();
    let raw = data.choices?.[0]?.message?.content || "";
    
    // Clean markdown
    if (raw.includes("```json")) {
      raw = raw.split("```json")[1].split("```")[0].trim();
    } else if (raw.includes("```")) {
      raw = raw.split("```")[1].split("```")[0].trim();
    }

    const newContent = JSON.parse(raw.trim());

    return new Response(
      JSON.stringify({ success: true, section, newContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("regenerate-section error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro ao refinar seção" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
