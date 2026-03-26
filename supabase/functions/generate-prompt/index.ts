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
      const disclaimers: Record<string, string> = {
        psicologo: `OBRIGATÓRIO: Incluir disclaimer "Este site não substitui atendimento de emergência. Em caso de crise, ligue 188 (CVV) ou procure o CAPS mais próximo."`,
        dentista: `OBRIGATÓRIO: Linguagem clínica ética. Seção antes/depois só com assets reais; caso contrário usar "Resultados e expectativas".`,
        terapeuta: `OBRIGATÓRIO: Linguagem acolhedora sem prometer cura clínica. Incluir aviso "A terapia complementar não substitui cuidados médicos ou psicológicos."`,
      };

      const bd = intake_data.business_data || {};
      const sd = intake_data.schedule_data || {};
      const svd = intake_data.services_data || {};

      systemPrompt = `Você é um especialista em criação de prompts ultra-detalhados para gerar projetos Astro completos. Seu objetivo é gerar um prompt COMPLETO e EXTENSO que, ao ser colado em um editor de código IA (como Lovable ou Cursor), produza TODOS os arquivos de um projeto Astro funcional com landing page profissional e visualmente impactante.

O prompt gerado DEVE seguir EXATAMENTE este formato e nível de detalhe:

---

### FORMATO OBRIGATÓRIO DO PROMPT GERADO

O prompt deve começar com:
"Crie um projeto Astro completo usando Bun como package manager, configurado para deploy na Vercel. O projeto deve ser uma landing page profissional e visualmente impactante para [NOME DO NEGÓCIO]."

### INFORMAÇÕES DO PRODUTO (preencha com os dados do negócio)
- Nome, Slogan, Descrição, Público-alvo
- Cor primária e cor secundária (escolha cores que combinem com a vertical do negócio)

### ESTRUTURA DE ARQUIVOS (sempre gerar esta estrutura)
\`\`\`
[slug-do-negocio]/
├── package.json
├── astro.config.mjs
├── tsconfig.json
├── .gitignore
├── vercel.json
└── src/
    ├── pages/
    │   └── index.astro
    ├── layouts/
    │   └── Layout.astro
    └── components/
        ├── Hero.astro
        ├── PainPoints.astro
        ├── About.astro
        ├── HowItWorks.astro
        ├── Services.astro
        ├── Testimonials.astro
        ├── FAQ.astro
        ├── FinalCTA.astro
        └── Footer.astro
\`\`\`

### PACKAGE.JSON
Incluir astro e @astrojs/vercel como dependências.

### ASTRO.CONFIG.MJS
Configurar com @astrojs/vercel/static como adapter.

### VERCEL.JSON
Configurar com "framework": "astro". Rewrites para index.html. Sem propriedade "output".

### SEÇÕES DA LANDING PAGE

Para CADA seção, o prompt deve especificar com o MÁXIMO de detalhe:

#### SEÇÃO 1 — Hero (Hero.astro)
- Design: Tela cheia (100vh), fundo escuro dramático com mesh gradient animado usando as cores primária e secundária
- Efeito de ruído/grain sutil via pseudo-elemento
- Badge animado no topo com o nome do negócio
- Headline gigante (clamp 52px–96px) com fonte display (Google Fonts: Syne weight 800) — usar o slogan
- Subtítulo (16–20px, fonte sans-serif leve) — usar a descrição
- Dois botões: CTA principal (WhatsApp ou agendamento) e secundário (saiba mais)
- Social proof: avatares empilhados + texto de clientes atendidos
- Card flutuante com métrica de destaque e micro-animação float
- Animações: @keyframes fadeUp staggerado, mesh gradient com @keyframes gradientShift

#### SEÇÃO 2 — Dores do Público (PainPoints.astro)
- Design: fundo levemente diferente do hero. Grid de cards com as dores
- Cada card: ícone SVG inline, título em negrito, descrição
- Glassmorphism: backdrop-filter blur, borda sutil
- Hover: borda ilumina com cor primária, translateY(-4px)
- Intersection Observer para animação de entrada staggerada

#### SEÇÃO 3 — Sobre/Autoridade (About.astro)
- Apresentação da abordagem e diferenciais do profissional
- Layout assimétrico com destaque visual
- Elementos decorativos com a cor primária

#### SEÇÃO 4 — Como Funciona (HowItWorks.astro)
- 3-4 passos em linha horizontal (desktop), vertical (mobile)
- Linha conectora tracejada animada via stroke-dashoffset
- Números grandes estilizados como fundo decorativo
- Ícones SVG 40x40 com background circular

#### SEÇÃO 5 — Serviços (Services.astro)
- Grid de cards com os serviços oferecidos
- Ícones SVG únicos por serviço
- Hover com efeito de elevação e brilho

#### SEÇÃO 6 — Depoimentos (Testimonials.astro)
- 3 cards, card central destacado (escala 1.05 + sombra mais intensa)
- Depoimentos realistas e anonimizados adequados à vertical
- Avatar com iniciais, aspas decorativas, estrelas ★★★★★
- Glassmorphism em todos os cards

#### SEÇÃO 7 — FAQ (FAQ.astro)
- 5 perguntas relevantes para a vertical e serviços
- Accordion com animação suave
- Otimizado para AEO (linguagem natural, respostas completas)

#### SEÇÃO 8 — CTA Final + Footer (FinalCTA.astro + Footer.astro)
- CTA: gradiente dramático, headline grande, input de contato + botão
- Garantias em linha
- Footer: logo + tagline, colunas de links, copyright + ícones sociais
- NAP completo (Nome, Endereço, Telefone)

### VARIÁVEIS CSS GLOBAIS (em Layout.astro)
Definir paleta completa: --color-primary, --color-secondary, --color-bg, --color-bg-card, --color-text, --color-text-muted, --color-border, --font-display, --font-body, --radius, --shadow-glow, --max-width, --section-padding.
Importar Google Fonts: Syne (400, 700, 800) e DM Sans (300, 400, 500).

### REQUISITOS TÉCNICOS OBRIGATÓRIOS
1. Zero dependências JS além do Astro — tudo em CSS + vanilla JS inline
2. Totalmente responsivo — mobile-first, breakpoints em 768px e 1024px
3. Performance máxima — sem imagens externas, visuais em CSS/SVG
4. Acessibilidade: alt em imagens, aria-label em botões, contraste adequado
5. SEO: title tag, meta description, meta og:*, Schema JSON-LD (LocalBusiness + FAQPage), H1 único
6. tsconfig.json com strict: true
7. .gitignore com node_modules, dist, .env, .vercel

### INSTRUÇÕES FINAIS
- Gerar CADA arquivo completo, sem omitir nenhuma linha
- Cada arquivo com comentário // arquivo: caminho/do/arquivo
- Bloco "Como rodar localmente" com bun install && bun run dev
- Bloco "Como fazer deploy na Vercel"

${disclaimers[vertical] || ""}

IMPORTANTE: O prompt gerado deve ser EXTREMAMENTE detalhado e específico, descrevendo CADA elemento visual, CADA animação, CADA interação. Quanto mais detalhado, melhor o resultado final. Use o contexto do negócio para personalizar TUDO: cores, textos, depoimentos, FAQs, serviços, métricas de social proof.`;

      userPrompt = `Gere o prompt completo e ultra-detalhado para criar o projeto Astro da landing page para este negócio:

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

Gere o prompt completo com TODAS as seções detalhadas, pronto para colar em um editor de código IA. O prompt deve ser auto-contido e gerar um projeto Astro funcional completo.`;

    } else if (action === "generate_content_pack") {
      systemPrompt = `Você é um especialista em SEO local e AEO (Answer Engine Optimization). Gere um content pack JSON com:
- meta_title (< 60 chars com keyword + cidade)
- meta_description (< 160 chars, persuasiva)
- schema_type (LocalBusiness, Dentist, ou ProfessionalService)
- og_title e og_description
- 5 FAQs relevantes para a vertical (otimizadas para linguagem natural e busca por IA)
- keywords (array de 10 keywords relevantes)
- schema_json_ld (objeto completo LocalBusiness + FAQPage)`;

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
        model: "google/gemini-2.5-flash",
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
