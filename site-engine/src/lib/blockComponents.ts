/**
 * blockComponents.ts — Resolver de componentes Astro por mood
 *
 * Usa import.meta.glob para carregar todos os blocos em tempo de build.
 * blocksForMood() seleciona qual variante usar por seção.
 *
 * Uso nas páginas:
 *   import { componentsForMood } from '../lib/blockComponents.ts';
 *   const B = componentsForMood(client.mood);
 *   <B.nav businessName="..." />
 *
 * Nota: o retorno usa `any` para compatibilidade com o renderer JSX do Astro.
 * A type-safety real está no contrato de props de cada bloco.
 */
import { blocksForMood } from './blocks.ts';
import type { Mood, BlockSection, BlockEntry } from './blocks.ts';

// Carrega todos os blocos eagerly em tempo de build (server-side)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modules = import.meta.glob('../components/blocks/**/*.astro', { eager: true }) as
  Record<string, { default: unknown }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentMap = Record<BlockSection, any>;

export function componentsForMood(mood: Mood): ComponentMap {
  const blockMap = blocksForMood(mood);
  const result = {} as ComponentMap;

  for (const [section, entry] of Object.entries(blockMap) as [BlockSection, BlockEntry][]) {
    const key = `../components/blocks/${entry.path}`;
    const mod = modules[key];
    if (!mod) {
      throw new Error(
        `[blockComponents] Bloco não encontrado: ${key}\n` +
        `  Seção: ${section} | Mood: ${mood}\n` +
        `  Disponíveis: ${Object.keys(modules).join(', ')}`
      );
    }
    result[section] = mod.default;
  }

  return result;
}
