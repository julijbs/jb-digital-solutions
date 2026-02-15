import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

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

    // 4. Update project as complete
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

    // 5. Create transaction record
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

    // 6. Create renewal record
    await supabase
      .from("domain_renewals")
      .insert({
        project_id: projectId,
        domain,
        renewal_date: renewalDate.toISOString().split("T")[0],
        auto_renew: true,
      });

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
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
