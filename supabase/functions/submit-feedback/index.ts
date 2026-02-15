import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

    const { client_id, project_id, type, nps_score, comment, is_public } = await req.json();

    if (!client_id || !project_id || !type) {
      throw new Error("Missing required fields: client_id, project_id, type");
    }

    // Validate client and project exist
    const { data: project } = await supabaseAdmin
      .from("projects")
      .select("id, client_id")
      .eq("id", project_id)
      .eq("client_id", client_id)
      .maybeSingle();

    if (!project) throw new Error("Invalid project or client");

    const { data, error } = await supabaseAdmin.from("client_feedback").insert({
      client_id,
      project_id,
      type,
      nps_score: nps_score ?? null,
      comment: comment || null,
      is_public: is_public || false,
    }).select().single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("submit-feedback error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
