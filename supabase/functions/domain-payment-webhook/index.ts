import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    return new Response(JSON.stringify({ error: "Webhook secret not configured" }), { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig!, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    // Only process domain purchases
    if (metadata.transactionType !== "purchase" || !metadata.domain) {
      return new Response(JSON.stringify({ received: true, skipped: true }), { status: 200 });
    }

    const { domain, projectId, userId, domainPriceUSD } = metadata;

    console.log(`[DOMAIN-WEBHOOK] Payment confirmed for domain: ${domain}, project: ${projectId}`);

    try {
      // 1. Update project status
      await supabase
        .from("projects")
        .update({ domain_status: "payment_processing" })
        .eq("id", projectId);

      // 2. Call domain-register function
      const registerRes = await fetch(
        `${Deno.env.get("SUPABASE_URL")}/functions/v1/domain-register`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            domain,
            projectId,
            sessionId: session.id,
          }),
        }
      );

      const registerData = await registerRes.json();
      if (!registerData.success) {
        console.error("[DOMAIN-WEBHOOK] Registration failed:", registerData.error);
        await supabase
          .from("projects")
          .update({ domain_status: "registering" })
          .eq("id", projectId);
      }

      console.log(`[DOMAIN-WEBHOOK] Domain ${domain} registered successfully`);
    } catch (err) {
      console.error("[DOMAIN-WEBHOOK] Error processing domain:", err);
      await supabase
        .from("projects")
        .update({ domain_status: "payment_processing" })
        .eq("id", projectId);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
