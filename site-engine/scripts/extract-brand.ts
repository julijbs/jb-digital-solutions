/**
 * extract-brand.ts — CLI logo → BrandTokens
 *
 * MODO MANUAL (funciona agora, sem rede):
 *   tsx scripts/extract-brand.ts \
 *     --primary "#3E5C76" --accent "#C08552" \
 *     --font-display Fraunces --font-body Inter
 *
 * MODO VISÃO (requer LOVABLE_API_KEY no ambiente):
 *   tsx scripts/extract-brand.ts --logo https://example.com/logo.png \
 *     [--font-display Fraunces --font-body Inter]
 *   (--font-display/body são opcionais no modo visão; o modelo sugere fontes se omitidos)
 *
 * SAÍDA:
 *   Bloco `brand: { ... }` TypeScript, pronto para colar em src/data/<slug>.ts
 *
 * FONTES SUPORTADAS (stacks pré-montadas):
 *   Display: Fraunces · DM Serif Display · Playfair Display · Cormorant Garamond · Lora
 *   Body:    Inter · DM Sans · Nunito · Lato · Poppins · Source Sans 3
 *   Pares não listados geram URL genérica do Google Fonts (funciona, sem pesos extras).
 */

import { expandBrandTokens } from '../src/lib/brand.ts';

// ── Arg parsing ───────────────────────────────────────────────────────────────

const rawArgs = process.argv.slice(2);

function getArg(name: string): string | undefined {
  const idx = rawArgs.indexOf(`--${name}`);
  return idx !== -1 && rawArgs[idx + 1] ? rawArgs[idx + 1] : undefined;
}

const logoArg     = getArg('logo');
const primaryArg  = getArg('primary');
const accentArg   = getArg('accent');
const fontDisplay = getArg('font-display');
const fontBody    = getArg('font-body');

// ── Vision mode: Lovable AI Gateway (Gemini 2.5 Flash) ──────────────────────

interface VisionResult {
  primary:     string;
  accent:      string;
  suggestedDisplay?: string;
  suggestedBody?:    string;
}

async function visionExtract(logoUrl: string): Promise<VisionResult> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    console.error('\n⚠️  LOVABLE_API_KEY não encontrada no ambiente.');
    console.error('   Defina a variável e re-execute:');
    console.error('     LOVABLE_API_KEY=xxx tsx scripts/extract-brand.ts --logo <url>');
    console.error('   Ou use o modo manual (sem rede):');
    console.error('     tsx scripts/extract-brand.ts --primary "#hex" --accent "#hex"');
    process.exit(1);
  }

  console.error('🔍 Analisando logo via Gemini 2.5 Flash...\n');

  const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: 'Você é um designer expert em branding. Analise o logotipo e extraia informações de marca. Retorne APENAS um JSON válido, sem markdown, sem texto extra.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analise este logotipo e extraia:
1. A cor primária ideal para o site (tom mais dominante/característico do logo, em hex)
2. A cor accent/destaque (cor secundária ou complementar ao primário, em hex)
3. Um par de fontes Google Fonts que combine com a personalidade do logo
4. Uma frase curta descrevendo o mood visual

