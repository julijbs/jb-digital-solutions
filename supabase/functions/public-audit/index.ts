import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessName, city, vertical, contact, siteUrl } = await req.json();

    if (!businessName || !city) {
      return new Response(JSON.stringify({ error: "Nome e cidade são obrigatórios" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    // Default structured audit if no API key is set
    let auditResult = {
      score: 38,
      business: businessName,
      city: city,
      vertical: vertical || "Profissional de Saúde",
      has_site: !!siteUrl,
      gaps: [
        {
          title: "Sem Site Próprio Estruturado — Invisível para as IAs (AEO)",
          desc: "Seu consultório não possui um site programático indexado. Sem uma página estruturada com dados técnicos (Schema.org), as IAs (ChatGPT, Perplexity e Gemini) não conseguem ler seus serviços nem sua autoridade clínica. O resultado é que o seu negócio é completamente ignorado quando um paciente pede recomendação para uma IA.",
          severity: "high",
          impact: "Crítico: Perda diária de pacientes que já buscam médicos, dentistas e psicólogos através de IAs.",
        },
        {
          title: "Perfil do Google Maps sem Autoridade e SEO Local",
          desc: "O algoritmo do Google prioriza perfis vinculados a sites rápidos e com autoridade local. Sem um site conectado e sem otimização de palavras-chave nas categorias, seu perfil perde posições no 'Local Pack' (os 3 primeiros do mapa).",
          severity: "high",
          impact: "Alto: Concorrentes da mesma rua ou bairro aparecem na sua frente nas buscas do Google.",
        },
        {
          title: "Ausência de Páginas por Procedimento e Bairro",
          desc: "Você não possui páginas específicas focadas em termos de busca de alta intenção (ex: tratamentos específicos da sua área no seu bairro). Isso impede que pacientes com dores pontuais te encontrem no Google orgânico.",
          severity: "med",
          impact: "Médio: Dependência contínua de indicações boca a boca ou anúncios pagos caros.",
        },
      ],
    };

    // If GEMINI_API_KEY is available, let AI enrich the specific gaps for this niche/city
    if (GEMINI_API_KEY) {
      try {
        const prompt = `Você é um auditor sênior de SEO Local e AEO (Answer Engine Optimization) para profissionais de saúde e negócios locais no Brasil.
Analise a presença digital do seguinte negócio:
- Nome: ${businessName}
- Cidade/Região: ${city}
- Especialidade: ${vertical}
- Site informado: ${siteUrl || "Nenhum site informado"}

Gere um diagnóstico cirúrgico em JSON.
IMPORTANTE:
1. O primeiro gargalo DEVE focar em AEO: enfatize que sem site próprio com Schema Markup, o ChatGPT/Perplexity/Gemini NÃO conseguem ler os serviços, especialidades ou endereço da ${businessName}, tornando o negócio INVISÍVEL para as respostas das IAs.
2. O segundo gargalo DEVE focar no Google Maps: explique como a falta de site com autoridade local rebaixa a posição no Google Maps frente aos concorrentes em ${city}.
3. O terceiro gargalo DEVE focar em Páginas Programáticas de Nicho: ausência de páginas por bairros de ${city} e procedimentos de ${vertical}.

Retorne APENAS um JSON válido neste formato:
{
  "score": 38,
  "gaps": [
    {
      "title": "Sem Site Próprio Estruturado — Invisível para as IAs (AEO)",
      "desc": "descrição detalhada e convincente focada em como a IA não enxerga o negócio",
      "severity": "high",
      "impact": "impacto prático para o consultório"
    },
    {
      "title": "Perfil do Google Maps sem Autoridade Local",
      "desc": "descrição focada no ranqueamento do mapa em ${city}",
      "severity": "high",
      "impact": "impacto prático"
    },
    {
      "title": "Ausência de Páginas por Procedimento e Bairro",
      "desc": "descrição focada em capturar buscas de bairros de ${city}",
      "severity": "med",
      "impact": "impacto prático"
    }
  ]
}`;

        const aiResp = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${GEMINI_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gemini-2.5-flash",
              messages: [{ role: "user", content: prompt }],
              temperature: 0.3,
            }),
          }
        );

        if (aiResp.ok) {
          const aiData = await aiResp.json();
          let rawContent = aiData.choices?.[0]?.message?.content || "";
          rawContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(rawContent);
          if (parsed.gaps && Array.isArray(parsed.gaps)) {
            auditResult.score = parsed.score || 41;
            auditResult.gaps = parsed.gaps;
          }
        }
      } catch (aiErr) {
        console.warn("AI audit enrichment fallback:", aiErr);
      }
    }

    return new Response(JSON.stringify(auditResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
