/** Shared by React, Astro and the server: server time is authoritative at checkout. */
export const BLACK_FRIDAY = {
  startsAt: '2026-11-18T00:00:00-03:00',
  endsAt: '2026-12-01T00:00:00-03:00',
  regularCents: 149700,
  promotionalCents: 49700,
} as const;
export function getSiteOffer(now = Date.now()) {
  const active = now >= Date.parse(BLACK_FRIDAY.startsAt) && now < Date.parse(BLACK_FRIDAY.endsAt);
  const setupCents = active ? BLACK_FRIDAY.promotionalCents : BLACK_FRIDAY.regularCents;
  return { active, setupCents, setupPrice: active ? 'R$ 497' : 'R$ 1.497', remainingMs: Math.max(0, Date.parse(BLACK_FRIDAY.endsAt) - now) };
}

export const ONE_TIME_SERVICES = {
  site_novo: { name: 'Site Novo', cents: 149700 },
  gbp_avulso: { name: 'Criação do Perfil Google', cents: 29700 },
  site_gbp: { name: 'Site + Perfil Google', cents: 75000 },
} as const;
export function getOneTimeService(tier: string, now = Date.now()) {
  if (!Object.prototype.hasOwnProperty.call(ONE_TIME_SERVICES, tier)) return null;
  const service = ONE_TIME_SERVICES[tier as keyof typeof ONE_TIME_SERVICES];
  return { ...service, cents: tier === 'site_novo' ? getSiteOffer(now).setupCents : service.cents };
}
