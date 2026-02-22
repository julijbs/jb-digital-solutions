import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// RDAP servers by TLD
const RDAP_SERVERS: Record<string, string> = {
  ".com": "https://rdap.verisign.com/com/v1",
  ".net": "https://rdap.verisign.com/net/v1",
  ".org": "https://rdap.org/org/v1",
  ".co": "https://rdap.nic.co/v1",
};

// Approximate registration prices in USD per TLD
const TLD_PRICES: Record<string, number> = {
  ".com": 9.77,
  ".net": 10.77,
  ".org": 9.93,
  ".co": 11.99,
};

async function checkDomainAvailability(fullDomain: string, ext: string): Promise<{
  name: string;
  available: boolean;
  price: number;
  currency: string;
  extension: string;
}> {
  const rdapServer = RDAP_SERVERS[ext];
  if (!rdapServer) {
    return { name: fullDomain, available: false, price: 0, currency: "USD", extension: ext };
  }

  try {
    const response = await fetch(`${rdapServer}/domain/${fullDomain}`, {
      headers: { "Accept": "application/rdap+json" },
    });

    // 404 = domain not found = available
    if (response.status === 404 || response.status === 400) {
      return {
        name: fullDomain,
        available: true,
        price: TLD_PRICES[ext] || 10,
        currency: "USD",
        extension: ext,
      };
    }

    // 200 = domain exists = not available
    if (response.ok) {
      return { name: fullDomain, available: false, price: 0, currency: "USD", extension: ext };
    }

    // Other errors - assume unavailable
    return { name: fullDomain, available: false, price: 0, currency: "USD", extension: ext };
  } catch (err) {
    console.error(`RDAP check failed for ${fullDomain}:`, err);
    return { name: fullDomain, available: false, price: 0, currency: "USD", extension: ext };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domain } = await req.json();
    const baseDomain = domain.replace(/\.(com|net|org|co|br|io|dev|ai)$/i, "").toLowerCase().trim();
    const extensions = [".com", ".net", ".org", ".co"];

    const checks = extensions.map((ext) => checkDomainAvailability(baseDomain + ext, ext));
    const results = await Promise.all(checks);

    const anyAvailable = results.some((r) => r.available);

    let suggestions: typeof results = [];
    if (!anyAvailable) {
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
      const suggChecks = unique.flatMap((alt) =>
        [".com", ".net"].map((ext) => checkDomainAvailability(alt + ext, ext))
      );
      const suggResults = await Promise.all(suggChecks);
      suggestions = suggResults.filter((r) => r.available);
    }

    return new Response(
      JSON.stringify({ success: true, domains: results, suggestions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
