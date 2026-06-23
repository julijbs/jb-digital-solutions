import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Problem {
  category: "performance" | "seo" | "aeo" | "mobile" | "technical";
  severity: "critical" | "warning" | "info";
  title: string;
  evidence: string;
  impact: string;
}

interface DiagnosisResult {
  url: string;
  generated_at: string;
  scores: {
    performance_mobile: number;
    performance_desktop: number;
    seo: number;
    accessibility: number;
    best_practices: number;
  };
  problems: Problem[];
  verdict: string;
}

function scoreToInt(score: number | null | undefined): number {
  if (score == null) return 0;
  return Math.round(score * 100);
}

function extractProblems(audits: Record<string, any>): Problem[] {
  const problems: Problem[] = [];

  // HTTPS
  if (audits["is-on-https"]?.score === 0) {
    problems.push({
      category: "technical",
      severity: "critical",
      title: "Site sem HTTPS",
      evidence: "O site não usa conexão segura (HTTPS)",
      impact: "Google penaliza sites sem HTTPS e navegadores exibem alerta de 'não seguro' para visitantes",
    });
  }

  // Viewport / mobile responsiveness
  if (audits["viewport"]?.score === 0 || audits["viewport"]?.score == null) {
    const val = audits["viewport"]?.score;
    if (val !== undefined) {
      problems.push({
        category: "mobile",
        severity: "critical",
        title: "Site não é responsivo/mobile",
        evidence: "Tag <meta name=viewport> ausente ou incorreta",
        impact: "Usuários mobile (maioria dos visitantes) têm experiência ruim; Google penaliza no ranking mobile",
      });
    }
  }

  // Total Blocking Time
  const tbt = audits["total-blocking-time"];
  if (tbt?.numericValue != null && tbt.numericValue > 300) {
    const ms = Math.round(tbt.numericValue);
    problems.push({
      category: "performance",
      severity: ms > 600 ? "critical" : "warning",
      title: "Tempo de bloqueio excessivo (TBT)",
      evidence: `TBT: ${ms}ms (ideal: < 200ms)`,
      impact: "Página trava durante o carregamento, prejudicando a experiência do usuário e o Core Web Vitals do Google",
    });
  }

  // Largest Contentful Paint
  const lcp = audits["largest-contentful-paint"];
  if (lcp?.score != null && lcp.score < 0.9) {
    problems.push({
      category: "performance",
      severity: lcp.score < 0.5 ? "critical" : "warning",
      title: "Carregamento lento do conteúdo principal (LCP)",
      evidence: `LCP: ${lcp.displayValue || "alto"} (ideal: < 2,5s)`,
      impact: "Usuários abandonam páginas lentas; LCP é um dos sinais mais importantes do Google para ranking",
    });
  }

  // First Contentful Paint
  const fcp = audits["first-contentful-paint"];
  if (fcp?.score != null && fcp.score < 0.9) {
    problems.push({
      category: "performance",
      severity: fcp.score < 0.5 ? "critical" : "warning",
      title: "Primeira exibição de conteúdo lenta (FCP)",
      evidence: `FCP: ${fcp.displayValue || "alto"} (ideal: < 1,8s)`,
      impact: "Visitantes percebem o site como lento logo no primeiro acesso",
    });
  }

  // Speed Index
  const si = audits["speed-index"];
  if (si?.score != null && si.score < 0.9) {
    problems.push({
      category: "performance",
      severity: "warning",
      title: "Índice de velocidade baixo",
      evidence: `Speed Index: ${si.displayValue || "alto"} (ideal: < 3,4s)`,
      impact: "O site demora para exibir conteúdo visível ao usuário",
    });
  }

  // Render blocking resources
  const rbr = audits["render-blocking-resources"];
  if (rbr?.score != null && rbr.score < 1 && rbr.details?.items?.length > 0) {
    problems.push({
      category: "performance",
      severity: "warning",
      title: "Recursos bloqueantes de renderização",
      evidence: `${rbr.details.items.length} recurso(s) bloqueando o carregamento (CSS/JS)`,
      impact: "Scripts e estilos carregados antes do conteúdo atrasam a exibição da página",
    });
  }

  // Responsive images
  const ri = audits["uses-responsive-images"];
  if (ri?.score != null && ri.score < 1 && ri.details?.overallSavingsBytes > 50000) {
    const savedKb = Math.round(ri.details.overallSavingsBytes / 1024);
    problems.push({
      category: "performance",
      severity: "warning",
      title: "Imagens não otimizadas para mobile",
      evidence: `Economia potencial de ${savedKb}KB redimensionando imagens`,
      impact: "Imagens grandes aumentam o tempo de carregamento, especialmente em conexões móveis",
    });
  }

  // Document title
  if (audits["document-title"]?.score === 0) {
    problems.push({
      category: "seo",
      severity: "critical",
      title: "Título da página ausente ou duplicado",
      evidence: "Tag <title> ausente ou vazia",
      impact: "Google não sabe sobre o que é a página; prejudica diretamente o ranking de busca",
    });
  }

  // Meta description
  if (audits["meta-description"]?.score === 0) {
    problems.push({
      category: "seo",
      severity: "warning",
      title: "Meta descrição ausente",
      evidence: "Tag <meta name=description> ausente",
      impact: "Google exibe texto aleatório nos resultados de busca em vez de uma descrição atrativa do negócio",
    });
  }

  // Canonical
  if (audits["canonical"]?.score === 0) {
    problems.push({
      category: "seo",
      severity: "warning",
      title: "Tag canonical ausente",
      evidence: "Sem tag <link rel=canonical>",
      impact: "Google pode indexar versões duplicadas da URL, diluindo o posicionamento",
    });
  }

  // Robots.txt
  if (audits["robots-txt"]?.score === 0) {
    problems.push({
      category: "technical",
      severity: "warning",
      title: "robots.txt ausente ou inválido",
      evidence: "Arquivo robots.txt não encontrado ou com erros",
      impact: "Google pode ter dificuldade para rastrear e indexar o site corretamente",
    });
  }

  // Structured data
  const sd = audits["structured-data"];
  if (sd?.score === 0 || (sd && !sd.details?.items?.length)) {
    problems.push({
      category: "aeo",
      severity: "warning",
      title: "Sem dados estruturados (JSON-LD)",
      evidence: "Nenhum Schema.org markup encontrado",
      impact: "O site perde visibilidade nos rich results do Google (estrelas, horários, localização) que aumentam cliques em até 30%",
    });
  }

  return problems;
}

