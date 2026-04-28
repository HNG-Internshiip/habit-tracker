import { describe, it, expect } from 'vitest';
import { validateHabitName } from '@/lib/validators';

describe('validateHabitName', () => {
  it('returns an error when habit name is empty', () => {
    const result = validateHabitName('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Habit name is required');

    // Also covers whitespace-only strings (trimmed to empty)
    const whitespace = validateHabitName('   ');
    expect(whitespace.valid).toBe(false);
    expect(whitespace.error).toBe('Habit name is required');
  });

  it('returns an error when habit name exceeds 60 characters', () => {
    const longName = 'a'.repeat(61);
    const result = validateHabitName(longName);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Habit name must be 60 characters or fewer');
  });

  it('returns a trimmed value when habit name is valid', () => {
    const result = validateHabitName('  Drink Water  ');
    expect(result.valid).toBe(true);
    expect(result.value).toBe('Drink Water');
    expect(result.error).toBeNull();

    // Exactly 60 characters — boundary value should pass
    const exactly60 = 'a'.repeat(60);
    const r60 = validateHabitName(exactly60);
    expect(r60.valid).toBe(true);
    expect(r60.error).toBeNull();
  });
});