#!/usr/bin/env tsx
/**
 * onboard-client.ts — Orquestrador de onboarding
 *
 * Lê intake do Supabase, gera ClientData via Claude, escreve src/data/<slug>.ts
 * e registra o cliente em src/data/index.ts.
 *
 * Uso:
 *   npm run onboard <project_id>
 *   tsx scripts/onboard-client.ts <project_id>
 *
 * Variáveis de ambiente necessárias em .env.local:
 *   SUPABASE_URL ou VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ANTHROPIC_API_KEY
 */

import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { intakeToClientData, slugify } from "./lib/intake-to-clientdata.ts";

// Load .env.local
const envPath = new URL("../../.env.local", import.meta.url).pathname;
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const [k, ...rest] = line.split("=");
    if (k && rest.length && !k.startsWith("#")) {
      process.env[k.trim()] = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
    }
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const projectId = process.argv[2];
if (!projectId) {
  console.error("Uso: npm run onboard <project_id>");
  process.exit(1);
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || "";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em site-engine/.env.local");
  process.exit(1);
}
if (!ANTHROPIC_KEY) {
  console.error("Defina ANTHROPIC_API_KEY em site-engine/.env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

// ── Helpers ──────────────────────────────────────────────────────────────────

function toVarName(slug: string): string {
  return slug.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());
}

function writeDataFile(slug: string, data: object): string {
  const varName = toVarName(slug);
  const filePath = path.join(ROOT, "src", "data", `${slug}.ts`);
  const content = `import type { ClientData } from '../lib/types.ts';\n\nexport const ${varName}: ClientData = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}

function updateIndex(slug: string): void {
  const indexPath = path.join(ROOT, "src", "data", "index.ts");
  let content = fs.readFileSync(indexPath, "utf-8");
  if (content.includes(`'${slug}'`)) {
    console.log(`   ℹ️  ${slug} já está no index.ts`);
    return;
  }
  const varName = toVarName(slug);
  const importLine = `import { ${varName} } from './${slug}.ts';`;
  const lastImport = content.lastIndexOf("\nimport ");
  const afterLastImport = content.indexOf("\n", lastImport + 1) + 1;
  content = content.slice(0, afterLastImport) + importLine + "\n" + content.slice(afterLastImport);
  const closing = content.lastIndexOf("};");
  content = content.slice(0, closing) + `  '${slug}': ${varName},\n` + content.slice(closing);
  fs.writeFileSync(indexPath, content, "utf-8");
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀 onboard-client — project_id: ${projectId}\n`);

  // 1. Fetch intake + project
  console.log("1/5  Buscando intake no Supabase...");
  const [{ data: intake, error: ie }, { data: project, error: pe }] = await Promise.all([
    supabase.from("client_intake").select("*").eq("project_id", projectId).single(),
    supabase.from("projects").select("*, clients(business_name, vertical, city, state)").eq("id", projectId).single(),
  ]);

  if (ie || !intake) { console.error("Erro ao buscar intake:", ie?.message); process.exit(1); }
  if (pe || !project) { console.error("Erro ao buscar projeto:", pe?.message); process.exit(1); }
  if (!intake.completed) console.warn("⚠️  Onboarding não concluído. Gerando assim mesmo...");

  // 2. Generate ClientData
  console.log("2/5  Gerando ClientData com Claude Sonnet 4.6...");
  const clientData = await intakeToClientData(intake, project, anthropic);
  const { slug } = clientData;
  console.log(`     slug: ${slug}`);

  // 3. Write data file
  console.log(`3/5  Escrevendo src/data/${slug}.ts...`);
  const filePath = writeDataFile(slug, clientData);
  console.log(`     ✓ ${filePath}`);

  // 4. Update index
  console.log("4/5  Atualizando src/data/index.ts...");
  updateIndex(slug);
  console.log(`     ✓ index.ts atualizado`);

  // 5. Update project status
  console.log("5/5  Atualizando status do projeto...");
  const { error: ue } = await supabase
    .from("projects")
    .update({ status: "content_ready", site_url: clientData.siteUrl })
    .eq("id", projectId);
  if (ue) console.warn("   ⚠️  Erro ao atualizar status:", ue.message);
  else console.log(`   ✓ status = content_ready · site_url = ${clientData.siteUrl}`);

  console.log(`\n✅ Concluído! Arquivo: site-engine/src/data/${slug}.ts`);
  console.log(`   Preview: cd site-engine && CLIENT=${slug} npm run dev\n`);
  console.log(`   ⚠️  Revise lat/lng (vazio) e ajuste prep dos bairros se necessário.\n`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
