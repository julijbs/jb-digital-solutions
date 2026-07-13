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

import { petCareMorumbi } from './pet-care-morumbi.ts';

import { petCareTatuape } from './pet-care-tatuape.ts';

import { miEAuPetcare } from './mi-e-au-petcare.ts';

import { birdsECia } from './birds-e-cia.ts';

import { espacoVetMk } from './espaco-vet-mk.ts';

export const clients: Record<string, ClientData> = {
  'espaco-vet-mk': espacoVetMk,
  'birds-e-cia': birdsECia,
  'mi-e-au-petcare': miEAuPetcare,
  'pet-care-tatuape': petCareTatuape,
  'pet-care-morumbi': petCareMorumbi,
  'animal-clinic-batel': animalClinicBatel,
  'cvp-tijuca': cvpTijuca,
  'animal-clinic-bacacheri': animalClinicBacacheri,
  'dra-ana-mello':       draAnaMello,
  'dra-marina-costa':    draMarinaCosta,
  'marcela-barcellos':   marcelaBarcellos,
};
