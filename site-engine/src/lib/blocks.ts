/**
 * blocks.ts — Registry de blocos do JB Digital System
 *
 * Cada "mood" mapeia seção → variante de bloco preferida.
 * Ao compor uma página nova, importe os blocos do mood escolhido.
 *
 * Regra: adicionar aqui ao criar qualquer bloco novo.
 */

export type Mood = 'calm-trust' | 'fresh-clinical';

export type BlockSection =
  | 'nav'
  | 'hero'
  | 'painpoints'
  | 'about'
  | 'services'
  | 'process'
  | 'testimonials'
  | 'faq'
  | 'finalcta'
  | 'footer';

export interface BlockEntry {
  /** Nome descritivo da variante */
  name: string;
  /** Caminho relativo a src/components/blocks/ */
  path: string;
  /** Moods onde esta variante é preferida */
  moods: Mood[];
  /** Variante dentro da seção: 'A' = original do spike */
  variant: 'A' | 'B' | 'C';
}

export const BLOCKS: Record<BlockSection, BlockEntry[]> = {
  nav: [
    {
      name: 'NavStickyMinimal',
      path: 'nav/NavStickyMinimal.astro',
      moods: ['calm-trust', 'fresh-clinical'],
      variant: 'A',
    },
  ],

  hero: [
    {
      name: 'HeroEditorialSplit',
      path: 'hero/HeroEditorialSplit.astro',
      moods: ['calm-trust'],
      variant: 'A',
    },
    {
      name: 'HeroCenteredStatement',
      path: 'hero/HeroCenteredStatement.astro',
      moods: ['fresh-clinical'],
      variant: 'B',
    },
    {
      name: 'HeroMinimalistText',
      path: 'hero/HeroMinimalistText.astro',
      moods: ['calm-trust', 'fresh-clinical'],
      variant: 'C',
    },
  ],

  painpoints: [
    {
      name: 'PainPointsNumbered',
      path: 'painpoints/PainPointsNumbered.astro',
      moods: ['calm-trust'],
      variant: 'A',
    },
    {
      name: 'PainPointsSymptomCards',
      path: 'painpoints/PainPointsSymptomCards.astro',
      moods: ['fresh-clinical'],
      variant: 'B',
    },
  ],

  about: [
    {
      name: 'AboutPortraitOffset',
      path: 'about/AboutPortraitOffset.astro',
      moods: ['calm-trust'],
      variant: 'A',
    },
    {
      name: 'AboutSideBySide',
      path: 'about/AboutSideBySide.astro',
      moods: ['fresh-clinical'],
      variant: 'B',
    },
  ],

  services: [
    {
      name: 'ServicesTypoList',
      path: 'services/ServicesTypoList.astro',
      moods: ['calm-trust'],
      variant: 'A',
    },
    {
      name: 'ServicesGrid',
      path: 'services/ServicesGrid.astro',
      moods: ['fresh-clinical'],
      variant: 'B',
    },
  ],

  process: [
    {
      name: 'ProcessHorizontalSteps',
      path: 'process/ProcessHorizontalSteps.astro',
      moods: ['calm-trust'],
      variant: 'A',
    },
    {
      name: 'ProcessVerticalTimeline',
      path: 'process/ProcessVerticalTimeline.astro',
      moods: ['fresh-clinical'],
      variant: 'B',
    },
  ],

  testimonials: [
    {
      name: 'TestimonialsPullQuote',
      path: 'testimonials/TestimonialsPullQuote.astro',
      moods: ['calm-trust'],
      variant: 'A',
    },
    {
      name: 'TestimonialsCardGrid',
      path: 'testimonials/TestimonialsCardGrid.astro',
      moods: ['fresh-clinical'],
      variant: 'B',
    },
  ],

  faq: [
    {
      name: 'FAQNativeDetails',
      path: 'faq/FAQNativeDetails.astro',
      moods: ['calm-trust', 'fresh-clinical'],
      variant: 'A',
    },
  ],

  finalcta: [
    {
      name: 'FinalCTACenteredEditorial',
      path: 'finalcta/FinalCTACenteredEditorial.astro',
      moods: ['calm-trust'],
      variant: 'A',
    },
    {
      name: 'FinalCTASplitAction',
      path: 'finalcta/FinalCTASplitAction.astro',
      moods: ['fresh-clinical'],
      variant: 'B',
    },
  ],

  footer: [
    {
      name: 'FooterSimpleColumns',
      path: 'footer/FooterSimpleColumns.astro',
      moods: ['calm-trust', 'fresh-clinical'],
      variant: 'A',
    },
  ],
};

/** Retorna as entradas de bloco preferidas para um mood */
export function blocksForMood(mood: Mood): Partial<Record<BlockSection, BlockEntry>> {
  const result: Partial<Record<BlockSection, BlockEntry>> = {};
  for (const [section, entries] of Object.entries(BLOCKS) as [BlockSection, BlockEntry[]][]) {
    const preferred = entries.find((e) => e.moods.includes(mood)) ?? entries[0];
    result[section] = preferred;
  }
  return result;
}
