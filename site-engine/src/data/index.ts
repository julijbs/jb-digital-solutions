/**
 * index.ts — Registro de clientes do JB Digital System
 *
 * Cada cliente = um arquivo em src/data/.
 * O script scripts/publish-site.ts itera este registro para gerar
 * um dist/<slug>/ independente por cliente.
 */
import type { ClientData } from '../lib/types.ts';
import { draAnaMello } from './dra-ana-mello.ts';
import { draMarinaCostaData } from './dra-marina-costa.ts';

export const clients: Record<string, ClientData> = {
  'dra-ana-mello':    draAnaMello,
  'dra-marina-costa': draMarinaCostaData,
};
