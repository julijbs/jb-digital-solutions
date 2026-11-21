import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Método não permitido." }, 405);

  try {
    const { slug, token } = await req.json() as { slug?: unknown; token?: unknown };
    if (
      typeof slug !== "string" ||
      !/^[a-z0-9._-]{1,60}$/.test(slug) ||
      typeof token !== "string" ||
      !/^[0-9a-f]{64}$/.test(token)
    ) {
      return jsonResponse({ error: "Esta prévia não está disponível." }, 404);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      throw new Error("Configuração do banco de dados ausente.");
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("site_prospect_previews")
      .select("html")
      .eq("slug", slug)
      .eq("token_hash", await hashToken(token))
      .is("revoked_at", null)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (error) {
      console.error("Public preview lookup failed:", error.code);
      throw new Error("Não foi possível carregar esta prévia.");
    }
    if (!data?.html) {
      return jsonResponse({ error: "Esta prévia expirou ou não está mais disponível." }, 404);
    }

    return jsonResponse({ html: data.html });
  } catch (error) {
    console.error(
      "get-prospect-preview failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return jsonResponse({ error: "Não foi possível carregar esta prévia." }, 500);
  }
});
