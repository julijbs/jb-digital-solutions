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

### SEO — OTIMIZAÇÃO MÁXIMA PARA BUSCADORES (OBRIGATÓRIO em Layout.astro)

O prompt DEVE exigir que o Layout.astro inclua TODOS estes elementos no <head>:

1. **Title Tag**: < 60 caracteres, formato "[Keyword Principal] em [Cidade] | [Nome do Negócio]"
2. **Meta Description**: < 160 caracteres, persuasiva, com keyword + cidade + CTA implícito
3. **Canonical URL**: <link rel="canonical" href="URL_DO_SITE" />
4. **Meta Robots**: <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
5. **Open Graph completo**:
   - og:type = "website"
   - og:title, og:description, og:url, og:site_name, og:locale = "pt_BR"
   - og:image (gerar SVG inline como fallback ou URL placeholder)
6. **Twitter Cards**: twitter:card = "summary_large_image", twitter:title, twitter:description
7. **Geo Tags** (SEO local):
   - <meta name="geo.region" content="BR-[ESTADO]" />
   - <meta name="geo.placename" content="[CIDADE]" />
   - <meta name="geo.position" content="latitude;longitude" /> (placeholder)
   - <meta name="ICBM" content="latitude, longitude" />
8. **Preconnect**: Google Fonts, analytics se houver
9. **Language**: <html lang="pt-BR">

### SEO — SCHEMA JSON-LD (OBRIGATÓRIO em Layout.astro ou index.astro)

Gerar schemas JSON-LD COMPLETOS e VÁLIDOS:

1. **LocalBusiness** (ou subtipo adequado: Dentist, ProfessionalService, HealthAndBeautyBusiness):
   \`\`\`json
   {
     "@context": "https://schema.org",
     "@type": "[tipo adequado à vertical]",
     "name": "[nome do negócio]",
     "description": "[descrição]",
     "url": "[URL do site]",
     "telephone": "[telefone]",
     "address": {
       "@type": "PostalAddress",
       "streetAddress": "[endereço]",
       "addressLocality": "[cidade]",
       "addressRegion": "[estado]",
       "postalCode": "[CEP]",
       "addressCountry": "BR"
     },
     "geo": { "@type": "GeoCoordinates", "latitude": "", "longitude": "" },
     "openingHoursSpecification": [...],
     "priceRange": "$$",
     "image": "[URL ou placeholder]",
     "sameAs": ["[instagram]", "[outras redes]"],
     "aggregateRating": {
       "@type": "AggregateRating",
       "ratingValue": "4.9",
       "reviewCount": "47"
     }
   }
   \`\`\`

2. **FAQPage** (CRUCIAL para AEO):
   \`\`\`json
   {
     "@context": "https://schema.org",
     "@type": "FAQPage",
     "mainEntity": [
       {
         "@type": "Question",
         "name": "[pergunta em linguagem natural]",
         "acceptedAnswer": {
           "@type": "Answer",
           "text": "[resposta completa, 2-3 frases]"
         }
       }
     ]
   }
   \`\`\`

3. **WebSite** com SearchAction (opcional mas recomendado):
   \`\`\`json
   {
     "@context": "https://schema.org",
     "@type": "WebSite",
     "name": "[nome]",
     "url": "[URL]"
   }
   \`\`\`

4. **BreadcrumbList** para navegação estruturada

### AEO — OTIMIZAÇÃO PARA ANSWER ENGINES (ChatGPT, Gemini, Perplexity)

O prompt DEVE instruir que:

1. **FAQ otimizada para linguagem natural**: As perguntas devem ser escritas EXATAMENTE como um usuário perguntaria a um assistente de IA:
   - "Qual o melhor [profissional] em [cidade]?"
   - "Quanto custa [serviço] em [cidade]?"
   - "Como funciona [serviço/tratamento]?"
   - "[Profissional] perto de mim que atende [condição]"
   - "Vale a pena fazer [serviço] com [profissional]?"

2. **Respostas completas e citáveis**: Cada resposta da FAQ deve ter 2-3 frases completas que uma IA possa citar diretamente como fonte. Incluir dados concretos: preços aproximados, tempo de tratamento, diferenciais.

3. **Conteúdo semântico rico**: Usar variações de keywords naturais no corpo do texto. Não keyword stuffing — linguagem fluida que responde perguntas implícitas.

4. **Headings como perguntas**: Alguns H2/H3 devem ser formulados como perguntas que IAs poderiam responder.

5. **E-E-A-T signals** (Experience, Expertise, Authoritativeness, Trustworthiness):
   - Seção "Sobre" com credenciais, tempo de experiência, formação
   - Depoimentos com nome, cargo/contexto
   - Endereço físico completo (NAP consistency)
   - Links para redes sociais profissionais

6. **Citabilidade**: Incluir frases-chave que funcionem como "snippets prontos" para IAs citarem:
   - "[Nome do Negócio] é referência em [serviço] em [cidade], com mais de [X] clientes atendidos."
   - "Localizado em [endereço], o [Nome] oferece [serviço] com [diferencial]."

7. **Meta tags específicas para AEO**:
   - Usar article:author quando aplicável
   - Incluir datePublished e dateModified no Schema
   - Conteúdo evergreen com linguagem atemporal

### SEO TÉCNICO OBRIGATÓRIO

1. **Performance**: 
   - Zero imagens externas (tudo CSS/SVG)
   - Fontes com font-display: swap
   - CSS crítico inline, restante assíncrono
   - Preload das fontes principais
2. **HTML Semântico**: 
   - H1 ÚNICO (no Hero)
   - Hierarquia H2 → H3 correta em cada seção
   - <main>, <section>, <article>, <nav>, <footer> semânticos
   - role="navigation", role="main", role="contentinfo"
3. **Acessibilidade**: alt em imagens, aria-label em botões/links icônicos, contraste WCAG AA mínimo
4. **Mobile-first**: breakpoints 768px e 1024px, touch targets mínimo 44x44px
5. **Sitemap hint**: comentário no código indicando onde adicionar sitemap.xml
6. **Robots**: meta robots permitindo indexação completa

### REQUISITOS TÉCNICOS ADICIONAIS
1. Zero dependências JS além do Astro — tudo em CSS + vanilla JS inline
2. tsconfig.json com strict: true
3. .gitignore com node_modules, dist, .env, .vercel

### INSTRUÇÕES FINAIS
- Gerar CADA arquivo completo, sem omitir nenhuma linha
- Cada arquivo com comentário // arquivo: caminho/do/arquivo
- Bloco "Como rodar localmente" com bun install && bun run dev
- Bloco "Como fazer deploy na Vercel"

${disclaimers[vertical] || ""}

IMPORTANTE: O prompt gerado deve ser EXTREMAMENTE detalhado e específico, descrevendo CADA elemento visual, CADA animação, CADA interação. A otimização SEO e AEO deve estar INTEGRADA em cada seção, não como algo separado. Quanto mais detalhado, melhor o resultado final. Use o contexto do negócio para personalizar TUDO: cores, textos, depoimentos, FAQs, serviços, métricas de social proof, schemas JSON-LD.`;

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
