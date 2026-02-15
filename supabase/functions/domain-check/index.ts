import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

  try {
    const { domain } = await req.json();
    const baseDomain = domain.replace(/\.(com|net|org|co|br|io|dev|ai)$/i, "");
    const extensions = [".com", ".net", ".org", ".co"];

    const checkDomain = async (name: string, ext: string) => {
      const fullDomain = name + ext;
      try {
        const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/registrar/domains/${fullDomain}`,
          {
            headers: {
              "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        return {
          name: fullDomain,
          available: data.result?.available || false,
          price: data.result?.price || 0,
          currency: "USD",
          extension: ext,
        };
      } catch {
        return { name: fullDomain, available: false, price: 0, currency: "USD", extension: ext };
      }
    };

    const checks = extensions.map((ext) => checkDomain(baseDomain, ext));
    const results = await Promise.all(checks);

    const anyAvailable = results.some((r) => r.available);

    let suggestions: typeof results = [];
    if (!anyAvailable) {
      // Generate alternative names
      const short = baseDomain.length > 12 ? baseDomain.slice(0, 12) : baseDomain;
      const alts = [
        short + "site",
        short + "web",
        short + "app",
        short + "online",
        "get" + short,
        "go" + short,
      ];
      const unique = [...new Set(alts)].filter((a) => a !== baseDomain).slice(0, 4);
      const suggChecks = unique.flatMap((alt) => [".com", ".net"].map((ext) => checkDomain(alt, ext)));
      const suggResults = await Promise.all(suggChecks);
      suggestions = suggResults.filter((r) => r.available);
    }

    return new Response(
      JSON.stringify({ success: true, domains: results, suggestions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
