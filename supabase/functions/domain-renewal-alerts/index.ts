import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    // Find domains expiring in the next 30 days that haven't been notified
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const { data: renewals, error } = await supabase
      .from("domain_renewals")
      .select("*, projects(id, name, client_id, custom_domain, clients(business_name, user_id))")
      .eq("notified", false)
      .lte("renewal_date", thirtyDaysFromNow.toISOString().split("T")[0])
      .order("renewal_date", { ascending: true });

    if (error) throw error;
    if (!renewals || renewals.length === 0) {
      return new Response(JSON.stringify({ success: true, message: "No renewals to notify", count: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[RENEWAL-ALERTS] Found ${renewals.length} domains expiring soon`);

    let notifiedCount = 0;

    for (const renewal of renewals) {
      const project = renewal.projects as any;
      if (!project?.clients?.user_id) continue;

      // Get user email
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", project.clients.user_id)
        .single();

      // Create notification for admin
      await supabase.from("notifications").insert({
        user_id: project.clients.user_id,
        title: "Renovação de domínio próxima",
        message: `O domínio ${renewal.domain} expira em ${new Date(renewal.renewal_date).toLocaleDateString("pt-BR")}. ${renewal.auto_renew ? "Renovação automática ativada." : "Ação necessária!"}`,
        type: "domain_renewal",
        link: "/dashboard",
      });

      // Send email via send-lifecycle-email
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      if (RESEND_API_KEY) {
        // Get user email from auth
        const { data: authData } = await supabase.auth.admin.getUserById(project.clients.user_id);
        const userEmail = authData?.user?.email;

        if (userEmail) {
          const daysUntilExpiry = Math.ceil(
            (new Date(renewal.renewal_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );

          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "JB Digital <noreply@jbdigital.com.br>",
              to: [userEmail],
              subject: `⚠️ Domínio ${renewal.domain} expira em ${daysUntilExpiry} dias`,
              html: `
                <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
                  <h2 style="color:#1a1a2e">Renovação de Domínio</h2>
                  <p>Olá, ${profile?.full_name || "cliente"}!</p>
                  <p>O domínio <strong>${renewal.domain}</strong> do projeto <strong>${project.name}</strong> expira em <strong>${daysUntilExpiry} dias</strong> (${new Date(renewal.renewal_date).toLocaleDateString("pt-BR")}).</p>
                  ${renewal.auto_renew
                    ? '<div style="padding:16px;background:#d1fae5;border-radius:8px"><p style="margin:0;color:#065f46">✅ Renovação automática está ativada.</p></div>'
                    : '<div style="padding:16px;background:#fee2e2;border-radius:8px"><p style="margin:0;color:#991b1b">⚠️ Renovação automática está desativada. Entre em contato para renovar.</p></div>'
                  }
                  <p style="margin-top:32px;color:#9ca3af;font-size:12px">JB Digital — Presença Google Essencial</p>
                </div>`,
            }),
          });

          await supabase.from("email_logs").insert({
            project_id: project.id,
            client_id: project.client_id,
            to_email: userEmail,
            template: "domain_renewal_alert",
            subject: `Domínio ${renewal.domain} expira em ${daysUntilExpiry} dias`,
            status: "sent",
          });
        }
      }

      // Mark as notified
      await supabase
        .from("domain_renewals")
        .update({ notified: true })
        .eq("id", renewal.id);

      notifiedCount++;
    }

    return new Response(
      JSON.stringify({ success: true, notified: notifiedCount }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[RENEWAL-ALERTS] Error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
