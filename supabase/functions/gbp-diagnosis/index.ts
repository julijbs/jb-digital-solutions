import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function getAccessToken(): Promise<string> {
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
  const refreshToken = Deno.env.get("GOOGLE_REFRESH_TOKEN");

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Google OAuth credentials not configured");
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Token refresh failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

interface Gap {
  field: string;
  severity: "critical" | "warning" | "info";
  title: string;
  evidence: string;
  impact: string;
  action: string;
}

interface GBPScore {
  total: number;
  breakdown: {
    description: number;
    categories: number;
    hours: number;
    contact: number;
    website: number;
    address: number;
    photos: number;
    reviews: number;
  };
  review_count: number;
  avg_rating: number;
  photo_count: number;
  gaps: Gap[];
  verdict: string;
  business_name: string;
  generated_at: string;
}

function scoreDescription(description: string | undefined): number {
  if (!description) return 0;
  const len = description.length;
  if (len >= 150) return 15;
  if (len >= 50) return 8;
  return 0;
}

function scoreCategories(categories: any): number {
  if (!categories) return 0;
  const primary = categories.primaryCategory;
  const additional = categories.additionalCategories || [];
  if (primary && additional.length >= 1) return 15;
  if (primary) return 8;
  return 0;
}

function scoreHours(regularHours: any): number {
  if (!regularHours?.periods || regularHours.periods.length === 0) return 0;
  const days = new Set(regularHours.periods.map((p: any) => p.openDay));
  if (days.size >= 7) return 15;
  return 8;
}

function scoreContact(phoneNumbers: any): number {
  if (phoneNumbers?.primaryPhone) return 10;
  return 0;
}

function scoreWebsite(websiteUri: string | undefined): number {
  return websiteUri ? 10 : 0;
}

function scoreAddress(storefrontAddress: any): number {
  if (storefrontAddress?.addressLines?.length > 0) return 10;
  return 0;
}

function scorePhotos(photoCount: number): number {
  if (photoCount >= 10) return 15;
  if (photoCount >= 3) return 8;
  return 0;
}

function scoreReviews(reviewCount: number): number {
  if (reviewCount >= 10) return 10;
  if (reviewCount >= 3) return 5;
  return 0;
}

function buildGaps(location: any, photoCount: number, reviewCount: number, avgRating: number): Gap[] {
  const gaps: Gap[] = [];

  // Description
  const desc = location.profile?.description || "";
  if (!desc) {
    gaps.push({
      field: "description",
      severity: "critical",
      title: "Descrição do negócio ausente",
      evidence: "Campo descrição não preenchido",
      impact: "Google usa a descrição para entender o que o negócio faz e exibi-la nos resultados de busca",
      action: "Adicionar descrição de 150-750 caracteres com palavras-chave do nicho e cidade",
    });
  } else if (desc.length < 50) {
    gaps.push({
      field: "description",
      severity: "warning",
      title: "Descrição muito curta",
      evidence: `Descrição com apenas ${desc.length} caracteres`,
      impact: "Google usa a descrição para entender o que o negócio faz e exibi-la nos resultados de busca",
      action: "Expandir descrição para ao menos 150 caracteres com palavras-chave do nicho e cidade",
    });
  }

  // Categories
  const hasPrimary = !!location.categories?.primaryCategory;
  const additionalCount = location.categories?.additionalCategories?.length || 0;
  if (!hasPrimary) {
    gaps.push({
      field: "categories",
      severity: "critical",
      title: "Categorias não configuradas",
      evidence: "Nenhuma categoria selecionada",
      impact: "As categorias são o principal sinal que o Google usa para saber em quais buscas exibir o perfil",
      action: "Definir categoria principal e pelo menos 2 categorias secundárias do nicho",
    });
  } else if (additionalCount === 0) {
    gaps.push({
      field: "categories",
      severity: "warning",
      title: "Somente categoria principal",
      evidence: "Nenhuma categoria adicional configurada",
      impact: "Categorias adicionais ampliam o alcance em buscas relacionadas ao nicho",
      action: "Adicionar pelo menos 2 categorias secundárias relevantes ao nicho",
    });
  }

  // Hours
  const periods = location.regularHours?.periods || [];
  if (periods.length === 0) {
    gaps.push({
      field: "hours",
      severity: "critical",
      title: "Horários de funcionamento não definidos",
      evidence: "Nenhum horário cadastrado",
      impact: "Perfis sem horário perdem visibilidade e clientes não sabem quando atender",
      action: "Configurar horários de todos os dias da semana",
    });
  } else {
    const days = new Set(periods.map((p: any) => p.openDay));
    if (days.size < 7) {
      gaps.push({
        field: "hours",
        severity: "warning",
        title: "Horários incompletos",
        evidence: `Apenas ${days.size} dias da semana com horário`,
        impact: "Perfis com horários incompletos passam imagem de pouco profissionalismo",
        action: "Configurar horários para todos os 7 dias da semana, incluindo fins de semana",
      });
    }
  }

  // Phone
  if (!location.phoneNumbers?.primaryPhone) {
    gaps.push({
      field: "contact",
      severity: "critical",
      title: "Telefone não cadastrado",
      evidence: "Nenhum número de telefone no perfil",
      impact: "Sem telefone, clientes não conseguem entrar em contato diretamente pelo Google Maps",
      action: "Adicionar número de telefone principal com DDD",
    });
  }

  // Website
  if (!location.websiteUri) {
    gaps.push({
      field: "website",
      severity: "warning",
      title: "Site não vinculado",
      evidence: "Nenhum site cadastrado no perfil",
      impact: "Sem site, o Google não tem onde enviar cliques — reduz tráfego e credibilidade",
      action: "Vincular o site oficial ao perfil GBP",
    });
  }

  // Address
  if (!location.storefrontAddress?.addressLines?.length) {
    gaps.push({
      field: "address",
      severity: "critical",
      title: "Endereço não configurado",
      evidence: "Nenhum endereço físico cadastrado",
      impact: "Sem endereço, o negócio não aparece em buscas por localização no Maps",
      action: "Adicionar endereço completo ou área de atendimento",
    });
  }

  // Photos
  if (photoCount === 0) {
    gaps.push({
      field: "photos",
      severity: "critical",
      title: "Sem fotos no perfil",
      evidence: "0 fotos cadastradas",
      impact: "Perfis com fotos recebem 42% mais pedidos de rota e 35% mais cliques no site (Google)",
      action: "Adicionar mínimo 5 fotos: fachada, interior, equipe, produto/serviço",
    });
  } else if (photoCount < 3) {
    gaps.push({
      field: "photos",
      severity: "warning",
      title: "Poucas fotos no perfil",
      evidence: `${photoCount} foto(s) cadastrada(s)`,
      impact: "Perfis com fotos recebem 42% mais pedidos de rota e 35% mais cliques no site (Google)",
      action: "Adicionar mínimo 5 fotos: fachada, interior, equipe, produto/serviço",
    });
  }

  // Reviews
  if (reviewCount < 5) {
    gaps.push({
      field: "reviews",
      severity: "warning",
      title: "Poucos reviews",
      evidence: `${reviewCount} avaliações`,
      impact: "Perfis com mais reviews têm posição média melhor no Maps",
      action: "Implementar estratégia de captação de avaliações pós-atendimento",
    });
  }

  // Low rating
  if (reviewCount > 0 && avgRating < 4.0) {
    gaps.push({
      field: "reviews",
      severity: "critical",
      title: "Nota baixa",
      evidence: `${avgRating.toFixed(1)} estrelas`,
      impact: "Notas abaixo de 4.0 reduzem conversão e podem desqualificar o negócio nos resultados do Maps",
      action: "Responder todas as avaliações negativas e implementar plano de melhoria da experiência",
    });
  }

  return gaps;
}

function buildVerdict(score: number, gaps: Gap[]): string {
  const criticalGaps = gaps.filter((g) => g.severity === "critical");
  const topGap = criticalGaps[0]?.title || gaps[0]?.title || "nenhuma lacuna identificada";

  if (score >= 80) {
    return `O perfil tem boa base mas pode melhorar em ${topGap.toLowerCase()}.`;
  }
  if (score >= 50) {
    return `O perfil tem ${gaps.length} lacunas importantes que reduzem a visibilidade no Google Maps.`;
  }
  const top2 = criticalGaps.slice(0, 2).map((g) => g.title.toLowerCase()).join(" e ");
  return `O perfil GBP está incompleto e perdendo clientes para concorrentes melhor configurados — ${top2}.`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (roleData?.role !== "admin_jb") {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { project_id } = await req.json();
    if (!project_id) {
      return new Response(JSON.stringify({ error: "project_id é obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Read project + business_name from clients
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("id, gbp_url, clients(business_name, city, state)")
      .eq("id", project_id)
      .maybeSingle();

    if (projectError || !projectData) {
      return new Response(JSON.stringify({ error: "Projeto não encontrado" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!projectData.gbp_url) {
      return new Response(JSON.stringify({ error: "GBP não vinculado a este projeto" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract locationId from gbp_url: last segment after /l/
    const gbpUrl: string = projectData.gbp_url;
    const locationIdMatch = gbpUrl.match(/\/l\/([^/?#]+)/);
    const locationId = locationIdMatch ? locationIdMatch[1] : null;
    if (!locationId) {
      return new Response(
        JSON.stringify({ error: "Não foi possível extrair o locationId da URL do GBP" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const clientInfo = Array.isArray(projectData.clients)
      ? projectData.clients[0]
      : projectData.clients as any;
    const businessName: string = clientInfo?.business_name || "Negócio";

    // Get Google access token
    const accessToken = await getAccessToken();

    // List accounts
    const accountsRes = await fetch(
      "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const accountsData = await accountsRes.json();

    if (!accountsRes.ok || !accountsData.accounts) {
      return new Response(
        JSON.stringify({ error: "google_api_error", detail: accountsData }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find location across all accounts
    let foundLocation: any = null;
    let foundLocationName: string = "";

    for (const account of accountsData.accounts) {
      const locRes = await fetch(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,storefrontAddress,websiteUri,phoneNumbers,categories,regularHours,specialHours,profile,openInfo,metadata`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const locData = await locRes.json();
      const locations: any[] = locData.locations || [];

      for (const loc of locations) {
        if (loc.name && loc.name.endsWith(locationId)) {
          foundLocation = loc;
          foundLocationName = loc.name;
          break;
        }
      }
      if (foundLocation) break;
    }

    if (!foundLocation) {
      return new Response(
        JSON.stringify({ error: "Localização GBP não encontrada na conta Google" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch reviews
    let reviewCount = 0;
    let avgRating = 0;
    try {
      const reviewsRes = await fetch(
        `https://mybusiness.googleapis.com/v4/${foundLocationName}/reviews?pageSize=50`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        const reviews: any[] = reviewsData.reviews || [];
        reviewCount = reviewsData.totalReviewCount ?? reviews.length;
        if (reviews.length > 0) {
          const ratingMap: Record<string, number> = {
            ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5,
          };
          const sum = reviews.reduce(
            (acc: number, r: any) => acc + (ratingMap[r.starRating] ?? 0),
            0
          );
          avgRating = reviews.length > 0 ? sum / reviews.length : 0;
        }
      }
    } catch (_e) {
      // Reviews API failure — continue with defaults
    }

    // Fetch media (photos)
    let photoCount = 0;
    try {
      const mediaRes = await fetch(
        `https://mybusiness.googleapis.com/v4/${foundLocationName}/media`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        photoCount = (mediaData.mediaItems || []).length;
      }
    } catch (_e) {
      // Media API failure — continue with defaults
    }

    // Score
    const breakdown = {
      description: scoreDescription(foundLocation.profile?.description),
      categories: scoreCategories(foundLocation.categories),
      hours: scoreHours(foundLocation.regularHours),
      contact: scoreContact(foundLocation.phoneNumbers),
      website: scoreWebsite(foundLocation.websiteUri),
      address: scoreAddress(foundLocation.storefrontAddress),
      photos: scorePhotos(photoCount),
      reviews: scoreReviews(reviewCount),
    };

    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

    const gaps = buildGaps(foundLocation, photoCount, reviewCount, avgRating);
    const verdict = buildVerdict(total, gaps);

    const result: GBPScore = {
      total,
      breakdown,
      review_count: reviewCount,
      avg_rating: Math.round(avgRating * 10) / 10,
      photo_count: photoCount,
      gaps,
      verdict,
      business_name: businessName,
      generated_at: new Date().toISOString(),
    };

    // Save to client_intake.gbp_diagnosis
    await (supabase as any)
      .from("client_intake")
      .update({ gbp_diagnosis: result })
      .eq("project_id", project_id);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GBP Diagnosis error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
