import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-github-event, x-hub-signature-256, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const event = req.headers.get("x-github-event");
    const body = await req.text();

    // Verify HMAC-SHA256 signature from GitHub
    const webhookSecret = Deno.env.get("GITHUB_WEBHOOK_SECRET");
    const signature = req.headers.get("x-hub-signature-256");

    if (!webhookSecret) {
      console.error("GITHUB_WEBHOOK_SECRET not configured");
      return new Response(JSON.stringify({ error: "Webhook secret not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!signature) {
      return new Response(JSON.stringify({ error: "Missing x-hub-signature-256 header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(webhookSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
    const expected = "sha256=" + Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, "0")).join("");

    if (signature !== expected) {
      console.error("Invalid GitHub webhook signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = JSON.parse(body);
    console.log(`GitHub webhook received: event=${event}`);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let statusUpdate: string | null = null;
    let repoFullName: string | null = null;

    if (event === "repository" && payload.action === "created") {
      // Repositório criado — precisamos associar ao projeto via nome
      repoFullName = payload.repository?.full_name;
      statusUpdate = "repo_created";
    } else if (event === "push" && payload.ref === "refs/heads/main") {
      // Push na main
      repoFullName = payload.repository?.full_name;
      statusUpdate = "code_pushed";
    } else if (event === "pull_request" && payload.action === "closed" && payload.pull_request?.merged) {
      // PR mergeado na main
      repoFullName = payload.repository?.full_name;
      statusUpdate = "pr_merged";
    }

    if (statusUpdate && repoFullName) {
      const { data: project, error: findError } = await supabase
        .from("projects")
        .select("id, status")
        .eq("github_repo", repoFullName)
        .maybeSingle();

      if (findError) {
        console.error("Error finding project:", findError);
        throw findError;
      }

      if (project) {
        const { error: updateError } = await supabase
          .from("projects")
          .update({ status: statusUpdate })
          .eq("id", project.id);

        if (updateError) {
          console.error("Error updating project status:", updateError);
          throw updateError;
        }

        // Fetch client user_id for notification
        const { data: projFull } = await supabase
          .from("projects")
          .select("name, clients(user_id)")
          .eq("id", project.id)
          .single();

        if (projFull) {
          const clientUserId = (projFull.clients as any)?.user_id;
          if (clientUserId) {
            await supabase.from("notifications").insert({
              user_id: clientUserId,
              title: "Atualização do projeto",
              message: `Seu projeto "${projFull.name}" avançou para: ${statusUpdate}`,
              type: "status_change",
              link: "/dashboard/projects",
            });
          }
        }

        console.log(`Project ${project.id} status updated to ${statusUpdate}`);
      } else {
        console.log(`No project found for repo: ${repoFullName}`);
      }
    }

    return new Response(JSON.stringify({ ok: true, event, status: statusUpdate }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("webhook-github error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
