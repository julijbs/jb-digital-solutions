import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', p => !p.data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Blog JB Digital System — Marketing para Profissionais de Saúde',
    description:
      'Artigos sobre como psicólogos, dentistas, nutricionistas e fisioterapeutas podem atrair mais pacientes organicamente com Google, SEO e IAs.',
    site: context.site ?? 'https://jbdigitalsystem.com',
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>pt-BR</language>`,
  });
}
