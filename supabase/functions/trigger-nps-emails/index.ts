import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Find projects published 7+ days ago that haven't received NPS email yet
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: projects, error: projError } = await supabaseAdmin
      .from("projects")
      .select("id, name, client_id, published_url, updated_at")
      .in("status", ["vercel_deployed_prod", "handoff_ready", "handoff_done", "monthly_active"])
      .lte("updated_at", sevenDaysAgo.toISOString());

    if (projError) throw projError;
    if (!projects || projects.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: "No eligible projects" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check which projects already had NPS emails sent
    const projectIds = projects.map((p) => p.id);
    const { data: existingLogs } = await supabaseAdmin
      .from("email_logs")
      .select("project_id")
      .in("project_id", projectIds)
      .eq("template", "nps_request");

    const alreadySent = new Set((existingLogs || []).map((l) => l.project_id));
    const eligible = projects.filter((p) => !alreadySent.has(p.id));

    if (eligible.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: "All eligible already emailed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get client info for eligible projects
    const clientIds = [...new Set(eligible.map((p) => p.client_id))];
    const { data: clients } = await supabaseAdmin
      .from("clients")
      .select("id, user_id, business_name");

    const clientMap = new Map((clients || []).map((c) => [c.id, c]));

    // Get profiles for emails
    const userIds = [...new Set((clients || []).map((c) => c.user_id))];
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("user_id, full_name");

    const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

    // Get emails from auth (via service role)
    const baseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    let sent = 0;

    for (const project of eligible) {
      const client = clientMap.get(project.client_id);
      if (!client) continue;

      const profile = profileMap.get(client.user_id);

      // Get user email via admin API
      const userRes = await fetch(`${baseUrl}/auth/v1/admin/users/${client.user_id}`, {
        headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
      });
      const userData = await userRes.json();
      const email = userData?.email;
      if (!email) continue;

      const clientName = profile?.full_name || client.business_name;
      const feedbackUrl = `${baseUrl.replace('.supabase.co', '')}/feedback?project=${project.id}`;

      // Send NPS email via send-lifecycle-email function
      const sendRes = await fetch(`${baseUrl}/functions/v1/send-lifecycle-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template: "nps_request",
          to_email: email,
          project_id: project.id,
          client_id: client.id,
          data: {
            clientName,
            projectName: project.name,
            feedbackUrl,
          },
        }),
      });

      if (sendRes.ok) sent++;
    }

    return new Response(JSON.stringify({ sent, total: eligible.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error triggering NPS emails:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
