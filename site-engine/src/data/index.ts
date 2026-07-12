/**
 * index.ts — Registro de clientes do JB Digital System
 *
 * Cada cliente = um arquivo em src/data/.
 * O script scripts/publish-site.ts itera este registro para gerar
 * um dist/<slug>/ independente por cliente.
 */
import type { ClientData } from '../lib/types.ts';
import { animalClinicBacacheri } from './animal-clinic-bacacheri.ts';
import { draAnaMello } from './dra-ana-mello.ts';
import { draMarinaCosta } from './dra-marina-costa.ts';
import { marcelaBarcellos } from './marcela-barcellos.ts';

import { cvpTijuca } from './cvp-tijuca.ts';

import { animalClinicBatel } from './animal-clinic-batel.ts';

export const clients: Record<string, ClientData> = {
  'animal-clinic-batel': animalClinicBatel,
  'cvp-tijuca': cvpTijuca,
  'animal-clinic-bacacheri': animalClinicBacacheri,
  'dra-ana-mello':       draAnaMello,
  'dra-marina-costa':    draMarinaCosta,
  'marcela-barcellos':   marcelaBarcellos,
};
