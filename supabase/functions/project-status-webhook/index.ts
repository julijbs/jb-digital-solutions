import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Map project status to email template
const STATUS_EMAIL_MAP: Record<string, string> = {
  content_ready: "onboarding_complete",
  lovable_site_generated: "site_ready_review",
  client_review: "site_ready_review",
  vercel_deployed_prod: "site_published",
  handoff_done: "site_published",
};

// Statuses that create a notification for the client
const NOTIFICATION_MAP: Record<string, { title: string; message: string }> = {
  content_ready: { title: "Conteúdo pronto!", message: "O conteúdo do seu projeto está pronto. Estamos criando seu site." },
  lovable_site_generated: { title: "Site gerado!", message: "Seu site foi gerado com sucesso. Em breve estará disponível para revisão." },
  client_review: { title: "Site pronto para revisão!", message: "Seu site está pronto! Acesse a página de Revisão para aprovar ou solicitar ajustes." },
  vercel_deployed_prod: { title: "Site publicado! 🎉", message: "Seu site foi publicado e está no ar!" },
  handoff_done: { title: "Projeto entregue! 🎉", message: "Seu projeto foi entregue com sucesso. Obrigado pela confiança!" },
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

    const { project_id, new_status, old_status, origin_url } = await req.json();
    if (!project_id || !new_status) throw new Error("Missing project_id or new_status");

    // Get project + client info
    const { data: project } = await supabaseAdmin
      .from("projects")
      .select("*, clients(id, user_id, business_name)")
      .eq("id", project_id)
      .single();

    if (!project || !project.clients) throw new Error("Project or client not found");

    const client = project.clients as any;

    // ===== AUTO-CREATE CLIENT REVIEW =====
    if (new_status === "client_review") {
      const { data: existingReview } = await supabaseAdmin
        .from("client_reviews")
        .select("id")
        .eq("project_id", project_id)
        .eq("status", "pending")
        .limit(1);

      if (!existingReview || existingReview.length === 0) {
        await supabaseAdmin.from("client_reviews").insert({
          project_id,
          status: "pending",
        });
        console.log(`[WEBHOOK] Auto-created client_review for project ${project_id}`);
      }
    }

    // ===== CREATE NOTIFICATION =====
    const notif = NOTIFICATION_MAP[new_status];
    if (notif) {
      await supabaseAdmin.from("notifications").insert({
        user_id: client.user_id,
        title: notif.title,
        message: notif.message,
        type: "project_update",
        link: new_status === "client_review" ? "/dashboard/review" : "/dashboard/projects",
      });
      console.log(`[WEBHOOK] Notification created for user ${client.user_id}`);
    }

    // ===== SEND EMAIL =====
    const template = STATUS_EMAIL_MAP[new_status];
    if (!template) {
      return new Response(JSON.stringify({ skipped: true, message: `No email for status: ${new_status}`, reviewCreated: new_status === "client_review" }), {
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
    
    // Use the origin URL from the request, or the preview URL, or production URL
    const dashboardUrl = origin_url || Deno.env.get("APP_URL") || "https://id-preview--b1bbd5ec-f6d3-4448-a1bf-92ebf61c21db.lovable.app";

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

    return new Response(JSON.stringify({ sent: true, template, result, reviewCreated: new_status === "client_review" }), {
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
