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
      nutricionista: "nutricionista clínica com foco em resultados baseados em ciência",
    };

    // Niche-specific prompt injection for AEO and keyword depth
    const nicheBoost: Record<string, string> = {
      nutricionista: `
**CONTEXTO DE NICHO — NUTRICIONISTA:**
- Palavras-chave locais obrigatórias: "nutricionista em ${sd.city || client?.city || ""}", "consulta nutricional em ${sd.city || client?.city || ""}", "reeducação alimentar"
- Keywords de serviço a incluir naturalmente: emagrecimento, reeducação alimentar, nutrição clínica, nutrição esportiva, saúde metabólica, plano alimentar individualizado
- FAQs devem ser formuladas como buscas reais no Google/ChatGPT:
  Exemplos: "quanto custa consulta com nutricionista?", "nutricionista online ou presencial?", "em quanto tempo vejo resultado com nutricionista?", "qual a diferença de nutricionista e nutrólogo?"
- Respostas de FAQ no formato AEO: resposta direta e completa na PRIMEIRA frase (citável por featured snippet ou AI Overview), depois complemento. Máx 90 palavras por FAQ.
- Hero headline deve nomear o benefício final concreto (ex: emagrecer, regular o intestino, ganhar massa) + contexto local, NÃO slogan genérico
- Depoimentos: mencionar resultado específico (peso perdido, exame normalizado, disposição melhorada) em linguagem espontânea de paciente real`,
      psicologo: `
**CONTEXTO DE NICHO — PSICÓLOGO:**
- Palavras-chave locais obrigatórias: "psicólogo em ${sd.city || client?.city || ""}", "terapia em ${sd.city || client?.city || ""}", "consulta com psicólogo ${sd.city || client?.city || ""}", "psicólogo online"
- Keywords de serviço a incluir naturalmente: terapia individual, TCC (terapia cognitivo-comportamental), ansiedade, depressão, burnout, autoconhecimento, saúde mental, terapia de casal, psicoterapia, regulação emocional
- FAQs devem ser formuladas como buscas reais no Google/ChatGPT:
  Exemplos: "quanto custa uma sessão de terapia?", "psicólogo online funciona igual ao presencial?", "qual a diferença entre psicólogo e psiquiatra?", "em quanto tempo a terapia faz efeito?", "preciso de encaminhamento para ver um psicólogo?"
- Respostas de FAQ no formato AEO: resposta direta e completa na PRIMEIRA frase (citável por featured snippet ou AI Overview), depois complemento. Máx 90 palavras por FAQ.
- Hero headline deve nomear o benefício emocional concreto (ex: viver com menos ansiedade, retomar o controle, dormir melhor, sair do ciclo do burnout) + contexto local, NÃO slogan genérico nem clichê de "bem-estar"
- Depoimentos: mencionar mudança específica percebida (ansiedade reduzida, sono melhorado, relacionamento transformado, retorno ao trabalho) em linguagem espontânea e íntima — nunca clínica
- ÉTICA CFP: não faça promessas absolutas de cura ou de resultado garantido. Use linguagem de possibilidade: "pode ajudar", "muitos pacientes relatam", "trabalhamos para". Não use linguagem sensacionalista sobre saúde mental. Respeite as normas do Código de Ética Profissional do Psicólogo.`,
    };

    const prompt = `Você é um diretor criativo + copywriter especialista em landing pages premium para profissionais liberais brasileiros.

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
${nicheBoost[vertical] || ""}

**TAREFA:**
Gere textos para uma landing page com nível de direção criativa comparável ao que seria feito manualmente no Lovable.
O resultado NÃO pode soar genérico, corporativo demais, nem como template comum de IA.

A página precisa seguir esta lógica narrativa:
1. Hero com tensão principal + promessa clara + linguagem específica da dor
2. Dores muito concretas, reconhecíveis e humanas
3. Sobre com autoridade, acolhimento e clareza metodológica
4. Serviços apresentados como caminhos de cuidado, não lista fria de procedimentos
5. Processo com sensação de clareza e segurança
6. Depoimentos críveis, íntimos e naturais
7. FAQ pensado para SEO + AEO, respondendo dúvidas que alguém faria no Google/ChatGPT/Perplexity
8. CTA final mais maduro e elegante, sem clichês exagerados

**RETORNE APENAS UM JSON** com esta estrutura exata:

{
  "meta_description": "Descrição meta de 140-160 caracteres com palavra-chave principal e intenção local",
  "hero_headline": "Headline principal (máx 72 caracteres) forte, elegante e específica",
  "hero_subheadline": "Subheadline de 110-160 caracteres com contexto, público e benefício central",
  "pain_point_1": "Primeira dor do público em linguagem humana e específica",
  "pain_point_2": "Segunda dor do público",
  "pain_point_3": "Terceira dor do público",
  "about_headline": "Título da seção Sobre com autoridade e acolhimento",
  "about_text": "Texto sobre o profissional (150-220 palavras, tom acolhedor, inclui credenciais, abordagem e diferencial humano)",
  "services_headline": "Título da seção de Serviços com promessa clara",
  "service_1_name": "Nome do serviço 1",
  "service_1_desc": "Descrição curta porém específica (70-110 caracteres)",
  "service_2_name": "Nome do serviço 2",
  "service_2_desc": "Descrição curta",
  "service_3_name": "Nome do serviço 3",
  "service_3_desc": "Descrição curta",
  "process_headline": "Título da seção 'Como Funciona' com sensação de clareza",
  "process_step_1": "Passo 1 com nome e breve explicação na mesma frase",
  "process_step_2": "Passo 2",
  "process_step_3": "Passo 3",
  "testimonial_1": "Depoimento fictício realista (50-90 palavras) com tom humano e natural - sem marketing excessivo",
  "testimonial_2": "Depoimento fictício 2",
  "cta_headline": "Headline do CTA final elegante, madura e acionável",
  "cta_button_text": "Texto do botão (3-5 palavras, ação clara)",
  "faq_question_1": "Pergunta FAQ 1 em linguagem de busca natural",
  "faq_answer_1": "Resposta FAQ 1 (60-100 palavras), objetiva, útil e otimizada para AEO",
  "faq_question_2": "Pergunta FAQ 2",
  "faq_answer_2": "Resposta FAQ 2",
  "faq_question_3": "Pergunta FAQ 3",
  "faq_answer_3": "Resposta FAQ 3"
}

**REGRAS OBRIGATÓRIAS:**
1. Use linguagem empática e sofisticada; evite tom robótico ou corporativo demais
2. Não escreva clichês vazios como “transforme sua vida agora” sem contexto
3. Foque em especificidade: dores, contexto e benefício precisam soar reais
4. Inclua palavras-chave naturalmente: "${svd.main_category || vertical} em ${sd.city || client?.city || ""}"
5. Use verbos de ação nos CTAs, mas sem apelar para urgência artificial
6. Depoimentos devem parecer relatos espontâneos, não anúncios
7. FAQs devem ser formuladas como perguntas reais de busca e responder de forma escaneável
8. Para psicologia/saúde: não faça promessas absolutas de cura, nem linguagem antiética
9. Se houver poucos dados do cliente, compense com elegância e clareza — nunca com generalidades vagas
10. Retorne APENAS o JSON, sem texto adicional`;

    const resp = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Você é um copywriter expert. Retorne APENAS JSON válido, sem markdown ou explicações." },
          { role: "user", content: prompt },
        ],
        max_tokens: 4096,
        temperature: 0.85,
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
