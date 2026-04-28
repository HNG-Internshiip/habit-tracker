// ── src/hooks/useHabits.ts ───────────────────────────────────────────────────
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Habit } from '@/types/habit';
import { getHabits, saveHabits } from '@/lib/storage';
import { toggleHabitCompletion } from '@/lib/habits';

export function useHabits(userId: string | undefined) {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    if (!userId) return;
    const all = getHabits();
    setHabits(all.filter((h) => h.userId === userId));
  }, [userId]);

  const persist = useCallback(
    (next: Habit[]) => {
      // Merge with other users' habits before saving
      const others = getHabits().filter((h) => h.userId !== userId);
      saveHabits([...others, ...next]);
      setHabits(next);
    },
    [userId]
  );

  const addHabit = useCallback(
    (name: string, description: string, frequency: Habit['frequency'] = 'daily') => {
      if (!userId) return;
      const habit: Habit = {
        id: crypto.randomUUID(),
        userId,
        name,
        description,
        frequency,
        createdAt: new Date().toISOString(),
        completions: [],
      };
      persist([...habits, habit]);
    },
    [habits, persist, userId]
  );

  const updateHabit = useCallback(
    (id: string, name: string, description: string) => {
      const next = habits.map((h) =>
        h.id === id ? { ...h, name, description } : h
      );
      persist(next);
    },
    [habits, persist]
  );

  const deleteHabit = useCallback(
    (id: string) => {
      persist(habits.filter((h) => h.id !== id));
    },
    [habits, persist]
  );

  const toggleCompletion = useCallback(
    (id: string, date: string) => {
      const next = habits.map((h) =>
        h.id === id ? toggleHabitCompletion(h, date) : h
      );
      persist(next);
    },
    [habits, persist]
  );

  return { habits, addHabit, updateHabit, deleteHabit, toggleCompletion };
}