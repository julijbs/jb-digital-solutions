/**
 * llms.txt.ts — Endpoint estático gerado a partir dos dados do cliente ativo
 * Substitui public/llms.txt (template cru com placeholders).
 * Em Astro static mode, GET() é chamado em build time → gera /llms.txt estático.
 */
import type { APIRoute } from 'astro';
import { client } from '../lib/activeClient.ts';

export const GET: APIRoute = () => {
  const serviceList = client.services.map(s => `- ${s.name} (${s.tag}): ${s.description}`).join('\n');

  const content = `# ${client.businessName} — ${client.specialty}

> ${client.copy.llmsSummary}

## Serviços

${serviceList}

## Contato

- WhatsApp/Telefone: ${client.phone}
- Email: ${client.email}
- Instagram: ${client.instagram}
- Cidade: ${client.city}, ${client.state}
- Endereço: ${client.address}
- Site: ${client.siteUrl}

## Credenciais

${client.credential}

## Atendimento

Presencial em ${client.district}, ${client.city}, e online para todo o Brasil.
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
