import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CLOUDFLARE_API_TOKEN = Deno.env.get("CLOUDFLARE_API_TOKEN")!;
const CLOUDFLARE_ACCOUNT_ID = Deno.env.get("CLOUDFLARE_ACCOUNT_ID")!;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  let projectId: string | undefined;

  try {
    const body = await req.json();
    const { domain, sessionId } = body;
    projectId = body.projectId;

    // 1. Update status to registering
    await supabase
      .from("projects")
      .update({ domain_status: "registering" })
      .eq("id", projectId);

    // 2. Register domain on Cloudflare
    const registerResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/registrar/domains/${domain}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auto_renew: true,
          privacy: true,
          years: 1,
        }),
      }
    );

    const registerData = await registerResponse.json();
    if (!registerData.success) {
      console.error("Cloudflare register error:", JSON.stringify(registerData));
      throw new Error("Falha ao registrar domínio no Cloudflare");
    }

    // 3. Create DNS zone
    await supabase
      .from("projects")
      .update({ domain_status: "dns_configuring" })
      .eq("id", projectId);

    const zoneResponse = await fetch(
      "https://api.cloudflare.com/client/v4/zones",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: { id: CLOUDFLARE_ACCOUNT_ID },
          name: domain,
          type: "full",
        }),
      }
    );

    const zoneData = await zoneResponse.json();
    const zoneId = zoneData.result?.id;

    // 4. Add DNS A record pointing to Vercel (76.76.21.21)
    if (zoneId) {
      try {
        await fetch(
          `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "A",
              name: "@",
              content: "76.76.21.21",
              proxied: true,
              ttl: 1,
            }),
          }
        );
        // Add www CNAME
        await fetch(
          `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "CNAME",
              name: "www",
              content: domain,
              proxied: true,
              ttl: 1,
            }),
          }
        );
        console.log(`DNS records created for ${domain}`);
      } catch (dnsErr) {
        console.error("DNS record creation error:", dnsErr);
      }
    }

    // 5. Update project as complete
    const renewalDate = new Date();
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);

    await supabase
      .from("projects")
      .update({
        custom_domain: domain,
        domain_status: "domain_ready",
        cloudflare_zone_id: zoneId,
        domain_payment_id: sessionId,
        domain_renewal_date: renewalDate.toISOString().split("T")[0],
        domain_auto_renew: true,
        site_url: `https://${domain}`,
      })
      .eq("id", projectId);

    // 6. Create transaction record
    await supabase
      .from("domain_transactions")
      .insert({
        project_id: projectId,
        domain,
        transaction_type: "purchase",
        amount: 100,
        payment_provider: "stripe",
        payment_id: sessionId,
        status: "paid",
      });

    // 7. Create renewal record
    await supabase
      .from("domain_renewals")
      .insert({
        project_id: projectId,
        domain,
        renewal_date: renewalDate.toISOString().split("T")[0],
        auto_renew: true,
      });

    // 8. Send email to client that domain is active
    try {
      const { data: project } = await supabase
        .from("projects")
        .select("name, client_id, clients(user_id, business_name)")
        .eq("id", projectId)
        .single();

      if (project?.clients) {
        const client = project.clients as any;
        const { data: authData } = await supabase.auth.admin.getUserById(client.user_id);
        const userEmail = authData?.user?.email;

        if (userEmail) {
          const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
          if (RESEND_API_KEY) {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "JB Digital <noreply@jbdigital.com.br>",
                to: [userEmail],
                subject: `🌐 Domínio ${domain} ativo!`,
                html: `
                  <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
                    <h2 style="color:#1a1a2e">Seu domínio está ativo! 🎉</h2>
                    <p>Olá, ${client.business_name}!</p>
                    <p>O domínio <strong>${domain}</strong> foi registrado e configurado com sucesso para o projeto <strong>${project.name}</strong>.</p>
                    <div style="margin:24px 0;padding:16px;background:#d1fae5;border-radius:8px">
                      <p style="margin:0;color:#065f46">✅ DNS configurado</p>
                      <p style="margin:4px 0 0;color:#065f46">✅ SSL ativo</p>
                      <p style="margin:4px 0 0;color:#065f46">✅ Renovação automática ativada</p>
                    </div>
                    <p>Seu site já está acessível em:</p>
                    <a href="https://${domain}" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Visitar ${domain} →</a>
                    <p style="margin-top:16px;color:#9ca3af;font-size:12px">Renovação: ${renewalDate.toLocaleDateString("pt-BR")}</p>
                    <p style="margin-top:32px;color:#9ca3af;font-size:12px">JB Digital — Presença Google Essencial</p>
                  </div>`,
              }),
            });

            await supabase.from("email_logs").insert({
              project_id: projectId,
              client_id: project.client_id,
              to_email: userEmail,
              template: "domain_active",
              subject: `Domínio ${domain} ativo!`,
              status: "sent",
            });
          }
        }

        // Create notification
        await supabase.from("notifications").insert({
          user_id: client.user_id,
          title: "Domínio ativo! 🌐",
          message: `Seu domínio ${domain} está configurado e acessível.`,
          type: "domain_active",
          link: "/dashboard",
        });
      }
    } catch (emailErr) {
      console.error("Email notification error:", emailErr);
      // Don't fail the whole operation for email errors
    }

    return new Response(
      JSON.stringify({ success: true, domain, zoneId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (projectId) {
      await supabase
        .from("projects")
        .update({ domain_status: "payment_pending" })
        .eq("id", projectId);
    }

    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
