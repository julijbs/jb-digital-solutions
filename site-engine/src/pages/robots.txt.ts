/**
 * robots.txt.ts — robots.txt dinâmico com Sitemap em URL absoluta
 *
 * Substitui public/robots.txt (que tinha Sitemap relativo — inválido).
 * Em Astro static mode, GET() é chamado em build time → gera /robots.txt estático.
 *
 * ATENÇÃO: public/robots.txt foi removido para evitar conflito de rota.
 */
import type { APIRoute } from 'astro';
import { client } from '../lib/activeClient.ts';

export const GET: APIRoute = () => {
  const content = `User-agent: *
Allow: /

# AI crawlers — allow for GEO/AEO indexing
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: ${client.siteUrl}/sitemap-index.xml
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