function buildVerdict(scores: DiagnosisResult["scores"], problems: Problem[]): string {
  const criticalCount = problems.filter((p) => p.severity === "critical").length;
  const totalCount = problems.length;

  if (scores.performance_mobile < 50) {
    return `Site extremamente lento no celular (nota ${scores.performance_mobile}/100) — Google penaliza sites lentos e a maioria dos clientes acessa pelo celular. Com ${totalCount} problema(s) identificado(s), o site atual está prejudicando a presença digital e a captação de clientes.`;
  }
  if (scores.seo < 70) {
    return `O site tem sérios problemas de SEO (nota ${scores.seo}/100) que impedem o Google de indexar e rankear corretamente. Com ${totalCount} problema(s) identificado(s), os clientes em potencial simplesmente não encontram o negócio no Google.`;
  }
  if (criticalCount > 0) {
    return `Com ${criticalCount} problema(s) crítico(s) e ${totalCount} problema(s) no total, o site atual está ativamente prejudicando a presença digital e a captação de novos clientes pelo Google.`;
  }
  return `Com ${totalCount} problema(s) identificado(s), o site atual está abaixo dos padrões mínimos esperados pelo Google, limitando a captação de clientes pela busca orgânica.`;
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
      return new Response(JSON.stringify({ error: "project_id obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch the existing site URL
    const { data: intake, error: intakeError } = await supabase
      .from("client_intake")
      .select("existing_site_url")
      .eq("project_id", project_id)
      .maybeSingle();

    if (intakeError || !intake) {
      return new Response(JSON.stringify({ error: "Projeto não encontrado" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const siteUrl = (intake as any).existing_site_url as string | null;
    if (!siteUrl) {
      return new Response(
        JSON.stringify({ error: "URL do site não cadastrada" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build PageSpeed API URL
    const apiKey = Deno.env.get("GOOGLE_PAGESPEED_API_KEY");
    const baseUrl = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
    const commonParams = `url=${encodeURIComponent(siteUrl)}&locale=pt_BR${apiKey ? `&key=${apiKey}` : ""}`;

    // Fetch mobile and desktop in parallel
    const [mobileRes, desktopRes] = await Promise.allSettled([
      fetch(`${baseUrl}?${commonParams}&strategy=mobile`),
      fetch(`${baseUrl}?${commonParams}&strategy=desktop`),
    ]);

    let mobileData: any = null;
    let desktopData: any = null;
    const errors: string[] = [];

    if (mobileRes.status === "fulfilled" && mobileRes.value.ok) {
      mobileData = await mobileRes.value.json();
    } else {
      errors.push("Falha ao obter dados mobile do PageSpeed");
    }

    if (desktopRes.status === "fulfilled" && desktopRes.value.ok) {
      desktopData = await desktopRes.value.json();
    } else {
      errors.push("Falha ao obter dados desktop do PageSpeed");
    }

    // Extract scores
    const mobileCategories = mobileData?.lighthouseResult?.categories ?? {};
    const desktopCategories = desktopData?.lighthouseResult?.categories ?? {};
    const mobileAudits = mobileData?.lighthouseResult?.audits ?? {};

    const scores: DiagnosisResult["scores"] = {
      performance_mobile: scoreToInt(mobileCategories?.performance?.score),
      performance_desktop: scoreToInt(desktopCategories?.performance?.score),
      seo: scoreToInt(mobileCategories?.seo?.score),
      accessibility: scoreToInt(mobileCategories?.accessibility?.score),
      best_practices: scoreToInt(mobileCategories?.["best-practices"]?.score),
    };

    const problems = extractProblems(mobileAudits);
    const verdict = buildVerdict(scores, problems);

    const result: DiagnosisResult = {
      url: siteUrl,
      generated_at: new Date().toISOString(),
      scores,
      problems,
      verdict,
    };

    // Save to database
    await supabase
      .from("client_intake")
      .update({ site_diagnosis: result as any })
      .eq("project_id", project_id);

    const response: any = { ...result };
    if (errors.length > 0) response.warnings = errors;

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("site-diagnosis error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Erro interno" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
