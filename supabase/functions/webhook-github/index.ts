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
    const payload = await req.json();

    console.log(`GitHub webhook received: event=${event}`);

    // TODO: Adicionar verificação de assinatura com GITHUB_WEBHOOK_SECRET
    // const signature = req.headers.get("x-hub-signature-256");

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
