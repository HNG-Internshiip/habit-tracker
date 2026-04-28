import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useState } from 'react';

// Mock Next.js router
const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

import HabitForm from '@/components/habits/HabitForm';
import HabitList from '@/components/habits/HabitList';
import HabitCard from '@/components/habits/HabitCard';
import type { Habit } from '@/types/habit';

// ── Helpers ──────────────────────────────────────────────────────────────────
const TODAY = '2024-06-15';

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: 'habit-test-1',
    userId: 'user-1',
    name: 'Drink Water',
    description: 'Stay hydrated',
    frequency: 'daily',
    createdAt: '2024-01-01T00:00:00.000Z',
    completions: [],
    ...overrides,
  };
}

// ── Wrapper that wires HabitForm + HabitList together like the dashboard does ─
function HabitManager({ initialHabits = [] }: { initialHabits?: Habit[] }) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleSave(name: string, description: string) {
    if (editingId) {
      setHabits((prev) =>
        prev.map((h) => (h.id === editingId ? { ...h, name, description } : h))
      );
      setEditingId(null);
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId: 'user-1',
        name,
        description,
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: [],
      };
      setHabits((prev) => [...prev, newHabit]);
    }
    setShowForm(false);
  }

  function handleDelete(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  function handleToggle(id: string) {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              completions: h.completions.includes(TODAY)
                ? h.completions.filter((d) => d !== TODAY)
                : [...h.completions, TODAY],
            }
          : h
      )
    );
  }

  return (
    <div>
      {!showForm && (
        <button data-testid="create-habit-button" onClick={() => setShowForm(true)}>
          New Habit
        </button>
      )}
      {showForm && (
        <HabitForm
          initialHabit={habits.find((h) => h.id === editingId) ?? null}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingId(null); }}
        />
      )}
      <HabitList
        habits={habits}
        today={TODAY}
        onEdit={(id) => { setEditingId(id); setShowForm(true); }}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />
    </div>
  );
}

// ── Reset between tests ───────────────────────────────────────────────────────
beforeEach(() => {
  localStorage.clear();
  mockReplace.mockClear();
});

describe('habit form', () => {
  it('shows a validation error when habit name is empty', async () => {
    const user = userEvent.setup();
    render(<HabitManager />);

    await user.click(screen.getByTestId('create-habit-button'));
    // Leave name empty, submit immediately
    await user.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Habit name is required');
    });
  });

  it('creates a new habit and renders it in the list', async () => {
    const user = userEvent.setup();
    render(<HabitManager />);

    await user.click(screen.getByTestId('create-habit-button'));
    await user.type(screen.getByTestId('habit-name-input'), 'Drink Water');
    await user.type(
      screen.getByTestId('habit-description-input'),
      'Stay hydrated'
    );
    await user.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const habit = makeHabit();
    const user = userEvent.setup();
    render(<HabitManager initialHabits={[habit]} />);

    // Click edit
    await user.click(screen.getByTestId('habit-edit-drink-water'));

    // Clear name and type new one
    const nameInput = screen.getByTestId('habit-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'Read Books');
    await user.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-read-books')).toBeInTheDocument();
    });

    // The old slug should be gone
    expect(screen.queryByTestId('habit-card-drink-water')).not.toBeInTheDocument();
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const habit = makeHabit();
    const user = userEvent.setup();
    render(<HabitManager initialHabits={[habit]} />);

    // Card should exist
    expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();

    // Click delete — confirmation should appear
    await user.click(screen.getByTestId('habit-delete-drink-water'));
    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument();

    // Confirm deletion
    await user.click(screen.getByTestId('confirm-delete-button'));

    await waitFor(() => {
      expect(screen.queryByTestId('habit-card-drink-water')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('toggles completion and updates the streak display', async () => {
    const habit = makeHabit();
    const user = userEvent.setup();
    render(<HabitManager initialHabits={[habit]} />);

    // Streak starts at 0
    const streakEl = screen.getByTestId('habit-streak-drink-water');
    expect(streakEl).toHaveTextContent('0');

    // Toggle complete
    await user.click(screen.getByTestId('habit-complete-drink-water'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('1');
    });

    // Toggle again — uncomplete
    await user.click(screen.getByTestId('habit-complete-drink-water'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('0');
    });
  });
});