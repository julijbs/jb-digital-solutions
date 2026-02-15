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
    const { projectId, customInstructions } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    const { data: project, error: projErr } = await sb
      .from("projects")
      .select("*, clients(business_name, vertical, city, state)")
      .eq("id", projectId)
      .single();

    if (projErr || !project) {
      return new Response(JSON.stringify({ error: "Projeto não encontrado" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: intake } = await sb
      .from("client_intake")
      .select("*")
      .eq("project_id", projectId)
      .maybeSingle();

    const client = project.clients as any;
    const bd = (intake?.business_data as any) || {};
    const svd = (intake?.services_data as any) || {};
    const sd = (intake?.schedule_data as any) || {};
    const vertical = client?.vertical || svd.main_category || "outro";

    const verticalContext: Record<string, string> = {
      psicologo: "profissional de psicologia clínica",
      dentista: "profissional de odontologia",
      terapeuta: "profissional de terapia holística",
      nutricionista: "profissional de nutrição",
    };

    const prompt = `Você é um copywriter especialista em marketing digital para profissionais liberais brasileiros.

**CONTEXTO DO CLIENTE:**
- Nome do negócio: ${bd.name || client?.business_name || "Profissional"}
- Tipo: ${verticalContext[vertical] || svd.main_category || vertical}
- Cidade: ${sd.city || client?.city || ""}
- Estado: ${sd.state || client?.state || ""}
- Descrição: ${bd.description || ""}
- Serviços principais: ${svd.services_tags || ""}
- Diferenciais: ${svd.differentials || ""}
- Abordagem/Método: ${svd.approach || ""}
- WhatsApp: ${bd.phone || ""}
- Email: ${bd.email || ""}
- Instagram: ${bd.instagram || ""}

${customInstructions ? `\n**INSTRUÇÕES PERSONALIZADAS:**\n${customInstructions}\n` : ""}

**TAREFA:**
Gere textos persuasivos e otimizados para SEO seguindo técnicas de copywriting modernas.

**RETORNE APENAS UM JSON** com esta estrutura exata:

{
  "meta_description": "Descrição meta de 140-160 caracteres com palavra-chave principal",
  "hero_headline": "Headline principal (máx 60 caracteres) - deve gerar curiosidade e urgência",
  "hero_subheadline": "Subheadline de 100-120 caracteres explicando o benefício principal",
  "pain_point_1": "Primeira dor do público (ex: 'Você sente ansiedade constante?')",
  "pain_point_2": "Segunda dor do público",
  "pain_point_3": "Terceira dor do público",
  "about_headline": "Título da seção Sobre (foco em credibilidade)",
  "about_text": "Texto sobre o profissional (150-200 palavras, tom acolhedor, inclui credenciais)",
  "services_headline": "Título da seção de Serviços",
  "service_1_name": "Nome do serviço 1",
  "service_1_desc": "Descrição curta (50-70 caracteres)",
  "service_2_name": "Nome do serviço 2",
  "service_2_desc": "Descrição curta",
  "service_3_name": "Nome do serviço 3",
  "service_3_desc": "Descrição curta",
  "process_headline": "Título da seção 'Como Funciona'",
  "process_step_1": "Passo 1 (ex: 'Agende sua consulta')",
  "process_step_2": "Passo 2",
  "process_step_3": "Passo 3",
  "testimonial_1": "Depoimento fictício realista (50-80 palavras) - nome genérico",
  "testimonial_2": "Depoimento fictício 2",
  "cta_headline": "Headline do CTA final (urgência + benefício)",
  "cta_button_text": "Texto do botão (3-5 palavras, ação clara)",
  "faq_question_1": "Pergunta FAQ 1",
  "faq_answer_1": "Resposta FAQ 1 (50-80 palavras)",
  "faq_question_2": "Pergunta FAQ 2",
  "faq_answer_2": "Resposta FAQ 2",
  "faq_question_3": "Pergunta FAQ 3",
  "faq_answer_3": "Resposta FAQ 3"
}

**REGRAS OBRIGATÓRIAS:**
1. Use linguagem empática e acolhedora (evite tom corporativo)
2. Foque em transformação e resultados (não em processos)
3. Inclua palavras-chave naturalmente: "${svd.main_category || vertical} em ${sd.city || client?.city || ""}"
4. Use verbos de ação nos CTAs
5. Depoimentos devem parecer autênticos (evite superlativos exagerados)
6. Mantenha tom profissional mas próximo
7. Retorne APENAS o JSON, sem texto adicional`;

    const resp = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Você é um copywriter expert. Retorne APENAS JSON válido, sem markdown ou explicações." },
          { role: "user", content: prompt },
        ],
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("AI error:", resp.status, errText);

      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit excedido, tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${resp.status}`);
    }

    const data = await resp.json();
    const raw = data.choices?.[0]?.message?.content || "";

    // Parse JSON from potential markdown wrapping
    let jsonStr = raw.trim();
    if (jsonStr.includes("```json")) {
      jsonStr = jsonStr.split("```json")[1].split("```")[0].trim();
    } else if (jsonStr.includes("```")) {
      jsonStr = jsonStr.split("```")[1].split("```")[0].trim();
    }

    let texts: any;
    try {
      texts = JSON.parse(jsonStr);
    } catch (e) {
      console.error("JSON parse error:", e, raw);
      throw new Error("Falha ao interpretar resposta da IA");
    }

    return new Response(
      JSON.stringify({ success: true, texts }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("generate-site-texts error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
