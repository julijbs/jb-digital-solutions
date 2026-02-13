import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-vercel-signature, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();

    console.log(`Vercel webhook received: type=${payload.type}`);

    // TODO: Adicionar verificação de assinatura com VERCEL_WEBHOOK_SECRET
    // const signature = req.headers.get("x-vercel-signature");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let statusUpdate: string | null = null;
    const vercelProjectId = payload.payload?.project?.id || payload.projectId;

    // Vercel deployment events
    // https://vercel.com/docs/webhooks/webhooks-api
    if (payload.type === "deployment.created") {
      statusUpdate = "vercel_deploying";
    } else if (payload.type === "deployment.succeeded") {
      // Verificar se é produção
      const target = payload.payload?.deployment?.meta?.target || payload.payload?.target;
      statusUpdate = target === "production" ? "vercel_deployed_prod" : "vercel_deployed_preview";
    } else if (payload.type === "deployment.error" || payload.type === "deployment.canceled") {
      statusUpdate = "vercel_deploy_failed";
    }

    if (statusUpdate && vercelProjectId) {
      const { data: project, error: findError } = await supabase
        .from("projects")
        .select("id, status")
        .eq("vercel_project_id", vercelProjectId)
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
              title: "Deploy atualizado",
              message: `O deploy do projeto "${projFull.name}" foi atualizado: ${statusUpdate}`,
              type: "deploy",
              link: "/dashboard/projects",
            });
          }
        }

        console.log(`Project ${project.id} status updated to ${statusUpdate}`);
      } else {
        console.log(`No project found for vercel_project_id: ${vercelProjectId}`);
      }
    }

    return new Response(JSON.stringify({ ok: true, type: payload.type, status: statusUpdate }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("webhook-vercel error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
