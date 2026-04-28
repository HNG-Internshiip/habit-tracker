/**
 * Validates a habit name input (TRD §9).
 *
 * Rules:
 *  - Trim before evaluating
 *  - Reject empty strings  → "Habit name is required"
 *  - Reject > 60 chars     → "Habit name must be 60 characters or fewer"
 *  - Return trimmed value on success
 */
export function validateHabitName(name: string): {
  valid: boolean;
  value: string;
  error: string | null;
} {
  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { valid: false, value: trimmed, error: 'Habit name is required' };
  }

  if (trimmed.length > 60) {
    return {
      valid: false,
      value: trimmed,
      error: 'Habit name must be 60 characters or fewer',
    };
  }

  return { valid: true, value: trimmed, error: null };
}