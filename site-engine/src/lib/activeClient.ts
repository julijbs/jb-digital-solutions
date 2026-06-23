/**
 * activeClient.ts — Exporta o cliente ativo com base na env var CLIENT
 *
 * Uso em desenvolvimento:  astro dev (padrão: dra-ana-mello)
 * Uso em build por cliente: CLIENT=dra-marina-costa astro build --outDir dist/dra-marina-costa
 *
 * Em ambiente Astro/Vite build-time, process.env é acessível em todos os
 * módulos executados pelo servidor (frontmatter de páginas, lib/*, etc.).
 */
import { clients } from '../data/index.ts';
import type { ClientData } from './types.ts';

const slug: string = process.env['CLIENT'] ?? 'dra-ana-mello';
export const client: ClientData = clients[slug] ?? clients['dra-ana-mello'];
