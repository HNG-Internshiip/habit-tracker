import { describe, it, expect } from 'vitest';
import { getHabitSlug } from '@/lib/slug';

describe('getHabitSlug', () => {
  it('returns lowercase hyphenated slug for a basic habit name', () => {
    expect(getHabitSlug('Drink Water')).toBe('drink-water');
    expect(getHabitSlug('Read Books')).toBe('read-books');
    expect(getHabitSlug('Morning Run')).toBe('morning-run');
  });

  it('trims outer spaces and collapses repeated internal spaces', () => {
    expect(getHabitSlug('  Drink  Water  ')).toBe('drink-water');
    expect(getHabitSlug('  Read   Books  ')).toBe('read-books');
    expect(getHabitSlug('   a   b   c   ')).toBe('a-b-c');
  });

  it('removes non alphanumeric characters except hyphens', () => {
    expect(getHabitSlug('Drink Water!')).toBe('drink-water');
    expect(getHabitSlug('Read & Write')).toBe('read-write');
    expect(getHabitSlug('100% Focus')).toBe('100-focus');
    expect(getHabitSlug('already-hyphenated')).toBe('already-hyphenated');
  });
});