Retorne este JSON exato:
{
  "primary_color": "#hex",
  "accent_color": "#hex",
  "font_display": "Nome da fonte display (ex.: Fraunces, Playfair Display, DM Serif Display)",
  "font_body": "Nome da fonte body (ex.: Inter, DM Sans, Lato)",
  "brand_mood": "descrição em 1 frase"
}`,
            },
            {
              type: 'image_url',
              image_url: { url: logoUrl },
            },
          ],
        },
      ],
      max_tokens: 512,
      temperature: 0.2,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    console.error(`AI error ${resp.status}: ${text}`);
    process.exit(1);
  }

  const data = await resp.json();
  let raw: string = (data.choices?.[0]?.message?.content ?? '').trim();

  // Remove markdown fences se presentes
  if (raw.includes('```json')) raw = raw.split('```json')[1].split('```')[0].trim();
  else if (raw.includes('```')) raw = raw.split('```')[1].split('```')[0].trim();

  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error('Falha ao interpretar resposta da IA:');
    console.error(raw);
    process.exit(1);
  }

  console.error(`✓ primary : ${parsed.primary_color}`);
  console.error(`✓ accent  : ${parsed.accent_color}`);
  if (parsed.font_display) console.error(`✓ display : ${parsed.font_display}`);
  if (parsed.font_body)    console.error(`✓ body    : ${parsed.font_body}`);
  console.error(`✓ mood    : ${parsed.brand_mood}\n`);

  return {
    primary:          parsed.primary_color,
    accent:           parsed.accent_color,
    suggestedDisplay: parsed.font_display,
    suggestedBody:    parsed.font_body,
  };
}

// ── Output formatter ──────────────────────────────────────────────────────────

function printTokens(primary: string, accent: string, display: string, body: string): void {
  const tokens = expandBrandTokens({ primary, accent, fontDisplay: display, fontBody: body });

  // Use double quotes for values that contain single quotes (font-family stacks and URLs),
  // single quotes for plain hex values — matches the style of src/data/*.ts files.
  const lines = (Object.entries(tokens) as [string, string][])
    .map(([k, v]) => {
      const q = v.includes("'") ? '"' : "'";
      return `    ${k}: ${q}${v}${q},`;
    })
    .join('\n');

  console.log('  brand: {');
  console.log(lines);
  console.log('  },');
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Validate hex format
  const hexRe = /^#[0-9A-Fa-f]{6}$/;
  const validateHex = (val: string, name: string) => {
    if (!hexRe.test(val)) {
      console.error(`Erro: ${name} deve ser um hex de 6 dígitos (ex.: "#3E5C76"), recebido: "${val}"`);
      process.exit(1);
    }
  };

  if (logoArg) {
    if (!logoArg.startsWith('http')) {
      console.error('⚠️  O modo visão requer uma URL pública (https://...).');
      console.error('   Para imagens locais, faça upload para um serviço público primeiro,');
      console.error('   ou use o modo manual: --primary "#hex" --accent "#hex".');
      process.exit(1);
    }

    const result = await visionExtract(logoArg);
    const display = fontDisplay ?? result.suggestedDisplay ?? 'Fraunces';
    const body    = fontBody    ?? result.suggestedBody    ?? 'Inter';

    if (!result.primary || !result.accent) {
      console.error('IA não retornou cores válidas. Tente o modo manual.');
      process.exit(1);
    }

    printTokens(result.primary, result.accent, display, body);

  } else if (primaryArg && accentArg) {
    validateHex(primaryArg, '--primary');
    validateHex(accentArg,  '--accent');
    const display = fontDisplay ?? 'Fraunces';
    const body    = fontBody    ?? 'Inter';
    printTokens(primaryArg, accentArg, display, body);

  } else {
    console.error('JB Digital System — extract-brand CLI\n');
    console.error('Uso:');
    console.error('  Modo manual:  tsx scripts/extract-brand.ts --primary "#hex" --accent "#hex" [--font-display Nome] [--font-body Nome]');
    console.error('  Modo visão:   tsx scripts/extract-brand.ts --logo https://... [--font-display Nome] [--font-body Nome]');
    console.error('\nExemplo:');
    console.error('  tsx scripts/extract-brand.ts --primary "#3E5C76" --accent "#C08552" --font-display Fraunces --font-body Inter');
    console.error('\nFontes suportadas (stacks pré-montadas + Google Fonts URL):');
    console.error('  Display: Fraunces · DM Serif Display · Playfair Display · Cormorant Garamond · Lora');
    console.error('  Body:    Inter · DM Sans · Nunito · Lato · Poppins · Source Sans 3');
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
