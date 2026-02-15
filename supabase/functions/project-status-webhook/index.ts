import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Map project status to email template
const STATUS_EMAIL_MAP: Record<string, string> = {
  client_review: "site_ready_review",
  vercel_deployed_prod: "site_published",
  handoff_done: "site_published",
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

    const { project_id, new_status, old_status } = await req.json();
    if (!project_id || !new_status) throw new Error("Missing project_id or new_status");

    const template = STATUS_EMAIL_MAP[new_status];
    if (!template) {
      return new Response(JSON.stringify({ skipped: true, message: `No email for status: ${new_status}` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Avoid duplicate emails for same project+template
    const { data: existingLog } = await supabaseAdmin
      .from("email_logs")
      .select("id")
      .eq("project_id", project_id)
      .eq("template", template)
      .limit(1);

    if (existingLog && existingLog.length > 0) {
      return new Response(JSON.stringify({ skipped: true, message: "Email already sent for this milestone" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get project + client info
    const { data: project } = await supabaseAdmin
      .from("projects")
      .select("*, clients(id, user_id, business_name)")
      .eq("id", project_id)
      .single();

    if (!project || !project.clients) throw new Error("Project or client not found");

    const client = project.clients as any;

    // Get user email
    const baseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const userRes = await fetch(`${baseUrl}/auth/v1/admin/users/${client.user_id}`, {
      headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
    });
    const userData = await userRes.json();
    const email = userData?.email;
    if (!email) throw new Error("User email not found");

    // Get profile name
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("user_id", client.user_id)
      .maybeSingle();

    const clientName = profile?.full_name || client.business_name;
    const dashboardUrl = `${baseUrl.replace(".supabase.co", "")}`;

    // Send email
    const sendRes = await fetch(`${baseUrl}/functions/v1/send-lifecycle-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template,
        to_email: email,
        project_id,
        client_id: client.id,
        data: {
          clientName,
          projectName: project.name,
          siteUrl: project.site_url,
          publishedUrl: project.published_url,
          dashboardUrl,
        },
      }),
    });

    const result = await sendRes.json();

    return new Response(JSON.stringify({ sent: true, template, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("project-status-webhook error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
