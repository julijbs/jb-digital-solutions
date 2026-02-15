import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CLOUDFLARE_ACCOUNT_ID = Deno.env.get("CLOUDFLARE_ACCOUNT_ID")!;
const CLOUDFLARE_API_TOKEN = Deno.env.get("CLOUDFLARE_API_TOKEN")!;

function getTemplateInstructions(template: string): string {
  switch (template) {
    case "elegant-minimal":
      return "Estilo minimalista e elegante. Muito espaço em branco, tipografia serif refinada para títulos, layout limpo e sofisticado. Use gradientes sutis.";
    case "modern-clean":
      return "Estilo moderno e clean. Linhas retas, cantos arredondados, ícones modernos, layout em grid. Aparência tech-forward mas acessível.";
    case "warm-soft":
      return "Estilo acolhedor e suave. Cores pastéis, formas orgânicas, bordas arredondadas suaves, fontes humanistas. Transmite calma e confiança.";
    default:
      return "Estilo profissional e elegante.";
  }
}

function getColorSchemeCSS(scheme: string): string {
  switch (scheme) {
    case "blue-professional":
      return "Cores: azul escuro (#1e3a5f) como primário, azul médio (#3b82f6) como accent, branco e cinza claro como background. Tom corporativo e confiável.";
    case "green-therapeutic":
      return "Cores: verde escuro (#166534) como primário, verde médio (#22c55e) como accent, tons de creme e verde claro. Tom natural e terapêutico.";
    case "purple-transformer":
      return "Cores: roxo escuro (#6b21a8) como primário, roxo médio (#a855f7) como accent, lavanda e branco. Tom transformador e criativo.";
    default:
      return "Cores profissionais e harmoniosas.";
  }
}

function getCopyTone(vertical: string): string {
  const v = (vertical || "").toLowerCase();
  if (v.includes("psicol")) return "Empático, acolhedor, sem promessas de cura. Respeitar CFP.";
  if (v.includes("nutri")) return "Informativo, motivador, sem promessas de resultados. Respeitar CFN.";
  if (v.includes("terap")) return "Sereno, compassivo, foco no bem-estar. Respeitar conselho profissional.";
  if (v.includes("dent")) return "Confiante, profissional, foco em saúde bucal. Respeitar CFO.";
  return "Profissional, acolhedor, ético. Respeitar diretrizes do conselho profissional.";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, template, colorScheme } = await req.json();

    // Fetch project data
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

    const prompt = `
Você é um expert em criar sites one-page elegantes e persuasivos para profissionais liberais.

CRIE UM SITE COMPLETO EM HTML + TAILWIND CSS (via CDN) com as seguintes especificações:

## DADOS DO PROFISSIONAL
- Nome do negócio: ${client?.business_name || bd.name || "Profissional"}
- Especialidade: ${svd.main_category || client?.vertical || "Profissional liberal"}
- Cidade: ${sd.city || client?.city || ""}/${sd.state || client?.state || ""}
- Descrição: ${bd.description || ""}
- Serviços: ${svd.services_tags || ""}
- Diferenciais: ${svd.differentials || ""}
- Abordagem: ${svd.approach || ""}
- WhatsApp: ${bd.phone || ""}
- Instagram: ${bd.instagram || ""}
- Email: ${bd.email || ""}

## TEMPLATE: ${template}
${getTemplateInstructions(template)}

## PALETA DE CORES: ${colorScheme}
${getColorSchemeCSS(colorScheme)}

## ESTRUTURA OBRIGATÓRIA DO SITE

1. **Hero** - Headline emocional, subheadline com promessa de transformação, CTA WhatsApp, placeholder para foto
2. **Sobre** - História breve, credenciais, motivação
3. **Serviços** - Lista com descrição e para quem é indicado
4. **Como Funciona** - Passo a passo do atendimento em timeline visual
5. **Depoimentos** - 2-3 placeholders para depoimentos
6. **CTA Final** - Reforço da transformação, botão WhatsApp grande
7. **Rodapé** - Contatos, links, disclaimers éticos

## REQUISITOS TÉCNICOS
- Use APENAS Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
- Mobile-first obrigatório
- HTML5 semântico completo
- Ícones inline SVG quando necessário
- Performance otimizada
- Use placeholder images de https://placehold.co

## COPYWRITING
- Tom: ${getCopyTone(client?.vertical || svd.main_category || "")}
- Foco: benefícios emocionais antes de técnicos
- Linguagem: simples, acolhedora, profissional
- Evite: jargões técnicos, promessas exageradas

## OUTPUT
Retorne APENAS o código HTML completo do site (<!DOCTYPE html> até </html>).
Não adicione explicações, apenas o código HTML puro.
O site deve estar 100% funcional e visualmente perfeito.
`;

    // Call Cloudflare Workers AI
    const aiResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-70b-instruct`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a professional web developer. Return only clean HTML code." },
            { role: "user", content: prompt },
          ],
          max_tokens: 8192,
          temperature: 0.7,
        }),
      }
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("Cloudflare AI error:", aiResponse.status, errText);
      return new Response(
        JSON.stringify({ error: `Cloudflare AI error: ${aiResponse.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    let htmlContent = aiData.result?.response || "";

    // Clean up the response - extract HTML if wrapped in markdown
    if (htmlContent.includes("```html")) {
      htmlContent = htmlContent.split("```html")[1].split("```")[0].trim();
    } else if (htmlContent.includes("```")) {
      htmlContent = htmlContent.split("```")[1].split("```")[0].trim();
    }

    // Ensure it starts with DOCTYPE
    if (!htmlContent.toLowerCase().startsWith("<!doctype")) {
      htmlContent = `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${client?.business_name || "Site Profissional"}</title>\n<script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body>\n${htmlContent}\n</body>\n</html>`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        html: htmlContent,
        metadata: {
          title: client?.business_name || "Site Profissional",
          template,
          colorScheme,
        },
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
