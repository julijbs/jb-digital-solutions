/**
 * publish-site.ts — Gera um dist/<slug>/ por cliente registrado
 *
 * Uso: npm run publish
 * Cada build injeta CLIENT e SITE_URL via env → sitemap com domínio real.
 *
 * Requer tsx como devDependency para executar TypeScript direto.
 */
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolver __dirname para ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Importa o registro de clientes (TS puro, executado por tsx)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — tsx resolve o alias de path em runtime
const { clients } = await import('../src/data/index.ts') as { clients: Record<string, { siteUrl: string; businessName: string }> };

const entries = Object.entries(clients);
console.log(`\n🏗️  JB Digital System — publish-site`);
console.log(`   Clientes: ${entries.length} (${entries.map(([s]) => s).join(', ')})\n`);

let ok = 0;
let failed = 0;

for (const [slug, clientData] of entries) {
  const outDir = path.join(root, 'dist', slug);
  const siteUrl = clientData.siteUrl;
  const label = `${clientData.businessName} (${slug})`;

  console.log(`→ Construindo ${label}...`);
  try {
    execSync(
      `CLIENT=${slug} SITE_URL=${siteUrl} npx astro build --outDir ${outDir}`,
      { stdio: 'inherit', cwd: root }
    );
    console.log(`✅ ${label} → dist/${slug}/\n`);
    ok++;
  } catch {
    console.error(`❌ Falhou: ${label}\n`);
    failed++;
  }
}

console.log(`\n📦 Resultado: ${ok} ok / ${failed} falha(s)`);
if (failed > 0) process.exit(1);
