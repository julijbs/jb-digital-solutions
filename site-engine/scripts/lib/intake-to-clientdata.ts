/**
 * intake-to-clientdata.ts — Mapeia intake Supabase → ClientData completo
 * Gera estrutura + _copyPrompt para uso no Claude Code (sem chamada à API).
 */

import { expandBrandTokens } from "../../src/lib/brand.ts";
import type { ClientData, ClientService, ClientNeighborhood } from "../../src/lib/types.ts";

// ── Helpers ──────────────────────────────────────────────────────────────────

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function cleanPhone(p: string): string {
  return p.replace(/\D/g, "");
}

function parseOpeningHours(hours: Record<string, string>) {
  const dayMap: Record<string, string> = {
    seg: "Monday", ter: "Tuesday", qua: "Wednesday",
    qui: "Thursday", sex: "Friday", sab: "Saturday", dom: "Sunday",
  };
  const groups = new Map<string, string[]>();
  for (const [k, v] of Object.entries(hours)) {
    if (!v || !dayMap[k]) continue;
    if (!groups.has(v)) groups.set(v, []);
    groups.get(v)!.push(dayMap[k]);
  }
  return Array.from(groups.entries()).map(([h, days]) => {
    const [opens, closes] = h.split("-").map((s) => s.trim());
    return { days, opens: opens || "08:00", closes: closes || "18:00" };
  });
}

function parseNeighborhoods(regions: string): ClientNeighborhood[] {
  if (!regions) return [];
  return regions.split(",").map((r) => r.trim()).filter(Boolean).map((name) => ({
    slug: slugify(name),
    name,
    prep: "no",
  }));
}

const SCHEMA_MAP: [string, string][] = [
  ["psicol", "Psychologist"],
  ["dentist", "Dentist"],
  ["nutrici", "Nutritionist"],
  ["fisioter", "PhysicalTherapist"],
  ["medic", "Physician"],
  ["terapeu", "HealthcareProvider"],
];

function inferSchemaType(cat: string): string {
  const l = cat.toLowerCase();
  for (const [k, v] of SCHEMA_MAP) if (l.includes(k)) return v;
  return "LocalBusiness";
}

// ── Copy generation (estrutura + prompt para Claude Code) ────────────────────

function generateCopy(ctx: {
  businessName: string; mainCategory: string; city: string; state: string;
  description: string; servicesTags: string; targetAudience: string;
  painPoints: string; differentials: string; approach: string;
  credentials: string; commonQuestions: string;
}): { copy: ClientData["copy"]; services: ClientService[]; copyPrompt: string } {

  const prompt = `Você é um copywriter especialista em sites para profissionais de saúde e negócios locais no Brasil.

Dados do profissional:
- Nome: ${ctx.businessName}
- Especialidade: ${ctx.mainCategory}
- Cidade: ${ctx.city}, ${ctx.state}
- Descrição: ${ctx.description}
- Serviços: ${ctx.servicesTags}
- Público-alvo: ${ctx.targetAudience}
- Dores dos clientes: ${ctx.painPoints}
- Diferenciais: ${ctx.differentials}
- Abordagem: ${ctx.approach}
- Formação: ${ctx.credentials}
- Perguntas frequentes: ${ctx.commonQuestions}

Retorne SOMENTE JSON válido (sem markdown) com esta estrutura:
{
  "copy": {
    "homeTitle": "Nome | Especialidade em Cidade",
    "homeMetaDescription": "descrição 155 chars com localização",
    "businessDescription": "schema.org 200 chars",
    "llmsSummary": "2 frases para contexto IA",
    "heroHeadline": "H1 benefit-focused máx 60 chars",
    "heroSubheadline": "suporte ao H1 máx 100 chars",
    "heroEyebrow": "label curta máx 30 chars",
    "heroPhotoAlt": "alt text da foto hero",
    "painPoints": ["Título — desc breve", "Título — desc breve", "Título — desc breve"],
    "aboutHeadline": "título sobre máx 50 chars",
    "aboutBody": "2 parágrafos sobre o profissional ~150 palavras",
    "pullQuote": "frase memorável",
    "aboutCredential": "credenciais resumidas",
    "aboutPhotoAlt": "alt text foto sobre",
    "servicesHeadline": "Como posso te ajudar",
    "processHeadline": "Como funciona",
    "processSteps": [{"name":"passo","description":"desc"},{"name":"passo","description":"desc"},{"name":"passo","description":"desc"},{"name":"passo","description":"desc"}],
    "testimonials": [{"quote":"depoimento plausível","author":"Nome Cliente"}],
    "faqHeadline": "Perguntas frequentes",
    "faqs": [{"question":"q","answer":"a"},{"question":"q","answer":"a"},{"question":"q","answer":"a"},{"question":"q","answer":"a"},{"question":"q","answer":"a"}],
    "ctaHeadline": "chamada ação máx 60 chars",
    "ctaSubtext": "suporte máx 100 chars",
    "ctaButtonText": "Agendar consulta"
  },
  "services": [
    {"slug":"slug-servico","name":"Nome Serviço","tag":"Para quem","description":"descrição completa","schemaType":"MedicalProcedure","h1Template":"{{SERVICE}} {{PREP}} {{BAIRRO}}","metaDescTemplate":"Serviço {{PREP}} {{BAIRRO}} — desc"}
  ]
}`;

  return {
    copy: {
      homeTitle: `${ctx.businessName} | ${ctx.mainCategory} em ${ctx.city}`,
      homeMetaDescription: `${ctx.mainCategory} em ${ctx.city}. ${ctx.description}`.slice(0, 155),
      businessDescription: ctx.description.slice(0, 200),
      llmsSummary: `${ctx.businessName} é ${ctx.mainCategory.toLowerCase()} em ${ctx.city}. ${ctx.description}`,
      heroHeadline: ctx.description.slice(0, 60),
      heroSubheadline: `Atendimento em ${ctx.city}`,
      heroEyebrow: ctx.mainCategory,
      heroPhotoAlt: `Foto de ${ctx.businessName}`,
      painPoints: ["Precisando de ajuda?", "Buscando mudanças reais?", "Pronto para evoluir?"],
      aboutHeadline: `Sobre ${ctx.businessName.split(" ")[0]}`,
      aboutBody: ctx.credentials || "Profissional dedicado(a) ao seu bem-estar.",
      pullQuote: ctx.differentials.split(",")[0]?.trim() || "Comprometido(a) com o seu sucesso.",
      aboutCredential: ctx.credentials,
      aboutPhotoAlt: `${ctx.businessName}`,
      servicesHeadline: "Como posso te ajudar",
      processHeadline: "Como funciona",
      processSteps: [
        { name: "Primeiro contato", description: "Entre em contato para agendar" },
        { name: "Avaliação inicial", description: "Entendemos a sua situação" },
        { name: "Plano personalizado", description: "Criamos um plano para você" },
        { name: "Acompanhamento", description: "Evoluímos juntos no seu ritmo" },
      ],
      testimonials: [{ quote: "Profissional incrível, mudou minha vida!", author: "Cliente satisfeito" }],
      faqHeadline: "Perguntas frequentes",
      faqs: [{ question: "Como faço para agendar?", answer: "Entre em contato pelo WhatsApp ou e-mail." }],
      ctaHeadline: "Pronto para começar?",
      ctaSubtext: "Agende uma sessão hoje mesmo.",
      ctaButtonText: "Agendar agora",
    },
    services: [],
    copyPrompt: prompt,
  };
}

