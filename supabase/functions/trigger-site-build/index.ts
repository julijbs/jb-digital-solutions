import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// trigger-site-build — dispara o GitHub Action (repository_dispatch) que builda e publica o site.
// SEGURANÇA: FAIL-CLOSED. Exige BUILD_SHARED_KEY setado E header x-build-key igual. Sem o segredo, recusa.
// Segredos: GITHUB_DEPLOY_TOKEN (actions:write) e BUILD_SHARED_KEY (obrigatório).
// Uso: POST { slug, subdomain, siteUrl } com header x-build-key: <BUILD_SHARED_KEY>

const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ ok: false, error: "use POST" }, 405);
  // FAIL-CLOSED
  const shared = Deno.env.get("BUILD_SHARED_KEY");
  if (!shared) return json({ ok: false, error: "BUILD_SHARED_KEY nao configurada — endpoint bloqueado por seguranca" }, 503);
  if (req.headers.get("x-build-key") !== shared) return json({ ok: false, error: "unauthorized" }, 401);

  const token = Deno.env.get("GITHUB_DEPLOY_TOKEN");
  if (!token) return json({ ok: false, error: "GITHUB_DEPLOY_TOKEN nao configurada" }, 500);

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch (_) { /* vazio */ }
  const slug = body.slug as string;
  const subdomain = (body.subdomain as string) || slug;
  const siteUrl = (body.siteUrl as string) || `https://${subdomain}.jbdigitalsystem.com`;
  if (!slug) return json({ ok: false, error: "missing slug" }, 400);

  const r = await fetch("https://api.github.com/repos/julijbs/jb-digital-solutions/dispatches", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "jb-trigger-site-build", "Content-Type": "application/json" },
    body: JSON.stringify({ event_type: "deploy-client", client_payload: { slug, subdomain, site_url: siteUrl } }),
  });
  const detail = r.ok ? "" : (await r.text()).slice(0, 300);
  return json({ ok: r.ok, status: r.status, detail });
});
