/**
 * Edge Function: seo-place-details
 * Proxy para Google Places Details API — resolve CORS do browser.
 * Extrai dados completos de um estabelecimento incluindo cidade, estado e CEP.
 *
 * Requer secret: GOOGLE_MAPS_API_KEY (configurar no painel Supabase)
 * POST body: { placeId: string }
 * Retorna: PlaceDetails
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
    const { placeId } = body;

    if (!placeId) {
      return new Response(JSON.stringify({ error: "placeId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

    if (!apiKey) {
      console.error("GOOGLE_MAPS_API_KEY not configured");
      return new Response(
        JSON.stringify({
          error: "API Key not configured",
          hint: "Set GOOGLE_MAPS_API_KEY in Supabase secrets",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=pt-BR&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,address_components,geometry`;

    console.log("🔍 seo-place-details:", placeId);

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      console.error("Google Places Details error:", data.status, data.error_message);
      return new Response(
        JSON.stringify({
          error: `API error: ${data.status}`,
          message: data.error_message,
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const place = data.result;

    // Extrair cidade, estado e CEP dos address_components
    let cidade = "";
    let estado = "";
    let cep = "";

    if (place.address_components) {
      for (const component of place.address_components) {
        if (component.types.includes("locality")) {
          cidade = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
          estado = component.short_name;
        }
        if (component.types.includes("postal_code")) {
          cep = component.long_name;
        }
      }
    }

    const result = {
      empresa: place.name || "",
      endereco: place.formatted_address || "",
      cidade,
      estado,
      cep,
      telefone: place.formatted_phone_number || "",
      website: place.website || "",
      email: "", // Google Places API não fornece email
      latitude: place.geometry?.location?.lat || 0,
      longitude: place.geometry?.location?.lng || 0,
      rating: place.rating,
      totalRatings: place.user_ratings_total,
    };

    console.log("✅ seo-place-details:", result.empresa);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("seo-place-details error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error?.message || "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
