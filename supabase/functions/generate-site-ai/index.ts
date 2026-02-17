import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

// ─── Template HTML base structures ───────────────────────────────────

const TEMPLATES: Record<string, { fonts: string; style: string; description: string }> = {
  "elegant-minimal": {
    fonts: "DM+Serif+Display&family=Inter:wght@400;500;600",
    style: `
      .font-display { font-family: 'DM Serif Display', serif; }
      .font-body { font-family: 'Inter', sans-serif; }
    `,
    description: "Minimalista e elegante. Muito espaço em branco, tipografia serif refinada para títulos, layout limpo e sofisticado. Use gradientes sutis entre primary e accent.",
  },
  "modern-clean": {
    fonts: "Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600",
    style: `
      .font-display { font-family: 'Poppins', sans-serif; }
      .font-body { font-family: 'Inter', sans-serif; }
    `,
    description: "Moderno e clean. Linhas retas, cantos arredondados, ícones modernos, layout em grid. Aparência tech-forward mas acessível. Energético e contemporâneo.",
  },
  "warm-soft": {
    fonts: "Playfair+Display:wght@400;700&family=Open+Sans:wght@400;500;600",
    style: `
      .font-display { font-family: 'Playfair Display', serif; }
      .font-body { font-family: 'Open Sans', sans-serif; }
    `,
    description: "Acolhedor e suave. Cores pastéis, formas orgânicas, bordas arredondadas suaves, fontes humanistas. Transmite calma, empatia e confiança.",
  },
};

const COLOR_SCHEMES: Record<string, { primary: string; accent: string; bg: string; description: string }> = {
  "blue-professional": {
    primary: "#0A1128",
    accent: "#C8A882",
    bg: "#f8f9fa",
    description: "Azul escuro (#0A1128) primário, dourado (#C8A882) como accent, branco e cinza claro como background. Tom corporativo, sofisticado e confiável.",
  },
  "green-therapeutic": {
    primary: "#2D6A4F",
    accent: "#40916C",
    bg: "#f0fdf4",
    description: "Verde escuro (#2D6A4F) primário, verde médio (#40916C) accent, tons de creme e verde claro. Tom natural e terapêutico.",
  },
  "purple-transformer": {
    primary: "#5A189A",
    accent: "#9D4EDD",
    bg: "#faf5ff",
    description: "Roxo escuro (#5A189A) primário, roxo médio (#9D4EDD) accent, lavanda e branco. Tom transformador e criativo.",
  },
};

function getCopyTone(vertical: string): string {
  const v = (vertical || "").toLowerCase();
  if (v.includes("psicol")) return "Empático, acolhedor, sem promessas de cura. Respeitar CFP.";
  if (v.includes("nutri")) return "Informativo, motivador, sem promessas de resultados. Respeitar CFN.";
  if (v.includes("terap")) return "Sereno, compassivo, foco no bem-estar. Respeitar conselho profissional.";
  if (v.includes("dent")) return "Confiante, profissional, foco em saúde bucal. Respeitar CFO.";
  return "Profissional, acolhedor, ético. Respeitar diretrizes do conselho profissional.";
}

