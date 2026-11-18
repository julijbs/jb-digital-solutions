import { describe, it, expect } from 'vitest';
import { getSiteOffer, getOneTimeService } from '../../supabase/functions/_shared/site-offer';
describe('one-time services and Black Friday deadline', () => {
  it('applies the discount only within the campaign in Brasilia', () => {
    expect(getSiteOffer(Date.parse('2026-11-17T23:59:59-03:00')).setupCents).toBe(149700);
    expect(getSiteOffer(Date.parse('2026-11-18T00:00:00-03:00')).setupCents).toBe(49700);
    expect(getSiteOffer(Date.parse('2026-11-30T23:59:59-03:00')).setupCents).toBe(49700);
    expect(getSiteOffer(Date.parse('2026-12-01T00:00:00-03:00')).setupCents).toBe(149700);
  });
  it('keeps GBP fixed, prices the complete system and rejects the retired combo', () => {
    for (const date of ['2026-11-20', '2026-12-02']) {
      expect(getOneTimeService('gbp_avulso', Date.parse(date))?.cents).toBe(29700);
      expect(getOneTimeService('site_gbp', Date.parse(date))).toBeNull();
    }
    expect(getOneTimeService('site_novo', Date.parse('2026-11-20'))).toEqual({ name: 'Sistema Completo (Site + GBP)', cents: 49700 });
    expect(getOneTimeService('gestao_google')).toBeNull();
    expect(getOneTimeService('__proto__')).toBeNull();
  });
});
