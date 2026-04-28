// ── src/types/habit.ts ───────────────────────────────────────────────────────
export type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekdays' | 'weekends' | 'weekly';
  createdAt: string;
  completions: string[];
};
