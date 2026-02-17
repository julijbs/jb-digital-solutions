import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAINTENANCE_PRODUCT_ID = "prod_Tz5RRdjUd6I2Ky";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not set");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Auth check - admin only
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No auth");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseAdmin.auth.getUser(token);
    if (!userData.user) throw new Error("Not authenticated");

    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .maybeSingle();
    if (roleData?.role !== "admin_jb") throw new Error("Not admin");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Get all subscriptions for the maintenance product
    const allSubscriptions = [];
    let hasMore = true;
    let startingAfter: string | undefined;

    while (hasMore) {
      const params: any = { limit: 100, status: "all" };
      if (startingAfter) params.starting_after = startingAfter;
      const subs = await stripe.subscriptions.list(params);
      
      // Filter for maintenance product
      const filtered = subs.data.filter(sub => 
        sub.items.data.some(item => item.price.product === MAINTENANCE_PRODUCT_ID)
      );
      allSubscriptions.push(...filtered);
      hasMore = subs.has_more;
      if (subs.data.length > 0) startingAfter = subs.data[subs.data.length - 1].id;
    }

    // Get all clients
    const { data: clients } = await supabaseAdmin.from("clients").select("id, business_name, user_id");
    const { data: profiles } = await supabaseAdmin.from("profiles").select("user_id, full_name");

    // Map emails to clients
    const clientsByEmail: Record<string, any> = {};
    if (clients && profiles) {
      for (const client of clients) {
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(client.user_id);
        if (authUser?.user?.email) {
          const profile = profiles.find(p => p.user_id === client.user_id);
          clientsByEmail[authUser.user.email] = {
            ...client,
            full_name: profile?.full_name,
            email: authUser.user.email,
          };
        }
      }
    }

    // Build subscription data with client info
    const subscriptionData = allSubscriptions.map(sub => {
      const customer = sub.customer as string;
      const email = (sub as any).customer_email || '';
      const client = clientsByEmail[email];
      
      return {
        id: sub.id,
        status: sub.status,
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        created: new Date(sub.created * 1000).toISOString(),
        canceled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : null,
        cancel_at_period_end: sub.cancel_at_period_end,
        customer_id: customer,
        client_name: client?.business_name || client?.full_name || 'Desconhecido',
        client_email: email,
      };
    });

    // Churn metrics
    const active = subscriptionData.filter(s => s.status === 'active').length;
    const canceled = subscriptionData.filter(s => s.status === 'canceled').length;
    const total = subscriptionData.length;
    const churnRate = total > 0 ? ((canceled / total) * 100).toFixed(1) : '0';
    const mrr = active * 397;

    return new Response(JSON.stringify({
      subscriptions: subscriptionData,
      metrics: { active, canceled, total, churnRate, mrr },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