// ── Export principal ──────────────────────────────────────────────────────────

export async function intakeToClientData(
  intake: any,
  project: any
): Promise<ClientData & { _copyPrompt: string }> {
  const bd = (intake.business_data || {}) as any;
  const sd = (intake.schedule_data || {}) as any;
  const svd = (intake.services_data || {}) as any;
  const brd = (intake.brand_data || {}) as any;
  const gd = (intake.google_data || {}) as any;
  const client = (project.clients || {}) as any;

  const businessName = bd.name || client.business_name || "";
  const slug = slugify(businessName);
  const city = sd.city || sd.main_city || client.city || "";
  const state = sd.state || client.state || "";
  const phone = bd.phone || "";
  const isAddr = sd.type === "address" || sd.type === "both";
  const streetAddress = isAddr ? `${sd.street || ""}, ${sd.number || ""}`.trim().replace(/^,|,$/, "") : "";

  // Brand tokens
  const primary = brd.primary_color || "#3E5C76";
  const accent = (brd.dominant_colors || [])[1] || brd.primary_color || "#C08552";
  const fontDisplay = brd.font_display || "Fraunces";
  const fontBody = brd.font_body || "Inter";
  const brand = expandBrandTokens({ primary, accent, fontDisplay, fontBody });

  // Opening hours
  const openingHours = parseOpeningHours(sd.hours || {});

  // Neighborhoods (Premium only)
  const neighborhoods = project.plan === "premium"
    ? parseNeighborhoods(sd.regions || "")
    : [];

  // Generate copy via Claude
  const mainCategory = svd.main_category || "";
  const { copy, services, copyPrompt } = generateCopy({
    businessName, mainCategory, city, state,
    description: bd.description || "",
    servicesTags: svd.services_tags || "",
    targetAudience: svd.target_audience || "",
    painPoints: svd.pain_points || "",
    differentials: svd.differentials || "",
    approach: svd.approach || "",
    credentials: svd.credentials_summary || "",
    commonQuestions: svd.common_questions || "",
  });

  return {
    businessName,
    specialty: mainCategory,
    credential: svd.credentials_summary || "",
    slug,
    siteUrl: `https://${slug}.jbdigitalsystem.com`,
    mood: (brd.brand_mood || "calm-trust") as any,
    logoSrc: brd.logo_url || undefined,
    ogImageSrc: `/${slug}/og-image.jpg`,
    gbpUrl: gd.gbp_url || project.gbp_url || undefined,
    brand,
    streetAddress,
    postalCode: sd.cep || "",
    district: sd.neighborhood || "",
    specialtyNoun: mainCategory.split(/\s+/)[0]?.toLowerCase() || "",
    city,
    state,
    phone,
    phoneClean: cleanPhone(phone),
    email: bd.email || "",
    instagram: bd.instagram || "",
    address: isAddr && streetAddress
      ? `${streetAddress} — ${sd.neighborhood || ""}, ${city}-${state}`
      : `${city}-${state}`,
    lat: "",
    lng: "",
    copy,
    services,
    neighborhoods,
    schemaType: inferSchemaType(mainCategory),
    openingHours: openingHours.length
      ? openingHours
      : [{ days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" }],
    priceRange: "$$",
    _copyPrompt: copyPrompt,
  } as ClientData & { _copyPrompt: string };
}
