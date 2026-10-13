import { describe, it, expect } from 'vitest';
import { planyoUrl, PLANYO_PITCH_RESOURCE, PLANYO_RESOURCE_IDS } from './config.js';

describe('planyoUrl', () => {
  it('opens the booking form with the pitch and day pre-filled', () => {
    expect(planyoUrl(58244, '2026-10-16')).toBe(
      'https://www.planyo.com/booking.php?calendar=22300&mode=reserve&resource_id=58244&one_date=2026-10-16');
  });
  it('opens the pitch without a day when none is picked', () => {
    expect(planyoUrl(58245, null)).toBe('https://www.planyo.com/booking.php?calendar=22300&mode=reserve&resource_id=58245');
  });
  it('falls back to the full calendar when the pitch has no Planyo ID', () => {
    expect(planyoUrl(null, '2026-10-16')).toBe('https://www.planyo.com/booking.php?calendar=22300');
  });
  it('only maps pitches to real Planyo resources', () => {
    for (const id of Object.values(PLANYO_PITCH_RESOURCE)) if (id !== null) expect(PLANYO_RESOURCE_IDS).toContain(id);
  });
});
