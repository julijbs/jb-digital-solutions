/**
 * Edge Function: seo-places-search
 * Proxy para Google Places Text Search API — resolve CORS do browser.
 *
 * Requer secret: GOOGLE_MAPS_API_KEY (configurar no painel Supabase)
 * POST body: { query: string, maxResults?: number }
 * Retorna: { results: PlaceSearchResult[] }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PlaceSearchResult {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  userRatingsTotal?: number;
  googleMapsUrl: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { query, maxResults = 20 } = body;

    if (!query) {
      return new Response(JSON.stringify({ error: "Query parameter is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

    if (!apiKey) {
      console.error("GOOGLE_MAPS_API_KEY not configured");
      return new Response(
        JSON.stringify({
          error: "Google Maps API Key not configured",
          hint: "Set GOOGLE_MAPS_API_KEY in Supabase secrets",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const encodedQuery = encodeURIComponent(query);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}&key=${apiKey}&language=pt-BR`;

    console.log("🔍 seo-places-search:", query);

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "REQUEST_DENIED") {
      return new Response(
        JSON.stringify({
          error: "Google Places API request denied",
          message: data.error_message || "Check if billing is enabled",
          suggestion: "Enable billing at https://console.cloud.google.com",
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (data.status === "ZERO_RESULTS") {
      return new Response(JSON.stringify({ results: [] }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (data.status !== "OK") {
      return new Response(
        JSON.stringify({
          error: `Google Places API error: ${data.status}`,
          message: data.error_message,
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: PlaceSearchResult[] = data.results
      .slice(0, maxResults)
      .map((place: any) => ({
        placeId: place.place_id,
        name: place.name || "",
        address: place.formatted_address || "",
        rating: place.rating,
        userRatingsTotal: place.user_ratings_total,
        googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      }));

    console.log(`✅ Found ${results.length} results`);

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("seo-places-search error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error?.message || "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
