import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

class HttpError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function requiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new HttpError(`Configuração ausente no servidor: ${name}`, 500);
  return value;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Método não permitido." }, 405);

  try {
    const authorization = req.headers.get("Authorization");
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) throw new HttpError("É necessário entrar como administradora.", 401);

    const supabaseUrl = requiredEnv("SUPABASE_URL");
    const supabaseAdmin = createClient(
      supabaseUrl,
      requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) throw new HttpError("Sessão inválida ou expirada.", 401);

    const { data: role, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin_jb")
      .maybeSingle();
    if (roleError) throw new HttpError("Não foi possível validar a permissão administrativa.", 500);
    if (!role) throw new HttpError("Acesso restrito à administração.", 403);

    const payload = await req.json() as {
      projectId?: unknown;
      html?: unknown;
      projectSlug?: unknown;
    };
    if (
      typeof payload.projectId !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(payload.projectId) ||
      typeof payload.html !== "string" ||
      !payload.html.trim() ||
      payload.html.length > 2_000_000 ||
      typeof payload.projectSlug !== "string"
    ) {
      throw new HttpError("Dados inválidos para publicar o site.", 400);
    }

    const projectSlug = payload.projectSlug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30);
    if (!projectSlug) throw new HttpError("Slug do projeto inválido.", 400);

    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .select("id")
      .eq("id", payload.projectId)
      .maybeSingle();
    if (projectError) throw new HttpError("Não foi possível validar o projeto.", 500);
    if (!project) throw new HttpError("Projeto não encontrado.", 404);

    const accountId = requiredEnv("CLOUDFLARE_ACCOUNT_ID");
    const apiToken = requiredEnv("CLOUDFLARE_API_TOKEN");
    const domain = Deno.env.get("CF_DOMAIN") || "jbdigitalsystem.com";
    const cfProjectName = `jb-${projectSlug}`;
    const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${cfProjectName}`;
    const filePath = `${payload.projectId}/index.html`;
    const htmlBlob = new Blob([payload.html], { type: "text/html" });

    const { error: uploadError } = await supabaseAdmin.storage
      .from("generated-sites")
      .upload(filePath, htmlBlob, {
        contentType: "text/html",
        upsert: true,
      });
    if (uploadError) {
      console.error("Site HTML storage upload failed:", uploadError.message);
      throw new HttpError("Não foi possível salvar o HTML do site.", 502);
    }

    const authHeaders = { Authorization: `Bearer ${apiToken}` };
    const projectCheck = await fetch(baseUrl, { headers: authHeaders });
    if (projectCheck.status === 404) {
      const createResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`,
        {
          method: "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({ name: cfProjectName, production_branch: "main" }),
        },
      );
      let projectCreated = false;
      if (createResponse.ok) {
        const createData = await createResponse.json() as { success?: boolean };
        projectCreated = createData.success === true;
      }
      if (!projectCreated) {
        const verifyResponse = await fetch(baseUrl, { headers: authHeaders });
        if (!verifyResponse.ok) {
          console.error("Cloudflare project creation failed:", createResponse.status);
          throw new HttpError("O Cloudflare não conseguiu criar o projeto de publicação.", 502);
        }
        const verifyData = await verifyResponse.json() as { success?: boolean };
        if (verifyData.success !== true) {
          throw new HttpError("O Cloudflare não confirmou a criação do projeto.", 502);
        }
      }
    } else if (!projectCheck.ok) {
      console.error("Cloudflare project lookup failed:", projectCheck.status);
      throw new HttpError("Não foi possível validar o projeto no Cloudflare.", 502);
    } else {
      const projectData = await projectCheck.json() as { success?: boolean };
      if (projectData.success !== true) {
        throw new HttpError("Não foi possível validar o projeto no Cloudflare.", 502);
      }
    }

    const formData = new FormData();
    formData.append(
      "file:index.html",
      new Blob([payload.html], { type: "text/html" }),
      "index.html",
    );
    formData.append(
      "file:_redirects",
      new Blob(["/* /index.html 200"], { type: "text/plain" }),
      "_redirects",
    );

    const deployResponse = await fetch(`${baseUrl}/deployments`, {
      method: "POST",
      headers: authHeaders,
      body: formData,
    });
    if (!deployResponse.ok) {
      console.error("Cloudflare Pages deployment failed:", deployResponse.status);
      throw new HttpError("O Cloudflare não confirmou a publicação do site.", 502);
    }

    const deployData = await deployResponse.json() as {
      success?: boolean;
      result?: { url?: string };
    };
    const cfDeployUrl = deployData.result?.url;
    let deployHost = "";
    try {
      deployHost = cfDeployUrl ? new URL(cfDeployUrl).hostname : "";
    } catch {
      deployHost = "";
    }
    if (
      deployData.success !== true ||
      typeof cfDeployUrl !== "string" ||
      deployHost.split(".").slice(-2).join(".") !== "pages.dev" ||
      !cfDeployUrl.startsWith("https://")
    ) {
      throw new HttpError("O Cloudflare não retornou uma URL de publicação válida.", 502);
    }

    let publishedUrl = cfDeployUrl;
    let domainWarning: string | null = null;
    const customDomain = `${projectSlug}.${domain}`;
    const domainResponse = await fetch(`${baseUrl}/domains`, {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ name: customDomain }),
    });
    if (domainResponse.ok) {
      const domainData = await domainResponse.json() as { success?: boolean };
      if (domainData.success) {
        publishedUrl = `https://${customDomain}`;
      } else {
        domainWarning = "O domínio personalizado ainda não foi confirmado.";
      }
    } else {
      domainWarning = "O domínio personalizado ainda não foi confirmado.";
      console.error("Cloudflare custom domain setup failed:", domainResponse.status);
    }

    const { error: updateError } = await supabaseAdmin
      .from("projects")
      .update({
        site_html_path: filePath,
        site_url: publishedUrl,
        published_url: publishedUrl,
        status: "vercel_deployed_preview",
      })
      .eq("id", payload.projectId);
    if (updateError) {
      console.error("Project publish status update failed:", updateError.message);
      throw new HttpError("O site foi enviado, mas não foi possível salvar o status da publicação.", 500);
    }

    return jsonResponse({
      success: true,
      publishedUrl,
      cfDeployUrl,
      filePath,
      domainWarning,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Erro inesperado ao publicar site.";
    console.error("publish-site failed:", message);
    return jsonResponse({ success: false, error: message }, status);
  }
});