async function callAI(messages: any[], maxTokens = 8192): Promise<string> {
  const resp = await fetch(AI_GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error("AI error:", resp.status, errText);
    throw new Error(`AI error: ${resp.status}`);
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content || "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, template, colorScheme } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    const { data: project, error: projErr } = await sb
      .from("projects")
      .select("*, clients(*), client_intake(*)")
      .eq("id", projectId)
      .single();

    if (projErr || !project) {
      return new Response(JSON.stringify({ error: "Projeto não encontrado" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const client = project.clients as any;
    const intake = Array.isArray(project.client_intake) ? project.client_intake[0] : project.client_intake;
    const bd = (intake?.business_data as any) || {};
    const svd = (intake?.services_data as any) || {};
    const sd = (intake?.schedule_data as any) || {};

    const tmpl = TEMPLATES[template] || TEMPLATES["elegant-minimal"];
    const colors = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES["blue-professional"];
    const vertical = client?.vertical || svd.main_category || "";

    // ─── PHASE 1: Generate structured content ──────────────────
    const phase1Prompt = `
Você é um copywriter expert especializado em sites para profissionais liberais (${vertical}).

TAREFA: Criar a estrutura de conteúdo do site. Retorne APENAS um JSON válido, sem markdown.

DADOS DO CLIENTE:
- Nome do negócio: ${client?.business_name || bd.name || "Profissional"}
- Especialidade: ${svd.main_category || vertical || "Profissional liberal"}
- Cidade: ${sd.city || client?.city || ""}/${sd.state || client?.state || ""}
- Descrição: ${bd.description || ""}
- Serviços: ${svd.services_tags || ""}
- Diferenciais: ${svd.differentials || ""}
- Abordagem: ${svd.approach || ""}
- Público-alvo: ${svd.target_audience || ""}
- Formação/Certificações: ${svd.credentials_summary || ""}
- Perguntas frequentes dos clientes: ${svd.common_questions || ""}
- WhatsApp: ${bd.phone || ""}
- Instagram: ${bd.instagram || ""}
- Email: ${bd.email || ""}

GERE este JSON exato:
{
  "hero": {
    "headline": "headline emocional de 8-12 palavras",
    "subheadline": "promessa de transformação (20-30 palavras)",
    "cta_text": "texto do botão principal"
  },
  "pain_section": {
    "headline": "título que identifica a dor do público",
    "pain_points": ["dor 1", "dor 2", "dor 3"]
  },
  "about": {
    "intro": "parágrafo pessoal (50-80 palavras) sobre o profissional",
    "credentials": ["formação 1", "formação 2", "experiência relevante"]
  },
  "services": [
    { "name": "nome do serviço", "description": "benefício emocional + resultado (30-40 palavras)" }
  ],
  "process": [
    { "title": "nome da etapa", "description": "o que acontece (20-30 palavras)" }
  ],
  "testimonials": [
    { "text": "depoimento fictício realista", "name": "Nome do Cliente" }
  ],
  "faq": [
    { "question": "pergunta frequente sobre o serviço", "answer": "resposta clara e direta (40-60 palavras)" }
  ],
  "cta_final": {
    "headline": "chamada final forte",
    "subheadline": "reforço da transformação"
  }
}

DIRETRIZES:
- Tom: ${getCopyTone(vertical)}
- Foco: benefícios emocionais antes de técnicos
- Linguagem: simples, acolhedora, profissional
- Evite: jargões técnicos, promessas exageradas
- Gere pelo menos 3 serviços e 4 etapas de processo
- Gere 2-3 depoimentos fictícios realistas
- Gere pelo menos 5 FAQs estratégicas — perguntas que alguém faria ao ChatGPT/Gemini sobre esse profissional
- As FAQs devem ser otimizadas para AEO (Answer Engine Optimization)`;

    const contentRaw = await callAI([
      { role: "system", content: "Você é um copywriter expert. Retorne APENAS JSON válido, sem markdown ou explicações." },
      { role: "user", content: phase1Prompt },
    ], 4096);

    let content: any;
    try {
      // Extract JSON from potential markdown wrapping
      let jsonStr = contentRaw.trim();
      if (jsonStr.includes("```json")) {
        jsonStr = jsonStr.split("```json")[1].split("```")[0].trim();
      } else if (jsonStr.includes("```")) {
        jsonStr = jsonStr.split("```")[1].split("```")[0].trim();
      }
      content = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Phase 1 parse error:", e, contentRaw);
      throw new Error("Falha ao gerar conteúdo estruturado");
    }

    // ─── PHASE 2: Generate HTML using template + content ──────
    const businessName = client?.business_name || bd.name || "Profissional";
    const phone = bd.phone || "";
    const email = bd.email || "";
    const instagram = bd.instagram || "";
    const city = sd.city || client?.city || "";
    const state = sd.state || client?.state || "";

    const phase2Prompt = `
Você é um desenvolvedor frontend expert. Crie um site one-page completo em HTML + Tailwind CSS.

## ESTILO DO TEMPLATE
${tmpl.description}

## PALETA DE CORES
${colors.description}
- Primary: ${colors.primary}
- Accent: ${colors.accent}
- Background: ${colors.bg}

## FONTES
Use Google Fonts: ${tmpl.fonts}
${tmpl.style}

## DADOS DO PROFISSIONAL
- Nome: ${businessName}
- Especialidade: ${svd.main_category || vertical}
- Cidade: ${city}/${state}
- WhatsApp: ${phone}
- Email: ${email}
- Instagram: ${instagram}

## CONTEÚDO GERADO (use exatamente este conteúdo)
${JSON.stringify(content, null, 2)}

## ESTRUTURA OBRIGATÓRIA
1. **Navbar** fixo com links âncora e botão CTA
2. **Hero** com headline, subheadline, CTA WhatsApp e credenciais
3. **Dores** (pain_section) com os pain_points em cards
4. **Sobre** com intro e credenciais em lista
5. **Serviços** em grid de cards
6. **Como Funciona** em timeline/steps visual
7. **Depoimentos** com cards e aspas visuais
8. **Widget de Avaliações Google** — seção visual simulando avaliações 5 estrelas do Google Meu Negócio com 3 reviews fictícios, nome, estrelas e texto. Incluir link placeholder para o perfil no Google Maps.
9. **FAQ** em formato acordeão/collapsible com as perguntas e respostas geradas — otimizado para AEO
10. **CTA Final** com fundo colorido, headline e botão WhatsApp grande
11. **Rodapé** com contatos, redes sociais e disclaimers

## REQUISITOS DE AEO (Answer Engine Optimization)
- Inclua Schema.org JSON-LD completo com:
  - LocalBusiness (com name, address, telephone, url, openingHours)
  - FAQPage schema com TODAS as perguntas e respostas
  - ProfessionalService ou tipo específico da vertical
  - aggregateRating com rating fictício 4.9/5
  - review schema com os depoimentos
- Use tags semânticas HTML5 (article, section, header, main, nav, footer)
- Cada FAQ deve usar <details>/<summary> ou accordion com microdados
- Meta description otimizada para perguntas naturais

## REQUISITOS TÉCNICOS
- Use APENAS Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
- Google Fonts via link
- Mobile-first responsivo
- HTML5 semântico
- Ícones inline SVG
- Animações CSS suaves (fadeInUp)
- Botão WhatsApp flutuante no canto inferior direito
- Links WhatsApp: https://wa.me/55${phone.replace(/\D/g, "")}

## MARQUE CADA SEÇÃO COM DATA ATTRIBUTES
Cada seção deve ter data-section="hero|pain|about|services|process|testimonials|reviews|faq|cta|footer"

## OUTPUT
Retorne APENAS o código HTML completo (<!DOCTYPE html> até </html>). Sem explicações.`;

    const htmlRaw = await callAI([
      { role: "system", content: "Você é um desenvolvedor frontend expert. Retorne APENAS código HTML limpo e completo." },
      { role: "user", content: phase2Prompt },
    ], 16384);

    // Clean up HTML
    let htmlContent = htmlRaw.trim();
    if (htmlContent.includes("```html")) {
      htmlContent = htmlContent.split("```html")[1].split("```")[0].trim();
    } else if (htmlContent.includes("```")) {
      htmlContent = htmlContent.split("```")[1].split("```")[0].trim();
    }

    if (!htmlContent.toLowerCase().startsWith("<!doctype")) {
      htmlContent = `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${businessName}</title>\n<script src="https://cdn.tailwindcss.com"><\/script>\n</head>\n<body>\n${htmlContent}\n</body>\n</html>`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        html: htmlContent,
        content, // structured content for section editing
        metadata: { title: businessName, template, colorScheme },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-site-ai error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
