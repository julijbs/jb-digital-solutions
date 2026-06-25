import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title:         z.string().max(65),
    description:   z.string().max(160),
    vertical:      z.enum(['psicologos','dentistas','nutricionistas','fisioterapeutas']),
    cluster:       z.enum(['mais-pacientes','marketing','site','google-meu-negocio']),
    targetKeyword: z.string(),
    pubDate:       z.coerce.date(),
    updatedDate:   z.coerce.date().optional(),
    draft:         z.boolean().default(false),
    faqs:          z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

export const collections = { blog };
