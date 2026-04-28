import type { Habit } from '@/types/habit';

/**
 * Toggles a completion date on a habit (TRD §9).
 *
 * Rules:
 *  - If date is absent  → add it
 *  - If date is present → remove it
 *  - No duplicate dates in output
 *  - Original habit object must NOT be mutated
 */
export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completions = [...new Set(habit.completions)];

  const updated = completions.includes(date)
    ? completions.filter((d) => d !== date)
    : [...completions, date];

  return { ...habit, completions: updated };
}