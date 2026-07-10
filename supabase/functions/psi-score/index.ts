import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// psi-score — retorna o score de PageSpeed Insights (0-100) + métricas de um site.
// Segredos (Supabase → Edge Functions → Secrets):
//   PAGESPEED_API_KEY  (obrigatório) — API key simples do Google (AIza...), restrita à PageSpeed Insights API.
//   PSI_SHARED_KEY     (obrigatório) — FAIL-CLOSED: exige header x-psi-key igual. Sem o segredo, recusa.
// Uso: POST { "url": "https://exemplo.com", "strategy": "mobile" }

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-psi-key, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const shared = Deno.env.get("PSI_SHARED_KEY");
  if (!shared) return json({ ok: false, error: "PSI_SHARED_KEY nao configurada — endpoint bloqueado por seguranca" }, 503);
  if (req.headers.get("x-psi-key") !== shared) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  const apiKey = Deno.env.get("PAGESPEED_API_KEY");
  if (!apiKey) return json({ ok: false, error: "PAGESPEED_API_KEY nao configurada" }, 500);

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch (_) { /* corpo vazio */ }
  const url = (body.url as string) || "";
  const strategy = (body.strategy as string) || "mobile";
  if (!url) return json({ ok: false, error: "missing url" }, 400);

  const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${encodeURIComponent(strategy)}&category=performance&key=${apiKey}`;

  try {
    const r = await fetch(api);
    if (!r.ok) {
      const t = await r.text();
      return json({ ok: false, error: `PSI ${r.status}`, detail: t.slice(0, 300) }, 502);
    }
    const d = await r.json();
    const lr = d.lighthouseResult ?? {};
    const score = Math.round(((lr.categories?.performance?.score) ?? 0) * 100);
    const a = lr.audits ?? {};
    return json({
      ok: true,
      url,
      strategy,
      score,
      fcp: a["first-contentful-paint"]?.displayValue ?? null,
      lcp: a["largest-contentful-paint"]?.displayValue ?? null,
      si: a["speed-index"]?.displayValue ?? null,
    });
  } catch (e) {
    return json({ ok: false, error: String(e) }, 500);
  }
});
