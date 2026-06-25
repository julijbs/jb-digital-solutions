/**
 * llms.txt.ts — Endpoint estático gerado a partir dos dados do cliente ativo
 * Substitui public/llms.txt (template cru com placeholders).
 * Em Astro static mode, GET() é chamado em build time → gera /llms.txt estático.
 */
import type { APIRoute } from 'astro';
import { client } from '../lib/activeClient.ts';

export const GET: APIRoute = () => {
  const firstNeighborhood = client.neighborhoods[0]?.slug ?? '';
  const serviceList = client.services
    .map(s => `- [${s.name}](${client.siteUrl}/${s.slug}/${firstNeighborhood}/): ${s.description}`)
    .join('\n');

  const content = `# ${client.businessName} — ${client.specialty}

> ${client.copy.llmsSummary}

## Serviços

${serviceList}

## Páginas

- [Página Principal](${client.siteUrl}/): ${client.businessName} — atendimento presencial e online
- [Sitemap](${client.siteUrl}/sitemap-index.xml): índice de todas as páginas do site

## Contato

- WhatsApp/Telefone: [${client.phone}](https://wa.me/55${client.phone.replace(/\D/g, '')})
${client.email ? `- Email: [${client.email}](mailto:${client.email})\n` : ''}- Site: [${client.siteUrl}](${client.siteUrl})
${client.instagram ? `- Instagram: [${client.instagram}](https://instagram.com/${client.instagram.replace('@', '')})\n` : ''}- Cidade: ${client.city}, ${client.state}
- Endereço: ${client.address}

## Credenciais

${client.credential}

## Atendimento

Presencial em ${client.district}, ${client.city}, e online para todo o Brasil.
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
