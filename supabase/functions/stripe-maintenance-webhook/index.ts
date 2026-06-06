import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
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
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!webhookSecret) {
      console.error("[STRIPE-WEBHOOK] STRIPE_WEBHOOK_SECRET not configured");
      return new Response(JSON.stringify({ error: "Webhook secret not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!sig) {
      return new Response(JSON.stringify({ error: "Missing stripe-signature header" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let event: Stripe.Event;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    console.log(`[STRIPE-WEBHOOK] Event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const projectId = session.metadata?.project_id;
        if (!projectId) {
          console.log("[STRIPE-WEBHOOK] No project_id in metadata, skipping");
          break;
        }

        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        // Get project to find client_id
        const { data: project } = await supabaseAdmin
          .from("projects")
          .select("client_id")
          .eq("id", projectId)
          .single();

        if (!project) {
          console.error("[STRIPE-WEBHOOK] Project not found:", projectId);
          break;
        }

        // Upsert maintenance subscription
        await supabaseAdmin.from("maintenance_subscriptions").upsert(
          {
            project_id: projectId,
            client_id: project.client_id,
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId,
            status: "active",
            started_at: new Date().toISOString(),
          },
          { onConflict: "project_id,client_id" }
        );

        console.log(`[STRIPE-WEBHOOK] Subscription activated for project ${projectId}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const { data: existing } = await supabaseAdmin
          .from("maintenance_subscriptions")
          .select("id")
          .eq("stripe_subscription_id", subscription.id)
          .maybeSingle();

        if (existing) {
          await supabaseAdmin
            .from("maintenance_subscriptions")
            .update({
              status: subscription.status === "active" ? "active" : subscription.status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              canceled_at: subscription.canceled_at
                ? new Date(subscription.canceled_at * 1000).toISOString()
                : null,
            })
            .eq("id", existing.id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await supabaseAdmin
          .from("maintenance_subscriptions")
          .update({
            status: "canceled",
            canceled_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        console.log(`[STRIPE-WEBHOOK] Subscription canceled: ${subscription.id}`);
        break;
      }

      default:
        console.log(`[STRIPE-WEBHOOK] Unhandled event: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[STRIPE-WEBHOOK] Error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
