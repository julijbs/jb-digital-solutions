import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Tier mapping — Essencial (R$600 setup + R$150/mês) | Premium (R$1.200 setup + R$350/mês)
const TIERS = {
  essencial: {
    setup_price_id: "price_1Tn3pZAtjEQC8UwgpNeWkETN",
    monthly_price_id: "price_1Tn3rJAtjEQC8Uwgd1xFvNDW",
    label: "JB Digital Essencial",
    setup_amount: 60000,
    monthly_amount: 15000,
  },
  premium: {
    setup_price_id: "price_1Tn3twAtjEQC8UwgH7plWPMp",
    monthly_price_id: "price_1Tn3wxAtjEQC8UwgC05O2k33",
    label: "JB Digital Premium",
    setup_amount: 120000,
    monthly_amount: 35000,
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated");

    const { tier, project_id, client_id } = await req.json();
    if (!tier || !project_id || !client_id) {
      throw new Error("Missing required fields: tier, project_id, client_id");
    }

    const tierConfig = TIERS[tier as keyof typeof TIERS];
    if (!tierConfig) throw new Error(`Invalid tier: ${tier}. Must be 'essencial' or 'premium'`);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Subscription mode: setup fee (one-time) + monthly recurring on first invoice
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        { price: tierConfig.setup_price_id, quantity: 1 },
        { price: tierConfig.monthly_price_id, quantity: 1 },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/billing?canceled=true`,
      metadata: {
        project_id,
        client_id,
        tier,
      },
    });

    // Create billing record as pending
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseAdmin.from("billing").insert({
      project_id,
      client_id,
      stripe_checkout_session_id: session.id,
      product_type: tier,
      amount: tierConfig.setup_amount + tierConfig.monthly_amount,
      status: "pending",
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
