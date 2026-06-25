/**
 * brand.ts — Expansão de paleta flat → BrandTokens completos
 *
 * Recebe as 2 cores extraídas do logo (primary + accent) e os nomes
 * das fontes, e devolve o objeto BrandTokens de 19 campos, pronto para
 * colar em src/data/<slug>.ts.
 *
 * Não faz chamada de rede — é puramente determinístico (math HSL).
 * Para a visão via IA, use scripts/extract-brand.ts --logo <url>.
 */

import type { BrandTokens } from './types.ts';

// ── HSL helpers ──────────────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l   = (max + min) / 2;

  if (max === min) return [0, 0, Math.round(l * 100)];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r)      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else                h = ((r - g) / d + 4) / 6;

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  const hn = ((h % 360) + 360) % 360;
  const sn = Math.max(0, Math.min(100, s)) / 100;
  const ln = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((hn / 60) % 2) - 1));
  const m = ln - c / 2;

  let r = 0, g = 0, b = 0;
  if      (hn < 60)  { r = c; g = x; b = 0; }
  else if (hn < 120) { r = x; g = c; b = 0; }
  else if (hn < 180) { r = 0; g = c; b = x; }
  else if (hn < 240) { r = 0; g = x; b = c; }
  else if (hn < 300) { r = x; g = 0; b = c; }
  else               { r = c; g = 0; b = x; }

  const toHex = (n: number) =>
    Math.round((n + m) * 255).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Escurece (+deltaL negativo) ou clareia (+deltaL positivo) um hex. */
function shift(hex: string, deltaL: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.max(5, Math.min(95, l + deltaL)));
}

// ── Font registry ─────────────────────────────────────────────────────────────

const FONT_STACKS: Record<string, string> = {
  'Fraunces':           "'Fraunces', Georgia, serif",
  'DM Serif Display':   "'DM Serif Display', Georgia, serif",
  'Playfair Display':   "'Playfair Display', Georgia, serif",
  'Cormorant Garamond': "'Cormorant Garamond', Georgia, serif",
  'Lora':               "'Lora', Georgia, serif",
  'Inter':              "'Inter', system-ui, sans-serif",
  'DM Sans':            "'DM Sans', system-ui, sans-serif",
  'Nunito':             "'Nunito', system-ui, sans-serif",
  'Lato':               "'Lato', system-ui, sans-serif",
  'Poppins':            "'Poppins', system-ui, sans-serif",
  'Source Sans 3':      "'Source Sans 3', system-ui, sans-serif",
};

/** URLs pré-construídas para os pares de fontes usados no sistema. */
const GOOGLE_FONTS_PAIRS: Record<string, string> = {
  'Fraunces|Inter':
    'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,400;1,9..144,600&family=Inter:wght@400;500;600&display=swap',
  'DM Serif Display|DM Sans':
    'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap',
  'Playfair Display|Inter':
    'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap',
  'Cormorant Garamond|Lato':
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lato:wght@400;700&display=swap',
  'Lora|Inter':
    'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap',
  'Lora|DM Sans':
    'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap',
  'Playfair Display|Lato':
    'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@400;700&display=swap',
};

function buildGoogleFontsUrl(display: string, body: string): string {
  const key = `${display}|${body}`;
  if (GOOGLE_FONTS_PAIRS[key]) return GOOGLE_FONTS_PAIRS[key];
  // Fallback genérico — pesos básicos, funciona para qualquer fonte do Google Fonts
  const enc = (f: string) => f.replace(/ /g, '+');
  return `https://fonts.googleapis.com/css2?family=${enc(display)}:wght@400;600;700&family=${enc(body)}:wght@400;500;600&display=swap`;
}

// ── Tipo de entrada ───────────────────────────────────────────────────────────

export interface FlatPalette {
  /** Cor principal extraída do logo (hex, ex.: "#3E5C76") */
  primary:     string;
  /** Cor de destaque/accent (hex, ex.: "#C08552") */
  accent:      string;
  /** Nome da fonte display no Google Fonts (ex.: "Fraunces") */
  fontDisplay: string;
  /** Nome da fonte body no Google Fonts (ex.: "Inter") */
  fontBody:    string;
}

// ── Expansão determinística ───────────────────────────────────────────────────

/**
 * Expande a paleta flat do logo nos 19 tokens do BrandTokens.
 *
 * Calibrado contra src/data/dra-ana-mello.ts (conjunto completo real):
 *  primary #3E5C76 → primaryDark #2F4A60 (-7L) · primaryLight #5A7A9A (+13L)
 *  accent  #C08552 → accentDark  #8A5A33 (-17L) · accentLight #D4A070 (+9L)
 *  surface ramp: hsl(primaryH, baixo-S, L alto) — warm off-white tingido
 *  ink ramp:     hsl(primaryH, baixo-S, L baixo) — quase-preto tingido
 */
export function expandBrandTokens(flat: FlatPalette): BrandTokens {
  const { primary, accent, fontDisplay, fontBody } = flat;
  const [pH, pS] = hexToHsl(primary);
  const [aH]     = hexToHsl(accent);

  return {
    // Paleta primária
    primary,
    primaryDark:  shift(primary, -7),
    primaryLight: shift(primary, +13),

    // Paleta accent
    accent,
    accentDark:  shift(accent, -17),
    accentLight: shift(accent, +9),

    // Superfícies — warm off-white tingida com o hue do ACCENT (personalidade quente do logo).
    // Usar o hue do accent (e não do primary) produz superfícies creme/quentes mesmo quando
    // o primary é um azul/verde frio — calibrado contra dra-ana-mello (#C08552 H≈31°).
    surface:      hslToHex(aH, 15, 96),
    surfaceMuted: hslToHex(aH, 12, 91),
    surfaceDark:  hslToHex(aH, 10, 86),
    surfaceAlt:   hslToHex(aH, 11, 90),

    // Tinta — quase-preto com hue primário (estrutural/autoritativo), baixíssima saturação
    ink:      hslToHex(pH, 25, 15),
    inkMuted: hslToHex(pH, 10, 41),
    inkFaint: hslToHex(pH,  7, 58),

    // Estrutural
    border:  hslToHex(aH, 10, 81),   // borda também usa hue quente do accent
    breakBg: hslToHex(pH, pS, 24),   // seção de depoimentos: tom escuro do primary
    white:   '#FFFFFF',

    // Tipografia
    fontDisplayFamily: FONT_STACKS[fontDisplay] ?? `'${fontDisplay}', Georgia, serif`,
    fontBodyFamily:    FONT_STACKS[fontBody]    ?? `'${fontBody}', system-ui, sans-serif`,
    googleFontsUrl:    buildGoogleFontsUrl(fontDisplay, fontBody),
  };
}
