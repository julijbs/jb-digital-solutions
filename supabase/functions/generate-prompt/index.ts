import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { intake_data, vertical, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "generate_prompt") {
      // Generate a Lovable site prompt from intake data
      const disclaimers: Record<string, string> = {
        psicologo: `OBRIGATÓRIO: Incluir disclaimer "Este site não substitui atendimento de emergência. Em caso de crise, ligue 188 (CVV) ou procure o CAPS mais próximo."`,
        dentista: `OBRIGATÓRIO: Linguagem clínica ética. Seção antes/depois só com assets reais; caso contrário usar "Resultados e expectativas".`,
        terapeuta: `OBRIGATÓRIO: Linguagem acolhedora sem prometer cura clínica. Incluir aviso "A terapia complementar não substitui cuidados médicos ou psicológicos."`,
      };

      systemPrompt = `Você é um especialista em criação de prompts para o Lovable (editor de código IA) que gera sites one-page premium para profissionais de saúde e negócios locais.

Seu objetivo é gerar um prompt completo, detalhado e otimizado que, ao ser colado no Lovable, produza um site one-page profissional, bonito e otimizado para SEO local.

O prompt deve seguir esta estrutura obrigatória:
1. Hero — headline forte + subheadline + CTA WhatsApp
2. Espelho/Dor — bullets com sinais e situações do público
3. Sobre/Autoridade — abordagem e diferenciais
4. Como funciona — 4 passos
5. Serviços — lista clara
6. Antes/Depois ou Resultados esperados
7. Depoimentos — anonimizados, realistas
8. FAQ — 5 perguntas relevantes
9. CTA Final — headline + botão WhatsApp
10. Rodapé — NAP + aviso legal

Inclua instruções técnicas de SEO: title tag, meta description, Schema JSON-LD, Open Graph, H1 único, performance (lazy loading, mobile-first).

Estilo visual: Dark premium, tipografia elegante (serif para títulos), paleta sofisticada, sem aspecto genérico.

${disclaimers[vertical] || ""}`;

      const bd = intake_data.business_data || {};
      const sd = intake_data.schedule_data || {};
      const svd = intake_data.services_data || {};

      userPrompt = `Gere um prompt completo para o Lovable criar o site one-page para este negócio:

NEGÓCIO: ${bd.name || "Não informado"}
DESCRIÇÃO: ${bd.description || "Não informado"}
VERTICAL: ${vertical || "Não informado"}
WHATSAPP: ${bd.phone || "Não informado"}
E-MAIL: ${bd.email || "Não informado"}
INSTAGRAM: ${bd.instagram || ""}
CIDADE: ${sd.city || sd.main_city || "Não informado"}
ESTADO: ${sd.state || ""}
ENDEREÇO: ${sd.street ? `${sd.street}, ${sd.number} - ${sd.neighborhood}` : "Não informado"}
CEP: ${sd.cep || ""}
TIPO DE ATENDIMENTO: ${sd.type || "Não informado"}
CATEGORIA PRINCIPAL: ${svd.main_category || "Não informado"}
CATEGORIAS ALTERNATIVAS: ${svd.alt_categories || "Não informado"}
SERVIÇOS: ${svd.services_tags || "Não informado"}
DORES DO PÚBLICO: ${svd.pain_points || "Não informado"}
DIFERENCIAIS: ${svd.differentials || "Não informado"}
ABORDAGEM: ${svd.approach || "Não informado"}

Gere o prompt completo, pronto para colar no Lovable.`;
    } else if (action === "generate_content_pack") {
      systemPrompt = `Você é um especialista em SEO local. Gere um content pack JSON com: meta_title (< 60 chars com keyword + cidade), meta_description (< 160 chars, persuasiva), schema_type (LocalBusiness, Dentist, ou ProfessionalService), e 5 FAQs relevantes para a vertical.`;

      const bd = intake_data.business_data || {};
      const sd = intake_data.schedule_data || {};
      const svd = intake_data.services_data || {};

      userPrompt = `Gere o content pack para: ${bd.name || "Profissional"}, ${svd.main_category || vertical}, em ${sd.city || "cidade não informada"}. Serviços: ${svd.services_tags || "não informado"}. Descrição: ${bd.description || "não informado"}.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Tente novamente em alguns segundos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-prompt error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
