import { getOneTimeService } from "../_shared/site-offer.ts";
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

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } }
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

    const offer = getOneTimeService(tier);
    if (!offer) throw new Error("Serviço avulso inválido.");

    // Validate ownership before creating a charge with privileged credentials.
    const { data: client } = await supabaseClient.from("clients").select("id").eq("id", client_id).eq("user_id", user.id).maybeSingle();
    const { data: project } = await supabaseClient.from("projects").select("id").eq("id", project_id).eq("client_id", client_id).maybeSingle();
    if (!client || !project) throw new Error("Cliente ou projeto não autorizado.");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const lineItems = [{
      price_data: {
        currency: "brl",
        unit_amount: offer.cents,
        product_data: { name: offer.name + " (pagamento único)" },
      },
      quantity: 1,
    }];

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "payment",
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

    const { error: billingError } = await supabaseAdmin.from("billing").insert({
      project_id,
      client_id,
      stripe_checkout_session_id: session.id,
      product_type: tier,
      amount: offer.cents,
      status: "pending",
    });

    if (billingError) {
      await stripe.checkout.sessions.expire(session.id);
      throw new Error("Não foi possível registrar a cobrança. Tente novamente.");
    }

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
