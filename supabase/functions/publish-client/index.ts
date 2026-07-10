import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { encodeBase64, decodeBase64 } from "jsr:@std/encoding/base64";

// publish-client — commita o data file do lead no repo + registra no index.ts + dispara o deploy.
// SEGURANÇA: FAIL-CLOSED. Exige BUILD_SHARED_KEY setado E header x-build-key igual. Sem o segredo, recusa.
// Segredos: GITHUB_DEPLOY_TOKEN (Contents:write + Actions:write) e BUILD_SHARED_KEY (obrigatório).
// Uso: POST { slug, subdomain, ts_content } com header x-build-key: <BUILD_SHARED_KEY>

const OWNER = "julijbs", REPO = "jb-digital-solutions", BRANCH = "main";
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });

function gh(token: string) {
  return (path: string, init: RequestInit = {}) => fetch(`https://api.github.com${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "jb-publish-client", "Content-Type": "application/json", ...(init.headers || {}) },
  });
}
async function getFile(api: ReturnType<typeof gh>, path: string): Promise<{ sha?: string; text?: string }> {
  const r = await api(`/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`);
  if (r.status === 404) return {};
  if (!r.ok) throw new Error(`GET ${path}: ${r.status} ${(await r.text()).slice(0,200)}`);
  const d = await r.json();
  return { sha: d.sha, text: new TextDecoder().decode(decodeBase64(d.content.replace(/\n/g, ""))) };
}
async function putFile(api: ReturnType<typeof gh>, path: string, content: string, message: string, sha?: string) {
  const body: Record<string, unknown> = { message, content: encodeBase64(new TextEncoder().encode(content)), branch: BRANCH };
  if (sha) body.sha = sha;
  const r = await api(`/repos/${OWNER}/${REPO}/contents/${path}`, { method: "PUT", body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`PUT ${path}: ${r.status} ${(await r.text()).slice(0,200)}`);
  return await r.json();
}

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
  const tsContent = body.ts_content as string;
  if (!slug || !tsContent) return json({ ok: false, error: "missing slug ou ts_content" }, 400);

  const api = gh(token);
  const camel = slug.replace(/-([a-z0-9])/g, (_m, c) => c.toUpperCase());
  const steps: Record<string, unknown> = {};
  try {
    const dataPath = `site-engine/src/data/${slug}.ts`;
    const existing = await getFile(api, dataPath);
    await putFile(api, dataPath, tsContent, `feat(site): dados do cliente ${slug}`, existing.sha);
    steps.dataFile = "ok";

    const idxPath = `site-engine/src/data/index.ts`;
    const idx = await getFile(api, idxPath);
    let idxText = idx.text ?? "";
    if (!idxText.includes(`'${slug}'`)) {
      const marker = "export const clients: Record<string, ClientData> = {";
      const importLine = `import { ${camel} } from './${slug}.ts';`;
      idxText = idxText.replace(marker, `${importLine}\n\n${marker}\n  '${slug}': ${camel},`);
      await putFile(api, idxPath, idxText, `chore(site): registra ${slug} no index`, idx.sha);
      steps.indexRegister = "ok";
    } else { steps.indexRegister = "ja-existia"; }

    const disp = await api(`/repos/${OWNER}/${REPO}/dispatches`, {
      method: "POST",
      body: JSON.stringify({ event_type: "deploy-client", client_payload: { slug, subdomain, site_url: `https://${subdomain}.jbdigitalsystem.com` } }),
    });
    steps.dispatch = disp.ok ? "ok" : `falhou ${disp.status}`;
    if (!disp.ok) steps.dispatchDetail = (await disp.text()).slice(0, 200);

    return json({ ok: true, slug, subdomain, url: `https://${subdomain}.jbdigitalsystem.com`, steps });
  } catch (e) {
    return json({ ok: false, error: String(e), steps }, 500);
  }
});
