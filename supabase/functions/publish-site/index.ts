import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CF_ACCOUNT_ID = Deno.env.get("CLOUDFLARE_ACCOUNT_ID")!;
const CF_API_TOKEN = Deno.env.get("CLOUDFLARE_API_TOKEN")!;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, html, projectSlug } = await req.json();

    if (!projectId || !html) {
      return new Response(
        JSON.stringify({ error: "projectId e html são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    // 1. Save HTML to Supabase Storage
    const filePath = `${projectId}/index.html`;
    const htmlBlob = new Blob([html], { type: "text/html" });

    const { error: uploadError } = await sb.storage
      .from("generated-sites")
      .upload(filePath, htmlBlob, {
        contentType: "text/html",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw new Error(`Erro ao salvar HTML: ${uploadError.message}`);
    }

    const { data: publicUrlData } = sb.storage
      .from("generated-sites")
      .getPublicUrl(filePath);

    const storageUrl = publicUrlData.publicUrl;

    // 2. Deploy to Cloudflare Pages via Direct Upload API
    let publishedUrl = storageUrl; // fallback
    let cfDeployUrl = "";

    try {
      const cfProjectName = `jb-${(projectSlug || projectId).slice(0, 30).replace(/[^a-z0-9-]/g, "-")}`;

      // 2a. Ensure Cloudflare Pages project exists
      const checkProject = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${cfProjectName}`,
        {
          headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
        }
      );

      if (!checkProject.ok) {
        // Create project
        const createResp = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${CF_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: cfProjectName,
              production_branch: "main",
            }),
          }
        );

        if (!createResp.ok) {
          const err = await createResp.text();
          console.error("CF create project error:", err);
          throw new Error("Falha ao criar projeto no Cloudflare Pages");
        }
      }

      // 2b. Direct Upload deployment
      // Create FormData with the HTML file
      const formData = new FormData();
      formData.append("file:index.html", new Blob([html], { type: "text/html" }), "index.html");

      // Also create a _redirects file for SPA fallback
      const redirects = "/* /index.html 200";
      formData.append("file:_redirects", new Blob([redirects], { type: "text/plain" }), "_redirects");

      const deployResp = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${cfProjectName}/deployments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${CF_API_TOKEN}`,
          },
          body: formData,
        }
      );

      if (deployResp.ok) {
        const deployData = await deployResp.json();
        cfDeployUrl = deployData.result?.url || "";
        publishedUrl = cfDeployUrl || `https://${cfProjectName}.pages.dev`;
        console.log("Cloudflare deploy success:", publishedUrl);
      } else {
        const errText = await deployResp.text();
        console.error("CF deploy error:", errText);
        // Don't throw - fallback to storage URL
      }
    } catch (cfErr) {
      console.error("Cloudflare deployment failed, using storage URL:", cfErr);
      // Continue with storage URL as fallback
    }

    // 3. Update project record
    const { error: updateError } = await sb
      .from("projects")
      .update({
        site_html_path: filePath,
        site_url: publishedUrl,
        published_url: publishedUrl,
        status: "vercel_deployed_preview",
      })
      .eq("id", projectId);

    if (updateError) {
      console.error("Project update error:", updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        storageUrl,
        publishedUrl,
        cfDeployUrl,
        filePath,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("publish-site error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro ao publicar site" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
