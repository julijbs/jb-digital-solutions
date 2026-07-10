import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// psi-enrich — calcula o PageSpeed (mobile) dos leads com domínio próprio e grava psi_score no banco.
// Espelha o padrão do serp-mapa: disparado via net.http_post; escreve colunas; a rotina só lê.
// SEGURANÇA: FAIL-CLOSED. Exige PSI_SHARED_KEY setado E header x-psi-key igual. Sem o segredo, recusa.
// Secrets: PAGESPEED_API_KEY (obrigatório). PSI_SHARED_KEY (obrigatório).

const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req: Request) => {
  const shared = Deno.env.get("PSI_SHARED_KEY");
  if (!shared) return json({ ok: false, error: "PSI_SHARED_KEY nao configurada — endpoint bloqueado por seguranca" }, 503);
  if (req.headers.get("x-psi-key") !== shared) return json({ ok: false, error: "unauthorized" }, 401);

  const apiKey = Deno.env.get("PAGESPEED_API_KEY");
  if (!apiKey) return json({ ok: false, error: "PAGESPEED_API_KEY nao configurada" }, 500);

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch (_) { /* vazio */ }
  const limit = (body.limit as number) ?? 10;

  const { data: leads, error } = await supabase
    .from("seo_stage_0615")
    .select("empresa,url")
    .eq("tipo_site", "dominio_proprio")
    .is("psi_score", null)
    .not("url", "is", null)
    .limit(limit);
  if (error) return json({ ok: false, error: error.message }, 500);

  let updated = 0;
  const results: Array<Record<string, unknown>> = [];
  for (const l of leads ?? []) {
    try {
      const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(l.url as string)}&strategy=mobile&category=performance&key=${apiKey}`;
      const r = await fetch(api);
      if (!r.ok) { results.push({ empresa: l.empresa, error: `psi ${r.status}` }); continue; }
      const d = await r.json();
      const score = Math.round(((d.lighthouseResult?.categories?.performance?.score) ?? 0) * 100);
      await supabase.from("seo_stage_0615").update({ psi_score: score }).eq("empresa", l.empresa);
      updated++; results.push({ empresa: l.empresa, score });
    } catch (e) { results.push({ empresa: l.empresa, error: String(e) }); }
  }
  return json({ ok: true, updated, total: (leads ?? []).length, results });
});
