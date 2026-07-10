import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Oferta atual (desde 2026-07-10):
//   site_novo     — R$1.497 setup (uma vez) + Presença Ativa R$149/mês
//   gestao_google — add-on R$97/mês, sem setup
//
// essencial e premium ficam apenas para não quebrar cobranças legadas já em
// curso. Nenhuma tela oferece esses tiers. Não remova sem antes migrar as
// assinaturas ativas no Stripe.
const TIERS: Record<string, {
  setup_price_id: string | null;
  monthly_price_id: string;
  label: string;
  setup_amount: number;
  monthly_amount: number;
}> = {
  site_novo: {
    setup_price_id: "price_1TrVQPAtjEQC8UwgB7sIzEa5",
    monthly_price_id: "price_1TrVQPAtjEQC8UwgT5e74hlu",
    label: "Site Novo + Presença Ativa",
    setup_amount: 149700,
    monthly_amount: 14900,
  },
  gestao_google: {
    setup_price_id: null,
    monthly_price_id: "price_1TrVQPAtjEQC8UwgIYgb9l4l",
    label: "Gestão de Google (add-on)",
    setup_amount: 0,
    monthly_amount: 9700,
  },
  // ── legado ──
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

    const tierConfig = TIERS[tier as string];
    if (!tierConfig) throw new Error(`Invalid tier: ${tier}. Must be one of: ${Object.keys(TIERS).join(", ")}`);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Subscription mode: setup fee (one-time) + monthly recurring on first invoice.
    // Add-ons não têm setup — mandam só a recorrência.
    const lineItems = [
      ...(tierConfig.setup_price_id ? [{ price: tierConfig.setup_price_id, quantity: 1 }] : []),
      { price: tierConfig.monthly_price_id, quantity: 1 },
    ];

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/dashboard/billing?canceled=true`,
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
