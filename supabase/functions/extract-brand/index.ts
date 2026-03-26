import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { logoUrl, projectId } = await req.json();

    if (!logoUrl) {
      return new Response(JSON.stringify({ error: "logoUrl é obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use AI vision to extract brand colors from the logo
    const resp = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Você é um designer expert em branding. Analise o logotipo e extraia informações de marca.
Retorne APENAS um JSON válido, sem markdown.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analise este logotipo e extraia:
1. As 3-5 cores dominantes em hex (ordene da mais dominante para menos)
2. A cor primária ideal para usar como cor principal do site
3. A cor de destaque/accent ideal
4. A cor de fundo sugerida (clara)
5. Se o logo tem estilo mais moderno, clássico/elegante ou acolhedor/orgânico
6. Sugestão de par de fontes Google Fonts que combinem com o estilo do logo

Retorne este JSON exato:
{
  "dominant_colors": ["#hex1", "#hex2", "#hex3"],
  "primary_color": "#hex",
  "accent_color": "#hex",
  "background_color": "#hex",
  "text_color": "#hex",
  "style": "modern" | "elegant" | "warm",
  "font_display": "Nome da fonte display do Google Fonts",
  "font_body": "Nome da fonte body do Google Fonts",
  "brand_mood": "descrição curta do mood/personalidade visual em 1 frase"
}`,
              },
              {
                type: "image_url",
                image_url: { url: logoUrl },
              },
            ],
          },
        ],
        max_tokens: 1024,
        temperature: 0.3,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("AI error:", resp.status, errText);

      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit excedido, tente novamente." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${resp.status}`);
    }

    const data = await resp.json();
    const raw = data.choices?.[0]?.message?.content || "";

    let jsonStr = raw.trim();
    if (jsonStr.includes("```json")) {
      jsonStr = jsonStr.split("```json")[1].split("```")[0].trim();
    } else if (jsonStr.includes("```")) {
      jsonStr = jsonStr.split("```")[1].split("```")[0].trim();
    }

    let brandData: any;
    try {
      brandData = JSON.parse(jsonStr);
    } catch (e) {
      console.error("JSON parse error:", e, raw);
      throw new Error("Falha ao interpretar análise do logo");
    }

    // Add logo URL to brand data
    brandData.logo_url = logoUrl;

    // Save to client_intake if projectId provided
    if (projectId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const sb = createClient(supabaseUrl, supabaseKey);

      await sb
        .from("client_intake")
        .update({ brand_data: brandData })
        .eq("project_id", projectId);
    }

    return new Response(
      JSON.stringify({ success: true, brand: brandData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("extract-brand error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});